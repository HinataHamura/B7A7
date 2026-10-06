import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
        accent: {
          DEFAULT: '#14b8a6',
          50: '#ecfeff',
          500: '#14b8a6',
        },
        slate: {
          950: '#020817',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(circle at top left, rgba(79, 70, 229, 0.16), transparent 40%), radial-gradient(circle at bottom right, rgba(20, 184, 166, 0.18), transparent 35%)',
      },
    },
  },
  plugins: [],
};

export default config;
