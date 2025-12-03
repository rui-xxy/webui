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
        "nerv-bg": "#1a1a2e",
        "nerv-emerald": "#00ff88",
        "nerv-orange": "#ff6b35",
        "nerv-metal": "#8b8b9c",
        "nerv-glass": "rgba(30, 30, 40, 0.8)",
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      "nerv": {
        extend: "dark", // inherits from dark theme
        colors: {
          background: "#1a1a2e",
          foreground: "#ffffff",
          primary: {
            50: "#e6fffa",
            100: "#b2f5ea",
            200: "#81e6d9",
            300: "#4fd1c5",
            400: "#38b2ac",
            500: "#00ff88", // futuristic-text-emerald
            600: "#00cc6a",
            700: "#00994f",
            800: "#006635",
            900: "#00331b",
            DEFAULT: "#00ff88",
            foreground: "#1a1a2e",
          },
          secondary: {
            DEFAULT: "#ff6b35", // futuristic-daily-color
            foreground: "#ffffff",
          },
          success: {
            DEFAULT: "#00ff88",
            foreground: "#1a1a2e",
          },
          warning: {
            DEFAULT: "#ff6b35",
            foreground: "#ffffff",
          },
          focus: "#00ff88",
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