"""Content management routes for the Content App API."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.database.session import get_db
from src.core.orchestrator import ContentAppOrchestrator
from src.database import schemas, models
from datetime import datetime

router = APIRouter(tags=["content"])  # Remove prefix since it's added in main.py


@router.get("/pending", response_model=List[schemas.ContentQueue])
async def get_pending_content(
    skip: int = 0, limit: int = 10, db: Session = Depends(get_db)
):
    """Get pending content that needs approval.
    
    Args:
        skip (int, optional): Number of records to skip. Defaults to 0.
        limit (int, optional): Maximum number of records to return. Defaults to 10.
        
    Returns:
        List[ContentQueue]: List of pending content items
    """
    pending = (
        db.query(models.ContentQueueItem)
        .filter(models.ContentQueueItem.status == models.ContentStatus.COMPLETED)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return pending


@router.post("/{content_id}/approve")
async def approve_content(content_id: int, db: Session = Depends(get_db)):
    """Approve content for posting.
    
    Args:
        content_id (int): ID of the content to approve
        
    Returns:
        dict: Success message
        
    Raises:
        HTTPException: If content not found or approval fails
    """
    content = db.query(models.ContentQueueItem).get(content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found"
        )
    
    try:
        content.status = models.ContentStatus.APPROVED
        content.approved_at = datetime.utcnow()
        db.commit()
        return {"message": "Content approved successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{content_id}/reject")
async def reject_content(content_id: int, reason: str, db: Session = Depends(get_db)):
    """Reject content and provide reason.
    
    Args:
        content_id (int): ID of the content to reject
        reason (str): Reason for rejection
        
    Returns:
        dict: Success message
        
    Raises:
        HTTPException: If content not found
    """
    content = db.query(models.ContentQueueItem).get(content_id)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found"
        )
    
    content.status = models.ContentStatus.REJECTED
    content.rejection_reason = reason
    db.commit()
    
    return {"message": "Content rejected successfully"}


@router.post("/flows/{flow_id}/source", status_code=status.HTTP_202_ACCEPTED)
async def trigger_content_sourcing(
    flow_id: int,
    db: Session = Depends(get_db),
):
    """Trigger immediate content sourcing and editing for a flow.
    
    This endpoint triggers the same task that runs periodically according to the flow's schedule,
    but executes it immediately. This is useful for testing or manual content sourcing.
    
    Args:
        flow_id: ID of the content flow to source content for
        
    Returns:
        dict: Message indicating the task was triggered
        
    Raises:
        HTTPException: If flow not found or inactive
    """
    flow = db.query(models.ContentFlow).get(flow_id)
    if not flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content flow not found"
        )
    
    if not flow.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot trigger sourcing for inactive flow"
        )
    
    # Import here to avoid circular imports
    from src.scheduler.scheduler import source_and_edit
    
    # Trigger the task asynchronously
    source_and_edit.delay(flow_id)
    
    return {
        "message": "Content sourcing triggered",
        "flow_id": flow_id
    }
