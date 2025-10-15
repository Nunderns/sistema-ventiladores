from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ventiladores, funcionarios, producao, estoque, chat
from app.services.rag_service import init_rag
import sys
import locale

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
try:
    locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
except locale.Error:
    # Ambiente pode não ter locale PT-BR instalado
    pass

app = FastAPI(
    title="API - Fábrica de Ventiladores",
    description="Backend FastAPI + LangChain para interação com dados da fábrica",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers sob /api
app.include_router(ventiladores.router, prefix="/api", tags=["Ventiladores"])
app.include_router(funcionarios.router, prefix="/api", tags=["Funcionários"])
app.include_router(producao.router, prefix="/api", tags=["Produção"])
app.include_router(estoque.router, prefix="/api", tags=["Estoque"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

# Inicializar LangChain
init_rag()

@app.get("/")
def root():
    return {"message": "🚀 API da fábrica de ventiladores rodando com todos os módulos!"}

