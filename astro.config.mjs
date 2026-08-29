// @ts-check
import { defineConfig } from 'astro/config';

// User site (CSmohmmadSH.github.io) => base stays "/".
// If you ever move this to a PROJECT repo (e.g. github.com/CSmohmmadSH/portfolio),
// change to:  site: 'https://CSmohmmadSH.github.io', base: '/portfolio'
export default defineConfig({
  site: 'https://CSmohmmadSH.github.io',
  base: '/',
  build: {
    // one CSS file instead of many tiny ones
    inlineStylesheets: 'auto',
  },
});
