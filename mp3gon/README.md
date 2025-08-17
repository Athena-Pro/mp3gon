# Run and deploy your AI Studio app

This contains everything you need to run and deploy your app.

## Installation

**Prerequisites:** Node.js

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in this directory and add your Gemini API key:

```bash
GEMINI_API_KEY=your_api_key_here
```

## Development

Start the development server:

```bash
npm run dev
```

## Build

Generate an optimized production build:

```bash
npm run build
```

## Preview

After building, preview the production output locally:

```bash
npm run preview
```

## Production Deployment

1. Set `GEMINI_API_KEY` in your production environment.
2. Run `npm run build` to create the `dist` directory.
3. Deploy the contents of `dist` to your preferred hosting provider (e.g., Vercel, Netlify, or any static file server).
