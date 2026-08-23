/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(199, 89%, 38%)",
          foreground: "hsl(0, 0%, 100%)",
          dark: "hsl(199, 89%, 20%)",
        },
        secondary: {
          DEFAULT: "hsl(199, 30%, 94%)",
          foreground: "hsl(199, 89%, 28%)",
        },
        accent: {
          DEFAULT: "hsl(172, 66%, 40%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(210, 20%, 96%)",
          foreground: "hsl(210, 15%, 45%)",
        },
        warning: {
          DEFAULT: "hsl(38, 92%, 50%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        success: {
          DEFAULT: "hsl(142, 71%, 40%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 72%, 51%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(210, 40%, 11%)",
        },
        border: "hsl(210, 20%, 90%)",
        sidebar: {
          background: "hsl(199, 89%, 20%)",
          foreground: "hsl(0, 0%, 98%)",
          accent: "hsl(199, 60%, 30%)",
          accentForeground: "hsl(0, 0%, 98%)",
        }
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        heading: ["Source Sans 3", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius, 0.625rem)",
      }
    },
  },
  plugins: [],
}
