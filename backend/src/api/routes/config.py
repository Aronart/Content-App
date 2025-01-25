"""Configuration routes for the Content App API."""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import models, schemas
from src.database.session import get_db

router = APIRouter(tags=["config"])  

# Global Config Routes
@router.get("/global", response_model=schemas.GlobalConfig)
def get_global_config(db: Session = Depends(get_db)):
    """Get the global configuration.
    
    Returns:
        GlobalConfig: Global configuration settings
        
    Raises:
        HTTPException: If no global config exists
    """
    config = db.query(models.GlobalConfig).first()
    if not config:
        config = models.GlobalConfig()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@router.put("/global", response_model=schemas.GlobalConfig)
def update_global_config(config: schemas.GlobalConfigUpdate, db: Session = Depends(get_db)):
    """Update the global configuration.
    
    Args:
        config (GlobalConfigUpdate): Updated configuration
        
    Returns:
        GlobalConfig: Updated global configuration
        
    Raises:
        HTTPException: If update fails
    """
    db_config = db.query(models.GlobalConfig).first()
    if not db_config:
        db_config = models.GlobalConfig()
        db.add(db_config)
    
    for field, value in config.model_dump(exclude_unset=True).items():
        setattr(db_config, field, value)
    
    db.commit()
    db.refresh(db_config)
    return db_config

# Source Config Routes
@router.get("/sources", response_model=List[schemas.SourceConfig])
def list_source_configs(db: Session = Depends(get_db)):
    """List all source configurations.
    
    Returns:
        List[SourceConfig]: List of all source configurations in the system
    """
    return db.query(models.SourceConfig).all()

@router.post("/sources", response_model=schemas.SourceConfig)
def create_source_config(config: schemas.SourceConfigCreate, db: Session = Depends(get_db)):
    """Create a new source configuration.
    
    Args:
        config (SourceConfigCreate): Source configuration to create
        
    Returns:
        SourceConfig: Created source configuration
        
    Raises:
        HTTPException: If creation fails
    """
    db_config = models.SourceConfig(**config.model_dump())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@router.get("/sources/{config_id}", response_model=schemas.SourceConfig)
def get_source_config(config_id: int, db: Session = Depends(get_db)):
    """Get a specific source configuration.
    
    Args:
        config_id (int): ID of the source config to retrieve
        
    Returns:
        SourceConfig: Requested source configuration
        
    Raises:
        HTTPException: If config not found
    """
    db_config = db.query(models.SourceConfig).filter(models.SourceConfig.id == config_id).first()
    if db_config is None:
        raise HTTPException(status_code=404, detail="Source config not found")
    return db_config

@router.put("/sources/{config_id}", response_model=schemas.SourceConfig)
def update_source_config(config_id: int, config: schemas.SourceConfigCreate, db: Session = Depends(get_db)):
    """Update a source configuration.
    
    Args:
        config_id (int): ID of the source config to update
        config (SourceConfigCreate): Updated configuration
        
    Returns:
        SourceConfig: Updated source configuration
        
    Raises:
        HTTPException: If config not found
    """
    db_config = db.query(models.SourceConfig).filter(models.SourceConfig.id == config_id).first()
    if db_config is None:
        raise HTTPException(status_code=404, detail="Source config not found")
    
    for key, value in config.model_dump().items():
        setattr(db_config, key, value)
    
    db.commit()
    db.refresh(db_config)
    return db_config

@router.delete("/sources/{config_id}")
def delete_source_config(config_id: int, db: Session = Depends(get_db)):
    """Delete a source configuration.
    
    Args:
        config_id (int): ID of the source config to delete
        
    Raises:
        HTTPException: If config not found or in use
    """
    config = db.query(models.SourceConfig).filter(models.SourceConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Source config not found")
    
    # Check if there are any content flows using this source config
    flows = db.query(models.ContentFlow).filter(models.ContentFlow.source_config_id == config_id).all()
    if flows:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete source config that is being used by content flows"
        )
    
    db.delete(config)
    db.commit()
    return {"message": "Source config deleted"}

