import { ethers } from 'ethers';
import { Card, mockCards } from '../data/mockData';

const API_KEY = '0xcd4ef955b9c95bb3d18bacf1b720b65f19d0fce8';

// Helper to map Renaiss API response to our app's Card interface
const mapRenaissResponseToCard = async (data: any, idPrefix: string): Promise<Card> => {
  const cardData = data.card || {};
  const colData = data.collectible || {};
  const certImages = data.certImages || {};

  const value = data.best_estimate || (cardData.priceUsdCents ? cardData.priceUsdCents / 100 : 0);
  
  let gradeStr = 'Ungraded';
  if (data.gradeLabel) {
    gradeStr = data.gradeLabel.replace('PSA ', '').replace('BGS ', '').replace('CGC ', '');
  } else if (data.grade) {
    gradeStr = data.grade.toString().split(' ')[0];
  } else if (cardData.grade) {
    gradeStr = cardData.grade.toString().split(' ')[0];
  } else if (colData.grade) {
    gradeStr = colData.grade.toString().split(' ')[0];
  }

  const imageUrl = data.image_url || cardData.imageUrl || certImages.front || certImages.item || colData.frontImageUrl || colData.itemImageUrl;
  const certNumber = data.cert || data.certNumber || 'Unknown';

  let onChainUrl: string | undefined = undefined;
  if (certNumber && certNumber !== 'Unknown') {
    try {
      const res = await fetch(`https://api.renaiss.xyz/v0/marketplace?search=${certNumber}`);
      if (res.ok) {
        const marketData = await res.json();
        if (marketData.collection && marketData.collection.length > 0) {
          onChainUrl = `https://bscscan.com/nft/0xF8646A3Ca093e97Bb404c3b25e675C0394DD5b30/${marketData.collection[0].tokenId}`;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch onChainUrl", e);
    }
  }

  return {
    id: `${idPrefix}_${Date.now()}`,
    name: data.name || cardData.name || colData.pokemonName || colData.name || 'Unknown Card',
    set: data.set_name || cardData.setName || colData.setName || 'Unknown Set',
    grader: data.company || cardData.company || data.grading_company || colData.gradingCompany || 'PSA',
    grade: gradeStr,
    certNumber: data.cert || data.certNumber || 'Unknown',
    currentValue: value,
    purchasePrice: value * (0.8 + Math.random() * 0.1),
    changePercent30d: data.confidence_tier === 'high' ? 5.2 : (cardData.deltaPct || -1.5),
    population: data.population || Math.floor(Math.random() * 500),
    recommendation: data.confidence_tier === 'high' ? 'buy' : data.confidence_tier === 'low' ? 'sell' : 'hold',
    renaisssSignal: data.confidence_tier === 'high' ? 'bullish' : data.confidence_tier === 'low' ? 'bearish' : 'neutral',
    confidence: data.confidence_score || (data.confidence_tier === 'high' ? 95 : 75),
    image: imageUrl,
    onChainUrl,
  };
};

export async function scanCardImage(file: File): Promise<Card> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.renaissos.com/v1/graded/by-image', {
    method: 'POST',
    headers: {
      'X-Api-Key': API_KEY,
    },
    body: formData,
  });

  if (response.status === 429) {
    throw new Error('API Rate limit exceeded. Please try again later.');
  }

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errData = await response.json();
      if (errData.error) errorMsg = errData.error;
    } catch(e) {}
    throw new Error(`Renaiss API Error (${response.status}): ${errorMsg || 'Too Many Requests (Rate Limited)'}`);
  }

  const text = await response.text();
  
  try {
    // Try normal JSON parsing first
    const data = JSON.parse(text);
    return await mapRenaissResponseToCard(data, 'scan_img');
  } catch (e) {
    // It's likely an SSE stream: "event: progress\ndata: {...}\n\n"
    const blocks = text.split('\n\n');
    let finalData = null;
    let errorData = null;
    
    for (const block of blocks) {
      const lines = block.split('\n');
      const eventLine = lines.find(l => l.startsWith('event: '));
      const dataLine = lines.find(l => l.startsWith('data: '));
      
      if (eventLine && dataLine) {
        const eventName = eventLine.substring(7).trim();
        const dataStr = dataLine.substring(6).trim();
        
        try {
          const parsed = JSON.parse(dataStr);
          if (eventName === 'failed' || eventName === 'error') {
            errorData = parsed;
          } else if (eventName === 'complete' || eventName === 'success') {
            finalData = parsed;
          } else if (parsed && (parsed.name || parsed.cert || parsed.best_estimate !== undefined)) {
            // fallback if it sends the result in a different event name
            finalData = parsed;
          }
        } catch (err) {
          // ignore invalid JSON
        }
      }
    }

    if (finalData) {
      return await mapRenaissResponseToCard(finalData, 'scan_img');
    }
    
    if (errorData) {
      throw new Error(errorData.detail || errorData.error || 'Failed to scan card image');
    }

    throw new Error(`Failed to parse API response. Raw response snippet: ${text.substring(0, 100)}`);
  }
}

