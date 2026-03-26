# Frontend Architecture & Existing Code

## Overview
The `frontend/` directory contains the MVP React frontend built with Next.js (App Router). It represents a fully functional, in-memory Kanban board demo.

## Directory Structure
- `src/app/`: Contains the Next.js App Router entry points (`page.tsx`, `layout.tsx`, `globals.css`). The main page renders the `KanbanBoard` component.
- `src/components/`: Contains the core React components.
  - `KanbanBoard.tsx`: The primary container managing the board state, columns, and drag-and-drop context.
  - `KanbanColumn.tsx`: Renders a single column and acts as a droppable area for cards.
  - `KanbanCard.tsx`: Renders an individual draggable card.
  - `KanbanCardPreview.tsx`: The visual representation of a card while it is actively being dragged.
  - `NewCardForm.tsx`: Component used within columns to add new task cards.
- `src/lib/`: Contains core business logic and types.
  - `kanban.ts`: Defines TypeScript interfaces (`Card`, `Column`, `BoardData`), provides the mock `initialData`, and implements the pure function `moveCard` for processing drag-and-drop card movements across and within columns.
- `src/test/` & `tests/`: Contains test suites (e.g., `KanbanBoard.test.tsx`, `kanban.test.ts`) validating logic and component rendering.

## Key Logic
- **State Management**: The Kanban board's state is currently managed locally inside `KanbanBoard.tsx`, initialized from `initialData` in `src/lib/kanban.ts`.
- **Drag and Drop**: Card movement logic is decoupled into a pure function `moveCard`, which computes array updates based on active and destination drop targets.
- **Styling**: Follows the color scheme and aesthetic guidelines outlined in the root project requirements.

## Next Steps for Full-Stack Integration
To integrate with the FastAPI backend:
1. `KanbanBoard.tsx` will need to fetch its initial state from the `/api/board` backend route.
2. State mutations (moving cards, editing text, adding cards) will need to send asynchronous updates to the backend to persist changes into the SQLite database.
