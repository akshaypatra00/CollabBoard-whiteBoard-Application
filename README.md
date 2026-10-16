# CollabBoard

A real-time collaborative whiteboard application inspired by Excalidraw, built from the ground up using React, a native HTML5 Canvas 2D engine, Node.js, Express, Socket.IO, and MongoDB.

CollabBoard allows users to sketch, build diagrams, take visual notes, and collaborate with others in real time without creating an account or logging in. Any whiteboard can be shared instantly using a unique URL.

---

## Key Features

- **Native HTML5 Canvas 2D Drawing Engine**: No external canvas wrappers or heavy drawing frameworks. Elements are stored as typed state and rendered to the canvas at high device pixel ratios.
- **Vector Tools**: Selection, freehand pencil (with midpoint smoothing), rectangle, ellipse, line, arrow, text, and element eraser.
- **Shape & Style Properties**: Real-time adjustment of stroke colors, background/fill colors, stroke widths (2px to 16px), stroke styles (solid, dashed, dotted), font sizes, and text alignments.
- **Manipulation & Transforms**: Single and multi-element selection, bounding box dragging, 8-handle resizing, element duplication, deletion, and copy/paste.
- **Infinite Navigation & Zoom**: Smooth mouse wheel zooming centered on the cursor, middle-click panning, spacebar pan shortcut, zoom reset, and fit-to-content.
- **Predictable History (Undo / Redo)**: Snapshot-based undo and redo history stack (up to 50 operations) that triggers on completed actions, not raw pointer movements.
- **Real-Time Collaboration**: Multi-user rooms powered by Socket.IO with live remote cursor positions, user name tags, and broadcasted element operations.
- **Anonymous Bearer Sharing**: Instant board creation without authentication; shareable URLs grant access to collaborators immediately.
- **Resilient Persistence**: MongoDB storage via Mongoose with debounced saves, optimistic local UI feedback, and an automatic in-memory fallback for local environments without an active MongoDB daemon.
- **Board Export**: Clean export of active drawing elements to PNG using an offscreen canvas.
- **Theme Support**: Seamless light and dark mode with localStorage persistence.
- **Local History**: Landing page tracks recently opened boards in browser storage for quick re-entry.

---

## Technology Stack

### Frontend (`client/`)
- **React 18** with **TypeScript**
- **Vite** for bundling and fast HMR
- **HTML5 Canvas 2D API** (native rendering engine)
- **Tailwind CSS** for layout, styling, and dark mode
- **React Router 6** for routing
- **Zustand** for modular client state management
- **Socket.IO Client** for real-time WebSockets
- **Lucide React** for icons
- **Vitest** for client unit and utility testing

### Backend (`server/`)
- **Node.js** & **Express** with **TypeScript**
- **Socket.IO** for WebSocket rooms and synchronization
- **MongoDB** & **Mongoose** for persistence
- **Zod** for runtime schema validation on HTTP requests and socket events
- **express-rate-limit** for rate limiting sensitive endpoints
- **Helmet** & **CORS** for HTTP security headers
- **Vitest** & **Supertest** for automated API, validation, and concurrency tests

### Shared Contract (`shared/`)
- Shared TypeScript types (elements, tools, boards, socket events)
- Shared Zod validation schemas for elements, board routes, and socket payloads

---

## Application Architecture

```
collab-whiteboard/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── canvas/             # Native Canvas 2D engine (renderer, hit-testing, transforms, handles, export)
│   │   ├── components/         # Header, Toolbar, PropertiesPanel, ZoomControls, Modals, RecentBoards
│   │   ├── hooks/              # useCanvasPointer, useKeyboardShortcuts, useSocket, useAutoSave, useTheme
│   │   ├── pages/              # LandingPage, WhiteboardPage, NotFoundPage
│   │   ├── services/           # REST API client and localStorage persistence
│   │   ├── store/              # Zustand stores (useBoardStore, useToolStore, useHistoryStore, useCollaborationStore)
│   │   └── utils/              # Geometry math, bounding boxes, color palettes, ID generator
│   └── tests/                  # Client Vitest suites (geometry, hitTest, transform, history)
├── server/                     # Express + Socket.IO Backend
│   ├── src/
│   │   ├── config/             # Environment parsing (Zod) and MongoDB connection manager
│   │   ├── controllers/        # Board HTTP route handlers
│   │   ├── middleware/         # Zod validation, rate limiters, centralized error handling
│   │   ├── models/             # Mongoose BoardModel schema
│   │   ├── routes/             # REST API routes (/api/health, /api/boards)
│   │   ├── services/           # BoardService with LWW conflict resolution and storage logic
│   │   ├── sockets/            # SocketManager and socket event handlers
│   │   └── utils/              # Structured logger, ID generator
│   └── tests/                  # Backend Vitest suites (REST API, validation, concurrency)
└── shared/                     # Shared TypeScript library
    └── src/
        ├── types/              # WhiteboardElement, Board, Tool, Socket types
        ├── schemas/            # Zod validation schemas
        └── events/             # Socket event constants
```

