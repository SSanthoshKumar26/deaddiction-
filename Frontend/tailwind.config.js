/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Professional Medical Palette
                // Primary: Trustworthy Medical Blue
                primary: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7dd3fc', // Brand accent light
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7', // Main Brand Color (Calm Blue)
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                // Secondary: Healing/Nature Teal (Muted)
                secondary: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488', // Muted Green/Teal
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                // Surface: Clean Medical White/Grays
                surface: {
                    50: '#F8FAFC', // Slate 50 (Very light gray, good for backgrounds)
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b', // Dark text
                    900: '#0f172a', // Very dark text
                },
                // Accent: Warm tone for attention (optional, minimal use)
                accent: {
                    500: '#f59e0b', // Amber (Warmth)
                }
            },
            fontFamily: {
                sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'], // Inter is cleaner/standard
                display: ['"Inter"', 'sans-serif'], // Keep it consistent
                serif: ['"Playfair Display"', '"Libre Baskerville"', 'serif'],
            },
            boxShadow: {
                'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
                'floating': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
            },
            backgroundImage: {
                'gradient-medical': 'linear-gradient(to right, #0284c7, #0d9488)', // Blue to Teal
            }
        },
    },
    plugins: [],
}