# Source Rate Limit Routes
@router.get("/source-rate-limits", response_model=List[schemas.SourceRateLimit])
def list_source_rate_limits(db: Session = Depends(get_db)):
    """List all source rate limit configurations.
    
    Returns:
        List[SourceRateLimit]: List of all source rate limits in the system
    """
    return db.query(models.SourceRateLimit).all()

@router.post("/source-rate-limits", response_model=schemas.SourceRateLimit)
def create_source_rate_limit(rate_limit: schemas.SourceRateLimitCreate, db: Session = Depends(get_db)):
    """Create a new source rate limit configuration.
    
    Args:
        rate_limit (SourceRateLimitCreate): Rate limit configuration to create
        
    Returns:
        SourceRateLimit: Created rate limit configuration
    """
    db_rate_limit = models.SourceRateLimit(**rate_limit.model_dump())
    db.add(db_rate_limit)
    db.commit()
    db.refresh(db_rate_limit)
    return db_rate_limit

@router.get("/source-rate-limits/{rate_limit_id}", response_model=schemas.SourceRateLimit)
def get_source_rate_limit(rate_limit_id: int, db: Session = Depends(get_db)):
    """Get a specific source rate limit configuration.
    
    Args:
        rate_limit_id (int): ID of the rate limit to retrieve
        
    Returns:
        SourceRateLimit: Requested rate limit configuration
        
    Raises:
        HTTPException: If rate limit not found
    """
    rate_limit = db.query(models.SourceRateLimit).filter(models.SourceRateLimit.id == rate_limit_id).first()
    if not rate_limit:
        raise HTTPException(status_code=404, detail="Source rate limit not found")
    return rate_limit

@router.put("/source-rate-limits/{rate_limit_id}", response_model=schemas.SourceRateLimit)
def update_source_rate_limit(rate_limit_id: int, rate_limit: schemas.SourceRateLimitUpdate, db: Session = Depends(get_db)):
    """Update a source rate limit configuration.
    
    Args:
        rate_limit_id (int): ID of the rate limit to update
        rate_limit (SourceRateLimitUpdate): Updated configuration
        
    Returns:
        SourceRateLimit: Updated rate limit configuration
        
    Raises:
        HTTPException: If rate limit not found
    """
    db_rate_limit = db.query(models.SourceRateLimit).filter(models.SourceRateLimit.id == rate_limit_id).first()
    if not db_rate_limit:
        raise HTTPException(status_code=404, detail="Source rate limit not found")
    
    for field, value in rate_limit.model_dump(exclude_unset=True).items():
        setattr(db_rate_limit, field, value)
    
    db.commit()
    db.refresh(db_rate_limit)
    return db_rate_limit

@router.delete("/source-rate-limits/{rate_limit_id}")
def delete_source_rate_limit(rate_limit_id: int, db: Session = Depends(get_db)):
    """Delete a source rate limit configuration.
    
    Args:
        rate_limit_id (int): ID of the rate limit to delete
        
    Raises:
        HTTPException: If rate limit not found or in use
    """
    db_rate_limit = db.query(models.SourceRateLimit).filter(models.SourceRateLimit.id == rate_limit_id).first()
    if not db_rate_limit:
        raise HTTPException(status_code=404, detail="Source rate limit not found")
    
    # Check if rate limit is in use
    if db_rate_limit.source_configs:
        raise HTTPException(status_code=400, detail="Cannot delete rate limit that is in use")
    
    db.delete(db_rate_limit)
    db.commit()

# Editing Pipeline Routes
@router.get("/pipelines", response_model=List[schemas.EditingPipeline])
def list_editing_pipelines(db: Session = Depends(get_db)):
    """List all editing pipeline configurations.
    
    Returns:
        List[EditingPipeline]: List of all editing pipelines in the system
    """
    return db.query(models.EditingPipeline).all()

