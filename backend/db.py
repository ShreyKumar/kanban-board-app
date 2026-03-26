import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "pm.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS boards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    ''')
    
    # Insert seed user if not exists
    cursor.execute("SELECT id FROM users WHERE username = ?", ("user",))
    user = cursor.fetchone()
    if not user:
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", ("user", "hashed_password"))
        user_id = cursor.lastrowid
    else:
        user_id = user["id"]
        
    # Insert initial board if not exists
    cursor.execute("SELECT id FROM boards WHERE user_id = ?", (user_id,))
    board = cursor.fetchone()
    if not board:
        initial_board = {
            "columns": [
                { "id": "col-backlog", "title": "Backlog", "cardIds": ["card-1", "card-2"] },
                { "id": "col-discovery", "title": "Discovery", "cardIds": ["card-3"] },
                { "id": "col-progress", "title": "In Progress", "cardIds": ["card-4", "card-5"] },
                { "id": "col-review", "title": "Review", "cardIds": ["card-6"] },
                { "id": "col-done", "title": "Done", "cardIds": ["card-7", "card-8"] }
            ],
            "cards": {
                "card-1": { "id": "card-1", "title": "Align roadmap themes", "details": "Draft quarterly themes with impact statements and metrics." },
                "card-2": { "id": "card-2", "title": "Gather customer signals", "details": "Review support tags, sales notes, and churn feedback." },
                "card-3": { "id": "card-3", "title": "Prototype analytics view", "details": "Sketch initial dashboard layout and key drill-downs." },
                "card-4": { "id": "card-4", "title": "Refine status language", "details": "Standardize column labels and tone across the board." },
                "card-5": { "id": "card-5", "title": "Design card layout", "details": "Add hierarchy and spacing for scanning dense lists." },
                "card-6": { "id": "card-6", "title": "QA micro-interactions", "details": "Verify hover, focus, and loading states." },
                "card-7": { "id": "card-7", "title": "Ship marketing page", "details": "Final copy approved and asset pack delivered." },
                "card-8": { "id": "card-8", "title": "Close onboarding sprint", "details": "Document release notes and share internally." }
            }
        }
        cursor.execute("INSERT INTO boards (user_id, data) VALUES (?, ?)", (user_id, json.dumps(initial_board)))
        
    conn.commit()
    conn.close()

def get_board(username: str) -> dict | None:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT b.data FROM boards b
    JOIN users u ON u.id = b.user_id
    WHERE u.username = ?
    ''', (username,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["data"])
    return None

def update_board(username: str, data: dict):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
    UPDATE boards
    SET data = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = (SELECT id FROM users WHERE username = ?)
    ''', (json.dumps(data), username))
    conn.commit()
    conn.close()
