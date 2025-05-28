from datetime import datetime
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import config

from .routers import router

app = FastAPI(title="Image SaaS API")

if config.DEBUG:
    os.makedirs(config.UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=config.UPLOAD_DIR), name="uploads")
    origins = ["*"]
else:
    origins = [config.FRONTEND_DOMAIN]



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


app.include_router(router)


@app.get("/health")
def health_check():
    return {
        "status": "Running",
        "time": datetime.now(),
    }
