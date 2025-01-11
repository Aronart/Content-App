# backend/src/api/routes/queues.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from src.database.session import get_db
from src.database import schemas, models
from src.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.ContentQueue])
async def get_queue_status(
    platform: Optional[schemas.PlatformEnum] = None,
    status: Optional[schemas.ContentStatusEnum] = None,
    destination_account_id: Optional[int] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get queue status with optional filtering"""
    query = db.query(models.ContentQueueItem)
    
    if platform:
        query = query.filter(models.ContentQueueItem.source_platform == platform)
    if status:
        query = query.filter(models.ContentQueueItem.status == status)
    if destination_account_id:
        query = query.filter(models.ContentQueueItem.destination_account_id == destination_account_id)
    
    return query.offset(skip).limit(limit).all()

@router.post("/{queue_id}/retry")
async def retry_failed_content(
    queue_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Retry processing failed content"""
    queue_item = db.query(models.ContentQueueItem).get(queue_id)
    if not queue_item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    if queue_item.status != models.ContentStatus.FAILED:
        raise HTTPException(status_code=400, detail="Can only retry failed items")
    
    queue_item.status = models.ContentStatus.PENDING
    queue_item.error_log = None
    queue_item.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Content queued for retry"}

@router.delete("/{queue_id}")
async def remove_from_queue(
    queue_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Remove content from queue"""
    queue_item = db.query(models.ContentQueueItem).get(queue_id)
    if not queue_item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    db.delete(queue_item)
    db.commit()
    
    return {"message": "Content removed from queue"}

@router.post("/{queue_id}/prioritize")
async def prioritize_content(
    queue_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Move content to the front of the queue"""
    queue_item = db.query(models.ContentQueueItem).get(queue_id)
    if not queue_item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    if queue_item.status != models.ContentStatus.PENDING:
        raise HTTPException(status_code=400, detail="Can only prioritize pending items")
    
    # Update priority timestamp to current time
    queue_item.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Content prioritized"}

@router.get("/statistics")
async def get_queue_statistics(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get statistics about the queue status"""
    stats = {
        "total": db.query(models.ContentQueueItem).count(),
        "pending": db.query(models.ContentQueueItem)
            .filter(models.ContentQueueItem.status == models.ContentStatus.PENDING)
            .count(),
        "processing": db.query(models.ContentQueueItem)
            .filter(models.ContentQueueItem.status == models.ContentStatus.PROCESSING)
            .count(),
        "completed": db.query(models.ContentQueueItem)
            .filter(models.ContentQueueItem.status == models.ContentStatus.COMPLETED)
            .count(),
        "failed": db.query(models.ContentQueueItem)
            .filter(models.ContentQueueItem.status == models.ContentStatus.FAILED)
            .count(),
    }
    
    return stats