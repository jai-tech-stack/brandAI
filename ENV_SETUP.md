# AI Service Configuration Guide

BloomboxAI requires at least one AI service API key for autonomous operation.

## Required: Add AI Service API Key

Create a `.env` file in the root directory and add at least one of these:

### Option 1: OpenAI DALL-E 3 (Recommended - Best Quality)
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```
Get your key at: https://platform.openai.com/api-keys

### Option 2: Stability AI (Alternative)
```env
STABILITY_API_KEY=sk-your-stability-api-key-here
```
Get your key at: https://platform.stability.ai/

### Option 3: Replicate (Alternative - Multiple Models)
```env
REPLICATE_API_TOKEN=r8_your-replicate-token-here
```
Get your token at: https://replicate.com/account/api-tokens

## Without API Key

If no API key is configured, asset generation will return an error. Brand extraction will still work but without AI-powered style analysis.

## Testing

After adding your API key, restart the development server:
```bash
npm run dev
```

Then test asset generation - it should now work autonomously with real AI!

