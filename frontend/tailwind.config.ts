import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wondergreen: '#2f5d3e',
        wonderleaf: '#90b35c',
        wonderorange: '#f5a940',
        wondersun: '#fbd78d',
        wonderbg: '#fdf6e9',
        // wonderbg: '#FAF7ED', 
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        // sans: ['Geist', 'sans-serif'],
        // mono: ['Geist Mono', 'monospace'],
      },
      screens: {
        xs: "425px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px", 
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite',
        'heart-beat': 'heart-beat 0.9s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'heart-beat': {
          '0%, 100%': { transform: 'scale(1)', color: 'inherit' },
          '25%': { transform: 'scale(1.15)', color: '#ef4444' }, 
          '50%': { transform: 'scale(1.05)', color: '#f97316' }, 
          '75%': { transform: 'scale(1.15)', color: '#ef4444' },
        },
      },
    },
  },
  plugins: [],
}
export default config
