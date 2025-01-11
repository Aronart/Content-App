# backend/src/api/routes/config.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src.database.session import get_db
from src.database import schemas, models
from src.core.security import get_current_user

router = APIRouter()

@router.get("/source", response_model=List[schemas.SourceConfig])
async def get_source_configs(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get all source configurations"""
    configs = db.query(models.SourceConfig).all()
    return configs

@router.post("/source", response_model=schemas.SourceConfig)
async def create_source_config(
    config: schemas.SourceConfigCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Create a new source configuration"""
    db_config = models.SourceConfig(**config.model_dump())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@router.get("/pipeline", response_model=List[schemas.EditingPipeline])
async def get_editing_pipelines(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get all editing pipeline configurations"""
    pipelines = db.query(models.EditingPipeline).all()
    return pipelines

@router.post("/pipeline", response_model=schemas.EditingPipeline)
async def create_editing_pipeline(
    pipeline: schemas.EditingPipelineCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Create a new editing pipeline configuration"""
    db_pipeline = models.EditingPipeline(**pipeline.model_dump())
    db.add(db_pipeline)
    db.commit()
    db.refresh(db_pipeline)
    return db_pipeline

@router.get("/destination", response_model=List[schemas.DestinationAccount])
async def get_destination_accounts(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get all destination account configurations"""
    accounts = db.query(models.DestinationAccount).all()
    return accounts

@router.post("/destination", response_model=schemas.DestinationAccount)
async def create_destination_account(
    account: schemas.DestinationAccountCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Create a new destination account configuration"""
    db_account = models.DestinationAccount(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/quota", response_model=List[schemas.ContentQuota])
async def get_content_quotas(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get all content quota configurations"""
    quotas = db.query(models.ContentQuota).all()
    return quotas

@router.post("/quota", response_model=schemas.ContentQuota)
async def create_content_quota(
    quota: schemas.ContentQuotaCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Create a new content quota configuration"""
    db_quota = models.ContentQuota(**quota.model_dump())
    db.add(db_quota)
    db.commit()
    db.refresh(db_quota)
    return db_quota