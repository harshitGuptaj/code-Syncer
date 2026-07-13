<div align="center">

# Code Sync

### Real-Time Collaborative Code Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://react.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-010101.svg)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4.svg)](https://tailwindcss.com/)

A powerful, real-time collaborative coding platform built for pair programming, code reviews, and team collaboration. Join any room with a unique Room ID and see changes instantly synced across all participants.

</div>

---

## Live Demo

> **Open the app:** [https://code-syncer.vercel.app](https://code-syncer.vercel.app)

### Steps to Try

1. Visit [code-syncer.vercel.app](https://code-syncer.vercel.app)
2. Enter your **username**
3. Click **"Generate Unique Room Id"**
4. Click **"Join"**
5. Create files, edit code, chat, draw — all in real-time
6. Share the **Room ID** with friends to collaborate together

> Open the same Room ID in **two browser tabs** to see real-time syncing in action.

---

## Features

| Feature | Description |
|---------|-------------|
| **Real-Time Code Syncing** | Instant synchronization of code changes across all participants using WebSockets |
| **Multi-Language Support** | Execute code in 25+ programming languages including JavaScript, Python, Java, C++, Go, Rust |
| **AI Code Copilot** | Get AI-powered code suggestions and generation powered by Groq API |
| **Collaborative Drawing** | Built-in whiteboard with tldraw for brainstorming and visual collaboration |
| **In-Room Chat** | Real-time messaging system for team communication |
| **File Management** | Create, rename, delete, and organize files and directories |
| **Syntax Highlighting** | Beautiful code editing with CodeMirror and 40+ theme support |
| **User Presence** | See who's online, cursor positions, and typing indicators |
| **Responsive Design** | Works seamlessly on desktop and tablet devices |
| **Dark Theme** | Beautiful dark UI designed for extended coding sessions |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react) | UI Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript) | Type Safety |
| ![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite) | Build Tool |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss) | Styling |
| ![CodeMirror](https://img.shields.io/badge/CodeMirror-6-46c410?logo=codemirror) | Code Editor |
| ![Socket.IO Client](https://img.shields.io/badge/Socket.IO-4.7-010101) | Real-Time Communication |
| ![tldraw](https://img.shields.io/badge/tldraw-2.1-FFD500) | Drawing Board |
| ![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter) | Routing |

### Backend

| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js) | Runtime |
| ![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express) | Web Framework |
| ![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-010101) | WebSocket Server |
| ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript) | Type Safety |
| ![Judge0](https://img.shields.io/badge/Judge0-1.13-00ADD8) | Code Execution |

---

## Project Structure

```
code-Syncer/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── api/               # API clients (Piston, Groq)
│   │   ├── assets/            # SVG illustrations and icons
│   │   ├── components/        # React components
│   │   │   ├── chats/         # Chat system
│   │   │   ├── common/        # Shared components
│   │   │   ├── connection/    # Connection status
│   │   │   ├── drawing/       # Whiteboard editor
│   │   │   ├── editor/        # Code editor with collaboration
│   │   │   ├── files/         # File structure management
│   │   │   ├── forms/         # Join/Create room forms
│   │   │   ├── sidebar/       # Sidebar navigation
│   │   │   ├── toast/         # Notifications
│   │   │   └── workspace/     # Main workspace layout
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── resources/         # Themes and fonts
│   │   ├── styles/            # Global CSS
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.mts
│
├── server/                    # Backend Node.js server
│   ├── src/
│   │   ├── server.ts          # Express + Socket.IO server
│   │   └── types/             # TypeScript types
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
├── render.yaml                # Render backend deployment config
├── docker-compose.yml         # Docker setup with Judge0
├── package.json               # Root package.json
└── README.md
```

---

## Run Locally

### Prerequisites

- **Node.js** >= 18.x
- **npm**

### Quick Setup

```bash
# Clone the repo
git clone https://github.com/harshitGuptaj/code-Syncer.git
cd code-Syncer

# Install and start the server
cd server
npm install
npm run dev

# In a new terminal — install and start the client
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Deploy Your Own

### Deploy Backend on Render (Free)

1. Create a free account at [render.com](https://render.com)
2. Click **"New Web Service"**
3. Connect your GitHub repo: `harshitGuptaj/code-Syncer`
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variable:
   - `JUDGE0_URL` = `https://ce.judge0.com`
6. Click **Create Web Service**
7. Copy the URL (e.g., `https://code-sync-server.onrender.com`)

### Deploy Frontend on Vercel

1. Create a free account at [vercel.com](https://vercel.com)
2. Click **"New Project"** and import `harshitGuptaj/code-Syncer`
3. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
4. Add environment variable:
   - `VITE_BACKEND_URL` = your Render backend URL (e.g., `https://code-sync-server.onrender.com`)
5. Click **Deploy**

---

## Environment Variables

### Client (`client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend server URL | `http://localhost:3000` |

### Server (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JUDGE0_URL` | Judge0 API URL for code execution | `https://ce.judge0.com` |

---

## Supported Languages

| Language | Version | Aliases |
|----------|---------|---------|
| JavaScript | 18.15.0 | js, node |
| TypeScript | 5.0.3 | ts |
| Python | 3.10.0 | py, python3 |
| Java | 15.0.2 | java |
| C | 10.2.0 | c |
| C++ | 10.2.0 | cpp, c++ |
| Go | 1.16.2 | go |
| Rust | 1.68.2 | rs, rust |
| Ruby | 3.0.1 | rb, ruby |
| PHP | 8.1.6 | php |
| Swift | 5.6.0 | swift |
| Kotlin | 1.8.0 | kt, kotlin |
| Bash | 5.2.0 | sh, bash |
| R | 4.1.1 | r |
| Perl | 5.34.0 | pl, perl |
| Haskell | 9.0.1 | hs, haskell |
| Lua | 5.4.4 | lua |
| Scala | 3.2.0 | scala |
| Elixir | 1.14.0 | ex, elixir |
| Erlang | 25.1 | erl, erlang |
| Clojure | 1.11.1 | clj, clojure |
| Dart | 2.19.6 | dart |
| C# | 6.12.0 | cs, c# |

---

## Architecture

```
┌──────────────┐     WebSocket      ┌──────────────┐
│              │◄──────────────────►│              │
│    Client    │     HTTP/REST      │    Server    │
│   (React)    │◄──────────────────►│  (Express)   │
│   (Vercel)   │                    │  (Render)    │
└──────┬───────┘                    └──────┬───────┘
       │                                    │
       ▼                                    ▼
┌──────────────┐                    ┌──────────────┐
│  CodeMirror  │                    │   Judge0     │
│    Editor    │                    │   Service    │
└──────────────┘                    └──────────────┘
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/runtimes` | List supported programming languages |
| POST | `/api/execute` | Execute code snippet |

---

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `JOIN_REQUEST` | Client → Server | Request to join a room |
| `JOIN_ACCEPTED` | Server → Client | Successfully joined room |
| `FILE_CREATED` | Client → Server → Client | New file created |
| `FILE_UPDATED` | Client → Server → Client | File content changed |
| `FILE_DELETED` | Client → Server → Client | File deleted |
| `DIRECTORY_CREATED` | Client → Server → Client | New directory created |
| `SEND_MESSAGE` | Client → Server → Client | Chat message sent |
| `TYPING_START` | Client → Server → Client | User started typing |
| `CURSOR_MOVE` | Client → Server → Client | Cursor position changed |
| `DRAWING_UPDATE` | Client → Server → Client | Drawing board updated |

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

### [Try Code Sync Live](https://code-syncer.vercel.app)

**Made with care by [Harshit Gupta](https://github.com/harshitGuptaj)**

</div>
