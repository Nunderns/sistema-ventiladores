from datetime import date
from app.db import SessionLocal, Funcionario

db = SessionLocal()

novo_func = Funcionario(
    nome="João Silva",
    cargo="Montador",
    cpf="123.456.789-00",
    data_admissao=date.today()
)

db.add(novo_func)
db.commit()
db.close()

print("✅ Funcionário adicionado com sucesso!")
