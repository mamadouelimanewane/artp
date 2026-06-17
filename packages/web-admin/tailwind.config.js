/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        artp: {
          50: "#f0f4ff",
          100: "#dce6fe",
          200: "#bfd0fd",
          300: "#93b0fb",
          400: "#6088f7",
          500: "#3b5ef0",
          600: "#2640e5",
          700: "#1e30d0",
          800: "#1e2ba8",
          900: "#1e2a84",
        },
        senegal: {
          green: "#00853F",
          yellow: "#FDEF42",
          red: "#E31B23",
        },
      },
    },
  },
  plugins: [],
};
