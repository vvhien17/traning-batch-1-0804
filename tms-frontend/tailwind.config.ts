import type { Config } from "tailwindcss";
import colors from "./src/assets/styles/index";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": {
            transform: "translateX(50%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        slideOut: {
          "0%": {
            transform: "translateX(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateX(50%)",
            opacity: "0",
          },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease forwards",
        slideOut: "slideOut 0.5s ease forwards",
      },
      colors: colors,
    },
  },
  plugins: [],
};
export default config;
