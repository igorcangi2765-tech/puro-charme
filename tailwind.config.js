/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                puro: {
                    pink: '#FF4095', // Slightly deeper pink for buttons/highlights
                    pastelPink: '#FF5BA0', // The specific requested pastel tone
                    softPink: '#FFE4EF', // Very light pink for backgrounds/tabs
                    inputBg: '#FFF5F9', // Specific input background
                    gold: '#D4AF37',
                    darkGold: '#B59428',
                    black: '#1A1A1A', // Soft Black
                    text: '#555555', // Soft Gray
                    textLight: '#888888',
                    warning: '#F7DC6F',
                }
            },
            fontFamily: {
                headline: ['"Poppins"', 'sans-serif'],
                sans: ['"Poppins"', 'sans-serif'],
                brand: ['"Allura"', 'cursive'],
                body: ['"Poppins"', 'sans-serif'],
            },
            letterSpacing: {
                'headline': '-0.02em', // -0.5px roughly
                'body': '0.015em', // ~0.2px
            },
            borderRadius: {
                'card': '24px',
                'button': '50px',
            },
            boxShadow: {
                'soft': '0 8px 32px rgba(0, 0, 0, 0.06)',
                'card': '0 4px 24px rgba(0, 0, 0, 0.04)',
                'hover': '0 20px 40px -10px rgba(255, 91, 160, 0.2)',
                'glow': '0 0 20px rgba(255, 91, 160, 0.3)',
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #FFF0F5 0%, #FFFFFF 60%, #FFF5F9 100%)',
                'footer-gradient': 'linear-gradient(to top, #FFF0F5 0%, #FFFFFF 100%)',
            }
        },
    },
    plugins: [],
}