---

## Drawing Data Model

The application does not store canvas bitmaps or rasterized images. The board is represented as a structured array of vector elements:

```typescript
type ElementType = 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'pencil' | 'text';

interface BaseElement {
  id: string;               // 10-character unique identifier
  type: ElementType;
  x: number;                // World coordinate X
  y: number;                // World coordinate Y
  width: number;
  height: number;
  strokeColor: string;      // Hex, rgb, or transparent
  fillColor: string;
  strokeWidth: number;      // 1 to 32
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  opacity: number;          // 0 to 100
  rotation: number;         // Rotation in radians
  version: number;          // Monotonic revision counter for LWW conflict resolution
  updatedAt: number;        // Epoch timestamp in milliseconds
  isDeleted?: boolean;
}
```

Shape-specific fields:
- **`pencil`**: `points: Point[]` (clamped to a maximum of 3,000 points to prevent payload abuse).
- **`line` / `arrow`**: `points: [Point, Point]` representing start and end points in world coordinates.
- **`text`**: `text: string`, `fontSize: number`, `fontFamily: string`, `textAlign: 'left' | 'center' | 'right'`.

---

## Conflict Resolution & Real-Time Sync

When multiple collaborators work on the same board concurrently:
1. **Isolated Rooms**: Clients join a Socket.IO room scoped to `boardId`. Events sent outside the joined room are rejected by the server.
2. **Optimistic Local Updates**: The active user sees their changes applied immediately on the native canvas.
3. **Last-Write-Wins (LWW)**: Every element edit increments its `version` counter and updates `updatedAt`. Incoming remote updates supersede existing state only if `incoming.version > existing.version` or `incoming.updatedAt >= existing.updatedAt`. Stale packets are discarded safely.
4. **Debounced MongoDB Persistence**: Real-time socket events do not write to MongoDB synchronously on every cursor or draw event. Updates are queued and flushed after a debounce period (1.5 seconds of inactivity) or when a room empties, preserving database throughput.
5. **Transient Cursors**: Live collaborator cursors and names are broadcast transiently over WebSocket and are never saved to the database.

---

## Anonymous Access Model & Security Considerations

CollabBoard intentionally operates **without user registration, logins, or passwords**.

### How Sharing Works
- Creating a board generates a 12-character cryptographically random, unguessable board ID (e.g., `k8xL29vN4p1Q`).
- Anyone with the board link (`https://<domain>/board/<id>`) can view and edit the board.

### Security Boundaries & Safeguards
- **Bearer Link Model**: An unguessable URL acts as a bearer token. It does not provide cryptographic access control or authentication.
- **Input Validation**: All REST bodies, URL parameters, and Socket.IO payloads are strictly validated using Zod on the server.
- **Point & Size Limits**: Pencil strokes are limited to 3,000 points, text inputs to 10,000 characters, and request JSON bodies to 10MB to prevent denial-of-service attempts.
- **Rate Limiting**: Board creation is rate-limited to 60 requests per hour per IP; general API calls are limited to 500 requests per 15 minutes.
- **Safe Text Rendering**: User-entered text is drawn directly using Canvas 2D `fillText` or escaped React nodes. Raw HTML is never executed.
- **Production Information Leakage**: Stack traces and internal database errors are suppressed in production mode.

> **Important**: Do not store sensitive, confidential, or private credentials on public whiteboard links.

---

## Environment Variables

### Backend (`server/.env`)
Create a `.env` file in the `server` directory (reference in `server/.env.example`):

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/collab_whiteboard
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

- If `MONGODB_URI` cannot connect during local development or test runs, the server automatically operates in in-memory mode without crashing.

### Frontend (`client/.env`)
Create a `.env` file in the `client` directory (reference in `client/.env.example`):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB** (optional for development; required for persistent production deployment)

---

## Installation & Local Development Setup

1. **Clone or navigate to the repository**:
   ```bash
   cd "Whiteboard application"
   ```

2. **Install all workspace dependencies**:
   ```bash
   npm install
   ```

3. **Build the shared package**:
   ```bash
   npm run build:shared
   ```

4. **Start both Backend and Frontend in development mode**:
   ```bash
   npm run dev
   ```
   - Frontend runs at: `http://localhost:5173`
   - Backend API runs at: `http://localhost:5000`

Alternatively, run each service independently:
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

---

## REST API Documentation

All endpoints return JSON with a consistent format:
`{ "success": boolean, "data"?: any, "error"?: string }`

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and database connectivity | None |
| `POST` | `/api/boards` | Create a new board with random ID | `{ "title"?: string }` |
| `GET` | `/api/boards/:id` | Fetch whiteboard document and elements | None |
| `PATCH` | `/api/boards/:id` | Update board title metadata | `{ "title": string }` |
| `PUT` | `/api/boards/:id/elements` | Batch save/sync all drawing elements | `{ "elements": WhiteboardElement[] }` |
| `GET` | `/api/boards/:id/export` | Download board data as JSON file | None |

