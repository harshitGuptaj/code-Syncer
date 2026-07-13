import axiosInstance from "@/api/pistonApi"
import { Language, RunContext as RunContextType } from "@/types/run"
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import toast from "react-hot-toast"
import { useFileSystem } from "./FileContext"

const RunCodeContext = createContext<RunContextType | null>(null)

export const useRunCode = () => {
    const context = useContext(RunCodeContext)
    if (context === null) {
        throw new Error(
            "useRunCode must be used within a RunCodeContextProvider",
        )
    }
    return context
}

const RunCodeContextProvider = ({ children }: { children: ReactNode }) => {
    const { activeFile } = useFileSystem()
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("")
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [supportedLanguages, setSupportedLanguages] = useState<Language[]>([])
    const [selectedLanguage, setSelectedLanguage] = useState<Language>({
        language: "",
        version: "",
        aliases: [],
    })

    useEffect(() => {
        const fetchSupportedLanguages = async () => {
            try {
                const response = await axiosInstance.get("/runtimes")
                const data = response.data
                const languages = Array.isArray(data) ? data : (data.runtimes || [])
                setSupportedLanguages(languages)
            } catch (error: any) {
                toast.error("Failed to fetch supported languages")
                if (error?.response?.data) console.error(error?.response?.data)
            }
        }

        fetchSupportedLanguages()
    }, [])

    useEffect(() => {
        if (!supportedLanguages?.length || !activeFile?.name) return

        const extension = activeFile.name.split(".").pop()?.toLowerCase()
        if (extension) {
            const extToLang: Record<string, string> = {
                js: "javascript", ts: "typescript", py: "python", java: "java",
                c: "c", cpp: "cpp", go: "go", rs: "rust", rb: "ruby", php: "php",
                swift: "swift", kt: "kotlin", html: "html", css: "css", json: "json",
                md: "markdown", sql: "sql", xml: "xml", yaml: "yaml", sh: "bash",
                r: "r", pl: "perl", hs: "haskell", lua: "lua", scala: "scala",
                ex: "elixir", erl: "erlang", clj: "clojure", dart: "dart",
                groovy: "groovy", cs: "csharp", m: "objectivec"
            }
            const langName = extToLang[extension]
            if (langName) {
                const language = supportedLanguages.find(
                    (l: Language) => l.language.toLowerCase() === langName
                )
                if (language) setSelectedLanguage(language)
            }
        } else setSelectedLanguage({ language: "", version: "", aliases: [] })
    }, [activeFile?.name, supportedLanguages])

    const runCode = async () => {
        try {
            if (!selectedLanguage || !selectedLanguage.language) {
                return toast.error("Please select a language to run the code")
            } else if (!activeFile) {
                return toast.error("Please open a file to run the code")
            } else {
                toast.loading("Running code...")
            }

            setIsRunning(true)
            const { language } = selectedLanguage

            const response = await axiosInstance.post("/execute", {
                language,
                code: activeFile.content,
                stdin: input,
            })
            if (response.data.run.stderr) {
                setOutput(response.data.run.stderr)
            } else {
                setOutput(response.data.run.stdout)
            }
            setIsRunning(false)
            toast.dismiss()
        } catch (error: any) {
            console.error("Error response:", error.response?.data)
            console.error("Error detail:", error.response?.data?.error)
            setIsRunning(false)
            toast.dismiss()
            toast.error("Failed to run the code")
        }
    }

    return (
        <RunCodeContext.Provider
            value={{
                setInput,
                output,
                isRunning,
                supportedLanguages,
                selectedLanguage,
                setSelectedLanguage,
                runCode,
            }}
        >
            {children}
        </RunCodeContext.Provider>
    )
}

export { RunCodeContextProvider }
export default RunCodeContext
