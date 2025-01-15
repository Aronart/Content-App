# backend/src/api/routes/stats.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime, timedelta
from src.database.session import get_db
from src.database import models

router = APIRouter()


@router.get("/overview")
async def get_overview_stats(
    days: Optional[int] = Query(default=7, ge=1, le=30),
    db: Session = Depends(get_db),
):
    """Get overview statistics for the dashboard"""
    start_date = datetime.utcnow() - timedelta(days=days)

    # Get content processing statistics
    content_stats = {
        "total_processed": db.query(models.ContentQueueItem)
        .filter(models.ContentQueueItem.created_at >= start_date)
        .count(),
        "successfully_posted": db.query(models.ContentQueueItem)
        .filter(
            models.ContentQueueItem.status == models.ContentStatus.COMPLETED,
            models.ContentQueueItem.created_at >= start_date,
        )
        .count(),
        "failed": db.query(models.ContentQueueItem)
        .filter(
            models.ContentQueueItem.status == models.ContentStatus.FAILED,
            models.ContentQueueItem.created_at >= start_date,
        )
        .count(),
    }

    # Get platform distribution
    platform_stats = (
        db.query(
            models.ContentQueueItem.source_platform,
            func.count(models.ContentQueueItem.id).label("count"),
        )
        .filter(models.ContentQueueItem.created_at >= start_date)
        .group_by(models.ContentQueueItem.source_platform)
        .all()
    )

    # Get daily processing counts
    daily_stats = (
        db.query(
            func.date_trunc("day", models.ContentQueueItem.created_at).label("date"),
            func.count(models.ContentQueueItem.id).label("count"),
        )
        .filter(models.ContentQueueItem.created_at >= start_date)
        .group_by(func.date_trunc("day", models.ContentQueueItem.created_at))
        .all()
    )

    return {
        "content_stats": content_stats,
        "platform_distribution": {
            str(p.source_platform): p.count for p in platform_stats
        },
        "daily_activity": [
            {"date": str(d.date), "count": d.count} for d in daily_stats
        ],
    }


@router.get("/performance")
async def get_performance_stats(
    days: Optional[int] = Query(default=30, ge=1, le=90),
    db: Session = Depends(get_db),
):
    """Get performance statistics"""
    start_date = datetime.utcnow() - timedelta(days=days)

    # Calculate average processing times
    processing_times = (
        db.query(
            models.ContentQueueItem.source_platform,
            func.avg(
                func.extract("epoch", models.ContentQueueItem.updated_at)
                - func.extract("epoch", models.ContentQueueItem.created_at)
            ).label("avg_processing_time"),
        )
        .filter(
            models.ContentQueueItem.status == models.ContentStatus.COMPLETED,
            models.ContentQueueItem.created_at >= start_date,
        )
        .group_by(models.ContentQueueItem.source_platform)
        .all()
    )

    # Get error rates by platform
    error_rates = (
        db.query(
            models.ContentQueueItem.source_platform,
            func.count(models.ContentQueueItem.id).label("total"),
            func.sum(
                case(
                    [
                        (
                            models.ContentQueueItem.status
                            == models.ContentStatus.FAILED,
                            1,
                        )
                    ],
                    else_=0,
                )
            ).label("failed"),
        )
        .filter(models.ContentQueueItem.created_at >= start_date)
        .group_by(models.ContentQueueItem.source_platform)
        .all()
    )

    return {
        "processing_times": {
            str(p.source_platform): round(p.avg_processing_time, 2)
            for p in processing_times
        },
        "error_rates": {
            str(p.source_platform): {
                "total": p.total,
                "failed": p.failed,
                "rate": round(p.failed / p.total * 100, 2) if p.total > 0 else 0,
            }
            for p in error_rates
        },
    }


@router.get("/destination-stats")
async def get_destination_stats(
    days: Optional[int] = Query(default=30, ge=1, le=90),
    db: Session = Depends(get_db),
):
    """Get statistics about destination platforms"""
    start_date = datetime.utcnow() - timedelta(days=days)

    # Get posting statistics by destination account
    account_stats = (
        db.query(
            models.DestinationAccount.platform,
            models.DestinationAccount.account_name,
            func.count(models.ContentQueueItem.id).label("total_posts"),
            func.avg(
                func.extract("epoch", models.ContentQueueItem.updated_at)
                - func.extract("epoch", models.ContentQueueItem.created_at)
            ).label("avg_processing_time"),
        )
        .join(
            models.ContentQueueItem,
            models.ContentQueueItem.destination_account_id
            == models.DestinationAccount.id,
        )
        .filter(
            models.ContentQueueItem.created_at >= start_date,
            models.ContentQueueItem.status == models.ContentStatus.COMPLETED,
        )
        .group_by(
            models.DestinationAccount.platform, models.DestinationAccount.account_name
        )
        .all()
    )

    return {
        "account_statistics": [
            {
                "platform": str(stat.platform),
                "account_name": stat.account_name,
                "total_posts": stat.total_posts,
                "avg_processing_time": round(stat.avg_processing_time, 2),
            }
            for stat in account_stats
        ]
    }
