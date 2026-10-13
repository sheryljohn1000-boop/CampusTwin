/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nebula-style deep green-black palette
        night: {
          DEFAULT: '#050d0b', // app canvas
          raised: '#081512', // panel / sidebar surface
          card: '#0a1a16', // cards & sheets
          hover: '#0e2420', // hover fill
          line: '#12352d', // hairline borders
        },
        royal: {
          DEFAULT: '#3dd68c', // emerald-mint — primary accent
          soft: '#07271c', // emerald tint surface
          deep: '#2ab477', // pressed / deeper
        },
        gold: {
          DEFAULT: '#a8f0c8', // pale mint — secondary accent
          soft: '#08271d', // mint tint surface
        },
        // Neutral text ramp (green-tinted)
        ink: {
          DEFAULT: '#eef7f2', // primary text
          soft: '#9fbfb2', // secondary text
          faint: '#5f7f72', // tertiary text
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.35)',
        lift: '0 8px 24px rgba(0,0,0,0.45)',
        'glow-royal': '0 0 22px -4px rgba(61,214,140,0.55)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
