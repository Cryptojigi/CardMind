# CardMind AI 🧠

**An intelligent multi-agent assistant for PSA-graded Pokémon card collectors**, built with real integration to the Renaiss ecosystem.

Trading card markets are currently fragmented, lacking real-time liquidity signals and transparent valuations. CardMind solves this by combining multi-agent AI analysis with live blockchain metrics, turning static card collections into dynamic, data-driven portfolios.

![CardMind Preview](./public/logo.png) <!-- Note: Feel free to replace this logo with a full screenshot of the dashboard! -->

## 🌟 Features
- **Smart Scanning**: Scan graded cards via image upload or certification number.
- **Renaiss API Integration**: Get real-time valuations, liquidity scores, and market insights powered by the Renaiss Index API.
- **On-Chain Verification**: View tokenized versions of your physical cards with direct BscScan links.
- **Wallet Integration**: Connect your Web3 wallet to merge your local scans with your actual on-chain holdings.
- **AI Advisor**: Context-aware chat that understands your portfolio and gives buy/hold/sell recommendations.

## 🏗️ Architecture & How It Works
1. **Input**: User uploads a card image or inputs a PSA cert number.
2. **AI Extraction**: Multi-agent system extracts text and identifies the specific Pokémon, set, and grade.
3. **Market Query**: We query the Renaiss API to fetch historical price data and real-time market signals.
4. **Blockchain Link**: The system queries the corresponding token ID and links the physical asset to its on-chain representation on the BNB Smart Chain.

## 🛠️ Tech Stack
- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 (Custom dark mode & neon aesthetics)
- **Data Visualization**: Recharts
- **Web3**: Ethers.js / Wallet Connection
- **Data Provider**: Renaiss Index API integration

## 🚀 How to Run Locally

We built this with a graceful fallback system. **No API keys are required to test the UI!**

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

*Note: Out-of-the-box, the app uses high-quality mock data so judges and developers can test all features instantly. To use live production data, you can configure your Renaiss API key.*

## 🏆 Important Notes for Judges

- The app uses the **real Renaiss Index API** for fetching market data and on-chain links when available.
- When rate limits are hit or the network fails, the app gracefully falls back to demo data (this is clearly labeled throughout the UI with an indicator).
- All AI chat responses are highly contextualized, pulling from the user's active scans and portfolio data.
- **Aesthetic Focus**: We spent significant time ensuring the UX/UI feels premium, snappy, and fully mobile-responsive.

## 🎯 Built For

**Renaiss Tech Hackathon Season 1** – AI, Game & Tool Sprint

## 📄 License

MIT
