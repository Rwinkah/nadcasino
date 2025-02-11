/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#84db4b",
          "primary-content": "#28540a",
          secondary: "#bded9d",
          "secondary-content": "#28540a",
          accent: "#8fd65e",
          "accent-content": "#28540a",
          neutral: "#223018",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#edfae3", //background color
          "base-300": "#def7cb",
          // text: "#000",
          "base-content": "#28540a",
          info: "#93bbfb",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
          cardUnavailable: "#83b562",
        },
      },
      {
        dark: {
          primary: "#493582",
          "primary-content": "#def7cd",
          secondary: "#917CF7",
          "secondary-content": "#def7cd",
          accent: "#6dad40",
          "accent-content": "#def7cd",
          neutral: "#def7cd",
          "neutral-content": "#60913d",
          "base-100": "#60913d",
          "base-200": "#0a1700", // background color
          "base-300": "#2a4a14",
          "base-content": "#def7cd",
          // text: "#fff",

          info: "#6dad40",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px", "--tooltip-color": "oklch(var(--p))" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
          cardUnavailable: "#0d1706",
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: { center: "0 0 12px -2px rgb(0 0 0 / 0.05)" },
      animation: { "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
    },
  },
};
