/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Royal dark palette
        night: {
          DEFAULT: '#0b0d14', // app canvas (deep midnight)
          raised: '#12141d', // panel / sidebar surface
          card: '#171a25', // cards & sheets
          hover: '#1e2230', // hover fill
          line: '#262a3a', // hairline borders
        },
        royal: {
          DEFAULT: '#8b7cf6', // royal violet — primary accent
          soft: '#241f38', // violet tint surface
          deep: '#6d5ce0', // pressed / deeper violet
        },
        gold: {
          DEFAULT: '#d4b570', // antique gold — secondary accent
          soft: '#2a2517', // gold tint surface
        },
        // Neutral text ramp (cool-tinted for the navy base)
        ink: {
          DEFAULT: '#eceaf6', // primary text
          soft: '#a6a4bd', // secondary text
          faint: '#6d6b85', // tertiary text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.35)',
        lift: '0 8px 24px rgba(0,0,0,0.45)',
        'glow-royal': '0 0 18px -4px rgba(139,124,246,0.45)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
