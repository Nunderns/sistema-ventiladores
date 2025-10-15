import os
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.llms import OpenAI

# ================================
# 1. Carregar variáveis de ambiente
# ================================
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ================================
# 2. Inicializar LangChain
# ================================
qa_chain = None

def init_rag():
    """Inicializa a cadeia de QA (Perguntas e Respostas) do LangChain."""
    global qa_chain
    if not OPENAI_API_KEY:
        print("⚠️ AVISO: OPENAI_API_KEY não configurada. RAG não será inicializado.")
        qa_chain = None
        return

    try:
        print("🚀 Inicializando LangChain (RAG)...")
        embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
        vectordb = Chroma(persist_directory="data/chroma", embedding_function=embeddings)
        retriever = vectordb.as_retriever()

        qa_chain = RetrievalQA.from_chain_type(
            llm=OpenAI(openai_api_key=OPENAI_API_KEY, temperature=0),
            retriever=retriever
        )
        print("✅ LangChain inicializado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao inicializar RAG: {e}")
        qa_chain = None


def get_answer(question: str) -> str:
    global client

    if client is None:
        return "⚠️ Serviço de IA não configurado."

    try:
        # Ensure question is properly encoded
        if isinstance(question, str):
            # Remove any problematic characters
            question = question.encode('utf-8', 'ignore').decode('utf-8')
        
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "Fábrica de Ventiladores",
            },
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "Você é um assistente da fábrica de ventiladores."},
                {"role": "user", "content": question}
            ]
        )
        # Ensure the response is properly encoded
        response = completion.choices[0].message.content
        return response.encode('utf-8', 'ignore').decode('utf-8')

    except Exception as e:
        error_msg = str(e).encode('utf-8', 'ignore').decode('utf-8')
        return f"❌ Erro ao processar a pergunta: {error_msg}"