/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Esto le dice que busque en CUALQUIER subcarpeta de src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}