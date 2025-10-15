from datetime import date
from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

# ======================================
# 🚀 Conexão com o banco de dados
# ======================================
engine = create_engine("sqlite:///fabrica_ventiladores.db", echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ======================================
# 🧊 Tabela: Ventiladores
# ======================================
class Ventilador(Base):
    __tablename__ = "ventiladores"

    id = Column(Integer, primary_key=True, index=True)
    modelo = Column(String(100), nullable=False)
    numero_serie = Column(String(100), unique=True, nullable=False)
    data_fabricacao = Column(Date, nullable=False)
    status = Column(String(50), default="Em estoque")
    funcionario_id = Column(Integer, ForeignKey("funcionarios.id"))

    funcionario = relationship("Funcionario", back_populates="ventiladores")
    producao = relationship("Producao", back_populates="ventilador")

# ======================================
# 👷 Tabela: Funcionários
# ======================================
class Funcionario(Base):
    __tablename__ = "funcionarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    cargo = Column(String(100), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    data_admissao = Column(Date, nullable=False)
    ativo = Column(Boolean, default=True)

    ventiladores = relationship("Ventilador", back_populates="funcionario")
    producao = relationship("Producao", back_populates="funcionario")

# ======================================
# 🏭 Tabela: Produção
# ======================================
class Producao(Base):
    __tablename__ = "producao"

    id = Column(Integer, primary_key=True, index=True)
    ventilador_id = Column(Integer, ForeignKey("ventiladores.id"))
    funcionario_id = Column(Integer, ForeignKey("funcionarios.id"))
    data_producao = Column(Date, nullable=False)
    turno = Column(String(50), nullable=False)

    ventilador = relationship("Ventilador", back_populates="producao")
    funcionario = relationship("Funcionario", back_populates="producao")

# ======================================
# 📦 Tabela: Estoque
# ======================================
class Estoque(Base):
    __tablename__ = "estoque"

    id = Column(Integer, primary_key=True, index=True)
    ventilador_id = Column(Integer, ForeignKey("ventiladores.id"))
    quantidade = Column(Integer, nullable=False)
    localizacao = Column(String(100), nullable=False)
    data_entrada = Column(Date, default=date.today)

    ventilador = relationship("Ventilador")

# ======================================
# 🛠️ Função para criar o banco
# ======================================
def init_db():
    Base.metadata.create_all(bind=engine)