@router.post("/pipelines", response_model=schemas.EditingPipeline)
def create_editing_pipeline(pipeline: schemas.EditingPipelineCreate, db: Session = Depends(get_db)):
    """Create a new editing pipeline configuration.
    
    Args:
        pipeline (EditingPipelineCreate): Pipeline configuration to create
        
    Returns:
        EditingPipeline: Created pipeline configuration
    """
    db_pipeline = models.EditingPipeline(**pipeline.model_dump())
    db.add(db_pipeline)
    db.commit()
    db.refresh(db_pipeline)
    return db_pipeline

@router.get("/pipelines/{pipeline_id}", response_model=schemas.EditingPipeline)
def get_editing_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    """Get a specific editing pipeline configuration.
    
    Args:
        pipeline_id (int): ID of the pipeline to retrieve
        
    Returns:
        EditingPipeline: Requested pipeline configuration
        
    Raises:
        HTTPException: If pipeline not found
    """
    pipeline = db.query(models.EditingPipeline).filter(models.EditingPipeline.id == pipeline_id).first()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Editing pipeline not found")
    return pipeline

@router.put("/pipelines/{pipeline_id}", response_model=schemas.EditingPipeline)
def update_editing_pipeline(pipeline_id: int, pipeline: schemas.EditingPipelineCreate, db: Session = Depends(get_db)):
    """Update an editing pipeline configuration.
    
    Args:
        pipeline_id (int): ID of the pipeline to update
        pipeline (EditingPipelineCreate): Updated configuration
        
    Returns:
        EditingPipeline: Updated pipeline configuration
        
    Raises:
        HTTPException: If pipeline not found
    """
    db_pipeline = db.query(models.EditingPipeline).filter(models.EditingPipeline.id == pipeline_id).first()
    if not db_pipeline:
        raise HTTPException(status_code=404, detail="Editing pipeline not found")
    
    for key, value in pipeline.model_dump().items():
        setattr(db_pipeline, key, value)
    
    db.commit()
    db.refresh(db_pipeline)
    return db_pipeline

@router.delete("/pipelines/{pipeline_id}")
def delete_editing_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    """Delete an editing pipeline configuration.
    
    Args:
        pipeline_id (int): ID of the pipeline to delete
        
    Raises:
        HTTPException: If pipeline not found or in use
    """
    pipeline = db.query(models.EditingPipeline).filter(models.EditingPipeline.id == pipeline_id).first()
    if not pipeline:
        raise HTTPException(status_code=404, detail="Editing pipeline not found")
    
    # Check if pipeline is being used
    flows = db.query(models.ContentFlow).filter(models.ContentFlow.editing_pipeline_id == pipeline_id).all()
    if flows:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete pipeline that is being used by content flows"
        )
    
    db.delete(pipeline)
    db.commit()
    return {"message": "Editing pipeline deleted"}

# Destination Rate Limit Routes
@router.get("/destination-rate-limits", response_model=List[schemas.DestinationRateLimit])
def list_destination_rate_limits(db: Session = Depends(get_db)):
    """List all destination rate limit configurations.
    
    Returns:
        List[DestinationRateLimit]: List of all destination rate limits in the system
    """
    return db.query(models.DestinationRateLimit).all()

@router.post("/destination-rate-limits", response_model=schemas.DestinationRateLimit)
def create_destination_rate_limit(rate_limit: schemas.DestinationRateLimitCreate, db: Session = Depends(get_db)):
    """Create a new destination rate limit configuration.
    
    Args:
        rate_limit (DestinationRateLimitCreate): Rate limit configuration to create
        
    Returns:
        DestinationRateLimit: Created rate limit configuration
    """
    db_rate_limit = models.DestinationRateLimit(**rate_limit.model_dump())
    db.add(db_rate_limit)
    db.commit()
    db.refresh(db_rate_limit)
    return db_rate_limit

