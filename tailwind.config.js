/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber-black': '#040507',
        'cyber-dark': '#080a0f',
        'cyber-surface': '#0c1018',
        'cyber-panel': '#121722',
        'cyber-card': '#161c2b',
        'cyber-border': '#1e2638',
        'cyber-red': {
          DEFAULT: '#ff1f43',
          dark: '#730c1d',
          glow: '#ff0033',
          muted: 'rgba(255, 31, 67, 0.15)',
        },
        'cyber-cyan': {
          DEFAULT: '#00f0ff',
          dark: '#006680',
          glow: '#00e5ff',
          muted: 'rgba(0, 240, 255, 0.15)',
        },
        'cyber-blue': {
          DEFAULT: '#0070f3',
          dark: '#003b80',
        },
        'brand-green': {
          DEFAULT: '#00e676',
          dark: '#00592e',
          muted: 'rgba(0, 230, 118, 0.15)',
        },
        'brand-orange': {
          DEFAULT: '#ff9800',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Orbitron"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(4,5,7,0.95) 100%)',
      }
    },
  },
  plugins: [],
}
