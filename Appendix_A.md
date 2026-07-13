# APPENDIX A: CONTRIBUTION OF THE PROJECT

## Short Version

The development of Code-Syncer was accomplished through the collaborative efforts of three project members, each contributing significantly to specific aspects of the application. The frontend development phase involved the design and implementation of the user interface components, including the code editor integration, file explorer, real-time collaboration indicators, and settings panels. The backend development encompassed the server architecture, WebSocket communication infrastructure using Socket.io, and code execution integration with the Judge0 API. Testing and integration were carried out jointly to ensure seamless real-time synchronization, resulting in a fully functional collaborative coding platform.

---

## Long Version

Code-Syncer is a real-time collaborative coding platform developed as a B.Tech final year project. The successful completion of this application was made possible through the dedicated efforts of all project members, each contributing their expertise across different phases of the software development lifecycle.

**Member 1 – Frontend Development and User Interface Design:**

The first team member was primarily responsible for the design and implementation of the client-side application. This included the development of the user interface using React and TypeScript, integration of the CodeMirror editor for syntax-highlighted code editing, and the implementation of responsive layouts using Tailwind CSS. Core UI components such as the sidebar navigation, file explorer, settings panel, and run output display were developed by this member. Additionally, significant contributions were made in the development of React Context providers for managing application state, including user activity, file structures, editor settings, and real-time socket communication. The member also implemented features such as cursor position synchronization, typing indicators, and collaborative presence tracking on the client side.

**Member 2 – Backend Development and Real-Time Communication:**

The second team member focused on the server-side implementation and real-time communication infrastructure. Responsibilities included setting up the Node.js and Express server, configuring Socket.io for WebSocket-based real-time data exchange, and implementing event handlers for collaborative actions. These actions included file creation, updates, renaming, and deletion, along with user management within collaborative rooms. The member handled join requests, user presence tracking, and disconnection handling. Furthermore, the member integrated the Judge0 API for code execution and ensured proper CORS configuration and server security. The server successfully handled real-time events including typing start/pause, cursor movement, and drawing synchronization.

**Member 3 – Testing, Integration, and Documentation:**

The third team member was responsible for comprehensive testing and documentation of the project. This involved creating and executing test scenarios to validate the functionality of real-time synchronization, file management operations, code execution, and user authentication. During testing, three concurrent users (Alice_Developer, Bob_Coder, and Charlie_Engineer) were simulated in a test room (test-room-12edd749) to validate multi-user collaboration. The member prepared the project report, API documentation, and user guides. Performance optimization and cross-browser compatibility were also ensured by this member.

**Joint Contributions:**

All members collaboratively participated in system architecture design, requirement analysis, and Docker containerization using docker-compose. Regular code reviews and integration testing sessions were conducted to maintain code quality and ensure seamless interoperability between the frontend and backend components. Testing validated that file structures with directories and nested files could be synchronized across all connected clients, code execution produced accurate results across multiple programming languages (JavaScript, Python, C++), and user status updates (online/offline) were properly broadcast to all room participants.