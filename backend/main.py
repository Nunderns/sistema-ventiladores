from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.routers import ventiladores, funcionarios, producao, estoque, chat
from app.services.rag_service import init_rag, get_answer
import sys
import locale

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
# ================================
# Inicialização da API
# ================================
app = FastAPI(
    title="API - Fábrica de Ventiladores",
    description="Backend FastAPI + LangChain para interação com dados da fábrica",
    version="1.0.0"
)

# ================================
# CORS (para o front React TSX)
# ================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# Rotas de negócio
# ================================
app.include_router(ventiladores.router, prefix="/ventiladores", tags=["Ventiladores"])
app.include_router(funcionarios.router, prefix="/funcionarios", tags=["Funcionários"])
app.include_router(producao.router, prefix="/producao", tags=["Produção"])
app.include_router(estoque.router, prefix="/estoque", tags=["Estoque"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

# ================================
# Inicializar LangChain
# ================================
init_rag()

# ================================
# Rotas auxiliares
# ================================
@app.get("/")
def root():
    return {"message": "🚀 API da fábrica de ventiladores rodando com todos os módulos!"}

# ================================
# Chat com IA (LangChain)
# ================================
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
def chat(req: ChatRequest):
    answer = get_answer(req.question)
    return {"answer": answer}
