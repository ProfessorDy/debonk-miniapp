import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#202020",
        primary: "#797979",
        accent: "#0493CC",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['"Open Sans"', 'Arial', 'Helvetica', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],  
      },
    },
  },
  plugins: [],
};
export default config;
