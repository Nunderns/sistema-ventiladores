from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal, Funcionario
from datetime import date
from pydantic import BaseModel

router = APIRouter(
    prefix="/funcionarios",
    tags=["Funcionários"]
)

# ==========================
# Sessão com o banco
# ==========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================
# Schemas
# ==========================
class FuncionarioCreate(BaseModel):
    nome: str
    cargo: str
    cpf: str
    data_admissao: date
    ativo: bool = True

class FuncionarioResponse(BaseModel):
    id: int
    nome: str
    cargo: str
    cpf: str
    data_admissao: date
    ativo: bool

    class Config:
        from_attributes = True

# ==========================
# Rotas CRUD
# ==========================
@router.post("/", response_model=FuncionarioResponse)
def criar_funcionario(data: FuncionarioCreate, db: Session = Depends(get_db)):
    funcionario = Funcionario(**data.dict())
    db.add(funcionario)
    db.commit()
    db.refresh(funcionario)
    return funcionario

@router.get("/", response_model=list[FuncionarioResponse])
def listar_funcionarios(db: Session = Depends(get_db)):
    return db.query(Funcionario).all()

@router.get("/{funcionario_id}", response_model=FuncionarioResponse)
def obter_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    return funcionario

@router.put("/{funcionario_id}", response_model=FuncionarioResponse)
def atualizar_funcionario(funcionario_id: int, data: FuncionarioCreate, db: Session = Depends(get_db)):
    funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    for key, value in data.dict().items():
        setattr(funcionario, key, value)
    db.commit()
    db.refresh(funcionario)
    return funcionario

@router.delete("/{funcionario_id}")
def deletar_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    db.delete(funcionario)
    db.commit()
    return {"message": "✅ Funcionário removido com sucesso"}
