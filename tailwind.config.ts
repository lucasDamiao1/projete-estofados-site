import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/constants/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F2EA",
        cream: "#F7F2EA",
        surface: "#E8DDCF",
        sand: "#E8DDCF",
        foreground: "#2B2520",
        muted: "#7A7166",
        primary: "#32462F",
        accent: "#B56B4D",
        dark: "#2B2520",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Avenir Next",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "Cormorant Garamond",
          "Playfair Display",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 55px rgba(50, 70, 47, 0.08)",
        lift: "0 24px 70px rgba(50, 70, 47, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
