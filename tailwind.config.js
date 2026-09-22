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
          dark: '#FBF8FC',
          card: '#F7EFF7',
          border: '#E8D8E7',
          accent: '#7160A7',
          neon: '#548B75',
          gold: '#AF7654',
          pink: '#A64D7A',
        }
      }
    },
  },
  plugins: [],
}
