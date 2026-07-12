const zh = {
  nav: {
    dashboard: '仪表板',
    scan: '扫描',
    portfolio: '投资组合',
    market: '市场',
    aiChat: 'AI 聊天',
    connectWallet: '连接钱包',
    fetching: '获取中...',
    scanCardBtn: '+ 扫描卡片',
    demoMode: '演示模式',
    demoTooltip: '演示模式启动 - 由于 API 速率限制，使用模拟数据'
  },
  landing: {
    poweredBy: '由 Renaiss Index API (Beta) 提供支持',
    theAIBrain: '您专属的',
    forYour: 'AI 大脑：',
    typewriter: {
      cardCollection: '卡片收藏',
      pokemonCards: '宝可梦卡',
      tradingCards: '集换式卡牌'
    },
    subtitle: '使用多智能体 AI 扫描、评估和交易经 PSA 评级的宝可梦卡片。即时估值、Renaiss 生态系统信号以及更明智的决策——尽在一个平台。',
    launchApp: '启动应用 →',
    scanCard: '扫描卡片',
    stats: {
      cardsValued: '已评估卡片',
      portfolioTracked: '追踪的投资组合',
      accuracyRate: '准确率'
    },
    howItWorks: {
      title1: 'CardMind ',
      title2: 'AI',
      title3: ' 是如何工作的',
      step1Title: '扫描您的卡片',
      step1Desc: '上传照片或使用实时摄像头。我们的多智能体 AI 会立即识别卡片、评级和 PSA 认证。',
      step2Title: '获取即时估值',
      step2Desc: '由 Renaiss Index API 提供支持的实时市场分析。置信度评分、价格历史和流动性信号。',
      step3Title: '做出更明智的决定',
      step3Desc: 'AI 生成的买入/持有/卖出建议和透明的理由。充满信心地建立您的投资组合。'
    },
    cta: {
      title1: '准备好更聪明地',
      title2: '收藏了吗？',
      desc: '加入成千上万使用 CardMind AI 在 PSA 宝可梦市场中做出数据驱动决策的收藏家行列。',
      btn: '启动 CardMind AI →'
    },
    footer: {
      builtWith: '由 Groq 和 Renaiss 构建',
      poweredBy: '由 Renaiss Index API (Beta) 提供支持',
      disclaimer: '仅供参考。非财务建议。市场数据可能会有延迟。',
      copyright: '© 2026 CardMind AI. 保留所有权利。'
    }
  },
  dashboard: {
    hero: {
      title1: '扫描。估值。',
      title2: '更明智的决策。',
      subtitle: '您的多智能体 AI 助手，提供 PSA 评级宝可梦卡片估值、投资组合情报以及 Renaiss 生态系统信号。',
      scanBtn: '⊙ 扫描卡片',
      portfolioBtn: '◈ 我的投资组合'
    },
    stats: {
      totalValue: '投资组合总价值',
      cardsTracked: '追踪的卡片',
      psaGraded: 'PSA 评级',
      signalStrength: 'Renaiss 信号强度',
      bullish: '看涨',
      bearish: '看跌',
      neutral: '中性'
    },
    recentScans: {
      title: '最近扫描',
      viewAll: '查看全部 →',
      empty: '还没有最近的扫描。扫描卡片以在这里查看。',
      noImage: '无图片'
    },
    features: {
      renaissApi: 'Renaiss Index API',
      beta: '测试版',
      renaissDesc: '来自 Renaiss 平台的实时链上市场信号、流动性评分和生态系统活动 — 直接整合到每次卡片估值中。',
      renaissWarning: '⚠ Renaiss API 数据处于测试阶段。价值仅供参考，不构成财务建议。',
      aiChat: 'AI 顾问聊天',
      aiChatDesc: '询问关于您的收藏的任何问题。我们的多智能体 AI 提取实时市场数据、投资组合背景和 Renaiss 信号，为您提供个性化建议。',
      startChatting: '开始聊天 →'
    }
  },
  scanner: {
    title1: '扫描您的',
    title2: '评级卡片',
    subtitle: '上传您的 PSA 评级宝可梦卡片封装盒照片，进行即时 AI 估值。',
    dropzone: {
      title: '将您的卡片图片拖放到此处',
      orClick: '或点击浏览文件',
      supports: '支持 JPG、PNG、WEBP — PSA 封装盒照片效果最佳'
    },
    actions: {
      uploadFile: '上传文件',
      jpgPng: 'JPG / PNG',
      manualEntry: 'Token ID / PSA 认证编号',
      enterManually: '手动输入',
      enterTitle: '输入 Token ID 或 PSA 认证编号',
      cancel: '取消',
      placeholder: '例如 969156... 或 12345678',
      scanBtn: '扫描'
    },
    sampleCards: {
      title: '尝试使用示例卡片：'
    },
    processing: {
      analysisComplete: '✓ 分析完成！',
      analyzing: '正在使用 AI 智能体分析...',
      redirecting: '正在重定向到结果...',
      agentsWorking: '我们的专业智能体正在协同工作，为您的卡片估值'
    },
    agents: {
      cardId: { name: '卡片识别智能体', task: '识别卡片名称、系列和变体...' },
      gradeVerifier: { name: '评级验证器', task: '读取 PSA 认证编号...' },
      marketAgent: { name: '市场智能体', task: '提取实时价格数据...' },
      renaissAgent: { name: 'Renaiss 智能体', task: '获取生态系统信号...' },
      valuationAgent: { name: '估值智能体', task: '生成置信度加权的估值...' }
    },
    footer: {
      poweredBy: '由 Renaiss Index API (Public) 提供支持',
      disclaimer: '估值结合了实时 Renaiss 生态系统信号、链上市场活动和流动性深度数据。仅供参考。'
    }
  },
  results: {
    noCard: {
      title: '未扫描卡片',
      desc: '请先扫描卡片以查看结果。',
      btn: '前往扫描仪'
    },
    header: {
      scanNew: '← 扫描新卡片',
      title: '卡片结果'
    },
    demoData: '使用增强的演示数据（已达到 Renaiss API 速率限制）',
    psa: {
      gemMt: 'GEM MT 10',
      mint: 'MINT',
      cert: '认证编号'
    },
    actions: {
      added: '✓ 已添加到投资组合',
      add: '◈ 添加到投资组合',
      askAi: '✦ 向 AI 询问这张卡片',
      share: '↗ 分享 / 导出',
      viewBsc: '🔗 在 BscScan 上查看'
    },
    metrics: {
      currentValue: '当前市场价值',
      confidence: '置信度',
      change30d: '30 天变化',
      pnl: '您的盈亏',
      popReport: '数量报告',
      priceHistory: '价格历史',
      rarity: '稀有度',
      liquidityScore: '流动性评分',
      popHigher: '更高评级数量',
      noneApex: '无 (顶级)',
      grade: '评级'
    },
    renaiss: {
      title: 'Renaiss 生态系统信号',
      beta: '测试版',
      signal: '信号',
      liquidity: '流动性',
      veryHigh: '极高',
      onChain: '链上',
      active: '活跃',
      disclaimer: 'Renaiss API 数据处于测试阶段。信号仅供参考，不构成财务建议。'
    },
    aiRec: {
      title: 'AI 建议',
      hold1: '这张 ',
      hold2: ' 只有 ',
      hold3: ' 张的存世量，且更高评级的有 ',
      hold4: ' 张，地位稳固。30 天动量强劲 (',
      hold5: '%)，Renaiss 信号也证实了这一情绪。建议持有以待长期升值。',
      hold6: '',
      buy: '强烈买入信号，具有高确信度。市场数据和 Renaiss 生态系统信号表现出积极的一致性。',
      sell: '建议谨慎。向下动量和看跌的 Renaiss 信号表明有进一步贬值的可能。',
      confidenceText: '置信度'
    }
  },
  portfolio: {
    header: {
      subtitle: '我的收藏',
      title1: '投资组合',
      title2: '智能',
      addBtn: '+ 添加卡片'
    },
    addModal: {
      title: '添加到投资组合',
      tabScans: '最近扫描',
      tabWallet: '钱包资产',
      btnAdd: '+ 添加',
      noScans: '没有可添加的最近扫描记录。',
      walletConnectText: '连接您的 Web3 钱包以同步代币化卡片资产。',
      walletConnectBtn: '连接钱包',
      walletSyncedEmpty: '钱包已同步！在此钱包中未找到代币化卡片。'
    },
    stats: {
      totalValue: '总价值',
      totalCost: '总成本',
      totalGain: '总收益',
      roi: '投资回报率'
    },
    charts: {
      perfTitle: '投资组合价值',
      divTitle: '多样化'
    },
    aiInsights: {
      title: 'AI 投资组合洞察',
      badge: '智能分析',
      i1: '喷火龙 PSA 10 占投资组合的 54%。为了风险管理，请考虑重新平衡。',
      i2: '烈空坐金星表现出最高的动量 (+8.9%)。Renaiss 信号强烈看涨。',
      i3: '您的投资组合在过去 6 个月内的表现优于市场指数 12.4%。'
    },
    filters: {
      all: '全部',
      buy: '买入',
      hold: '持有',
      sell: '卖出'
    },
    grid: {
      noImage: '无图片'
    },
    table: {
      card: '卡片',
      grade: '评级',
      currentValue: '当前价值',
      change30d: '30天变化',
      pnl: '盈亏',
      renaiss: 'Renaiss',
      signal: '信号'
    },
    disclaimer: {
      strong: '由 Renaiss Index API (Public) 提供支持',
      text: ' — 投资组合信号和估值仅供参考。过往表现不保证未来结果。不构成财务建议。'
    }
  },
  market: {
    header: {
      subtitle: '实时数据',
      title1: '市场',
      title2: '洞察',
      liveBadge: 'Renaiss 指数实时（测试版）'
    },
    overview: {
      indexTitle: 'PSA 宝可梦市场指数',
      ytd: '今年迄今 +44%',
      mktCap: '市值',
      sold30d: 'PSA 10 售出 (30天)',
      avgPrice: '平均售价'
    },
    tabs: {
      trending: '🔥 趋势',
      sets: '⬡ 热门系列',
      renaiss: '◉ Renaiss 信号'
    },
    trending: {
      searchPlaceholder: '搜索卡片或系列...'
    },
    sets: {
      chartTitle: '按系列划分的销售额（百万美元，30天）',
      listTitle: '🔥 当前最热系列'
    },
    renaissData: {
      s1: '市场活动',
      d1: 'Renaiss 生态系统内交易量高',
      s2: '流动性深度',
      d2: '买卖差价强劲收窄',
      s3: '链上需求',
      d3: '创下与 TCG 资产钱包互动的记录',
      s4: '收藏家情绪',
      d4: '各 PSA 评级均显示看涨社区信号'
    },
    renaissDetails: {
      title: 'Renaiss 生态系统总结',
      subtitle: '测试版 · 实时数据',
      desc: 'Renaiss 生态系统在所有主要指标上均显示出强烈的积极信号。本月对 PSA 评级的宝可梦 TCG 资产的链上需求创下历史新高，市场交易量环比增长 31%。流动性深度分析显示，PSA 9 和 PSA 10 老卡（尤其是 Base Set 和 Neo 系列）的买卖价差收窄。',
      m1: '活跃钱包',
      m2: '每日交易量',
      m3: '平均持有时间',
      disclaimer: '⚠ Renaiss 指数 API 处于测试阶段。显示的所有信号、指标和数据点仅供参考，不构成财务、投资或交易建议。过往表现不保证未来结果。'
    }
  },
  chat: {
    header: {
      ai: 'AI',
      title1: 'CardMind ',
      title2: '对话',
      activeAgents: '3 个智能体激活'
    },
    input: {
      placeholder: '询问关于卡片价值、市场趋势、投资组合建议...'
    },
    disclaimer: 'AI 回复可能包含模拟数据 · 由 Renaiss Index API (Public) 提供支持 · 不构成财务建议',
    contextLabel: '上下文:',
    contextPrompt: '告诉我关于我的 '
  }
};

export default zh;
