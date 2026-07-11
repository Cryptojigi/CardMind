const ja = {
  nav: {
    dashboard: 'ダッシュボード',
    scan: 'スキャン',
    portfolio: 'ポートフォリオ',
    market: 'マーケット',
    aiChat: 'AIチャット',
    connectWallet: 'ウォレット接続',
    fetching: '取得中...',
    scanCardBtn: '+ カードをスキャン',
    demoMode: 'デモモード',
    demoTooltip: 'デモモードが有効です - APIの制限によりシミュレートされたデータを使用しています'
  },
  landing: {
    poweredBy: 'Powered by Renaiss Index API (Beta)',
    theAIBrain: 'The AI Brain',
    forYour: 'for Your',
    typewriter: {
      cardCollection: 'Card Collection',
      pokemonCards: 'Pokémon Cards',
      tradingCards: 'Trading Cards'
    },
    subtitle: 'マルチエージェントAIでPSA鑑定済みポケモンカードをスキャン、評価、取引。リアルタイムの評価とRenaissエコシステムのシグナルを活用し、より賢い意思決定を。',
    launchApp: 'アプリを起動 →',
    scanCard: 'カードをスキャン',
    stats: {
      cardsValued: '評価されたカード',
      portfolioTracked: '追跡中のポートフォリオ',
      accuracyRate: '精度'
    },
    howItWorks: {
      title1: 'CardMind ',
      title2: 'AI',
      title3: ' の仕組み',
      step1Title: 'カードをスキャン',
      step1Desc: '写真をアップロードするか、ライブカメラを使用します。AIが瞬時にカード、グレード、PSA証明書を識別します。',
      step2Title: '即時評価を取得',
      step2Desc: 'Renaiss Index APIを活用したリアルタイムの市場分析。信頼度スコア、価格履歴、流動性シグナル。',
      step3Title: '賢明な決定',
      step3Desc: 'AIが生成した売買・保持の推奨。確信を持ってポートフォリオを構築しましょう。'
    },
    cta: {
      title1: '賢く収集を',
      title2: '始めますか？',
      desc: 'CardMind AIを使用してPSAポケモン市場でデータ主導の意思決定を行っている数千人のコレクターに参加しましょう。',
      btn: 'CardMind AIを起動 →'
    },
    footer: {
      builtWith: 'Built with Groq & Renaiss',
      poweredBy: 'Powered by Renaiss Index API (Beta)',
      disclaimer: '情報提供のみを目的としています。財務アドバイスではありません。市場データは遅れる場合があります。',
      copyright: '© 2026 CardMind AI. All rights reserved.'
    }
  },
  dashboard: {
    hero: {
      title1: 'スキャン。評価。',
      title2: 'より賢い決定を。',
      subtitle: 'PSA鑑定済みポケモンカードの評価、ポートフォリオの分析、RenaissシグナルのためのマルチエージェントAIアシスタント。',
      scanBtn: '⊙ カードをスキャン',
      portfolioBtn: '◈ ポートフォリオ'
    },
    stats: {
      totalValue: 'ポートフォリオ総額',
      cardsTracked: '追跡中のカード',
      psaGraded: 'PSA鑑定済み',
      signalStrength: 'Renaissシグナル強度',
      bullish: '強気',
      bearish: '弱気',
      neutral: '中立'
    },
    recentScans: {
      title: '最近のスキャン',
      viewAll: 'すべて見る →',
      empty: 'スキャン履歴がありません。カードをスキャンしてここに表示します。',
      noImage: '画像なし'
    },
    features: {
      renaissApi: 'Renaiss Index API',
      beta: 'Beta',
      renaissDesc: 'Renaissプラットフォームからのリアルタイムのオンチェーン市場シグナル、流動性スコア、エコシステムのアクティビティをカード評価に直接統合。',
      renaissWarning: '⚠ Renaiss APIデータはベータ版です。値は情報提供のみを目的としており、財務アドバイスを構成するものではありません。',
      aiChat: 'AIアドバイザーチャット',
      aiChatDesc: 'コレクションについて何でも質問してください。AIがリアルタイムの市場データ、ポートフォリオのコンテキスト、Renaissシグナルを取得してパーソナライズされたアドバイスを提供します。',
      startChatting: 'チャットを始める →'
    }
  },
  scanner: {
    title1: '鑑定済みカードを',
    title2: 'スキャン',
    subtitle: 'PSA鑑定済みポケモンカードの写真をアップロードして、AIによる即時評価を行います。',
    dropzone: {
      title: 'ここにカードの画像をドロップ',
      orClick: 'またはクリックしてファイルを参照',
      supports: 'JPG, PNG, WEBPに対応 — PSAスラブの写真が最適です'
    },
    actions: {
      uploadFile: 'ファイルをアップロード',
      jpgPng: 'JPG / PNG',
      manualEntry: 'トークンID / PSA証明書番号',
      enterManually: '手動で入力',
      enterTitle: 'トークンIDまたはPSA証明書番号を入力',
      cancel: 'キャンセル',
      placeholder: '例: 969156... または 12345678',
      scanBtn: 'スキャン'
    },
    sampleCards: {
      title: 'サンプルカードで試す:'
    },
    processing: {
      analysisComplete: '✓ 分析完了！',
      analyzing: 'AIエージェントで分析中...',
      redirecting: '結果にリダイレクトしています...',
      agentsWorking: '専門のエージェントが協力してカードを評価しています'
    },
    agents: {
      cardId: { name: 'カードIDエージェント', task: 'カード名、セット、バリエーションを識別中...' },
      gradeVerifier: { name: 'グレード検証エージェント', task: 'PSA証明書番号を読み取り中...' },
      marketAgent: { name: 'マーケットエージェント', task: 'リアルタイムの価格データを取得中...' },
      renaissAgent: { name: 'Renaissエージェント', task: 'エコシステムシグナルを取得中...' },
      valuationAgent: { name: '評価エージェント', task: '信頼度を考慮した評価を生成中...' }
    },
    footer: {
      poweredBy: 'Powered by Renaiss Index API (Public)',
      disclaimer: '評価には、リアルタイムのRenaissエコシステムシグナル、オンチェーンの市場活動、および流動性の深さデータが組み込まれています。情報提供のみを目的としています。'
    }
  },
  results: {
    noCard: {
      title: 'カードがスキャンされていません',
      desc: '結果を表示するには、まずカードをスキャンしてください。',
      btn: 'スキャナーへ'
    },
    header: {
      scanNew: '← 新しいカードをスキャン',
      title: 'カードの結果'
    },
    demoData: '強化されたデモデータを使用中（Renaiss APIのレート制限に達しました）',
    psa: {
      gemMt: 'GEM MT 10',
      mint: 'MINT',
      cert: 'Cert #'
    },
    actions: {
      added: '✓ ポートフォリオに追加済み',
      add: '◈ ポートフォリオに追加',
      askAi: '✦ AIに質問する',
      share: '↗ 共有 / エクスポート',
      viewBsc: '🔗 BscScanで表示'
    },
    metrics: {
      currentValue: '現在の市場価値',
      confidence: '信頼度',
      change30d: '30日間の変化',
      pnl: 'あなたの損益',
      popReport: 'POPレポート',
      priceHistory: '価格履歴 (7ヶ月)',
      noPriceHistory: 'このカードの価格履歴は利用できません',
      rarity: 'レアリティ',
      liquidityScore: '流動性スコア',
      popHigher: 'より高いグレードの数',
      noneApex: 'なし (最高峰)',
      grade: 'グレード'
    },
    renaiss: {
      title: 'Renaiss エコシステム インサイト',
      beta: 'BETA',
      signal: 'Renaissシグナル',
      liquidity: '流動性の深さ',
      onChain: 'オンチェーンステータス',
      veryHigh: '非常に高い',
      active: 'アクティブ',
      disclaimer: 'データはRenaissプロトコルの市場活動とオンチェーンの流動性プールから導出されています。'
    },
    aiRec: {
      title: 'AI レコメンデーション',
      confidenceText: 'AIの確信度',
      hold1: '',
      hold2: 'のPSA個体数がわずか',
      hold3: 'で、より上位のグレードが',
      hold4: '個であるため、この',
      hold5: 'は強いポジションにあります。30日間のモメンタムは',
      hold6: '%と安定しており、Renaissシグナルがそれを裏付けています。長期的な価値上昇のために保持をお勧めします。',
      buy: 'これは、強力なモメンタムと高い流動性に裏打ちされた絶好の購入機会です。',
      sell: '市場の指標は現在ピークにあることを示唆しています。利益を確定するために売却を検討してください。'
    }
  },
  portfolio: {
    header: {
      title: 'ポートフォリオ分析',
      subtitle: 'RenaissシグナルとAIインサイトを活用したコレクション'
    },
    metrics: {
      totalValue: '総額 (USD)',
      profit: '実現利益',
      cards: '合計カード数'
    },
    filters: {
      all: 'すべて',
      psa10: 'PSA 10',
      pokemon: 'ポケモン',
      trainer: 'トレーナー'
    },
    tabs: {
      gallery: 'ギャラリー',
      list: 'リスト',
      analytics: '分析'
    },
    table: {
      card: 'カード',
      grade: 'グレード',
      value: '価値',
      pnl: '損益',
      signal: 'シグナル'
    },
    analytics: {
      performance: 'ポートフォリオパフォーマンス',
      gradeDist: 'グレード分布',
      recent: '最近追加されたカード'
    },
    empty: {
      title: 'まだカードがありません',
      desc: 'カードのスキャンを開始してポートフォリオを構築しましょう。',
      btn: 'スキャナーへ'
    }
  },
  market: {
    header: {
      title: '市場のインサイト',
      subtitle: 'Renaissプロトコルを利用したリアルタイムのPSAカードデータとトレンド',
      live: 'LIVE',
      listings: 'リスト'
    },
    tabs: {
      trending: 'トレンド',
      sets: 'トップセット',
      renaiss: 'Renaissシグナル'
    },
    stats: {
      totalValue: '総市場価値',
      avgPrice: '平均カード価格'
    },
    search: {
      placeholder: 'カード、セット、またはポケモンの検索...'
    },
    trending: {
      table: {
        card: 'カード',
        grade: 'グレード',
        fmv: '推定価値 (FMV)',
        ask: '提示価格',
        premium: 'プレミアム',
        action: 'アクション'
      },
      view: '表示'
    },
    sets: {
      title: 'ボリュームによるトップセット',
      desc: 'Renaissネットワーク全体で最もアクティブなカードセット',
      gradeDist: 'グレード分布',
      gradeDesc: 'すべてのリストの品質の内訳'
    },
    renaissDetails: {
      title: 'エコシステムの健全性',
      desc: 'Renaissインデックスからの集計メトリクスとシグナル',
      m1: '総リスト数',
      m2: 'ロックされた総額',
      m3: 'アクティブセット'
    }
  },
  chat: {
    title: 'AIアドバイザー',
    online: 'オンライン',
    placeholder: 'コレクションについて質問してください...',
    typing: 'AIアドバイザーが入力中...',
    suggestions: {
      value: '私のコレクションの現在の価値は？',
      sell: '今売るべきカードは？',
      buy: '次に何を買うべき？'
    }
  }
};

export default ja;
