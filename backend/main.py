import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any

from db import init_db, get_board, update_board

class BoardUpdateRequest(BaseModel):
    data: Dict[str, Any]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

from ai import call_openrouter

@app.get("/api/ai_test")
async def ai_test_route():
    try:
        response = await call_openrouter([{"role": "user", "content": "What is 2+2? Reply with just the number."}])
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/board")
async def read_board():
    # MVP: Hardcoded user login
    board = get_board("user")
    return {"board": board}

@app.post("/api/board")
async def save_board(req: BoardUpdateRequest):
    update_board("user", req.data)
    return {"status": "ok"}

from ai import chat_with_board

class ChatRequest(BaseModel):
    message: str
    history: list = []

def sanitize_board(board: dict) -> dict:
    seen = set()
    for col in board.get("columns", []):
        new_ids = []
        for cid in col.get("cardIds", []):
            if cid not in seen and cid in board.get("cards", {}):
                seen.add(cid)
                new_ids.append(cid)
        col["cardIds"] = new_ids
    return board

@app.post("/api/chat")
async def chat_route(req: ChatRequest):
    current_board = get_board("user")
    if not current_board:
        return {"error": "User board not found"}
        
    ai_response = await chat_with_board(req.message, current_board, req.history)
    
    if ai_response.get("boardUpdate"):
        sanitized = sanitize_board(ai_response["boardUpdate"])
        update_board("user", sanitized)
        ai_response["boardUpdate"] = sanitized
        
    return ai_response

frontend_out = os.path.join(os.path.dirname(__file__), "../frontend/out")

if os.path.exists(frontend_out):
    app.mount("/", StaticFiles(directory=frontend_out, html=True), name="static")
else:
    @app.get("/", response_class=HTMLResponse)
    async def serve_placeholder():
        return "<html><body><h1>Frontend not built yet! Please run npm run build in frontend directory.</h1></body></html>"
