from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import sessionmaker
from backend.src.database.models import ContentQueueItem
from src.api.routes import auth, config, content, queues, stats
from src.database.session import engine, Base, get_db
from src.core.orchestrator import ContentAppOrchestrator

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Content App API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(config.router, prefix="/api/config", tags=["config"])
app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(queues.router, prefix="/api/queues", tags=["queues"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])

# Orchestrator initialization
orchestrator = None

@app.on_event("startup")
async def startup_event():
    global orchestrator
    Session = sessionmaker(bind=engine)
    session = Session()
    orchestrator = ContentAppOrchestrator(session)
    print("ContentBotOrchestrator started.")

@app.on_event("shutdown")
async def shutdown_event():
    global orchestrator
    # Clean up?
    orchestrator = None
    print("ContentBotOrchestrator stopped.")

# Example endpoint
@app.get("/")
async def root():
    return {"message": "Content Bot API is running"}

@app.get("/queue")
def get_queue(db: Depends(get_db)):
    items = db.query(ContentQueueItem).filter(ContentQueueItem.status == "pending").all()
    return items

@app.post("/queue/approve")
def approve_item(item_id: int, db: Depends(get_db)):
    db.query(ContentQueueItem).filter(ContentQueueItem.id == item_id).update({"status": "approved"})
    db.commit()
    return {"status": "success", "message": f"Item {item_id} approved."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
