import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#F7F7F5',
        panel: '#FFFFFF',
        panelLight: '#FAFAF9',
        border: '#ECECE9',
        muted: '#8E8E92',
        text: '#1C1C1E',
        danger: '#F0665E',
        dangerDim: '#FDEEED',
        safe: '#3DBD8B',
        safeDim: '#EAF7F1',
        brand: '#5B8DEF',
        brandDim: '#EDF2FD',
        brandDeep: '#2F6FED',
        warn: '#F4B860',
        warnDim: '#FEF5E9',
        lavender: '#B9A6F0',
        lavenderDim: '#F3EFFC',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 28, 30, 0.04), 0 8px 24px -8px rgba(28, 28, 30, 0.06)',
        cardHover: '0 1px 2px rgba(28, 28, 30, 0.05), 0 12px 32px -8px rgba(28, 28, 30, 0.10)',
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        scan: 'scan 2.4s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        floatSlow: 'floatSlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
