from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from src.database.models import ContentQueueItem
from src.api.routes.config import router as config_router
from src.api.routes.content import router as content_router
from src.api.routes.queues import router as queues_router
from src.api.routes.stats import router as stats_router
from src.database.session import engine, Base, get_db, SessionLocal
from src.core.orchestrator import ContentAppOrchestrator
from sqlalchemy.orm import Session
from config import Settings

settings = Settings()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Content App API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(config_router, prefix=settings.API_V1_STR + "/config", tags=["config"])
app.include_router(content_router, prefix=settings.API_V1_STR + "/content", tags=["content"])
app.include_router(queues_router, prefix=settings.API_V1_STR + "/queues", tags=["queues"])
app.include_router(stats_router, prefix=settings.API_V1_STR + "/stats", tags=["stats"])

# Orchestrator initialization
orchestrator = None


@app.on_event("startup")
async def startup_event():
    global orchestrator
    session = SessionLocal()
    orchestrator = ContentAppOrchestrator(session)
    print("ContentAppOrchestrator started.")


@app.on_event("shutdown")
async def shutdown_event():
    global orchestrator
    if orchestrator and orchestrator.db:
        orchestrator.db.close()
    orchestrator = None
    print("ContentAppOrchestrator stopped.")


@app.get("/")
async def root():
    return {"message": "Content App API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
