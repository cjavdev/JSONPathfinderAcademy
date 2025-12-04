# Deployment Guide

## Project Structure

This project is organized to separate distribution files from test files:

```
/
├── dist/              # Static files for deployment (Cloudflare Pages)
│   ├── index.html
│   ├── game.js
│   ├── levels.js
│   └── styles.css
├── tests/             # Test files and configuration
│   ├── game.test.js
│   ├── levels.test.js
│   ├── jest.config.js
│   ├── jest.setup.js
│   └── babel.config.js
├── package.json       # NPM dependencies (for testing only)
└── node_modules/      # NPM packages (for testing only)
```

## Cloudflare Pages Deployment

1. **Build Settings:**
   - **Build command:** (leave empty - no build needed)
   - **Build output directory:** `dist`
   - **Root directory:** `/` (root of repository)

2. **Environment Variables:**
   - None required (this is a static site)

3. **Deployment:**
   - Cloudflare Pages will serve files from the `dist/` directory
   - The `package.json` in the root is only for local testing and will be ignored by Cloudflare

## Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run tests:**

   ```bash
   npm test
   ```

3. **View the site locally:**
   - Open `dist/index.html` in a browser, or
   - Use a local server: `npx serve dist`

## Notes

- All static files (HTML, CSS, JS) are in the `dist/` directory
- Test files are in the `tests/` directory and won't be deployed
- The `package.json` is only used for running tests locally
