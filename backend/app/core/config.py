from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    DEBUG: bool = True
    ALLOWED_ORIGINS: str = ""

    DB_HOST: Optional[str] = None
    DB_PASSWORD: Optional[str] = None
    DB_USER: Optional[str] = None
    DB_NAME: Optional[str] = None
    DB_PORT: Optional[int] = None

    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    REDIS_URL: Optional[str] = None

    SUPABASE_URL: Optional[str] = None
    SUPABASE_BUCKET_NAME: Optional[str] = None
    SUPABASE_SECRET_KEY: Optional[str] = None

    UPLOAD_DIR: Optional[str] = None

    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    RAZORPAY_WEBHOOK_SECRET: Optional[str] = None

    @property
    def get_allowed_origins(self) -> List[str]:
        return [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]


config = BaseConfig()
