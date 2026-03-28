import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'kiwi-green': '#9FE870',
        'kiwi-green-dark': '#7AC74F',
        'kiwi-green-light': '#C5F5A0',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} satisfies Config;
