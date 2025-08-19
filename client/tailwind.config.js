export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          light: "#60a5fa",
          DEFAULT: "#2563eb",
          dark: "#1e3a8a",
        },
        gray: {
          soft: "#f3f4f6",
          dark: "#1f2937",
        },
      },
    },
  },
  plugins: [],
}
