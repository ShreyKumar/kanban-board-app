# Project Management MVP

This project is a Kanban Board MVP. It features a Next.js frontend with drag-and-drop capabilities, served statically by a Python FastAPI backend that interfaces with a local SQLite database. It includes an integrated AI assistant powered by OpenRouter to read and manipulate the Kanban board via natural language chat.

*Note: This entire project was AI-generated.*

## Technologies Used

### Frontend
- Next.js (Static Export)
- React
- Tailwind CSS
- dnd-kit (Drag and Drop)
- Playwright (End-to-End Testing)

### Backend
- Python 3.12
- FastAPI
- SQLite
- uv (Package Manager)
- Pytest (Unit Testing)

### Infrastructure & AI
- Docker & Docker Compose
- OpenRouter API (gpt-oss-120b)

## Running the Application

1. Add your OpenRouter API key to `.env` in the project root:
   ```
   OPENROUTER_API_KEY="sk-or-v1-..."
   ```
2. Start the application using the provided scripts:
   - macOS: `./scripts/start.sh` 
   - Linux: `./scripts/start-linux.sh`
   - Windows: `./scripts/start.bat`
3. Access the application at `http://localhost:8000/`.
4. Log in with the default MVP credentials:
   - Username: `user`
   - Password: `password`

## Stopping the Application

To tear down the Docker containers, run the corresponding stop script:
- `./scripts/stop.sh` (macOS)
- `./scripts/stop-linux.sh` (Linux)
- `./scripts/stop.bat` (Windows)
