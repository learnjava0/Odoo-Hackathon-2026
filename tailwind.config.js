/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b"
        }
      }
    }
  },
  plugins: []
};
