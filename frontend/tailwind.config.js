/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
        },
        kid: {
          yellow: '#FBBF24',
          orange: '#FB923C',
          green: '#4ADE80',
          purple: '#A855F7',
          pink: '#F472B6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        kid: ['Comic Sans MS', 'Chalkboard SE', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
