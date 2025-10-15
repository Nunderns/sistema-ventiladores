# -*- coding: utf-8 -*-
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_NAME = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o")

client = None

def init_rag():
    global client

    if not OPENROUTER_API_KEY:
        print("⚠️ AVISO: OPENROUTER_API_KEY não configurada. Serviço de IA não será iniciado.")
        return

    print("🚀 Inicializando OpenRouter com openai-python...")
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY
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
            extra_headers={
                "HTTP-Referer": "http://localhost:5173",  # opcional
                "X-Title": "Fábrica de Ventiladores",      # opcional
            },
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "Você é um assistente da fábrica de ventiladores."},
                {"role": "user", "content": user_content}
            ]
        )
        return completion.choices[0].message.content

    except Exception as e:
        return f"❌ Erro ao processar a pergunta: {e}"
