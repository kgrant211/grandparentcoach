# Server API Documentation

This directory contains the client-side API code for communicating with the backend server.

## Setup

The server should be deployed to Vercel or Cloudflare Workers and handle the following endpoints:

### POST /coach

Handles coaching conversations with AI.

**Request Body:**
```json
{
  "sessionId": "string",
  "context": {
    "ageRange": "string",
    "situationType": "string", 
    "attempted": "string",
    "urgency": "boolean",
    "userNotes": "string"
  },
  "messages": [
    {
      "role": "user|assistant|system",
      "content": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response content",
  "isCrisis": false,
  "isMedical": false
}
```

### POST /summarize

Creates a one-page summary of a coaching session.

**Request Body:**
```json
{
  "sessionId": "string",
  "messages": [
    {
      "role": "user|assistant|system",
      "content": "string"
    }
  ]
}
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key

## Implementation Notes

- The server should inject the system prompt from `/prompts/coach-system-prompt.txt`
- Implement rate limiting per user
- Log only anonymized metadata
- Validate all inputs
- Handle safety and medical content filtering
- Stream responses for better UX
