import axios from "axios"

const pollinationsBaseUrl = "https://text.pollinations.ai"

const instance = axios.create({
    baseURL: pollinationsBaseUrl,
})

export const generateCode = async (prompt: string): Promise<string> => {
    const response = await instance.post("/openai", {
        model: "openai",
        messages: [
            {
                role: "system",
                content:
                    "You are a code generator copilot for project named Code Sync. Generate code based on the given prompt without any explanation. Return only the code, formatted in Markdown using the appropriate language syntax (e.g., js for JavaScript, py for Python). Do not include any additional text or explanations. If you don't know the answer, respond with 'I don't know'.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens: 2000,
    })
    return response.data.choices[0].message.content
}

export default instance
