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
    console.warn("API Rate limit hit (429). Falling back to demo data.");
    return {
      ...mockCards[0],
      id: `scan_img_mock_${Date.now()}`,
      isMockFallback: true,
    };
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
    console.warn("API Rate limit hit (429). Falling back to demo data.");
    return {
      ...mockCards[0],
      id: `scan_cert_mock_${Date.now()}`,
      isMockFallback: true,
    };
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
    console.warn("API Rate limit hit (429). Falling back to demo data.");
    return {
      ...mockCards[0],
      id: `scan_token_mock_${Date.now()}`,
      isMockFallback: true,
    };
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
