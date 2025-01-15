# backend/src/api/routes/content.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.database.session import get_db
from src.core.orchestrator import ContentAppOrchestrator
from src.database import schemas, models

router = APIRouter()


@router.get("/flows", response_model=List[schemas.ContentFlow])
async def get_content_flows(db: Session = Depends(get_db)):
    """Get all content flows"""
    flows = db.query(models.ContentFlow).all()
    return flows


@router.get("/pending", response_model=List[schemas.ContentQueue])
async def get_pending_content(
    skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    """Get pending content that needs approval"""
    pending = (
        db.query(models.ContentQueueItem)
        .filter(models.ContentQueueItem.status == models.ContentStatus.COMPLETED)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return pending


@router.post("/{content_id}/approve")
async def approve_content(content_id: int, flow_id: int, db: Session = Depends(get_db)):
    """Approve content for posting"""
    orchestrator = ContentAppOrchestrator(db)
    try:
        orchestrator.approve_content(content_id)
        return {"message": "Content approved successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{content_id}/reject")
async def reject_content(content_id: int, reason: str, db: Session = Depends(get_db)):
    """Reject content and provide reason"""
    content = db.query(models.ContentQueueItem).get(content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Content not found"
        )

    content.status = models.ContentStatus.FAILED
    content.error_log = {"reason": reason}
    db.commit()

    return {"message": "Content rejected successfully"}
