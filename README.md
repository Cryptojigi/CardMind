# CardMind AI

**An intelligent multi-agent assistant for PSA-graded Pokémon card collectors**, built with real integration to the Renaiss ecosystem.

## Features
- Scan graded cards via image upload or certification number
- Get real-time valuations and market insights via Renaiss Index API
- View on-chain tokenized versions (BscScan links)
- Connect wallet to see your actual on-chain holdings
- Context-aware AI advisor chat
- Dual portfolio system (Local + On-chain)

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Recharts
- Web3 wallet connection
- Renaiss Index API integration

## Demo
[Add live link here once deployed]

## How to Run Locally
Open your terminal in the project root and run:

```bash
npm install
npm run dev
```

## Important Notes for Judges

- The app uses the **real Renaiss Index API** when available.
- When rate limits are hit, it gracefully falls back to high-quality demo data (clearly labeled with a "Demo Mode" indicator).
- All AI responses include context from your scans and portfolio.
- Mock/fallback data is transparently labeled throughout the app.

## Built For

Renaiss Tech Hackathon Season 1 – AI, Game & Tool Sprint

## License

MIT
