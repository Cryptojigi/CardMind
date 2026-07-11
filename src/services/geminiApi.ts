import { Card } from '../data/mockData';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const buildSystemPrompt = (portfolio: Card[], activeScan: Card | null): string => {
  let context = `You are CardMind AI, an expert multi-agent assistant for PSA-graded Pokémon card collectors. You specialize in card valuations, market analysis, portfolio management, and the Renaiss blockchain ecosystem.

PERSONALITY & RULES:
- You are knowledgeable, confident, and concise.
- Format responses with **bold** for key data points and headers.
- Use bullet points (•) for lists.
- Include specific numbers when discussing values, trends, and populations.
- Reference "Renaiss ecosystem signals" when discussing market sentiment.
- Keep responses focused — aim for 150-300 words max.
- End responses with a brief italic disclaimer like: *Powered by Renaiss Index API (Public) — For informational purposes only*
- Never say you are Llama, Meta, Groq, or a language model. You are CardMind AI.
- If asked about non-card topics, gently redirect to card collecting and trading.

`;

  if (portfolio.length > 0) {
    context += `USER'S PORTFOLIO (${portfolio.length} cards):\n`;
    portfolio.forEach(card => {
      context += `• ${card.name} — ${card.grader} ${card.grade} — Current Value: $${card.currentValue.toLocaleString()} — 30d Change: ${card.changePercent30d > 0 ? '+' : ''}${card.changePercent30d}% — Signal: ${card.renaisssSignal} — Recommendation: ${card.recommendation}\n`;
    });
    context += '\n';
  } else {
    context += `USER'S PORTFOLIO: Empty (no cards scanned yet). Encourage them to scan a card.\n\n`;
  }

  if (activeScan) {
    context += `MOST RECENT SCAN:\n`;
    context += `• ${activeScan.name} — ${activeScan.grader} ${activeScan.grade} (Cert #${activeScan.certNumber})\n`;
    context += `• Value: $${activeScan.currentValue.toLocaleString()} | 30d: ${activeScan.changePercent30d > 0 ? '+' : ''}${activeScan.changePercent30d}%\n`;
    context += `• Population: ${activeScan.population} | Signal: ${activeScan.renaisssSignal} | Confidence: ${activeScan.confidence}%\n\n`;
  }

  return context;
};

export const askGemini = async (
  userMessage: string,
  portfolio: Card[],
  activeScan: Card | null,
  chatHistory: { role: string; content: string }[] = []
): Promise<string> => {
  const systemPrompt = buildSystemPrompt(portfolio, activeScan);

  // Build conversation history (last 6 messages max)
  const recentHistory = chatHistory.slice(-6).map(msg => ({
    role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content,
  }));

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...recentHistory,
    { role: 'user' as const, content: userMessage },
  ];

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Groq API error:', response.status, errorData);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('No response text from Groq');
  }

  return text;
};
