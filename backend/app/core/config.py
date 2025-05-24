from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from loguru import logger

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"


class BaseConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
    )

    DB_HOST: Optional[str] = None
    DB_PASSWORD: Optional[str] = None
    DB_USER: Optional[str] = None
    DB_NAME: Optional[str] = None
    DB_PORT: Optional[int] = None

    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


config = BaseConfig()
