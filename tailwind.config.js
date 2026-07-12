/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#020617",
          900: "#0f172a",
          850: "#162032",
        },
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(51,65,85,0.7)",
      },
    },
  },
  plugins: [],
};
