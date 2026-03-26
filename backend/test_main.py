import pytest
from fastapi.testclient import TestClient
from main import app
import os

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}

def test_root_returns_html():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

def test_board_crud():
    with TestClient(app) as client:
        response = client.get("/api/board")
        assert response.status_code == 200
        board = response.json().get("board")
        
        board["cards"]["test-card"] = {"id": "test-card", "title": "QA Test", "details": "Testing the backend"}
        
        response2 = client.post("/api/board", json={"data": board})
        assert response2.status_code == 200
        
        response3 = client.get("/api/board")
        updated_board = response3.json()["board"]
        assert "test-card" in updated_board["cards"]

def test_chat_route():
    with TestClient(app) as client:
        payload = {"message": "Please fix login bug", "history": []}
        response = client.post("/api/chat", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "boardUpdate" in data
        
        # Verify DB was actually updated by the AI
        board_res = client.get("/api/board")
        board = board_res.json()["board"]
        assert "mock-card-1" in board["cards"]
        assert board["cards"]["mock-card-1"]["title"] == "Fix login bug"
