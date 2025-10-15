from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal, Ventilador
from datetime import date
from pydantic import BaseModel

router = APIRouter(
    prefix="/ventiladores",
    tags=["Ventiladores"]
)

# ==========================
# 🧰 Dependência de Sessão
# ==========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================
# 📥 Schemas (Pydantic)
# ==========================
class VentiladorCreate(BaseModel):
    modelo: str
    numero_serie: str
    data_fabricacao: date
    funcionario_id: int | None = None

class VentiladorResponse(BaseModel):
    id: int
    modelo: str
    numero_serie: str
    data_fabricacao: date
    status: str

    class Config:
        from_attributes = True

# ==========================
# 🧾 Rotas CRUD
# ==========================

@router.post("/", response_model=VentiladorResponse)
def criar_ventilador(data: VentiladorCreate, db: Session = Depends(get_db)):
    ventilador = Ventilador(
        modelo=data.modelo,
        numero_serie=data.numero_serie,
        data_fabricacao=data.data_fabricacao,
        funcionario_id=data.funcionario_id
    )
    db.add(ventilador)
    db.commit()
    db.refresh(ventilador)
    return ventilador

@router.get("/", response_model=list[VentiladorResponse])
def listar_ventiladores(db: Session = Depends(get_db)):
    return db.query(Ventilador).all()

@router.get("/{ventilador_id}", response_model=VentiladorResponse)
def obter_ventilador(ventilador_id: int, db: Session = Depends(get_db)):
    ventilador = db.query(Ventilador).filter(Ventilador.id == ventilador_id).first()
    if not ventilador:
        raise HTTPException(status_code=404, detail="Ventilador não encontrado")
    return ventilador

@router.put("/{ventilador_id}", response_model=VentiladorResponse)
def atualizar_ventilador(ventilador_id: int, data: VentiladorCreate, db: Session = Depends(get_db)):
    ventilador = db.query(Ventilador).filter(Ventilador.id == ventilador_id).first()
    if not ventilador:
        raise HTTPException(status_code=404, detail="Ventilador nǜo encontrado")
    ventilador.modelo = data.modelo
    ventilador.numero_serie = data.numero_serie
    ventilador.data_fabricacao = data.data_fabricacao
    ventilador.funcionario_id = data.funcionario_id
    db.commit()
    db.refresh(ventilador)
    return ventilador

@router.delete("/{ventilador_id}")
def deletar_ventilador(ventilador_id: int, db: Session = Depends(get_db)):
    ventilador = db.query(Ventilador).filter(Ventilador.id == ventilador_id).first()
    if not ventilador:
        raise HTTPException(status_code=404, detail="Ventilador não encontrado")
    db.delete(ventilador)
    db.commit()
    return {"message": "✅ Ventilador removido com sucesso"}
