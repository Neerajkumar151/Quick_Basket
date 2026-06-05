import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        h1: ['var(--text-h1-size)', { lineHeight: 'var(--text-h1-leading)', fontWeight: 'var(--text-h1-weight)' }],
        h2: ['var(--text-h2-size)', { lineHeight: 'var(--text-h2-leading)', fontWeight: 'var(--text-h2-weight)' }],
        h3: ['var(--text-h3-size)', { lineHeight: 'var(--text-h3-leading)', fontWeight: 'var(--text-h3-weight)' }],
        h4: ['var(--text-h4-size)', { lineHeight: 'var(--text-h4-leading)', fontWeight: 'var(--text-h4-weight)' }],
        body: ['var(--text-body-size)', { lineHeight: 'var(--text-body-leading)', fontWeight: 'var(--text-body-weight)' }],
        description: ['var(--text-description-size)', { lineHeight: 'var(--text-description-leading)', fontWeight: 'var(--text-description-weight)' }],
        caption: ['var(--text-caption-size)', { lineHeight: 'var(--text-caption-leading)', fontWeight: 'var(--text-caption-weight)' }],
        nav: ['var(--text-nav-size)', { fontWeight: 'var(--text-nav-weight)' }],
      }
    }
  }
} satisfies Config;
