# backend/src/api/routes/queues.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from src.database.session import get_db
from src.database import schemas, models

router = APIRouter()


@router.get("/items", response_model=List[schemas.ContentQueueItemResponse])
async def get_queue_items(
    platform: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get all queue items with optional filtering"""
    query = db.query(models.ContentQueueItem)

    if platform:
        query = query.filter(models.ContentQueueItem.source_platform == platform)
    if status:
        query = query.filter(models.ContentQueueItem.status == status)

    items = query.order_by(models.ContentQueueItem.created_at.desc()).offset(skip).limit(limit).all()
    return items


@router.get("/items/{item_id}", response_model=schemas.ContentQueueItemResponse)
async def get_queue_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific queue item by ID"""
    item = db.query(models.ContentQueueItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    return item


@router.post("/{queue_id}/retry")
async def retry_failed_content(
    queue_id: int,
    db: Session = Depends(get_db),
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

    return {"status": "success", "message": "Item queued for retry"}
