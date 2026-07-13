/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{jsx,tsx}", "./*.html"],
    theme: {
        extend: {
            colors: {
                dark: "#212429",
                darkHover: "#3D404A",
                light: "#f5f5f5",
                primary: "#39E079",
                danger: "#ef4444",
                royal: {
                    dark: "#1a1a2e",
                    navy: "#16213e",
                    blue: "#0f3460",
                    crimson: "#e94560",
                    pink: "#d63384",
                    gold: "#d4af37",
                },
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
            animation: {
                "up-down": "up-down 2s ease-in-out infinite alternate",
            },
        },
    },
    plugins: [],
}
