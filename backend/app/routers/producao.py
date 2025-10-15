from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal, Producao
from datetime import date
from pydantic import BaseModel

router = APIRouter(
    prefix="/producao",
    tags=["Produção"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ProducaoCreate(BaseModel):
    ventilador_id: int
    funcionario_id: int
    data_producao: date
    turno: str

class ProducaoResponse(BaseModel):
    id: int
    ventilador_id: int
    funcionario_id: int
    data_producao: date
    turno: str

    class Config:
        from_attributes = True

@router.post("/", response_model=ProducaoResponse)
def criar_producao(data: ProducaoCreate, db: Session = Depends(get_db)):
    producao = Producao(**data.dict())
    db.add(producao)
    db.commit()
    db.refresh(producao)
    return producao

@router.get("/", response_model=list[ProducaoResponse])
def listar_producao(db: Session = Depends(get_db)):
    return db.query(Producao).all()

@router.get("/{producao_id}", response_model=ProducaoResponse)
def obter_producao(producao_id: int, db: Session = Depends(get_db)):
    producao = db.query(Producao).filter(Producao.id == producao_id).first()
    if not producao:
        raise HTTPException(status_code=404, detail="Produção não encontrada")
    return producao

@router.delete("/{producao_id}")
def deletar_producao(producao_id: int, db: Session = Depends(get_db)):
    producao = db.query(Producao).filter(Producao.id == producao_id).first()
    if not producao:
        raise HTTPException(status_code=404, detail="Produção não encontrada")
    db.delete(producao)
    db.commit()
    return {"message": "✅ Registro de produção removido com sucesso"}
