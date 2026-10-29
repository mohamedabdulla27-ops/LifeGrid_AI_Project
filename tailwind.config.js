/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds sampled from the mockup
        ink: {
          950: '#020403', // app base
          900: '#030303', // deepest panels
          850: '#050807', // topbar / sidebar
          800: '#070B0C', // card surface
          700: '#0B1210', // raised surface / inputs
          600: '#111A17', // hairline borders
          500: '#1B2722', // stronger borders
        },
        // Accents sampled from the mockup
        signal: {
          DEFAULT: '#00E472', // primary green
          soft: '#36D27E',
          glow: '#00FC9C',
          tint: '#02110A', // green pill background
        },
        alert: {
          DEFAULT: '#FC3C18', // red-orange
          soft: '#FC6C3C',
          tint: '#280C08', // active nav background
        },
        amber: {
          DEFAULT: '#FCAE00',
          soft: '#F0BA36',
        },
        mint: {
          DEFAULT: '#E0F8F0', // primary text
          muted: '#8FA69B',
          dim: '#5C6E66',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.02) inset, 0 8px 28px -12px rgba(0,0,0,0.8)',
        'glow-green': '0 0 24px -6px rgba(0,228,114,0.45)',
        'glow-red': '0 0 22px -6px rgba(252,60,24,0.55)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.8)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
        'slide-in': 'slideIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
