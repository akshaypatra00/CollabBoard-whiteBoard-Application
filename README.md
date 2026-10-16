# CollabBoard

CollabBoard is a collaborative whiteboard for sketching ideas, making
diagrams, and taking visual notes. It uses a native HTML Canvas drawing
engine and lets people work on the same board in real time.

You do not need an account. Create a board and share its link with
anyone who needs to join.

## Features

-   **Drawing tools:** selection, freehand pencil, rectangle, ellipse,
    line, arrow, text, and eraser.
-   **Edit shapes:** select, move, resize, duplicate, copy, paste, and
    delete elements.
-   **Style controls:** change stroke color, fill color, stroke width,
    line style, and text formatting.
-   **Canvas navigation:** zoom, pan, reset zoom, and fit the drawing to
    the screen.
-   **Undo and redo:** reverse completed drawing actions.
-   **Live collaboration:** work with other people on the same board and
    see their cursors.
-   **Automatic saving:** store board data in MongoDB when the database
    is available.
-   **PNG export:** export the current drawing as an image.
-   **Light and dark themes:** choose a theme that suits your workspace.
-   **Recent boards:** find boards you have opened recently in the same
    browser.

## Tech stack

**Frontend** - React, TypeScript, and Vite - HTML Canvas 2D API -
Tailwind CSS - React Router - Zustand - Socket.IO Client - Lucide React

**Backend** - Node.js, Express, and TypeScript - Socket.IO - MongoDB and
Mongoose - Zod for request and event validation - Helmet, CORS, and rate
limiting

**Shared code and testing** - Shared TypeScript types and Zod schemas -
Vitest and Supertest

## How it works

The canvas is used to draw the board, but the drawing is stored as
structured data rather than as a screenshot. Each shape has properties
such as its type, position, size, and style. This makes it possible to
select and edit elements, save the board, and send changes to other
collaborators.

The React client handles the interface and local drawing interactions.
The Express server provides the board API, while Socket.IO sends live
changes between clients in the same board room. MongoDB stores board
data so it can be loaded again later.

## Project structure

``` text
collabboard/
├── client/
│   ├── src/
│   │   ├── canvas/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── tests/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── utils/
│   └── tests/
└── shared/
    └── src/
        ├── events/
        ├── schemas/
        └── types/
```

The exact files may vary as the project develops. The `client` folder
contains the frontend, `server` contains the API and real-time services,
and `shared` contains types and validation contracts used by both.

## Requirements

Before running the project, install:

-   Node.js 18 or later (Node.js 20 or later is recommended)
-   npm
-   MongoDB, either running locally or hosted by MongoDB Atlas

MongoDB may be optional for some local development configurations if the
server supports its in-memory fallback. In-memory data is temporary and
should not be used for production persistence.

## Getting started

### 1. Clone the repository

``` bash
git clone https://github.com/akshaypatra00/CollabBoard-whiteBoard-Application.git
cd CollabBoard-whiteBoard-Application
```

### 2. Install dependencies

If the repository is configured as an npm workspace, install
dependencies from the root:

``` bash
npm install
```

### 3. Configure environment variables

Create `server/.env`:

``` env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/collab_whiteboard
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

``` env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Use the variable names expected by your code and the provided
`.env.example` files if they differ. Never commit real `.env` files,
database passwords, or API secrets. Keep example files with placeholder
values in the repository.

### 4. Start the application

If the root `package.json` provides workspace scripts, the usual
development command is:

``` bash
npm run dev
```

If the project provides separate scripts, start the backend and frontend
in two terminals from the repository root:

``` bash
npm run dev:server
```

``` bash
npm run dev:client
```

Check the root `package.json` for the actual script names. The expected
local addresses are:

-   Frontend: `http://localhost:5173`
-   Backend: `http://localhost:5000`

Open the frontend in your browser and create a board. If the app cannot
connect to MongoDB, check the backend logs and the `MONGODB_URI` value.

## API overview

The documented REST endpoints are:

  ----------------------------------------------------------------------------
  Method                  Endpoint                     Purpose
  ----------------------- ---------------------------- -----------------------
  `GET`                   `/api/health`                Check server health and
                                                       database connectivity

  `POST`                  `/api/boards`                Create a board

  `GET`                   `/api/boards/:id`            Load a board

  `PATCH`                 `/api/boards/:id`            Update board details
                                                       such as its title

  `PUT`                   `/api/boards/:id/elements`   Save board elements

  `GET`                   `/api/boards/:id/export`     Retrieve board data as
                                                       JSON
  ----------------------------------------------------------------------------

