/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3E2723",
          dark: "#2D1B18",
        },
        secondary: {
          DEFAULT: "#F5E6CC",
          dark: "#E8D4B5",
        },
        accent: {
          DEFAULT: "#C97B36",
          dark: "#A0612A",
          light: "#D99A5C",
        },
        highlight: "#E6C9A8",
        surface: "#FFFFFF",
        background: "#FDF6EC",
        muted: "#7D5A4F",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
