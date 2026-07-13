import express, { Response, Request } from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"
import { SocketEvent, SocketId } from "./types/socket"
import { USER_CONNECTION_STATUS, User } from "./types/user"
import { Server } from "socket.io"
import path from "path"
import axios from "axios"

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.static(path.join(__dirname, "public")))

const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358"

const languageToJudge0Id: Record<string, number> = {
    javascript: 63,
    typescript: 101,
    python: 71,
    java: 62,
    c: 50,
    cpp: 54,
    go: 60,
    rust: 73,
    ruby: 72,
    php: 68,
    swift: 78,
    kotlin: 70,
    bash: 46,
    r: 80,
    perl: 85,
    haskell: 64,
    lua: 66,
    scala: 81,
    elixir: 56,
    erlang: 57,
    clojure: 55,
    dart: 56,
    groovy: 61,
    csharp: 51,
}

app.get("/api/runtimes", async (req: Request, res: Response) => {
    const runtimes = [
        { language: "javascript", version: "18.15.0", aliases: ["js", "node"] },
        { language: "typescript", version: "5.0.3", aliases: ["ts"] },
        { language: "python", version: "3.10.0", aliases: ["py", "python3"] },
        { language: "java", version: "15.0.2", aliases: ["java"] },
        { language: "c", version: "10.2.0", aliases: ["c"] },
        { language: "cpp", version: "10.2.0", aliases: ["cpp", "c++"] },
        { language: "go", version: "1.16.2", aliases: ["go"] },
        { language: "rust", version: "1.68.2", aliases: ["rs", "rust"] },
        { language: "ruby", version: "3.0.1", aliases: ["rb", "ruby"] },
        { language: "php", version: "8.1.6", aliases: ["php"] },
        { language: "swift", version: "5.6.0", aliases: ["swift"] },
        { language: "kotlin", version: "1.8.0", aliases: ["kt", "kotlin"] },
        { language: "bash", version: "5.2.0", aliases: ["sh", "bash"] },
        { language: "r", version: "4.1.1", aliases: ["r"] },
        { language: "perl", version: "5.34.0", aliases: ["pl", "perl"] },
        { language: "haskell", version: "9.0.1", aliases: ["hs", "haskell"] },
        { language: "lua", version: "5.4.4", aliases: ["lua"] },
        { language: "scala", version: "3.2.0", aliases: ["scala"] },
        { language: "elixir", version: "1.14.0", aliases: ["ex", "elixir"] },
        { language: "erlang", version: "25.1", aliases: ["erl", "erlang"] },
        { language: "clojure", version: "1.11.1", aliases: ["clj", "clojure"] },
        { language: "dart", version: "2.19.6", aliases: ["dart"] },
        { language: "groovy", version: "4.0.3", aliases: ["groovy"] },
        { language: "csharp", version: "6.12.0", aliases: ["cs", "c#"] },
    ]
    res.json(runtimes)
})

