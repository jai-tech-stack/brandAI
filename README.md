# BloomboxAI - Agentic AI for On-Brand Asset Generation

BloomboxAI is the world's first Agentic AI for brand assets. This autonomous AI agent automatically extracts your brand's visual identity from any website—logo, colors, typography, and style—then generates any brand asset you need, always perfectly on-brand.

## 🎨 Key Features (All Powered by Autonomous AI Agents)

- **Automatic Brand Extraction**: Autonomous AI agent analyzes websites to extract logo, colors, typography, and style automatically
- **On-Brand Asset Generation**: Agentic AI creates hiring posters, merch, marketing materials with perfect brand consistency
- **Simple Text Prompts**: Autonomous AI agent generates any brand asset with just a text description—no design skills needed
- **Multi-Brand Support**: AI agent works with multiple brands simultaneously
- **Instant Generation**: Agentic AI creates fully on-brand assets in seconds, not hours
- **Brand Kit Creation**: Autonomous AI agent automatically builds complete brand kits from website analysis

## 🚀 Getting Started

### Installation

```bash
npm install
```

### AI Service Configuration

BloomboxAI requires at least one AI service API key for autonomous operation. Copy `.env.example` to `.env` and add your API key:

```bash
cp .env.example .env
```

**Required:** Add at least one of these API keys to `.env`:

- **OpenAI DALL-E 3** (Recommended - Best quality)
  ```env
  OPENAI_API_KEY=sk-your-key-here
  ```

- **Stability AI** (Alternative)
  ```env
  STABILITY_API_KEY=sk-your-key-here
  ```

- **Replicate** (Alternative - Multiple models)
  ```env
  REPLICATE_API_TOKEN=r8_your-token-here
  ```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 🤖 How Autonomous AI Agents Work

### 1. Brand Extraction Agent
- Automatically fetches website HTML and CSS
- Intelligently extracts colors, fonts, and logos
- Uses AI analysis to determine brand style and personality
- Builds complete brand kits autonomously

### 2. Asset Generation Agent
- Enhances user prompts with brand constraints using AI
- Generates images using AI (DALL-E 3, Stability AI, or Replicate)
- Ensures perfect brand consistency automatically
- Works completely autonomously without manual intervention

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **OpenAI API** - AI image generation (DALL-E 3)
- **Stability AI** - Alternative AI image generation
- **Replicate** - Alternative AI image generation

## 📝 License

MIT

## 🎯 For Different Audiences

**Tech enthusiasts:** This is the future of AI-powered brand asset generation.

**Marketing teams:** Maintain perfect brand consistency across all assets effortlessly.

**Designers:** Generate on-brand assets instantly without manual brand guideline reference.

---

**Generate anything. Always on brand.** 🚀
