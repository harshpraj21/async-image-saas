from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    DEBUG: bool = True

    DB_HOST: Optional[str] = None
    DB_PASSWORD: Optional[str] = None
    DB_USER: Optional[str] = None
    DB_NAME: Optional[str] = None
    DB_PORT: Optional[int] = None

    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    REDIS_URL: Optional[str] = None

    # SUPABASE_STORAGE_URL: str=None
    # SUPABASE_ACCESS_KEY: str=None
    # SUPABASE_BUCKET_NAME: str=None
    UPLOAD_DIR: Optional[str] = None

    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    RAZORPAY_WEBHOOK_SECRET: Optional[str] = None


config = BaseConfig()
