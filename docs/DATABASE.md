# Database Schema

## Overview
For this MVP project, we will use a single SQLite file (`pm.db`) managed natively by the Python FastAPI backend. We do not need a complex ORM like SQLAlchemy for this MVP; we can use standard Python `sqlite3` and raw SQL queries to keep things lightweight.

## Schema Definition

### `users` table
Stores authentication details. For the MVP, we will only have one hardcoded user ("user" / "password") but the architecture supports scaling.

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `boards` table
Stores the Kanban board state. Instead of normalizing cards and columns into separate tables, we store the entire Board state as a single JSON blob. This drastically simplifies the architecture, allows flexible schema changes to cards, and supports the AI rewriting the board state in a single action.

```sql
CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    data TEXT NOT NULL, -- Stored as JSON string representing the BoardData
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Initialization Strategy
On backend startup, the FastAPI `lifespan` event will:
1. Create the `pm.db` SQLite file if it doesn't exist.
2. Execute the `CREATE TABLE` scripts above.
3. Check if the seed user (`username: "user"`) exists. If not, insert it (using a basic password hash or plaintext depending on MVP strictness—we will use a simple hash for good practice).
4. If a board doesn't exist for the seed user, insert the `initialData` JSON blob.

## JSON Payload Structure
The `data` blob will perfectly match the frontend's `BoardData` interface:

```typescript
{
  "columns": [
    { "id": "string", "title": "string", "cardIds": ["string"] }
  ],
  "cards": {
    "card-id": {
      "id": "string",
      "title": "string",
      "details": "string"
    }
  }
}
```

This ensures zero transformation is needed between the `GET /api/board` and the React frontend.
