/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          0: '#07070b',
          1: '#0a0a10',
          2: '#10111a',
          3: '#181a27',
          4: '#232636',
        },
        line: 'rgba(255,255,255,0.08)',
        lineStrong: 'rgba(255,255,255,0.16)',
        axis: {
          rep: '#22d3ee',
          input: '#e879f9',
          pipe: '#a3e635',
          cap: '#fbbf24',
          target: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        glow: '0 0 24px rgba(34,211,238,0.25)',
        panel: '0 24px 60px -20px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.04) inset',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in-r': 'slideInR 260ms cubic-bezier(.2,.7,.2,1)',
        pulse2: 'pulse2 2.4s ease-in-out infinite',
        drift: 'drift 60s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideInR: {
          '0%': { opacity: 0, transform: 'translateX(16px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        drift: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '240px 240px' },
        },
      },
    },
  },
  plugins: [],
};
