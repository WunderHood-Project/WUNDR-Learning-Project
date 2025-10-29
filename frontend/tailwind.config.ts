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
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      screens: {
        xs: "320px",     
        sm: "425px",     
        md: "768px",
        // lg: "1200px",
        lg: "1024px", 
        desk: '1025px',
        xl: "1280px",    
        xxl: "1536px",  
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }
    },
  },
  plugins: [],
}
export default config
