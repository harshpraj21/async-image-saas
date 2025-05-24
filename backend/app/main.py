import datetime
from fastapi import FastAPI
from loguru import logger

from app.core.config import config

app = FastAPI(title="Image SaaS API")


@app.get("/health")
def health_check():
    return {
        "status": "Running",
        "time": datetime.now(),
    }
