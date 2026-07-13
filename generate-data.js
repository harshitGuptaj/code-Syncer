const { io } = require("socket.io-client");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const SERVER_URL = "http://localhost:3000";
const ROOM_ID = "test-room-" + uuidv4().substring(0, 8);

const testUsers = [
  { username: "Alice_Developer", language: "javascript" },
  { username: "Bob_Coder", language: "python" },
  { username: "Charlie_Engineer", language: "javascript" },
];

const fileStructures = [
  {
    id: uuidv4(),
    name: "src",
    type: "directory",
    children: [
      {
        id: uuidv4(),
        name: "index.js",
        type: "file",
        content: `// Main application entry point
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});
`,
      },
      {
        id: uuidv4(),
        name: "app.js",
        type: "file",
        content: `// Application configuration
const config = {
    environment: process.env.NODE_ENV || 'development',
    debug: true,
    maxConnections: 100,
    timeout: 30000
};

module.exports = config;
`,
      },
      {
        id: uuidv4(),
        name: "utils.js",
        type: "file",
        content: `// Utility functions
function formatDate(date) {
    return new Date(date).toISOString();
}

function validateEmail(email) {
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return regex.test(email);
}

module.exports = { formatDate, validateEmail };
`,
      },
    ],
  },
  {
    id: uuidv4(),
    name: "tests",
    type: "directory",
    children: [
      {
        id: uuidv4(),
        name: "app.test.js",
        type: "file",
        content: `// Unit tests for the application
describe('App Tests', () => {
    test('should pass basic test', () => {
        expect(1 + 1).toBe(2);
    });

    test('should validate email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
    });
});
`,
      },
    ],
  },
  {
    id: uuidv4(),
    name: "README.md",
    type: "file",
    content: `# Code-Syncer Test Project

A collaborative coding demonstration project.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`
`,
  },
  {
    id: uuidv4(),
    name: "package.json",
    type: "file",
    content: `{
    "name": "code-syncer-test",
    "version": "1.0.0",
    "description": "Test project for Code-Syncer",
    "main": "src/index.js",
    "scripts": {
        "start": "node src/index.js",
        "test": "jest"
    }
}
`,
  },
];

const codeSnippets = {
  javascript: `// Fibonacci Sequence Implementation
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci Sequence:");
for (let i = 0; i < 10; i++) {
    console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`,
  python: `# Bubble Sort Implementation
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
print("Sorted array:", bubble_sort(numbers))`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}`,
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function joinUser(user, index) {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log(`[${user.username}] Connected to server`);

      socket.emit("join-request", {
        roomId: ROOM_ID,
        username: user.username,
      });
    });

    socket.on("join-accepted", (data) => {
      console.log(`[${user.username}] Joined room: ${ROOM_ID}`);
      console.log(`[${user.username}] Users in room: ${data.users.length}`);
      resolve({ socket, user, data });
    });

    socket.on("user-joined", (data) => {
      console.log(`[${user.username}] New user joined: ${data.user.username}`);
    });

    socket.on("user-disconnected", (data) => {
      console.log(`[${user.username}] User left: ${data.user.username}`);
    });

    setTimeout(() => {
      if (!socket.connected) {
        console.log(`[${user.username}] Connection timeout`);
        resolve(null);
      }
    }, 5000);
  });
}

async function createFiles(socket, files, parentId = null) {
  for (const file of files) {
    if (file.type === "directory") {
      socket.emit("directory-created", {
        parentDirId: parentId,
        newDirectory: { id: file.id, name: file.name, type: "directory" },
      });
      console.log(`Created directory: ${file.name}`);
      await sleep(100);

      if (file.children) {
        await createFiles(socket, file.children, file.id);
      }
    } else {
      socket.emit("file-created", {
        parentDirId: parentId,
        newFile: { id: file.id, name: file.name, type: "file" },
      });
      console.log(`Created file: ${file.name}`);
      await sleep(100);

      if (file.content) {
        socket.emit("file-updated", {
          fileId: file.id,
          newContent: file.content,
        });
        console.log(`Updated content in: ${file.name}`);
      }
    }
    await sleep(200);
  }
}

