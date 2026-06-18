/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        artp: { 50:"#eef1ff", 100:"#d5dcff", 500:"#3b54f0", 600:"#2845cc", 700:"#1e34a8" },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 1px 12px 0 rgba(0,0,0,0.06)" },
    },
  },
  plugins: [],
};
