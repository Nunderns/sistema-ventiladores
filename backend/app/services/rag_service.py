# -*- coding: utf-8 -*-
import os
from typing import Dict, List, Tuple

from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy import func

from app.db import SessionLocal, Ventilador, Estoque

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_HTTP_REFERER = os.getenv("OPENROUTER_HTTP_REFERER", "http://localhost:5173")
OPENROUTER_TITLE = os.getenv("OPENROUTER_TITLE", "Fabrica de Ventiladores")
MODEL_NAME = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o")

try:
    print(f"🔑 API Key: {OPENROUTER_API_KEY[:5]}...{OPENROUTER_API_KEY[-5:] if OPENROUTER_API_KEY else 'N/A'}")
    print(f"🌐 HTTP Referer: {OPENROUTER_HTTP_REFERER}")
    print(f"🏷️  Title: {OPENROUTER_TITLE}")
    print(f"🧠 Model: {MODEL_NAME}")
except Exception:
    # Evita quebra por encoding do console
    pass


def _sanitize_ascii_header(value: str) -> str:
    """Garantir que cabeçalhos HTTP usem apenas caracteres ASCII."""
    return value.encode("ascii", errors="ignore").decode("ascii")


client = None


def _build_default_headers() -> Dict[str, str]:
    """Construir cabeçalhos padrão aceitos pelo OpenRouter."""
    return {
        "HTTP-Referer": OPENROUTER_HTTP_REFERER,
        # Cabeçalhos HTTP devem conter apenas caracteres ASCII.
        "X-Title": _sanitize_ascii_header(OPENROUTER_TITLE),
    }


def init_rag():
    global client

    if not OPENROUTER_API_KEY:
        print("⚠️  AVISO: OPENROUTER_API_KEY não configurada. Serviço de IA não será iniciado.")
        return

    print("🚀 Inicializando OpenRouter com openai-python...")
    # Alguns clientes/middlewares ainda leem OPENAI_API_KEY, então garantimos a variável.
    os.environ.setdefault("OPENAI_API_KEY", OPENROUTER_API_KEY)
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
        default_headers=_build_default_headers(),
    )
    print(f"✅ Cliente OpenRouter pronto ({MODEL_NAME})")


# =============================
# Camada de respostas via BD
# =============================
VENTILADORES_KEYWORDS = [
    "ventilador", "ventiladores", "modelo", "modelos", "estoque",
    "quantidade", "quantidades", "quantos", "tem na loja", "disponível", "disponíveis",
]


def _is_ventilador_question(text: str) -> bool:
    t = (text or "").lower()
    return any(k in t for k in VENTILADORES_KEYWORDS)


def _db_list_modelos_com_quantidades(db) -> List[Tuple[str, int]]:
    # Soma quantidade de estoque por modelo de ventilador
    rows = (
        db.query(
            Ventilador.modelo.label("modelo"),
            func.coalesce(func.sum(Estoque.quantidade), 0).label("qtd")
        )
        .outerjoin(Estoque, Estoque.ventilador_id == Ventilador.id)
        .group_by(Ventilador.modelo)
        .order_by(Ventilador.modelo.asc())
        .all()
    )
    return [(r.modelo, int(r.qtd or 0)) for r in rows]


def _db_responder_sobre_ventiladores(pergunta: str) -> str:
    db = SessionLocal()
    try:
        modelos_qtd = _db_list_modelos_com_quantidades(db)
        if not modelos_qtd:
            return "Não encontrei ventiladores cadastrados no banco de dados."

        t = (pergunta or "").lower()
        pede_modelos = ("modelo" in t) or ("modelos" in t) or ("quais" in t)
        pede_quantidade = ("quantidade" in t) or ("quantos" in t) or ("estoque" in t)

        if pede_modelos and pede_quantidade:
            linhas = ["Modelos e quantidades disponíveis:"]
            for modelo, qtd in modelos_qtd:
                linhas.append(f"- {modelo}: {qtd} unidade(s)")
            return "\n".join(linhas)

        if pede_modelos and not pede_quantidade:
            modelos = ", ".join(m for m, _ in modelos_qtd)
            return f"Temos os seguintes modelos: {modelos}."

        if pede_quantidade and not pede_modelos:
            total = sum(q for _, q in modelos_qtd)
            linhas = [f"Quantidade total em estoque: {total}.", "Por modelo:"]
            for modelo, qtd in modelos_qtd:
                linhas.append(f"- {modelo}: {qtd}")
            return "\n".join(linhas)

        # Padrão: retornar visão geral
        linhas = ["Resumo de ventiladores em estoque:"]
        for modelo, qtd in modelos_qtd:
            linhas.append(f"- {modelo}: {qtd} unidade(s)")
        return "\n".join(linhas)
    finally:
        db.close()


def get_answer(question: str) -> str:
    global client

    # 1) Se a pergunta é sobre ventiladores/estoque/modelos, responder via banco
    try:
        if _is_ventilador_question(question):
            return _db_responder_sobre_ventiladores(question)
    except Exception:
        # Se algo falhar no BD, continua com LLM como fallback
        pass

    # 2) Caso contrário, usa o modelo LLM (se configurado)
    if client is None:
        return "Serviço de IA não configurado."

    try:
        user_content = str(question).encode("utf-8", errors="ignore").decode("utf-8")
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "Você é um assistente da fábrica de ventiladores."},
                {"role": "user", "content": user_content},
            ],
        )
        return completion.choices[0].message.content
    except Exception as e:
        message = str(e)
        if "401" in message or "not found" in message.lower():
            return (
                "Erro ao processar a pergunta: não foi possível autenticar no OpenRouter. "
                "Verifique se a OPENROUTER_API_KEY está correta e se o domínio configurado em OPENROUTER_HTTP_REFERER está autorizado."
            )
        return f"Erro ao processar a pergunta: {message}"

