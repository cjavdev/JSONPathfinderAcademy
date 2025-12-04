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

### Option 1: Using Build Output Directory (Recommended)

1. **Build Settings:**
   - **Build command:** `npm run build` (or leave empty)
   - **Build output directory:** `dist`
   - **Root directory:** `/` (root of repository)
   - **Deploy command:** (leave empty - not needed for static sites)

2. **Environment Variables:**
   - None required (this is a static site)

### Option 2: Using Wrangler Deploy Command

If you have a deploy command configured (`npx wrangler deploy`), the `wrangler.jsonc` file in the root will tell Wrangler where to find the assets.

1. **Build Settings:**
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Deploy command:** `npx wrangler deploy` (optional - only if you want to use Wrangler)

2. **Configuration:**
   - The `wrangler.jsonc` file is already configured to use `./dist` as the assets directory
   - No additional configuration needed

### Notes

- Cloudflare Pages will serve files from the `dist/` directory
- The `package.json` in the root is only for local testing
- The `wrangler.jsonc` file is included to support Wrangler-based deployments if needed

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
