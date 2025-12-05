# API Requirements for BloomboxAI

## 📋 Summary

**REQUIRED for Asset Generation:**
- At least ONE AI image generation API (OpenAI, Stability AI, or Replicate)

**OPTIONAL for Enhanced Features:**
- OpenAI GPT-4 API (for enhanced brand analysis and prompt optimization)

**NO API NEEDED for:**
- Basic brand extraction (colors, fonts, logos from websites)
- Brand kit management
- UI functionality

---

## 🔴 REQUIRED APIs

### For Asset Generation (Choose ONE)

You MUST have at least one of these APIs configured for asset generation to work:

#### Option 1: OpenAI DALL-E 3 ⭐ (Recommended)
- **API:** OpenAI Images API
- **Model:** DALL-E 3
- **Cost:** ~$0.04 per image
- **Quality:** Highest quality, best results
- **Get Key:** https://platform.openai.com/api-keys
- **Setup:**
  ```env
  OPENAI_API_KEY=sk-your-key-here
  ```

#### Option 2: Stability AI
- **API:** Stability AI API
- **Model:** Stable Image Core
- **Cost:** Varies by plan
- **Quality:** High quality, fast generation
- **Get Key:** https://platform.stability.ai/
- **Setup:**
  ```env
  STABILITY_API_KEY=sk-your-key-here
  ```

#### Option 3: Replicate
- **API:** Replicate API
- **Model:** Flux (or other models)
- **Cost:** Pay per use
- **Quality:** Good quality, multiple model options
- **Get Token:** https://replicate.com/account/api-tokens
- **Setup:**
  ```env
  REPLICATE_API_TOKEN=r8_your-token-here
  ```

**Note:** The system tries providers in order (OpenAI → Stability → Replicate) and uses the first available one.

---

## 🟡 OPTIONAL APIs

### OpenAI GPT-4 (For Enhanced Features)

**What it enhances:**
- Brand style analysis (more accurate, AI-powered insights)
- Prompt optimization (better prompt enhancement for image generation)
- Brand personality detection

**Without GPT-4:**
- Brand extraction still works (uses rule-based analysis)
- Prompt enhancement still works (uses rule-based enhancement)
- All features functional, just less AI-powered

**Setup:**
```env
OPENAI_API_KEY=sk-your-key-here
```
(Same key as DALL-E 3 - one key works for both!)

---

## ✅ What Works WITHOUT Any APIs

These features work completely without any API keys:

1. **Brand Extraction (Basic)**
   - Extracts colors from CSS
   - Extracts fonts from HTML/CSS
   - Finds logos
   - Works without any API

2. **Brand Kit Management**
   - Save brand kits
   - View brand kits
   - Delete brand kits
   - All CRUD operations work

3. **UI/UX**
   - All interface elements
   - Navigation
   - Forms and inputs

---

## 🚫 What DOESN'T Work Without APIs

**Asset Generation:**
- Will return error: "No AI image generation service configured"
- Cannot generate images without at least one AI service API key

**Enhanced Brand Analysis:**
- Falls back to rule-based analysis (still works, just less intelligent)
- No AI-powered brand personality detection
- No AI recommendations

---

## 💰 Cost Estimates

### OpenAI DALL-E 3
- **Standard Quality:** $0.04 per image (1024x1024)
- **HD Quality:** $0.08 per image (1024x1024)
- **GPT-4 (if used):** ~$0.01-0.03 per analysis

### Stability AI
- **Free Tier:** Limited credits
- **Paid Plans:** Varies, check their pricing

### Replicate
- **Pay per use:** ~$0.002-0.01 per image (varies by model)

---

## 🎯 Recommended Setup

**For Production:**
```env
OPENAI_API_KEY=sk-your-key-here
```
This gives you:
- ✅ DALL-E 3 image generation (best quality)
- ✅ GPT-4 brand analysis (if implemented)
- ✅ GPT-4 prompt enhancement (if implemented)
- ✅ Single API key for everything

**For Development/Testing:**
- Start with OpenAI (easiest setup)
- Or use Replicate for lower costs during testing

---

## 🔧 Setup Instructions

1. Create `.env` file in root directory
2. Add at least ONE API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Restart development server:
   ```bash
   npm run dev
   ```
4. Test asset generation - it should work!

---

## ❓ FAQ

**Q: Do I need all three APIs?**
A: No! Just ONE is required for asset generation.

**Q: Can I use multiple APIs?**
A: Yes! The system will try them in order and use the first available one.

**Q: What if I don't add any API key?**
A: Brand extraction works, but asset generation will fail with an error.

**Q: Is there a free option?**
A: Some providers offer free tiers with limited credits. Check each provider's website.

**Q: Can I test without an API key?**
A: Yes, brand extraction works. Asset generation will show an error message explaining what's needed.


