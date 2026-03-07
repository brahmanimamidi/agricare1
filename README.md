# 🌾 AgriCare — AI-Powered Farming Assistant

<div align="center">

![AgriCare Banner](https://img.shields.io/badge/AgriCare-AI%20Farming%20Assistant-2d6a2d?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

**Empowering Every Indian Farmer with the Power of AI**

*Multilingual • Voice Enabled • AI Powered • Built for India 🇮🇳*

</div>

---

## 📖 About AgriCare

AgriCare is a comprehensive AI-powered agricultural advisory 
web application built specifically for Indian farmers. 
It bridges the gap between modern artificial intelligence 
and traditional Indian farming by providing expert 
agricultural knowledge in regional languages — 
Telugu, Hindi, and English.

Unlike generic AI tools, AgriCare is purpose-built for 
Indian farming conditions with real soil datasets, 
region-specific advice, local medicine recommendations, 
and voice interaction designed for farmers who may not 
be comfortable with text-based interfaces.

---

## ✨ Features

### 🌱 1. Smart Crop Advisory (NPK Based)
- Enter soil nutrients: Nitrogen (N), Phosphorus (P), 
  Potassium (K), Temperature, Humidity, pH, Rainfall
- AI matches your soil data against 2,200 real crop 
  records using nearest-neighbor algorithm
- Returns top 5 best matching crops with confidence %
- Shows NPK values, climate requirements per crop
- Powered by real Kaggle agricultural dataset

### 📍 2. Location Based Crop Advisory
- Enter your city name and crop you want to grow
- AI analyzes local climate, soil type, rainfall patterns
- Gives YES / NO / MAYBE verdict with explanation
- Shows climate match percentage, expected yield,
  key challenges, recommended fertilizers
- "Best Crops for My Location" shows top 5 crops 
  suited for your city and season
- Specific to Indian cities and farming conditions

### 🏛️ 3. Government Schemes Finder
- Enter your crop and location
- AI fetches relevant central and state government schemes
- Shows PM-KISAN, crop insurance, fertilizer subsidies
- Displays eligibility, how to apply, benefit amounts
- Direct links to official government portals

### 🔬 4. Disease Detection (Image Based)
- Upload a photo of your crop leaf
- Gemini Vision AI analyzes the image
- Identifies crop type automatically
- Detects disease, pest damage or confirms healthy
- Provides complete treatment plan with:
  * Disease name and severity
  * Medicine names and dosage (Indian brands)
  * Fertilizer recommendations
  * Organic alternatives
  * Prevention tips

### 🩺 5. Disease Detection (Symptom Based)
- Select your crop from 38+ options
- Choose symptoms from 25 common symptoms
- AI identifies most likely disease
- Complete treatment advisory in your language
- Follow-up question support

### 🤖 6. AgriBot — AI Farming Assistant
- Conversational AI chatbot for farming queries
- Answers questions about crops, diseases, weather,
  farming techniques, market prices
- Maintains conversation context
- Quick suggestion pills for common questions
- Farming-only responses (redirects off-topic queries)

### 🎤 7. Voice Interaction
- Click microphone to speak your question
- Supports Telugu, Hindi, English voice input
- Live transcription shown as you speak
- Auto-sends after speech ends
- AgriBot responds with both text AND voice
- Natural Indian language voices via Sarvam AI
- Telugu, Hindi voices sound natural (not American accent)
- Click speaker icon on any message to replay

### 🌤️ 8. Live Weather Widget
- Automatic weather fetch for entered city
- Shows temperature, humidity, rainfall, wind speed
- Real-time farming tip based on weather
- "Rain detected — avoid pesticide spraying today"
- Powered by OpenWeatherMap API

### 🌍 9. Multilingual Support
- Complete app in 3 languages:
  * English
  * हिंदी (Hindi)
  * తెలుగు (Telugu)
- All AI responses in selected language
- Voice input and output in selected language
- Seamless language switching

### 📤 10. Share Results
- Share crop recommendations via WhatsApp, 
  Telegram, SMS, Gmail and more
- Native share sheet on mobile devices
- Clipboard copy fallback on desktop

---

## 🛠️ Technical Stack

| Category | Technology |
|----------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL) |
| Build Tool | Vite |
| Deployment | Vercel |
| Voice Input | Web Speech API (Browser Native) |
| Canvas Animation | HTML5 Canvas API |

