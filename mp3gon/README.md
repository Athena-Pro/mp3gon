# Run and deploy your AI Studio app

This contains everything you need to run and deploy your app.

## Installation

**Prerequisites:** Node.js

 codex/add-gemini-api-endpoint-and-documentation
1. Install dependencies:
   `npm install`
 codex/update-environment-variable-settings
2. Set the `GEMINI_API_KEY` environment variable (e.g., in `.env.local`) to your Gemini API key
3. Run the app:
2. Set the `GEMINI_API_KEY` environment variable with your Gemini API key.
3. Run the frontend:
 main
   `npm run dev`
4. In a separate terminal start the backend API:
   `npm run server`

## Deployment

The backend server uses these environment variables:

- `GEMINI_API_KEY` – required Gemini API key
- `PORT` – optional port for the API server (defaults to 3001)

Build the frontend with `npm run build` and launch the backend with `npm run server` on your deployment platform.
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
 main
