import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7ff',
          100: '#e6edff',
          200: '#c9d7ff',
          300: '#9fb7ff',
          400: '#6a8fff',
          500: '#3f5efb',
          600: '#2436d9',
          700: '#1c2ba8',
          800: '#192b87',
          900: '#111b57',
        },
      },
      boxShadow: {
        card: '0 10px 40px -20px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
