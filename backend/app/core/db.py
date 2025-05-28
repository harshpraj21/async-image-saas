from sqlmodel import create_engine, Session
from app.core.config import config


DB_URL = f"postgresql+psycopg2://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}?sslmode=require"
engine = create_engine(DB_URL)


def get_session():
    with Session(engine) as session:
        yield session