@router.get("/destination-rate-limits/{rate_limit_id}", response_model=schemas.DestinationRateLimit)
def get_destination_rate_limit(rate_limit_id: int, db: Session = Depends(get_db)):
    """Get a specific destination rate limit configuration.
    
    Args:
        rate_limit_id (int): ID of the rate limit to retrieve
        
    Returns:
        DestinationRateLimit: Requested rate limit configuration
        
    Raises:
        HTTPException: If rate limit not found
    """
    rate_limit = db.query(models.DestinationRateLimit).filter(models.DestinationRateLimit.id == rate_limit_id).first()
    if not rate_limit:
        raise HTTPException(status_code=404, detail="Destination rate limit not found")
    return rate_limit

@router.put("/destination-rate-limits/{rate_limit_id}", response_model=schemas.DestinationRateLimit)
def update_destination_rate_limit(rate_limit_id: int, rate_limit: schemas.DestinationRateLimitUpdate, db: Session = Depends(get_db)):
    """Update a destination rate limit configuration.
    
    Args:
        rate_limit_id (int): ID of the rate limit to update
        rate_limit (DestinationRateLimitUpdate): Updated configuration
        
    Returns:
        DestinationRateLimit: Updated rate limit configuration
        
    Raises:
        HTTPException: If rate limit not found
    """
    db_rate_limit = db.query(models.DestinationRateLimit).filter(models.DestinationRateLimit.id == rate_limit_id).first()
    if not db_rate_limit:
        raise HTTPException(status_code=404, detail="Destination rate limit not found")
    
    for field, value in rate_limit.model_dump(exclude_unset=True).items():
        setattr(db_rate_limit, field, value)
    
    db.commit()
    db.refresh(db_rate_limit)
    return db_rate_limit

@router.delete("/destination-rate-limits/{rate_limit_id}")
def delete_destination_rate_limit(rate_limit_id: int, db: Session = Depends(get_db)):
    """Delete a destination rate limit configuration.
    
    Args:
        rate_limit_id (int): ID of the rate limit to delete
        
    Raises:
        HTTPException: If rate limit not found or in use
    """
    db_rate_limit = db.query(models.DestinationRateLimit).filter(models.DestinationRateLimit.id == rate_limit_id).first()
    if not db_rate_limit:
        raise HTTPException(status_code=404, detail="Destination rate limit not found")
    
    # Check if rate limit is in use
    if db_rate_limit.destination_accounts:
        raise HTTPException(status_code=400, detail="Cannot delete rate limit that is in use")
    
    db.delete(db_rate_limit)
    db.commit()

# Destination Account Routes
@router.get("/destinations", response_model=List[schemas.DestinationAccount])
def list_destination_accounts(db: Session = Depends(get_db)):
    """List all destination account configurations.
    
    Returns:
        List[DestinationAccount]: List of all destination accounts in the system
    """
    return db.query(models.DestinationAccount).all()

