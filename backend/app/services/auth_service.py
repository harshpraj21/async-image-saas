from sqlmodel import Session, select
from app.models import User
from app.models.users import UserCreate


def get_user_by_email(db: Session, email: str) -> User:
    stmt = select(User).where(User.email == email)
    return db.exec(stmt).first()


def create_user(db: Session, user: UserCreate):
    user = User(email=user.email, name=user.name, hashed_password=user.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
