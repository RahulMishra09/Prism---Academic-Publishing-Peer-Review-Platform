import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                lumex: {
                    /* Primary accent */
                    blue: 'var(--lumex-accent)',
                    'blue-dark': 'var(--lumex-accent-dark)',
                    'blue-soft': 'var(--lumex-accent-soft)',

                    /* Legacy reds kept for error states */
                    red: 'var(--lumex-red)',
                    'red-dark': 'var(--lumex-red-dark)',
                    'oa-gold': 'var(--lumex-oa-gold)',

                    /* Neutrals */
                    text: 'var(--lumex-text)',
                    muted: 'var(--lumex-text-muted)',
                    sub: 'var(--lumex-text-sub)',
                    border: 'var(--lumex-border)',
                    'border-hover': 'var(--lumex-border-hover)',

                    /* Backgrounds */
                    bg: 'var(--lumex-bg)',
                    'bg-deep': 'var(--lumex-bg-deep)',
                    'bg-light': 'var(--lumex-bg)',
                    card: 'var(--lumex-card)',
                    'bg-white': 'var(--lumex-bg-white)',
                    'card-hover': 'var(--lumex-card-hover)',

                    /* Chips & tags */
                    'tag-bg': 'var(--lumex-tag-bg)',
                    'tag-text': 'var(--lumex-tag-text)',

                    /* Access badges */
                    'open-bg': 'rgba(20,184,166,0.09)',
                    'open-text': '#0d9488',
                    'sub-bg': 'rgba(59,91,219,0.08)',
                    'sub-text': '#3b5bdb',
                },
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                serif: ['Fraunces', 'Georgia', 'serif'],
                mono: ['Source Code Pro', 'monospace'],
            },
            screens: {
                sm: '576px',
                md: '768px',
                lg: '992px',
                xl: '1200px',
                '2xl': '1400px',
            },
            maxWidth: {
                container: '1240px',
            },
            keyframes: {
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(18px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
            },
            animation: {
                'fade-up': 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
                float: 'float 10s ease-in-out infinite',
            },
            borderRadius: {
                card: '11px',
            },
        },
    },
    plugins: [],
};

export default config;