@router.post("/destinations", response_model=schemas.DestinationAccount)
def create_destination_account(account: schemas.DestinationAccountCreate, db: Session = Depends(get_db)):
    """Create a new destination account configuration.
    
    Args:
        account (DestinationAccountCreate): Account configuration to create
        
    Returns:
        DestinationAccount: Created account configuration
    """
    db_account = models.DestinationAccount(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/destinations/{account_id}", response_model=schemas.DestinationAccount)
def get_destination_account(account_id: int, db: Session = Depends(get_db)):
    """Get a specific destination account configuration.
    
    Args:
        account_id (int): ID of the account to retrieve
        
    Returns:
        DestinationAccount: Requested account configuration
        
    Raises:
        HTTPException: If account not found
    """
    account = db.query(models.DestinationAccount).filter(models.DestinationAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Destination account not found")
    return account

@router.put("/destinations/{account_id}", response_model=schemas.DestinationAccount)
def update_destination_account(account_id: int, account: schemas.DestinationAccountCreate, db: Session = Depends(get_db)):
    """Update a destination account configuration.
    
    Args:
        account_id (int): ID of the account to update
        account (DestinationAccountCreate): Updated configuration
        
    Returns:
        DestinationAccount: Updated account configuration
        
    Raises:
        HTTPException: If account not found
    """
    db_account = db.query(models.DestinationAccount).filter(models.DestinationAccount.id == account_id).first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Destination account not found")
    
    for key, value in account.model_dump().items():
        setattr(db_account, key, value)
    
    db.commit()
    db.refresh(db_account)
    return db_account

@router.delete("/destinations/{account_id}")
def delete_destination_account(account_id: int, db: Session = Depends(get_db)):
    """Delete a destination account configuration.
    
    Args:
        account_id (int): ID of the account to delete
        
    Raises:
        HTTPException: If account not found or in use
    """
    account = db.query(models.DestinationAccount).filter(models.DestinationAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Destination account not found")
    
    # Check if account is being used
    flows = db.query(models.ContentFlow).filter(models.ContentFlow.destination_account_id == account_id).all()
    if flows:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete account that is being used by content flows"
        )
    
    db.delete(account)
    db.commit()
    return {"message": "Destination account deleted"}

# Content Flow Routes
@router.get("/flows", response_model=List[schemas.ContentFlow])
def list_content_flows(db: Session = Depends(get_db)):
    """List all content flow configurations.
    
    Returns:
        List[ContentFlow]: List of all content flows in the system
    """
    return db.query(models.ContentFlow).all()

@router.post("/flows", response_model=schemas.ContentFlow)
def create_content_flow(flow: schemas.ContentFlowCreate, db: Session = Depends(get_db)):
    """Create a new content flow configuration.
    
    Args:
        flow (ContentFlowCreate): Flow configuration to create
        
    Returns:
        ContentFlow: Created flow configuration
    """
    db_flow = models.ContentFlow(**flow.model_dump())
    db.add(db_flow)
    db.commit()
    db.refresh(db_flow)
    return db_flow

@router.get("/flows/{flow_id}", response_model=schemas.ContentFlow)
def get_content_flow(flow_id: int, db: Session = Depends(get_db)):
    """Get a specific content flow configuration.
    
    Args:
        flow_id (int): ID of the flow to retrieve
        
    Returns:
        ContentFlow: Requested flow configuration
        
    Raises:
        HTTPException: If flow not found
    """
    flow = db.query(models.ContentFlow).filter(models.ContentFlow.id == flow_id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Content flow not found")
    return flow

@router.put("/flows/{flow_id}", response_model=schemas.ContentFlow)
def update_content_flow(flow_id: int, flow: schemas.ContentFlowCreate, db: Session = Depends(get_db)):
    """Update a content flow configuration.
    
    Args:
        flow_id (int): ID of the flow to update
        flow (ContentFlowCreate): Updated configuration
        
    Returns:
        ContentFlow: Updated flow configuration
        
    Raises:
        HTTPException: If flow not found
    """
    db_flow = db.query(models.ContentFlow).filter(models.ContentFlow.id == flow_id).first()
    if not db_flow:
        raise HTTPException(status_code=404, detail="Content flow not found")
    
    for key, value in flow.model_dump().items():
        setattr(db_flow, key, value)
    
    db.commit()
    db.refresh(db_flow)
    return db_flow

@router.delete("/flows/{flow_id}")
def delete_content_flow(flow_id: int, db: Session = Depends(get_db)):
    """Delete a content flow configuration.
    
    Args:
        flow_id (int): ID of the flow to delete
        
    Raises:
        HTTPException: If flow not found
    """
    flow = db.query(models.ContentFlow).filter(models.ContentFlow.id == flow_id).first()
    if not flow:
        raise HTTPException(status_code=404, detail="Content flow not found")
    
    db.delete(flow)
    db.commit()
    return {"message": "Content flow deleted"}