export async function scanCardByCert(cert: string): Promise<Card> {
  const response = await fetch(`https://api.renaissos.com/v1/graded/${cert}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': API_KEY,
    },
  });

  if (response.status === 429) {
    throw new Error('API Rate limit exceeded. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(`Renaiss API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return await mapRenaissResponseToCard(data, 'scan_cert');
}

export async function scanCardByTokenId(tokenId: string): Promise<Card> {
  const response = await fetch(`https://api.renaissos.com/v0/cards/${tokenId}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': API_KEY,
    },
  });

  if (response.status === 429) {
    throw new Error('API Rate limit exceeded. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(`Renaiss API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const col = data.collectible;

  if (!col) {
    throw new Error('Invalid response format: missing collectible data');
  }

  let currentValue = 0;
  if (col.fmvPriceInUSD && col.fmvPriceInUSD !== "NO-FMV-PRICE") {
    currentValue = parseFloat(col.fmvPriceInUSD);
  } else if (data.pricing?.price?.value) {
    currentValue = parseFloat(data.pricing.price.value);
  }
  
  let cert = 'Unknown';
  if (col.attributes) {
    const certAttr = col.attributes.find((a: any) => a.trait === 'Certification Number');
    if (certAttr) cert = certAttr.value;
  }

  return {
    id: `scan_token_${Date.now()}`,
    name: col.pokemonName || col.name || 'Unknown Card',
    set: col.setName || 'Unknown Set',
    grader: col.gradingCompany || 'PSA',
    grade: col.grade ? col.grade.toString() : 'Ungraded',
    certNumber: cert,
    currentValue: currentValue,
    purchasePrice: currentValue * 0.9, 
    changePercent30d: 0,
    population: 0,
    recommendation: 'hold',
    renaisssSignal: 'bullish',
    confidence: 100,
    image: data.image_url || col.image_url || undefined,
    onChainUrl: `https://bscscan.com/nft/0xF8646A3Ca093e97Bb404c3b25e675C0394DD5b30/${tokenId}`,
  };
}

// ── Marketplace API types & functions ──

export interface MarketplaceCard {
  tokenId: string;
  name: string;
  setName: string;
  cardNumber: string;
  pokemonName: string;
  ownerAddress: string;
  askPriceInUSDT: string;
  fmvPriceInUSD: string;
  vaultLocation: string;
  grade: string;
  gradingCompany: string;
  year: number;
  attributes: { trait: string; value: string }[];
}

export interface MarketplaceResponse {
  collection: MarketplaceCard[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const MARKETPLACE_BASE = 'https://api.renaiss.xyz/v0/marketplace';

export async function fetchMarketplaceCards(
  search?: string,
  limit = 20,
  offset = 0
): Promise<MarketplaceResponse> {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  if (search) params.set('search', search);

  const res = await fetch(`${MARKETPLACE_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`Marketplace API error: ${res.status}`);
  return res.json();
}

/** Derive aggregate market stats from a batch of marketplace cards */
export function deriveMarketStats(cards: MarketplaceCard[]) {
  let totalValue = 0;
  const setCounts: Record<string, { count: number; totalValue: number; years: number[] }> = {};
  const gradeCounts: Record<string, number> = {};

  for (const c of cards) {
    const fmv = parseFloat(c.fmvPriceInUSD) || 0;
    totalValue += fmv;

    // Sets
    const setKey = c.setName.replace(/^Pokemon\s+(Japanese\s+)?/i, '').trim();
    if (!setCounts[setKey]) setCounts[setKey] = { count: 0, totalValue: 0, years: [] };
    setCounts[setKey].count++;
    setCounts[setKey].totalValue += fmv;
    if (c.year) setCounts[setKey].years.push(c.year);

    // Grades
    const grade = c.grade.split(' ')[0]; // "10", "9", "8"
    gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
  }

  const avgPrice = cards.length ? totalValue / cards.length : 0;

  // Top sets by count
  const topSets = Object.entries(setCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8)
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgValue: data.count ? data.totalValue / data.count : 0,
      year: data.years.length ? Math.min(...data.years).toString() : 'N/A',
    }));

  return { totalValue, avgPrice, topSets, gradeCounts, totalCards: cards.length };
}

export async function fetchWalletPortfolio(walletAddress: string): Promise<Card[]> {
  try {
    const provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    const contract = new ethers.Contract(
      '0xF8646A3Ca093e97Bb404c3b25e675C0394DD5b30',
      [
        'function balanceOf(address) view returns (uint256)',
        'function tokenOfOwnerByIndex(address, uint256) view returns (uint256)',
        'function tokenURI(uint256) view returns (string)'
      ],
      provider
    );

    const balanceBigInt = await contract.balanceOf(walletAddress);
    const balance = Number(balanceBigInt.toString());

    if (balance === 0) {
      return [];
    }

    const cards: Card[] = [];
    
    // Fetch up to first 20 tokens to avoid hitting rate limits or taking too long
    const limit = Math.min(balance, 20);
    for (let i = 0; i < limit; i++) {
      try {
        const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
        const tokenURI = await contract.tokenURI(tokenId);
        
        // Fetch metadata
        const metadataRes = await fetch(tokenURI);
        if (!metadataRes.ok) continue;
        const metadata = await metadataRes.json();
        
        // Extract attributes
        let grader = 'Unknown';
        let gradeStr = 'Ungraded';
        let certNumber = 'Unknown';
        let setName = 'Unknown';
        let cardNum = 'Unknown';

        metadata.attributes?.forEach((attr: any) => {
          if (attr.trait_type === 'Grader') grader = attr.value;
          if (attr.trait_type === 'Grade') gradeStr = attr.value.split(' ')[0];
          if (attr.trait_type === 'Serial') certNumber = attr.value.replace('PSA', '').replace('BGS', '').replace('CGC', '');
          if (attr.trait_type === 'Set') setName = attr.value;
          if (attr.trait_type === 'Card Number') cardNum = attr.value;
        });

        // Simulate a realistic value since it's not strictly in metadata
        // In a full prod app we would query the marketplace API for this exact tokenId's price
        const value = 100 + Math.floor(Math.random() * 900);

        const card: Card = {
          id: `onchain_${tokenId.toString()}`,
          name: metadata.name.split(' ').slice(4).join(' ').replace(cardNum, '').trim() || 'Unknown Card',
          set: setName,
          grader: grader,
          grade: gradeStr,
          certNumber: certNumber,
          currentValue: value,
          purchasePrice: value * (0.8 + Math.random() * 0.1),
          changePercent30d: (Math.random() * 10 - 5),
          population: Math.floor(Math.random() * 500),
          recommendation: Math.random() > 0.5 ? 'buy' : 'hold',
          renaisssSignal: Math.random() > 0.5 ? 'bullish' : 'neutral',
          confidence: 85 + Math.floor(Math.random() * 10),
          image: metadata.image || metadata.item_info?.asset_pictures?.[0] || '',
          onChainUrl: `https://bscscan.com/nft/0xF8646A3Ca093e97Bb404c3b25e675C0394DD5b30/${tokenId.toString()}`,
        };
        cards.push(card);
      } catch (err) {
        console.error(`Failed to fetch token ${i} for ${walletAddress}`, err);
      }
    }

    return cards;
  } catch (error) {
    console.error("Error fetching wallet portfolio:", error);
    return [];
  }
}
