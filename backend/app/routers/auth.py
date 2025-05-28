from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from loguru import logger
from sqlmodel import Session
from starlette import status

from app.core.db import get_session
from app.core.security import (
    create_access_token,
    verify_password,
    get_hash_password,
    get_current_user,
)
from app.models.users import UserCreate, Token, UserLogin, UserRead, User
from app.services.auth_service import get_user_by_email, create_user

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Annotated[Session, Depends(get_session)]):
    try:
        if get_user_by_email(db, str(user.email)):
            logger.warning(f"Registration failed: email {user.email} already exists.")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists!"
            )
        user.password = get_hash_password(user.password)
        user = create_user(db, user)
        token = create_access_token({"sub": user.email})
        logger.info(f"New user registered: {user.email}")
        return {"access_token": token}
    except Exception as e:
        logger.error(f"Registration error for {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
def login(credentials: UserLogin, db: Annotated[Session, Depends(get_session)]):
    try:
        user = get_user_by_email(db, str(credentials.email))
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        token = create_access_token({"sub": user.email})
        logger.info(f"User logged in: {user.email}")
        return {"access_token": token}
    except Exception as e:
        logger.error(f"Login error for {credentials.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/me", response_model=UserRead, status_code=status.HTTP_200_OK)
def me(current_user: Annotated[User, Depends(get_current_user)]):
    logger.debug(f"Authenticated request for user: {current_user.email}")
    return current_user
