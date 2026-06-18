/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        artp: {
          50:  "#eef1ff",
          100: "#d5dcff",
          200: "#aab6ff",
          300: "#7f90ff",
          400: "#546bff",
          500: "#3b54f0",
          600: "#2845cc",
          700: "#1e34a8",
          800: "#152484",
          900: "#0c1560",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:    "0 2px 16px 0 rgba(40,69,204,0.08)",
        fab:     "0 4px 24px 0 rgba(40,69,204,0.32)",
        hero:    "0 8px 40px 0 rgba(40,69,204,0.24)",
        colored: "0 8px 24px -4px var(--tw-shadow-color)",
      },
      backgroundImage: {
        "hero-gradient":   "linear-gradient(135deg, #1a3aff 0%, #2845cc 50%, #6c3ff5 100%)",
        "card-gradient":   "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
