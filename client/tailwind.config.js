/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f8",
          100: "#ffe4f2",
          200: "#ffc9e5",
          300: "#ff9ed0",
          400: "#ff63b1",
          500: "#f43397",
          600: "#d91f7e",
          700: "#b51565",
          800: "#941552",
          900: "#7b1747",
        },
        ink: "#1f1f29",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 31, 41, 0.09)",
        glow: "0 18px 45px rgba(244, 51, 151, 0.24)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
        shimmer: "shimmer 1.7s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
    },
  },
  plugins: [],
};
