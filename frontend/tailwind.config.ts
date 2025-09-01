import type { Config } from "tailwindcss";

// Configuración principal de Tailwind
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',        // Todas las páginas
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',   // Todos los componentes
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',          // App Router
    './src/styles/globals.css',                    // Estilos globales
  ],

  theme: {
    extend: {
      // Breakpoints personalizados
      screens: {
        'xxs': '360px',
        'xs': '480px',
      },

      // Colores de marca
      colors: {
        'brand-black': '#0A0A0A',
        'brand-red': '#E50914',
        'brand-white': '#F5F5F5',
      },

      // Tipografías
      fontFamily: {
        sans: [
          'Open Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif',
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji',
        ],
        heading: [
          'Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif',
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji',
        ],
      },

      // ✅ Unificamos todas las animaciones aquí
      animation: {
        marquee: "marquee 40s linear infinite",
        "gradient-x": "gradientX 10s ease infinite",
      },

      // ✅ Unificamos todas las keyframes aquí
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        gradientX: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
          
        },
      },
    },
  },

  plugins: [],
};

export default config;
