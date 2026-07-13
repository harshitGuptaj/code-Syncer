import { useCopilot } from "@/context/CopilotContext"
import { useFileSystem } from "@/context/FileContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { SocketEvent } from "@/types/socket"
import toast from "react-hot-toast"
import { LuClipboardPaste, LuCopy, LuRepeat } from "react-icons/lu"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

function CopilotView() {
    const {socket} = useSocket()
    const { viewHeight } = useResponsive()
    const { generateCode, output, isRunning, setInput } = useCopilot()
    const { activeFile, updateFileContent, setActiveFile } = useFileSystem()

    const copyOutput = async () => {
        try {
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            await navigator.clipboard.writeText(content)
            toast.success("Output copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy output to clipboard")
            console.log(error)
        }
    }

    const pasteCodeInFile = () => {
        if (activeFile) {
            const fileContent = activeFile.content
                ? `${activeFile.content}\n`
                : ""
            const content = `${fileContent}${output.replace(/```[\w]*\n?/g, "").trim()}`
            updateFileContent(activeFile.id, content)
            // Update the content of the active file if it's the same file
            setActiveFile({ ...activeFile, content })
            toast.success("Code pasted successfully")
            // Emit the FILE_UPDATED event to the server
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent: content,
            })
        }
    }

    const replaceCodeInFile = () => {
        if (activeFile) {
            const isConfirmed = confirm(
                `Are you sure you want to replace the code in the file?`,
            )
            if (!isConfirmed) return
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            updateFileContent(activeFile.id, content)
            // Update the content of the active file if it's the same file
            setActiveFile({ ...activeFile, content })
            toast.success("Code replaced successfully")
            // Emit the FILE_UPDATED event to the server
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent: content,
            })
        }
    }

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="view-title">Copilot</h1>
            <textarea
                className="min-h-[120px] w-full rounded-md border-none bg-darkHover p-2 text-white outline-none"
                placeholder="What code do you want to generate?"
                onChange={(e) => setInput(e.target.value)}
            />
            <button
                className="mt-1 flex w-full justify-center rounded-md bg-primary p-2 font-bold text-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={generateCode}
                disabled={isRunning}
            >
                {isRunning ? "Generating..." : "Generate Code"}
            </button>
            {output && (
                <div className="relative flex h-[calc(100%-180px)] flex-col rounded-lg border border-gray-700 bg-[#282a36]">
                    <div className="absolute right-2 top-2 z-10 flex gap-2">
                        <button
                            title="Copy Output"
                            onClick={copyOutput}
                            className="rounded bg-gray-700 p-1.5 transition-colors hover:bg-gray-600"
                        >
                            <LuCopy size={16} className="text-white" />
                        </button>
                        <button
                            title="Replace code in file"
                            onClick={replaceCodeInFile}
                            className="rounded bg-gray-700 p-1.5 transition-colors hover:bg-gray-600"
                        >
                            <LuRepeat size={16} className="text-white" />
                        </button>
                        <button
                            title="Paste code in file"
                            onClick={pasteCodeInFile}
                            className="rounded bg-gray-700 p-1.5 transition-colors hover:bg-gray-600"
                        >
                            <LuClipboardPaste size={16} className="text-white" />
                        </button>
                    </div>
                    <div className="h-full overflow-y-auto p-0">
                        <ReactMarkdown
                            components={{
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                code({ inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "")
                                    const language = match ? match[1] : "javascript"

                                    return !inline ? (
                                        <SyntaxHighlighter
                                            style={dracula}
                                            language={language}
                                            PreTag="pre"
                                            className="!m-0 !h-full !rounded-lg !bg-transparent !p-2"
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                pre({ children }) {
                                    return <pre className="h-full">{children}</pre>
                                },
                            }}
                        >
                            {output}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
            {!output && (
                <div className="flex h-[calc(100%-180px)] items-center justify-center rounded-lg border border-gray-700 bg-[#282a36]">
                    <p className="text-gray-400">Generated code will appear here</p>
                </div>
            )}
        </div>
    )
}

export default CopilotView
