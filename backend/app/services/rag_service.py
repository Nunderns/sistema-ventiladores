# -*- coding: utf-8 -*-
import os
from typing import Dict

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_NAME = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o")
HTTP_REFERER = os.getenv("OPENROUTER_HTTP_REFERER", "http://localhost:5173")
RAW_TITLE = os.getenv("OPENROUTER_TITLE", "Fabrica de Ventiladores")


def _sanitize_ascii_header(value: str) -> str:
    """Garantir que cabeçalhos HTTP usem apenas caracteres ASCII."""

    return value.encode("ascii", errors="ignore").decode("ascii")

client = None

def _build_default_headers() -> Dict[str, str]:
    """Construir cabeçalhos padrão aceitos pelo OpenRouter."""

    return {
        "HTTP-Referer": HTTP_REFERER,
        # Cabeçalhos HTTP devem conter apenas caracteres ASCII.
        "X-Title": _sanitize_ascii_header(RAW_TITLE),
    }


def init_rag():
    global client

    if not OPENROUTER_API_KEY:
        print("⚠️ AVISO: OPENROUTER_API_KEY não configurada. Serviço de IA não será iniciado.")
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


def get_answer(question: str) -> str:
    global client

    if client is None:
        return "⚠️ Serviço de IA não configurado."

    try:
        # 🔥 Força UTF-8 para evitar erros com acentos
        user_content = str(question).encode("utf-8", errors="ignore").decode("utf-8")

        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "Você é um assistente da fábrica de ventiladores."},
                {"role": "user", "content": user_content}
            ]
        )
        return completion.choices[0].message.content

    except Exception as e:
        message = str(e)
        if "401" in message or "not found" in message.lower():
            return (
                "❌ Erro ao processar a pergunta: não foi possível autenticar no OpenRouter. "
                "Verifique se a OPENROUTER_API_KEY está correta e se o domínio configurado em OPENROUTER_HTTP_REFERER está autorizado."
            )

        return f"❌ Erro ao processar a pergunta: {message}"