async function executeCode(language, code) {
  try {
    console.log(`Executing ${language} code...`);
    const response = await axios.post(`${SERVER_URL}/api/execute`, {
      language,
      code,
      stdin: "",
    });
    console.log(`Execution result:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`Execution error:`, error.message);
    return null;
  }
}

async function generateData() {
  console.log("=" .repeat(50));
  console.log("CODE-SYNCER - DATA GENERATION SCRIPT");
  console.log("=" .repeat(50));
  console.log(`Generating data for room: ${ROOM_ID}`);
  console.log("");

  // Step 1: Join users sequentially first
  console.log("\n--- Step 1: Joining Users ---");
  const userConnections = [];

  for (let i = 0; i < testUsers.length; i++) {
    const result = await joinUser(testUsers[i], i);
    if (result) {
      userConnections.push(result);
      await sleep(500);
    }
  }

  if (userConnections.length === 0) {
    console.log("No users connected. Make sure the server is running.");
    return;
  }

  // Step 2: Create file structure (first user creates)
  console.log("\n--- Step 2: Creating Files & Directories ---");
  const firstUser = userConnections[0];
  await createFiles(firstUser.socket, fileStructures, null);
  await sleep(500);

  // Step 3: Simulate real-time editing (second user edits)
  console.log("\n--- Step 3: Real-time Editing Simulation ---");
  if (userConnections[1]) {
    const srcDir = fileStructures[0];
    const indexFile = srcDir.children.find((f) => f.name === "index.js");
    if (indexFile) {
      userConnections[1].socket.emit("file-updated", {
        fileId: indexFile.id,
        newContent:
          indexFile.content +
          "\n\n// Added by Bob_Coder\nconsole.log('Collaborative edit!');",
      });
      console.log("[Bob_Coder] Updated index.js with collaborative edit");
    }
  }
  await sleep(500);

  // Step 4: Send chat messages
  console.log("\n--- Step 4: Chat Messages ---");
  const messages = [
    { from: "Alice_Developer", text: "Hey team! Ready to start coding?" },
    { from: "Bob_Coder", text: "Let's implement the feature!" },
    { from: "Charlie_Engineer", text: "I'll work on the backend." },
  ];

  for (const msg of messages) {
    userConnections[0].socket.emit("send-message", {
      message: { sender: msg.from, text: msg.text, timestamp: new Date().toISOString() },
    });
    console.log(`[Chat] ${msg.from}: ${msg.text}`);
    await sleep(300);
  }

  // Step 5: Code execution
  console.log("\n--- Step 5: Code Execution ---");
  for (const [lang, code] of Object.entries(codeSnippets)) {
    await executeCode(lang, code);
    await sleep(1000);
  }

  // Step 6: Simulate typing and cursor movement
  console.log("\n--- Step 6: Cursor & Typing Simulation ---");
  for (const conn of userConnections) {
    conn.socket.emit("typing-start", {
      cursorPosition: Math.floor(Math.random() * 100),
      selectionStart: null,
      selectionEnd: null,
    });
    console.log(`[${conn.user.username}] Started typing`);
    await sleep(200);
  }

  // Step 7: Simulate user offline/online
  console.log("\n--- Step 7: User Status Simulation ---");
  if (userConnections[1]) {
    userConnections[1].socket.emit("user-offline", {
      socketId: userConnections[1].socket.id,
    });
    console.log("[Bob_Coder] Going offline...");
    await sleep(1000);

    userConnections[1].socket.emit("user-online", {
      socketId: userConnections[1].socket.id,
    });
    console.log("[Bob_Coder] Back online!");
  }

  // Final summary
  console.log("\n" + "=".repeat(50));
  console.log("DATA GENERATION COMPLETE");
  console.log("=".repeat(50));
  console.log("\nSummary:");
  console.log(`- Room ID: ${ROOM_ID}`);
  console.log(`- Users joined: ${userConnections.length}`);
  console.log(`- Files created: ${fileStructures.length}`);
  console.log(`- Directories: 2 (src, tests)`);
  console.log(`- Files: 6 (index.js, app.js, utils.js, app.test.js, README.md, package.json)`);
  console.log(`- Chat messages: ${messages.length}`);
  console.log(`- Code executions: ${Object.keys(codeSnippets).length}`);
  console.log("");

  // Cleanup
  console.log("Cleaning up connections...");
  for (const conn of userConnections) {
    conn.socket.disconnect();
  }
  console.log("Done!");
}

// Run the data generation
generateData().catch(console.error);