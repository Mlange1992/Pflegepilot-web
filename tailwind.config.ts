import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primärfarbe: Teal
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0891b2', // Haupt-Teal aus SPEC
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Warm-Orange für Warnungen
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        // Rot für Verfall
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Grün für genutzte Beträge
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        'soft-md': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'soft-lg': '0 10px 25px -5px rgb(0 0 0 / 0.08), 0 4px 10px -4px rgb(0 0 0 / 0.04)',
        'soft-xl': '0 20px 40px -10px rgb(0 0 0 / 0.12), 0 8px 20px -8px rgb(0 0 0 / 0.06)',
        'glow-primary': '0 10px 30px -8px rgb(8 145 178 / 0.35)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blob': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.05)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.95)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 400ms ease-out',
        'blob': 'blob 14s ease-in-out infinite',
      },
      backgroundImage: {
        'mesh-primary':
          'radial-gradient(at 20% 0%, rgb(186 230 253 / 0.7) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(125 211 252 / 0.5) 0px, transparent 50%), radial-gradient(at 40% 100%, rgb(224 242 254 / 0.8) 0px, transparent 50%)',
        'mesh-dark':
          'radial-gradient(at 20% 30%, rgb(8 145 178 / 0.4) 0px, transparent 50%), radial-gradient(at 80% 70%, rgb(14 116 144 / 0.5) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}

export default config
