/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        dj: {
          dark: '#0B0F19',
          card: '#131B2E',
          border: '#1F2B48',
          accent: '#06B6D4',
          neon: '#10B981',
          gold: '#F59E0B',
          pink: '#EC4899',
        }
      }
    },
  },
  plugins: [],
}
