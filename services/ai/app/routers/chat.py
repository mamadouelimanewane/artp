from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Literal
import uuid
from app.chatbot import get_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    lang: Literal["fr", "wo"] = "fr"
    context: Literal["qos", "complaint", "general"] = "general"
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    lang: str
    intent: Optional[str] = None
    suggestions: list[str] = []

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    conv_id = req.conversation_id or str(uuid.uuid4())
    reply, intent, suggestions = get_response(req.message, req.lang, req.context)

    return ChatResponse(
        reply=reply,
        conversation_id=conv_id,
        lang=req.lang,
        intent=intent,
        suggestions=suggestions,
    )
