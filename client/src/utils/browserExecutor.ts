declare global {
    interface Window {
        loadPyodide: any;
    }
}

let pyodide: any = null;
let pyodideLoading: Promise<any> | null = null;

export const loadPyodideInstance = async (): Promise<any> => {
    if (pyodide) return pyodide;
    if (pyodideLoading) return pyodideLoading;

    pyodideLoading = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.onload = async () => {
            try {
                pyodide = await window.loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
                });
                resolve(pyodide);
            } catch (e) {
                reject(e);
            }
        };
        script.onerror = () => reject(new Error("Failed to load Pyodide"));
        document.head.appendChild(script);
    });

    return pyodideLoading;
};

export interface BrowserExecutionResult {
    output: string;
    error?: string;
}

export const executeJavaScript = (code: string, stdin: string): BrowserExecutionResult => {
    try {
        let output = "";

        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args: any[]) => {
            output += args.map(arg =>
                typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(" ") + "\n";
        };

        console.error = (...args: any[]) => {
            output += args.map(arg =>
                typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(" ") + "\n";
        };

        console.warn = (...args: any[]) => {
            output += args.map(arg =>
                typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(" ") + "\n";
        };

        if (stdin) {
            (globalThis as any).__stdinBuffer = stdin.split('\n');
            (globalThis as any).__stdinIndex = 0;
            
            if (typeof window !== 'undefined') {
                (globalThis as any).prompt = () => {
                    const buffer = (globalThis as any).__stdinBuffer;
                    const idx = (globalThis as any).__stdinIndex++;
                    return buffer[idx] || '';
                };
            }
        }

        const result = eval(code);

        if (result !== undefined && output === "") {
            output = typeof result === "object"
                ? JSON.stringify(result, null, 2)
                : String(result);
        }

        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        return { output: output.trim() || "✅ Code executed successfully (no output)" };
    } catch (error: any) {
        return {
            output: "",
            error: error.message || String(error),
        };
    }
};

export const executePython = async (code: string, stdin: string): Promise<BrowserExecutionResult> => {
    try {
        const pyodideInstance = await loadPyodideInstance();
        
        let output = "";

        pyodideInstance.setStdout({
            batched: (text: string) => {
                output += text + "\n";
            },
        });

        pyodideInstance.setStderr({
            batched: (text: string) => {
                output += text + "\n";
            },
        });

        if (stdin) {
            pyodideInstance.setStdin({
                stdin: () => {
                    const lines = stdin.split("\n");
                    return lines.shift() || "";
                },
            });
        }

        await pyodideInstance.runPythonAsync(code);

        return { output: output.trim() || "✅ Code executed successfully (no output)" };
    } catch (error: any) {
        return {
            output: "",
            error: error.message || String(error),
        };
    }
};

export const isBrowserExecutable = (language: string): boolean => {
    return ["javascript", "python"].includes(language.toLowerCase());
};

export const getBrowserExecutor = (language: string): "javascript" | "python" | null => {
    const lang = language.toLowerCase();
    if (lang === "javascript" || lang === "js" || lang === "typescript" || lang === "ts") {
        return "javascript";
    }
    if (lang === "python" || lang === "py") {
        return "python";
    }
    return null;
};
