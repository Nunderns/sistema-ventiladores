from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_service import get_answer

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("")
async def chat_endpoint(request: ChatRequest):
    """Handle chat requests and return AI responses."""
    try:
        answer = get_answer(request.question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))