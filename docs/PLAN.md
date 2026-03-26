# High level steps for project

## Part 1: Plan
**Goal:** Define detailed project roadmap, and document existing frontend.
- [x] Enrich PLAN.md with checklists, tests, and success criteria.
- [x] Analyze existing frontend code.
- [x] Create `frontend/AGENTS.md` detailing the frontend architecture.
- [x] User review and approval of the plan.

*Tests & Success Criteria:* 
- `docs/PLAN.md` and `frontend/AGENTS.md` exist and are comprehensive. 
- User explicitly approves the plan.

## Part 2: Scaffolding
**Goal:** Setup backend and Docker infrastructure.
- [x] Setup Python backend using `uv` package manager in `backend/`.
- [x] Create basic FastAPI `main.py` serving a health check and static HTML placeholder.
- [x] Create `scripts/start.sh`, `scripts/start.bat`, `scripts/start-linux.sh` for local startup.
- [x] Create `scripts/stop.sh`, `scripts/stop.bat`, `scripts/stop-linux.sh` for local shutdown.
- [x] Create Dockerfile packaging the backend.

*Tests & Success Criteria:*
- Running the start script spins up the server successfully locally.
- A GET request to the root or `/api/health` returns successfully.

## Part 3: Add in Frontend
**Goal:** Serve the frontend from the FastAPI backend.
- [x] Update NextJS config for static export.
- [x] Build the NextJS app to an `out/` directory.
- [x] Configure FastAPI to serve the static built frontend at the `/` route.
- [x] Write integration test to check that the frontend loads.

*Tests & Success Criteria:*
- Navigating to `http://localhost:8000/` displays the existing Kanban board demo.
- Unit and integration tests pass for the static serving logic.

## Part 4: Add in a fake user sign in experience
**Goal:** Secure the Kanban board behind a hardcoded login.
- [x] Create a Login page component in NextJS.
- [x] Add simple frontend auth state requiring "user" and "password" credentials.
- [x] Add a logout button to the Kanban board.
- [x] Protect the root route to show the Login page if not authenticated.

*Tests & Success Criteria:*
- Invalid credentials show an error message.
- Valid credentials grant access to the Kanban board.
- Clicking logout returns the user to the login screen.
- Comprehensive UI tests for the login flow.

## Part 5: Database modeling
**Goal:** Design the SQLite schema.
- [x] Propose SQLite schema specifying a tables for users and a JSON payload for the Kanban board.
- [x] Write a markdown document `docs/DATABASE.md` detailing the schema.
- [x] Await user sign-off on the schema.

*Tests & Success Criteria:*
- `docs/DATABASE.md` exists and is reviewed and approved by the user.

## Part 6: Backend
**Goal:** API routes for reading/updating the Kanban board.
- [ ] Implement SQLite DB initialization on startup if it doesn't exist.
- [ ] Create GET `/api/board` to fetch the board for the logged-in user.
- [ ] Create POST/PUT `/api/board` to update the user's board JSON.
- [ ] Write comprehensive Pytest unit tests mocking the DB.

*Tests & Success Criteria:*
- Backend tests pass with high coverage.
- CRUD operations to the API correctly read and write to the local SQLite database.

## Part 7: Frontend + Backend
**Goal:** Connect the NextJS frontend to the FastAPI backend.
- [ ] Replace `initialData` mock in frontend with real API fetches on load.
- [ ] Update frontend interactions (drag/drop, rename, add card) to fire API updates.
- [ ] Handle loading states and error states in the UI.

*Tests & Success Criteria:*
- Moving a card on the UI and refreshing the page retains the new position (persistence proven).
- UI successfully syncs with the backend.

## Part 8: AI connectivity
**Goal:** Establish backend connection to OpenRouter.
- [ ] Add `OPENROUTER_API_KEY` to `.env` and load in backend.
- [ ] Create an internal backend utility to call `openai/gpt-oss-120b` via OpenRouter.
- [ ] Add a test route `/api/ai_test` that sends a simple "What is 2+2?" prompt.

*Tests & Success Criteria:*
- `/api/ai_test` successfully returns "4" (or similar) from the AI, proving network and API key validity.

## Part 9: AI Structured Outputs
**Goal:** Enable AI to read and update the Kanban board.
- [ ] Define Structured Output schema for the AI response (must include textual response and optional Kanban JSON mutations/new board state).
- [ ] Create POST `/api/chat` route taking the user's message and board state.
- [ ] Modify backend to prompt the AI with the current Kanban JSON and the user's message.
- [ ] Parse AI's Structured Output and apply requested JSON mutations to the database.

*Tests & Success Criteria:*
- Backend test passing Kanban JSON and a prompt "Create a card for 'Fix login bug'" results in the DB being updated with the new card.

## Part 10: AI Chat UI
**Goal:** Build the sidebar chat widget.
- [ ] Build a collapsible sidebar widget on the right side of the Kanban board.
- [ ] Implement chat interface (message history, input box, loading animations).
- [ ] Connect chat UI to `/api/chat`.
- [ ] If `/api/chat` indicates the board was updated by the AI, automatically re-fetch the board data to reflect changes on screen.

*Tests & Success Criteria:*
- User can chat with the AI.
- Asking AI to "Add a column named 'Blocked'" results in the UI immediately showing the new column without manual refresh.