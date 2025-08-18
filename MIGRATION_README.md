# Gemini Service Migration: Client to Backend

## Overview
The Gemini AI service has been moved from the client-side to the backend for better security and maintainability.

## Changes Made

### Backend (Server)
1. **New Service**: `server/services/geminiService.js`
   - Handles all Gemini API calls
   - Uses environment variable `GEMINI_API_KEY` for API key
   - Includes `generateProfessionalBio` and `enhanceBioWithAI` functions

2. **New Routes**: `server/routes/aiRoutes.js`
   - `POST /api/ai/generate-bio` - Generate new professional bio
   - `POST /api/ai/enhance-bio` - Enhance existing bio

3. **Updated Dependencies**: Added `node-fetch` for HTTP requests in Node.js

4. **Server Configuration**: Added AI routes to `server.js`

### Frontend (Client)
1. **New Service**: `client/src/services/aiService.ts`
   - Replaces direct Gemini API calls with backend API calls
   - Uses environment variable `VITE_API_URL` for backend URL
   - Maintains same function signatures for easy migration

2. **Updated Components**: `PortfolioBuilder.tsx` now imports from `aiService` instead of `geminiService`

3. **Removed**: `client/src/services/geminiService.ts` (no longer needed)

## Environment Variables Required

### Backend (.env)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

## Benefits of This Migration

1. **Security**: API keys are no longer exposed in client-side code
2. **Maintainability**: Centralized AI service management
3. **Scalability**: Easier to implement rate limiting, caching, and monitoring
4. **Consistency**: All external API calls go through the backend

## API Endpoints

### Generate Bio
```http
POST /api/ai/generate-bio
Content-Type: application/json

{
  "name": "John Doe",
  "title": "Software Engineer",
  "skills": ["React", "Node.js", "Python"],
  "experience": ["Software Engineer at Tech Corp"],
  "education": ["BS Computer Science from University"]
}
```

### Enhance Bio
```http
POST /api/ai/enhance-bio
Content-Type: application/json

{
  "currentBio": "Existing bio text..."
}
```

## Installation

1. Install backend dependencies:
```bash
cd server
npm install
```

2. Set up environment variables in `server/.env`

3. Start the backend server:
```bash
npm run dev
```

4. The frontend will automatically use the new backend service

## Testing

The migration maintains the same user experience - all AI bio generation and enhancement features will work exactly as before, but now through the secure backend API.
