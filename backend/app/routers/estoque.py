from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal, Estoque
from datetime import date
from pydantic import BaseModel

router = APIRouter(
    prefix="/estoque",
    tags=["Estoque"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class EstoqueCreate(BaseModel):
    ventilador_id: int
    quantidade: int
    localizacao: str
    data_entrada: date = date.today()

class EstoqueResponse(BaseModel):
    id: int
    ventilador_id: int
    quantidade: int
    localizacao: str
    data_entrada: date

    class Config:
        from_attributes = True

@router.post("/", response_model=EstoqueResponse)
def adicionar_estoque(data: EstoqueCreate, db: Session = Depends(get_db)):
    estoque = Estoque(**data.dict())
    db.add(estoque)
    db.commit()
    db.refresh(estoque)
    return estoque

@router.get("/", response_model=list[EstoqueResponse])
def listar_estoque(db: Session = Depends(get_db)):
    return db.query(Estoque).all()

@router.get("/{estoque_id}", response_model=EstoqueResponse)
def obter_item(estoque_id: int, db: Session = Depends(get_db)):
    estoque = db.query(Estoque).filter(Estoque.id == estoque_id).first()
    if not estoque:
        raise HTTPException(status_code=404, detail="Item do estoque não encontrado")
    return estoque

@router.delete("/{estoque_id}")
def deletar_item(estoque_id: int, db: Session = Depends(get_db)):
    estoque = db.query(Estoque).filter(Estoque.id == estoque_id).first()
    if not estoque:
        raise HTTPException(status_code=404, detail="Item do estoque não encontrado")
    db.delete(estoque)
    db.commit()
    return {"message": "✅ Item do estoque removido com sucesso"}
