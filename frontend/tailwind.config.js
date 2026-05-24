/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#667085",
        line: "#d9e2ef",
        panel: "#f6f8fb",
        surface: "#ffffff",
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#b9dcff",
          300: "#86c5ff",
          400: "#4aa4f4",
          500: "#1f86dc",
          600: "#126bb9",
          700: "#115793",
          800: "#144a79",
          900: "#173f66"
        },
        accent: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e"
        },
        success: {
          50: "#ecfdf3",
          700: "#047857"
        },
        warning: {
          50: "#fffbeb",
          700: "#b45309"
        },
        danger: {
          50: "#fef2f2",
          700: "#b91c1c"
        },
        score: {
          high: "#047857",
          medium: "#b45309",
          low: "#b91c1c"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 23, 42, 0.09)",
        card: "0 1px 2px rgba(15, 23, 42, 0.05), 0 12px 30px rgba(15, 23, 42, 0.04)",
        glow: "0 24px 70px rgba(31, 134, 220, 0.18)"
      },
      borderRadius: {
        card: "0.5rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shine: "shine 2.8s ease-in-out infinite"
      }
    },
  },
  plugins: [],
};
