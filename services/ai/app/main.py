from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, health
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="ARTP Mon Réseau SN — Service IA",
    description="Chatbot bilingue (français/wolof) pour l'assistance ARTP",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(chat.router)
