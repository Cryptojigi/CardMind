# CardMind AI 🧠

**An intelligent multi-agent assistant for PSA-graded Pokémon card collectors**, built with real integration to the Renaiss ecosystem.

Trading card markets are currently fragmented, lacking real-time liquidity signals and transparent valuations. CardMind solves this by combining multi-agent AI analysis with live blockchain metrics, turning static card collections into dynamic, data-driven portfolios.

![CardMind Preview](./public/landing.png)

## 🌟 Features
- **Smart Scanning**: Scan graded cards via image upload or certification number.
- **Full Localization (English & 中文)**: Seamless UI and dynamic AI response translation for Mandarin Chinese users.
- **Custom Web3 Wallet Integration**: Connect seamlessly via MetaMask, OKX, Binance, Trust Wallet, and TokenPocket with intelligent mobile deep-linking support.
- **On-Chain Verification**: View tokenized versions of your physical cards with direct BscScan links and live portfolio fetching via ethers.js.
- **Renaiss API Integration**: Get real-time valuations, liquidity scores, and market insights powered by the Renaiss Index API.
- **Intelligent Error Handling**: Fully customized in-app toast notifications for rate-limiting, wallet errors, and API timeouts.
- **AI Advisor**: Context-aware chat (in your native language) that understands your portfolio and gives buy/hold/sell recommendations.

## 🏗️ Architecture & How It Works
1. **Input**: User uploads a card image or inputs a PSA cert number.
2. **AI Extraction**: Multi-agent system extracts text and identifies the specific Pokémon, set, and grade.
3. **Market Query**: We query the Renaiss API to fetch historical price data and real-time market signals.
4. **Blockchain Link**: The system queries the corresponding token ID and links the physical asset to its on-chain representation on the BNB Smart Chain.
5. **Localization Context**: A React context provider passes language state to the UI and injects system instructions into the LLM prompts for native translation.

## 🛠️ Tech Stack
- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 (Custom dark mode & neon aesthetics)
- **Data Visualization**: Recharts
- **Web3**: Ethers.js v6 / Custom Wallet Selector Modal
- **Data Provider**: Renaiss Index API integration

## 🚀 How to Run Locally

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

*Note: Out-of-the-box, the app connects to the real Renaiss Index API. If rate limits are hit or the network fails, the app uses an intelligent toast notification system to alert the user without crashing.*

## 🏆 Important Notes for Judges

- The app uses the **real Renaiss Index API** for fetching market data and on-chain links when available.
- **No Mock Fallbacks**: We replaced all simulated API mocks with production-ready error handling and toast notifications.
- All AI chat responses are highly contextualized, pulling from the user's active scans and portfolio data, and support dynamic translation.
- **Aesthetic Focus**: We spent significant time ensuring the UX/UI feels premium, snappy, and fully mobile-responsive.

## 🎯 Built For

**Renaiss Tech Hackathon Season 1** – AI, Game & Tool Sprint

## 🔗 Links

- **X (Twitter)**: [https://x.com/CardMindAI](https://x.com/CardMindAI)
- **GitHub**: [https://github.com/Cryptojigi/CardMind](https://github.com/Cryptojigi/CardMind)

## 📄 License

MIT
