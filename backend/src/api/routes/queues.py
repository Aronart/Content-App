"""Queue management routes for the Content App API."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from src.database.session import get_db
from src.database import schemas, models

router = APIRouter(tags=["queues"])  # Remove the prefix here since it's added in main.py


@router.get("/items", response_model=List[schemas.ContentQueueItemResponse])
async def get_queue_items(
    flow_id: Optional[int] = None,
    platform: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get queue items with optional filtering."""
    query = db.query(models.ContentQueueItem)

    if flow_id:
        query = query.filter(models.ContentQueueItem.content_flow_id == flow_id)
    if platform:
        query = query.filter(models.ContentQueueItem.source_platform == platform)
    if status:
        query = query.filter(models.ContentQueueItem.status == status)

    items = query.order_by(models.ContentQueueItem.created_at.desc()).offset(skip).limit(limit).all()
    return items  # FastAPI will automatically convert empty list to JSON []


@router.get("/items/{item_id}", response_model=schemas.ContentQueueItemResponse)
async def get_queue_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    """Get a specific queue item by ID.
    
    Args:
        item_id (int): ID of the queue item to retrieve
        
    Returns:
        ContentQueueItemResponse: Queue item details
        
    Raises:
        HTTPException: If item not found
    """
    item = db.query(models.ContentQueueItem).get(item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Queue item not found"
        )
    return item
