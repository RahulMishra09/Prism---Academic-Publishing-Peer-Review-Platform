import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                /* --- Legacy lumex tokens (values updated, names kept for compatibility) --- */
                lumex: {
                    blue: 'var(--lumex-accent)',
                    'blue-dark': 'var(--lumex-accent-dark)',
                    'blue-soft': 'var(--lumex-accent-soft)',
                    'accent-soft': 'var(--lumex-accent-soft)',

                    red: 'var(--lumex-red)',
                    'red-dark': 'var(--lumex-red-dark)',
                    'oa-gold': 'var(--lumex-oa-gold)',

                    text: 'var(--lumex-text)',
                    'text-secondary': 'var(--lumex-text-muted)',
                    muted: 'var(--lumex-text-muted)',
                    sub: 'var(--lumex-text-sub)',
                    border: 'var(--lumex-border)',
                    'border-hover': 'var(--lumex-border-hover)',

                    bg: 'var(--lumex-bg)',
                    'bg-deep': 'var(--lumex-bg-deep)',
                    'bg-light': 'var(--lumex-bg)',
                    card: 'var(--lumex-card)',
                    'bg-white': 'var(--lumex-bg-white)',
                    'card-hover': 'var(--lumex-card-hover)',

                    'tag-bg': 'var(--lumex-tag-bg)',
                    'tag-text': 'var(--lumex-tag-text)',

                    'open-bg': 'var(--lumex-open-bg)',
                    'open-text': 'var(--lumex-open-text)',
                    'sub-bg': 'var(--lumex-sub-bg)',
                    'sub-text': 'var(--lumex-sub-text)',
                },

                /* --- New Prism tokens --- */
                prism: {
                    violet: 'var(--prism-violet)',
                    'violet-dark': 'var(--prism-violet-dark)',
                    'violet-soft': 'var(--prism-violet-soft)',
                    teal: 'var(--prism-teal)',
                    'teal-soft': 'var(--prism-teal-soft)',
                    'glass-bg': 'var(--prism-glass-bg)',
                    'glass-border': 'var(--prism-glass-border)',
                    'reading-bg': 'var(--prism-reading-bg)',
                    'reading-text': 'var(--prism-reading-text)',
                    'reading-muted': 'var(--prism-reading-muted)',
                },
            },

            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
                reading: ['Crimson Pro', 'Georgia', 'serif'],
                mono: ['Source Code Pro', 'ui-monospace', 'monospace'],
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
                reading: '680px',
            },

            keyframes: {
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                slideDown: {
                    from: { opacity: '0', transform: 'translateY(-8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.96)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
            },

            animation: {
                'fade-up': 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
                'fade-in': 'fadeIn 0.3s ease both',
                float: 'float 8s ease-in-out infinite',
                shimmer: 'shimmer 2s linear infinite',
                'slide-down': 'slideDown 0.2s ease both',
                'scale-in': 'scaleIn 0.2s ease both',
            },

            borderRadius: {
                card: '0.75rem',
                sm: '0.25rem',
                md: '0.375rem',
                lg: '0.625rem',
            },

            boxShadow: {
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                dropdown: 'var(--shadow-dropdown)',
                'card-hover': 'var(--shadow-card-hover)',
                glass: 'var(--shadow-glass)',
            },

            backdropBlur: {
                glass: '12px',
            },

            transitionDuration: {
                fast: '150ms',
                base: '200ms',
                slow: '300ms',
            },

            typography: {
                DEFAULT: {
                    css: {
                        fontFamily: 'Crimson Pro, Georgia, serif',
                        fontSize: '1.125rem',
                        lineHeight: '1.85',
                        color: 'var(--prism-reading-text)',
                        a: {
                            color: 'var(--lumex-accent)',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                        },
                    },
                },
            },
        },
    },
    plugins: [],
};

export default config;
