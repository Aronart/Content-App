from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import models, schemas
from src.database.session import get_db

router = APIRouter()

@router.get("/source-configs", response_model=List[schemas.SourceConfig])
def list_source_configs(db: Session = Depends(get_db)):
    return db.query(models.SourceConfig).all()

@router.post("/source-configs", response_model=schemas.SourceConfig)
def create_source_config(config: schemas.SourceConfigCreate, db: Session = Depends(get_db)):
    db_config = models.SourceConfig(**config.model_dump())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@router.get("/source-configs/{config_id}", response_model=schemas.SourceConfig)
def get_source_config(config_id: int, db: Session = Depends(get_db)):
    db_config = db.query(models.SourceConfig).filter(models.SourceConfig.id == config_id).first()
    if db_config is None:
        raise HTTPException(status_code=404, detail="Source config not found")
    return db_config

@router.put("/source-configs/{config_id}", response_model=schemas.SourceConfig)
def update_source_config(config_id: int, config: schemas.SourceConfigCreate, db: Session = Depends(get_db)):
    db_config = db.query(models.SourceConfig).filter(models.SourceConfig.id == config_id).first()
    if db_config is None:
        raise HTTPException(status_code=404, detail="Source config not found")
    
    for key, value in config.model_dump().items():
        setattr(db_config, key, value)
    
    db.commit()
    db.refresh(db_config)
    return db_config

@router.delete("/source-configs/{config_id}")
def delete_source_config(config_id: int, db: Session = Depends(get_db)):
    config = db.query(models.SourceConfig).filter(models.SourceConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Source config not found")
    
    # Check if there are any content flows using this source config
    flows = db.query(models.ContentFlow).filter(models.ContentFlow.source_config_id == config_id).all()
    if flows:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete source config that is being used by content flows. Please delete the associated content flows first."
        )
    
    try:
        db.delete(config)
        db.commit()
        return {"message": "Source config deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Cannot delete source config due to existing references"
        ) from e

@router.get("/editing-pipelines", response_model=List[schemas.EditingPipeline])
def list_editing_pipelines(db: Session = Depends(get_db)):
    return db.query(models.EditingPipeline).all()

@router.post("/editing-pipelines", response_model=schemas.EditingPipeline)
def create_editing_pipeline(pipeline: schemas.EditingPipelineCreate, db: Session = Depends(get_db)):
    db_pipeline = models.EditingPipeline(**pipeline.model_dump())
    db.add(db_pipeline)
    db.commit()
    db.refresh(db_pipeline)
    return db_pipeline

@router.get("/editing-pipelines/{pipeline_id}", response_model=schemas.EditingPipeline)
def get_editing_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    db_pipeline = db.query(models.EditingPipeline).filter(models.EditingPipeline.id == pipeline_id).first()
    if db_pipeline is None:
        raise HTTPException(status_code=404, detail="Editing pipeline not found")
    return db_pipeline

@router.put("/editing-pipelines/{pipeline_id}", response_model=schemas.EditingPipeline)
def update_editing_pipeline(pipeline_id: int, pipeline: schemas.EditingPipelineCreate, db: Session = Depends(get_db)):
    db_pipeline = db.query(models.EditingPipeline).filter(models.EditingPipeline.id == pipeline_id).first()
    if db_pipeline is None:
        raise HTTPException(status_code=404, detail="Editing pipeline not found")
    
    for key, value in pipeline.model_dump().items():
        setattr(db_pipeline, key, value)
    
    db.commit()
    db.refresh(db_pipeline)
    return db_pipeline

@router.delete("/editing-pipelines/{pipeline_id}")
def delete_editing_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    db_pipeline = db.query(models.EditingPipeline).filter(models.EditingPipeline.id == pipeline_id).first()
    if db_pipeline is None:
        raise HTTPException(status_code=404, detail="Editing pipeline not found")
    
    db.delete(db_pipeline)
    db.commit()
    return {"message": "Editing pipeline deleted"}

@router.get("/destination-accounts", response_model=List[schemas.DestinationAccount])
def list_destination_accounts(db: Session = Depends(get_db)):
    return db.query(models.DestinationAccount).all()

@router.post("/destination-accounts", response_model=schemas.DestinationAccount)
def create_destination_account(account: schemas.DestinationAccountCreate, db: Session = Depends(get_db)):
    db_account = models.DestinationAccount(**account.model_dump())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/destination-accounts/{account_id}", response_model=schemas.DestinationAccount)
def get_destination_account(account_id: int, db: Session = Depends(get_db)):
    db_account = db.query(models.DestinationAccount).filter(models.DestinationAccount.id == account_id).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Destination account not found")
    return db_account

@router.put("/destination-accounts/{account_id}", response_model=schemas.DestinationAccount)
def update_destination_account(account_id: int, account: schemas.DestinationAccountCreate, db: Session = Depends(get_db)):
    db_account = db.query(models.DestinationAccount).filter(models.DestinationAccount.id == account_id).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Destination account not found")
    
    for key, value in account.model_dump().items():
        setattr(db_account, key, value)
    
    db.commit()
    db.refresh(db_account)
    return db_account

@router.delete("/destination-accounts/{account_id}")
def delete_destination_account(account_id: int, db: Session = Depends(get_db)):
    db_account = db.query(models.DestinationAccount).filter(models.DestinationAccount.id == account_id).first()
    if db_account is None:
        raise HTTPException(status_code=404, detail="Destination account not found")
    
    db.delete(db_account)
    db.commit()
    return {"message": "Destination account deleted"}

@router.get("/content-flows", response_model=List[schemas.ContentFlow])
def list_content_flows(db: Session = Depends(get_db)):
    return db.query(models.ContentFlow).all()

@router.post("/content-flows", response_model=schemas.ContentFlow)
def create_content_flow(flow: schemas.ContentFlowCreate, db: Session = Depends(get_db)):
    db_flow = models.ContentFlow(**flow.model_dump())
    db.add(db_flow)
    db.commit()
    db.refresh(db_flow)
    return db_flow

@router.get("/content-flows/{flow_id}", response_model=schemas.ContentFlow)
def get_content_flow(flow_id: int, db: Session = Depends(get_db)):
    db_flow = db.query(models.ContentFlow).filter(models.ContentFlow.id == flow_id).first()
    if db_flow is None:
        raise HTTPException(status_code=404, detail="Content flow not found")
    return db_flow

@router.put("/content-flows/{flow_id}", response_model=schemas.ContentFlow)
def update_content_flow(flow_id: int, flow: schemas.ContentFlowCreate, db: Session = Depends(get_db)):
    db_flow = db.query(models.ContentFlow).filter(models.ContentFlow.id == flow_id).first()
    if db_flow is None:
        raise HTTPException(status_code=404, detail="Content flow not found")
    
    for key, value in flow.model_dump().items():
        setattr(db_flow, key, value)
    
    db.commit()
    db.refresh(db_flow)
    return db_flow

@router.delete("/content-flows/{flow_id}")
def delete_content_flow(flow_id: int, db: Session = Depends(get_db)):
    db_flow = db.query(models.ContentFlow).filter(models.ContentFlow.id == flow_id).first()
    if db_flow is None:
        raise HTTPException(status_code=404, detail="Content flow not found")
    
    db.delete(db_flow)
    db.commit()
    return {"message": "Content flow deleted"}
