import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        card: '#ffffff',
        'card-foreground': '#000000',
        popover: '#ffffff',
        'popover-foreground': '#000000',
        primary: '#000000',
        'primary-foreground': '#ffffff',
        secondary: '#f5f5f5',
        'secondary-foreground': '#000000',
        muted: '#f5f5f5',
        'muted-foreground': '#737373',
        accent: '#9FE870',
        'accent-foreground': '#000000',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#e5e5e5',
        input: '#e5e5e5',
        'input-background': '#f5f5f5',
        'switch-background': '#e5e5e5',
        ring: '#9FE870',
        'kiwi-green': '#9FE870',
        'kiwi-green-dark': '#7AC74F',
        'kiwi-green-light': '#C5F5A0',
      },
      borderRadius: {
        'lg': '10px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} satisfies Config;
