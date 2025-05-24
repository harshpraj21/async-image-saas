from datetime import datetime
from fastapi import FastAPI

from .routers import router

app = FastAPI(title="Image SaaS API")

app.include_router(router)


@app.get("/health")
def health_check():
    return {
        "status": "Running",
        "time": datetime.now(),
    }