---

## Socket.IO Real-Time Events

### Client to Server
- `join-board`: `{ boardId: string, clientId: string, userName: string, userColor: string }`
- `element-create`: `{ boardId: string, element: WhiteboardElement }`
- `element-update`: `{ boardId: string, elements: WhiteboardElement[] }`
- `element-delete`: `{ boardId: string, elementIds: string[] }`
- `board-clear`: `{ boardId: string }`
- `board-metadata-update`: `{ boardId: string, title: string }`
- `cursor-move`: `{ boardId: string, clientId: string, userName: string, userColor: string, x: number, y: number }`

### Server to Client
- `board-state`: `{ boardId: string, title: string, elements: WhiteboardElement[], schemaVersion: number, updatedAt: string }`
- `element-create`: Broadcasted to room members when an element is added
- `element-update`: Broadcasted when one or more elements are moved/resized/restyled
- `element-delete`: Broadcasted when elements are deleted
- `board-clear`: Broadcasted when the board is reset
- `board-metadata-update`: Broadcasted when title is edited
- `cursor-move`: Broadcasted to room members with active collaborator cursor coordinates
- `client-left`: `{ clientId: string }` emitted when a collaborator disconnects
- `sync-error`: Emitted to a socket if an action failed validation or authorization

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `V` or `1` | Select Tool |
| `P` or `2` | Pencil (Freehand) Tool |
| `R` or `3` | Rectangle Tool |
| `O` or `4` | Ellipse Tool |
| `A` or `6` | Arrow Tool |
| `L` or `5` | Line Tool |
| `T` or `7` | Text Tool |
| `X` or `8` | Eraser Tool |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` or `Ctrl + Shift + Z` | Redo |
| `Delete` or `Backspace` | Delete selected elements |
| `Ctrl + C` | Copy selected elements |
| `Ctrl + V` | Paste copied elements |
| `Ctrl + D` | Duplicate selected elements |
| `Space + Click & Drag` | Pan canvas |
| `Ctrl + Mouse Wheel` | Zoom in / Zoom out |
| `Ctrl + 0` | Reset Zoom to 100% |
| `Esc` | Clear selection or cancel active tool |

---

## Automated Testing

Automated test suites cover geometry calculations, hit-testing, coordinate transformations, history undo/redo stacks, REST API endpoints, Zod schema validations, and concurrent conflict resolution:

```bash
# Run all automated tests (client + server)
npm test

# Run only server tests
npm run test:server

# Run only client tests
npm run test:client
```

All 32 tests execute cleanly without external dependencies.

---

## Type Checking & Production Build

Verify TypeScript across all workspaces:
```bash
npm run typecheck
```

Create production bundles for all packages:
```bash
npm run build
```
- Client artifacts are compiled to `client/dist/`
- Server artifacts are compiled to `server/dist/`
- Shared types and schemas are compiled to `shared/dist/`

---

## Production Deployment Guidance

### Frontend (Static Hosting: Vercel, Netlify, Cloudflare Pages, S3)
1. Set environment variable: `VITE_API_URL=https://api.yourdomain.com/api`
2. Set environment variable: `VITE_SOCKET_URL=https://api.yourdomain.com`
3. Build command: `npm run build:client`
4. Output directory: `client/dist`
5. Configure SPA fallback routing to serve `index.html` for all paths (`/board/*`).

### Backend (Node.js Service: Render, Railway, Fly.io, AWS ECS, DigitalOcean)
1. Ensure the host supports persistent WebSocket connections (Socket.IO).
2. Set environment variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/collab_whiteboard`
   - `CORS_ORIGIN=https://yourwhiteboard.com`
   - `CLIENT_URL=https://yourwhiteboard.com`
3. Build command: `npm run build:shared && npm run build:server`
4. Start command: `node server/dist/index.js`

### MongoDB Atlas Setup
1. Create a free or dedicated cluster on MongoDB Atlas.
2. Under Network Access, whitelist your backend service's IP addresses or use `0.0.0.0/0` with secure credentials.
3. Supply the connection string in the backend `MONGODB_URI`.

---

## Known Limitations

- **Complex Curve Editing**: Freehand pencil strokes use midpoint quadratic smoothing upon creation; individual bezier control points cannot be repositioned after drawing.
- **Offline Mesh Collaboration**: Synchronization relies on the central Socket.IO backend; peer-to-peer WebRTC fallback without server connectivity is not currently implemented.
- **Public URL Secrecy**: Any person who obtains a board link can edit it; fine-grained view-only tokens are not yet supported.

---

## Future Improvements

- Read-only share link generation (`/board/:id?mode=readonly`)
- SVG vector export alongside existing high-resolution PNG export
- Freehand arrow curving and connector snapping between shapes
- Export to and import from local `.board` files
- Optional password protection for individual boards without user accounts