Confirm the routes in `server/src/routes` before relying on this table,
as endpoint names can change during development.

## Real-time collaboration

Socket.IO connects users who open the same board. The documented event
names include:

**Client to server** - `join-board` - `element-create` -
`element-update` - `element-delete` - `board-clear` -
`board-metadata-update` - `cursor-move`

**Server to client** - `board-state` - `element-create` -
`element-update` - `element-delete` - `board-clear` -
`board-metadata-update` - `cursor-move` - `client-left` - `sync-error`

The server should validate incoming events and restrict updates to the
board room the client has joined. Check the socket handlers and shared
event types for the exact payload shape used by the current
implementation.

## Keyboard shortcuts

The documented shortcuts are:

  Shortcut                           Action
  ---------------------------------- ----------------------------------------------
  `V` or `1`                         Selection tool
  `P` or `2`                         Pencil tool
  `R` or `3`                         Rectangle tool
  `O` or `4`                         Ellipse tool
  `L` or `5`                         Line tool
  `A` or `6`                         Arrow tool
  `T` or `7`                         Text tool
  `X` or `8`                         Eraser tool
  `Ctrl + Z`                         Undo
  `Ctrl + Y` or `Ctrl + Shift + Z`   Redo
  `Delete` or `Backspace`            Delete selected elements
  `Ctrl + C`                         Copy selected elements
  `Ctrl + V`                         Paste copied elements
  `Ctrl + D`                         Duplicate selected elements
  `Space + drag`                     Pan the canvas
  `Ctrl + mouse wheel`               Zoom in or out
  `Ctrl + 0`                         Reset zoom
  `Esc`                              Cancel the current action or clear selection

Shortcuts can vary by operating system and browser. Refer to the current
keyboard shortcut handler for the definitive list.

## Testing and builds

Run the commands supported by the root `package.json`:

``` bash
npm test
npm run typecheck
npm run build
```

If tests are split by workspace, the project may also provide:

``` bash
npm run test:client
npm run test:server
```

These commands are examples based on the documented project setup. Check
the package scripts before running them, and report test results only
after the tests have actually run.

## Deployment notes

A typical deployment uses:

-   A static hosting service for the Vite frontend
-   A Node.js hosting service that supports persistent Socket.IO
    connections for the backend
-   MongoDB Atlas or another reachable MongoDB deployment

Set the frontend API and Socket.IO URLs to the deployed backend address.
Configure the backend CORS settings to allow the deployed frontend
origin. Configure the frontend host to serve `index.html` for board
routes such as `/board/:id`.

Set production environment variables in your hosting provider's
dashboard. Do not put MongoDB credentials in frontend variables, because
Vite exposes `VITE_` variables to the browser.

The exact build and start commands depend on the scripts in the root,
client, and server `package.json` files. Verify those commands before
deploying.

## Anonymous sharing and security

CollabBoard does not use accounts or passwords. Anyone who has a board
link may be able to view and edit that board. Treat the link as a way to
share access, not as authentication or a guarantee of privacy.

Do not put passwords, confidential information, or private data on a
shared board. For a public deployment, configure CORS, validate API and
Socket.IO input, use rate limits, restrict payload sizes, and keep
database credentials secret.

## Current limitations

-   Freehand strokes are editable as elements, but individual curve
    control points may not be editable.
-   Collaboration depends on the backend and an active network
    connection.
-   Anyone with a board link may have access; role-based permissions and
    view-only links are not part of the anonymous access model unless
    implemented separately.
-   The availability of in-memory fallback storage depends on the
    current server configuration. In-memory data can be lost when the
    server restarts.

## Possible next steps

-   Add view-only sharing links
-   Add SVG export and import/export of board files
-   Improve shape connectors and snapping
-   Add optional board passwords
-   Improve conflict handling for simultaneous edits
-   Add more accessibility and mobile interaction tests

## Contributing

Contributions and suggestions are welcome. Before opening a pull
request, explain the change, run the relevant tests, and make sure no
credentials or local environment files are included.

## License

No license has been specified yet. Add a `LICENSE` file before
presenting the project as open source, and choose a license that matches
how you want others to use the code.
