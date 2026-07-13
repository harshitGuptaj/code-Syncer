import axios from "axios"

const groqBaseUrl = "https://api.groq.com/openai/v1/chat/completions"

const instance = axios.create({
    baseURL: groqBaseUrl,
})

export const generateCode = async (prompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    
    if (!apiKey || apiKey === "your_groq_api_key_here") {
        throw new Error("Please add your Groq API key in the .env file (VITE_GROQ_API_KEY)")
    }

    try {
        const response = await instance.post(
            "",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a code generator copilot for project named Code Sync. Generate code based on the given prompt without any explanation. Return only the code, formatted in Markdown using the appropriate language syntax (e.g., js for JavaScript, py for Python). Do not include any additional text or explanations. If you don't know the answer, respond with 'I don\\'t know'."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        )
        
        const content = response.data?.choices?.[0]?.message?.content || ""
        return content
    } catch (error) {
        console.error("API Error:", error)
        throw error
    }
}

export default instance
