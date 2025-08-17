# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` environment variable with your Gemini API key.
3. Run the frontend:
   `npm run dev`
4. In a separate terminal start the backend API:
   `npm run server`

## Deployment

The backend server uses these environment variables:

- `GEMINI_API_KEY` – required Gemini API key
- `PORT` – optional port for the API server (defaults to 3001)

Build the frontend with `npm run build` and launch the backend with `npm run server` on your deployment platform.
