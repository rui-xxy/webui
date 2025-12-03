/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "nerv-bg": "#f0f4f8",
        "nerv-emerald": "#059669",
        "nerv-orange": "#ea580c",
        "nerv-metal": "#64748b",
        "nerv-glass": "rgba(255, 255, 255, 0.8)",
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      "nerv": {
        extend: "light", // inherits from light theme
        colors: {
          background: "#f0f4f8",
          foreground: "#1e293b",
          primary: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e", 
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            DEFAULT: "#10b981", // emerald-500
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#f97316", // orange-500
            foreground: "#ffffff",
          },
          success: {
            DEFAULT: "#10b981",
            foreground: "#ffffff",
          },
          warning: {
            DEFAULT: "#f59e0b",
            foreground: "#ffffff",
          },
          focus: "#10b981",
        },
        layout: {
          radius: {
            small: "4px",
            medium: "8px",
            large: "12px",
          },
        },
      },
    },
  })],
}