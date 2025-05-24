from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from starlette import status

from app.core.db import get_session
from app.core.security import create_access_token, verify_password, get_hash_password, get_current_user
from app.models.users import UserCreate, Token, UserLogin, UserRead, User
from app.services.auth_service import get_user_by_email, create_user

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Annotated[Session, Depends(get_session)]):
    if get_user_by_email(db, str(user.email)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists!"
        )
    user.password = get_hash_password(user.password)
    user = create_user(db, user)
    token = create_access_token({"sub": user.email})
    return {"access_token": token}


@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(credentials: UserLogin, db: Annotated[Session, Depends(get_session)]):
    user = get_user_by_email(db, str(credentials.email))
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token}


@router.get("/me", response_model=UserRead, status_code=status.HTTP_200_OK)
def me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
