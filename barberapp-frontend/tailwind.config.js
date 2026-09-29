/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          dark: '#0F1115',
          card: '#161920',
          elevated: '#1F242D',
          gold: '#E5A93C',
          goldHover: '#F5BE59',
          accent: '#C58F2C',
          muted: '#8E95A5',
          border: '#2A303C',
          success: '#10B981',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
