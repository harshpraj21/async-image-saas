from datetime import datetime
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.config import config

from .routers import router

app = FastAPI(title="Image SaaS API")

if config.DEBUG:
    app.mount("/uploads", StaticFiles(directory=config.UPLOAD_DIR), name="uploads")

app.include_router(router)


@app.get("/health")
def health_check():
    return {
        "status": "Running",
        "time": datetime.now(),
    }