app.post("/api/execute", async (req: Request, res: Response) => {
    try {
        const { language, code, stdin } = req.body
        console.log("Executing code:", { language, code: code.substring(0, 50) })
        
        const languageId = languageToJudge0Id[language]
        
        if (!languageId) {
            res.status(400).json({ error: `Unsupported language: ${language}` })
            return
        }

        const submitResponse = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`, {
            language_id: languageId,
            source_code: Buffer.from(code).toString('base64'),
            stdin: stdin ? Buffer.from(stdin).toString('base64') : null,
        })

        const token = submitResponse.data.token
        console.log("Submission token:", token)

        let result = null
        for (let i = 0; i < 60; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const statusResponse = await axios.get(`${JUDGE0_URL}/submissions/${token}?base64_encoded=true`)
            result = statusResponse.data
            console.log(`Attempt ${i+1}: Status ${result.status?.id} - ${result.status?.description}`)
            
            if (result.status?.id > 2) break
        }

        if (!result) {
            res.status(500).json({ error: "Execution timed out" })
            return
        }

        const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : ""
        const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : ""

        console.log("Execution complete:", { status: result.status?.id, stdout: stdout.substring(0, 100) })
        
        console.log("Execution complete:", { status: result.status?.id, stdout: stdout.substring(0, 100) })

        res.json({
            run: {
                stdout,
                stderr,
                code: result.status?.id === 3 ? 0 : result.status?.id || 1,
                signal: result.signal || null
            }
        })
    } catch (error: any) {
        console.error("Error executing code:", error.message)
        res.status(500).json({ 
            error: "Code execution service is currently unavailable",
            details: error.response?.data || error.message
        })
    }
})

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "*",
	},
	maxHttpBufferSize: 1e8,
	pingTimeout: 60000,
})

let userSocketMap: User[] = []

// Function to get all users in a room
function getUsersInRoom(roomId: string): User[] {
	return userSocketMap.filter((user) => user.roomId == roomId)
}

// Function to get room id by socket id
function getRoomId(socketId: SocketId): string | null {
	const roomId = userSocketMap.find(
		(user) => user.socketId === socketId
	)?.roomId

	if (!roomId) {
		console.error("Room ID is undefined for socket ID:", socketId)
		return null
	}
	return roomId
}

function getUserBySocketId(socketId: SocketId): User | null {
	const user = userSocketMap.find((user) => user.socketId === socketId)
	if (!user) {
		console.error("User not found for socket ID:", socketId)
		return null
	}
	return user
}

io.on("connection", (socket) => {
	// Handle user actions
	socket.on(SocketEvent.JOIN_REQUEST, ({ roomId, username }) => {
		// Check is username exist in the room
		const isUsernameExist = getUsersInRoom(roomId).filter(
			(u) => u.username === username
		)
		if (isUsernameExist.length > 0) {
			io.to(socket.id).emit(SocketEvent.USERNAME_EXISTS)
			return
		}

		const user = {
			username,
			roomId,
			status: USER_CONNECTION_STATUS.ONLINE,
			cursorPosition: 0,
			typing: false,
			socketId: socket.id,
			currentFile: null,
		}
		userSocketMap.push(user)
		socket.join(roomId)
		socket.broadcast.to(roomId).emit(SocketEvent.USER_JOINED, { user })
		const users = getUsersInRoom(roomId)
		io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, { user, users })
	})

	socket.on("disconnecting", () => {
		const user = getUserBySocketId(socket.id)
		if (!user) return
		const roomId = user.roomId
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.USER_DISCONNECTED, { user })
		userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id)
		socket.leave(roomId)
	})

	// Handle file actions
	socket.on(
		SocketEvent.SYNC_FILE_STRUCTURE,
		({ fileStructure, openFiles, activeFile, socketId }) => {
			io.to(socketId).emit(SocketEvent.SYNC_FILE_STRUCTURE, {
				fileStructure,
				openFiles,
				activeFile,
			})
		}
	)

	socket.on(
		SocketEvent.DIRECTORY_CREATED,
		({ parentDirId, newDirectory }) => {
			const roomId = getRoomId(socket.id)
			if (!roomId) return
			socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_CREATED, {
				parentDirId,
				newDirectory,
			})
		}
	)

	socket.on(SocketEvent.DIRECTORY_UPDATED, ({ dirId, children }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_UPDATED, {
			dirId,
			children,
		})
	})

	socket.on(SocketEvent.DIRECTORY_RENAMED, ({ dirId, newName }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_RENAMED, {
			dirId,
			newName,
		})
	})

	socket.on(SocketEvent.DIRECTORY_DELETED, ({ dirId }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.DIRECTORY_DELETED, { dirId })
	})

	socket.on(SocketEvent.FILE_CREATED, ({ parentDirId, newFile }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.FILE_CREATED, { parentDirId, newFile })
	})

	socket.on(SocketEvent.FILE_UPDATED, ({ fileId, newContent }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_UPDATED, {
			fileId,
			newContent,
		})
	})

	socket.on(SocketEvent.FILE_RENAMED, ({ fileId, newName }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_RENAMED, {
			fileId,
			newName,
		})
	})

	socket.on(SocketEvent.FILE_DELETED, ({ fileId }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_DELETED, { fileId })
	})

	// Handle user status
	socket.on(SocketEvent.USER_OFFLINE, ({ socketId }) => {
		userSocketMap = userSocketMap.map((user) => {
			if (user.socketId === socketId) {
				return { ...user, status: USER_CONNECTION_STATUS.OFFLINE }
			}
			return user
		})
		const roomId = getRoomId(socketId)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.USER_OFFLINE, { socketId })
	})

	socket.on(SocketEvent.USER_ONLINE, ({ socketId }) => {
		userSocketMap = userSocketMap.map((user) => {
			if (user.socketId === socketId) {
				return { ...user, status: USER_CONNECTION_STATUS.ONLINE }
			}
			return user
		})
		const roomId = getRoomId(socketId)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.USER_ONLINE, { socketId })
	})

	// Handle chat actions
	socket.on(SocketEvent.SEND_MESSAGE, ({ message }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.RECEIVE_MESSAGE, { message })
	})

	// Handle cursor position and selection
	socket.on(SocketEvent.TYPING_START, ({ cursorPosition, selectionStart, selectionEnd }) => {
		userSocketMap = userSocketMap.map((user) => {
			if (user.socketId === socket.id) {
				return {
					...user,
					typing: true,
					cursorPosition,
					selectionStart,
					selectionEnd
				}
			}
			return user
		})
		const user = getUserBySocketId(socket.id)
		if (!user) return
		const roomId = user.roomId
		socket.broadcast.to(roomId).emit(SocketEvent.TYPING_START, { user })
	})

	socket.on(SocketEvent.TYPING_PAUSE, () => {
		userSocketMap = userSocketMap.map((user) => {
			if (user.socketId === socket.id) {
				return { ...user, typing: false }
			}
			return user
		})
		const user = getUserBySocketId(socket.id)
		if (!user) return
		const roomId = user.roomId
		socket.broadcast.to(roomId).emit(SocketEvent.TYPING_PAUSE, { user })
	})

	// Handle cursor movement without typing
	socket.on(SocketEvent.CURSOR_MOVE, ({ cursorPosition, selectionStart, selectionEnd }) => {
		userSocketMap = userSocketMap.map((user) => {
			if (user.socketId === socket.id) {
				return {
					...user,
					cursorPosition,
					selectionStart,
					selectionEnd
				}
			}
			return user
		})
		const user = getUserBySocketId(socket.id)
		if (!user) return
		const roomId = user.roomId
		socket.broadcast.to(roomId).emit(SocketEvent.CURSOR_MOVE, { user })
	})

	socket.on(SocketEvent.REQUEST_DRAWING, () => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.REQUEST_DRAWING, { socketId: socket.id })
	})

	socket.on(SocketEvent.SYNC_DRAWING, ({ drawingData, socketId }) => {
		socket.broadcast
			.to(socketId)
			.emit(SocketEvent.SYNC_DRAWING, { drawingData })
	})

	socket.on(SocketEvent.DRAWING_UPDATE, ({ snapshot }) => {
		const roomId = getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DRAWING_UPDATE, {
			snapshot,
		})
	})
})

const PORT = process.env.PORT || 3000

app.get("/", (req: Request, res: Response) => {
	// Send the index.html file
	res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

server.listen(Number(PORT), () => {
	console.log(`Listening on port ${PORT}`)
})