---

## 🔌 APIs & Services

| Service | Purpose | Website |
|---------|---------|---------|
| Google Gemini AI | Disease detection, crop advisory, chatbot, location analysis | [aistudio.google.com](https://aistudio.google.com) |
| Sarvam AI | Natural Indian language Text-to-Speech (Telugu, Hindi, English) | [sarvam.ai](https://sarvam.ai) |
| Supabase | Real-time database storing 2,200 crop records | [supabase.com](https://supabase.com) |
| OpenWeatherMap | Live weather data for farming advice | [openweathermap.org](https://openweathermap.org) |
| Web Speech API | Browser-native voice recognition (free) | [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) |

---

## 📊 Dataset

| Dataset | Source | Size |
|---------|--------|------|
| Crop Recommendation Dataset | Kaggle | 2,200 records, 22 crops |
| PlantVillage Disease Dataset | Kaggle | 87,000 images, 38 classes |

**Crop Recommendation Dataset columns:**
N, P, K, temperature, humidity, ph, rainfall, label

**Crops covered:** Rice, Maize, Chickpea, Wheat, Coffee, 
Cotton, Jute, Coconut, Papaya, Orange, Apple, Muskmelon, 
Watermelon, Grapes, Mango, Banana, Pomegranate, Lentil, 
Blackgram, Mungbean, Mothbeans, Pigeonpeas (22 crops)

---

## 🏗️ Project Structure

```text
agribloom-companion/
├── src/
│   ├── components/       # Reusable UI components (ChatBubble, etc.)
│   ├── context/          # React Context providers (LanguageContext, etc.)
│   ├── hooks/            # Custom React hooks (useSpeechSynthesis, useToast)
│   ├── i18n/             # Translations dictionary (EN, HI, TE)
│   ├── lib/              # External library clients (Supabase setup)
│   ├── pages/            # Main application screens (AgriBot, CropAdvisory, etc.)
│   ├── services/         # API integrations (Gemini, Supabase, Sarvam, Weather)
│   ├── types/            # Global TypeScript interfaces
│   ├── utils/            # Helper functions (shareResults)
│   ├── App.tsx           # Application router and layout
│   └── main.tsx          # React complete entry point
├── .env                  # API keys and environment variables
├── package.json          # Project dependencies & scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript compiler options
└── vite.config.ts        # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/AKHI1630/agribloom-companion.git

# Navigate to project
cd agribloom-companion

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SARVAM_API_KEY=your_sarvam_api_key
VITE_WEATHER_API_KEY=your_openweathermap_key
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

App is deployed on Vercel.
Add all environment variables in Vercel dashboard
before deploying.
```bash
npm run build
```

---

## 🎯 Why AgriCare is Unique

1. **Real Dataset** — Crop recommendations from 
   2,200 real soil records, not just AI guessing

2. **Indian Specific** — Local climate, Indian medicine 
   brands, regional crop knowledge

3. **Voice First** — Natural Telugu and Hindi voices 
   via Sarvam AI (India's own TTS engine)

4. **Accessible** — No technical knowledge needed,
   farmers just speak or tap

5. **Multiple AI Models** — Gemini for text/vision,
   Sarvam for voice, custom algorithm for NPK matching

6. **Government Integration** — Shows actual schemes
   with eligibility and direct portal links

---

## 👥 Team

Built with ❤️ for Indian Farmers

**Institution:** GITAM University, Visakhapatnam
**Event:** [Hackathon Name]

---

## 📄 License

MIT License — Free to use and modify

---

## 🙏 Acknowledgements

- Google Gemini AI for powerful language understanding
- Sarvam AI for natural Indian language voices  
- Supabase for real-time database
- OpenWeatherMap for weather data
- Kaggle community for agricultural datasets
- PlantVillage for disease image dataset

---

<div align="center">
Made with ❤️ for Indian Farmers 🇮🇳
</div>
