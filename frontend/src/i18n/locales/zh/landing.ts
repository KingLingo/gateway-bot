export default {
  batchImageGuide: {
    title: '图片批量生成',
    description: '一次提交多条提示词，任务完成后可统一下载图片结果'
  },
  // Home Page
  home: {
    title: '所有模型，在此换乘',
    titleLead: '所有模型，',
    titleAccent: '在此换乘',
    description: '改一行环境变量，Claude Code、Codex，以及任何认 OpenAI / Anthropic 协议的 SDK，全部就位。',
    heroEyebrow: '值夜班的网关',
    heroDiagramLabel: '上游模型经由网关收敛成一个端点，再分发给你的工具',
    compactHint: '进入控制台，继续你的 AI 接入',
    customHomeTitle: '自定义首页',
    viewDocs: '查看文档',
    docs: '文档',
    switchToLight: '切换到浅色模式',
    switchToDark: '切换到深色模式',
    dashboard: '控制台',
    login: '登录',
    getStarted: '立即开始',
    goToDashboard: '进入控制台',
    heroProof: 'Claude · GPT — Anthropic / OpenAI 兼容端点，一个 Key 接入',
    heroFoot: {
      subscription: '订阅状态，随时可见',
      keys: '一个 API Key，统一接入',
      usage: '周期用量，清晰可控'
    },
    access: {
      snippetLabel: '统一端点',
      title: 'curl 一下，就通了',
      description: '选订阅、建密钥、换端点。走完第三步，你原来的代码一行都不用动。',
      choose: {
        title: '选择订阅',
        description: '根据周期、额度和可用模型选择适合你的方案。'
      },
      key: {
        title: '创建密钥',
        description: '在控制台生成 API Key，并按需设置有效期与用量限制。'
      },
      call: {
        title: '开始调用',
        description: '使用统一端点接入现有工具，用量和状态实时回到控制台。'
      }
    },
    subscription: {
      title: '余额不是玄学',
      description: '当前方案、使用周期、额度进度和到期时间——需要的时候，一眼就能找到。',
      ledgerLabel: '订阅面板 · 你会看到这几栏',
      period: '使用周期',
      periodValue: '按方案清晰展示',
      quota: '额度进度',
      quotaValue: '随调用实时更新',
      expiry: '到期时间',
      expiryValue: '提前可见、便于续订',
      action: '查看我的订阅'
    },
    models: {
      title: '换模型是改配置，不是改代码',
      description: '同一个端点后面，模型随时可以换。支持范围随服务持续更新。',
      railLabel: '支持的模型平台',
      comingSoon: '更多模型敬请期待'
    },
    visibility: {
      title: '凌晨三点，也知道网关在干嘛',
      description: '会话、调用、渠道状态，接入之后一直摆在控制台里。不用猜。',
      session: {
        title: '会话保持',
        description: '连续请求保持上下文路径，减少不必要的切换。'
      },
      tracking: {
        title: '用量追踪',
        description: '按周期、模型和密钥查看真实使用记录。'
      },
      status: {
        title: '渠道状态',
        description: '可用性和异常状态及时呈现，便于快速判断。'
      }
    },
    final: {
      eyebrow: '值夜班的网关，已经上岗。',
      title: '现在，拿一个 Key'
    },
    // 新增：面向用户的价值主张
    heroDescription: '无需管理多个订阅账号，一站式接入 Claude、GPT、Gemini 等主流 AI 服务',
    // 用户痛点区块
    // 解决方案区块
    // 优势对比
    // CTA 区块
    footer: {
      allRightsReserved: '保留所有权利。'
    }
  },

  // Key Usage Query Page
  keyUsage: {
    title: 'API Key 用量查询',
    subtitle: '输入您的 API Key 以查看实时消费金额与使用状态',
    placeholder: 'sk-ant-mirror-xxxxxxxxxxxx',
    query: '查询',
    querying: '查询中...',
    privacyNote: '您的 Key 仅在浏览器本地处理，不会被存储',
    dateRange: '统计范围:',
    dateRangeToday: '今日',
    dateRange7d: '7 天',
    dateRange30d: '30 天',
    dateRange90d: '90 天',
    dateRangeCustom: '自定义',
    apply: '应用',
    used: '已使用',
    detailInfo: '详细信息',
    tokenStats: 'Token 统计',
    dailyDetail: '按日明细',
    modelStats: '模型用量统计',
    // Table headers
    date: '日期',
    model: '模型',
    requests: '请求数',
    inputTokens: '输入 Tokens',
    outputTokens: '输出 Tokens',
    cacheCreationTokens: '缓存创建',
    cacheReadTokens: '缓存读取',
    cacheWriteTokens: '缓存写入',
    totalTokens: '总 Tokens',
    cost: '费用',
    // Status
    quotaMode: 'Key 限额模式',
    walletBalance: '钱包余额',
    // Ring card titles
    totalQuota: '总额度',
    limit5h: '5 小时限额',
    limitDaily: '日限额',
    limit7d: '7 天限额',
    limitWeekly: '周限额',
    limitMonthly: '月限额',
    // Detail rows
    remainingQuota: '剩余额度',
    expiresAt: '过期时间',
    todayExpires: '(今日到期)',
    daysLeft: '({days} 天)',
    usedQuota: '已用额度',
    resetNow: '即将重置',
    subscriptionType: '订阅类型',
    subscriptionExpires: '订阅到期',
    // Usage stat cells
    todayRequests: '今日请求',
    todayInputTokens: '今日输入',
    todayOutputTokens: '今日输出',
    todayTokens: '今日 Tokens',
    todayCacheCreation: '今日缓存创建',
    todayCacheRead: '今日缓存读取',
    todayCost: '今日费用',
    rpmTpm: 'RPM / TPM',
    totalRequests: '累计请求',
    totalInputTokens: '累计输入',
    totalOutputTokens: '累计输出',
    totalTokensLabel: '累计 Tokens',
    totalCacheCreation: '累计缓存创建',
    totalCacheRead: '累计缓存读取',
    totalCost: '累计费用',
    avgDuration: '平均耗时',
    // Messages
    enterApiKey: '请输入 API Key',
    querySuccess: '查询成功',
    queryFailed: '查询失败',
    queryFailedRetry: '查询失败，请稍后重试',
    noDailyUsage: '暂无按日用量数据',
  },

  // Setup Wizard
  setup: {
    title: 'Gateway Bot 安装向导',
    description: '配置您的 Gateway Bot 实例',
    database: {
      title: '数据库配置',
      description: '连接到您的 PostgreSQL 数据库',
      host: '主机',
      port: '端口',
      username: '用户名',
      password: '密码',
      databaseName: '数据库名称',
      sslMode: 'SSL 模式',
      passwordPlaceholder: '密码',
      ssl: {
        disable: '禁用',
        require: '要求',
        verifyCa: '验证 CA',
        verifyFull: '完全验证'
      }
    },
    redis: {
      title: 'Redis 配置',
      description: '连接到您的 Redis 服务器',
      host: '主机',
      port: '端口',
      username: '用户名（可选）',
      password: '密码（可选）',
      database: '数据库',
      usernamePlaceholder: '默认用户留空',
      passwordPlaceholder: '密码',
      enableTls: '启用 TLS',
      enableTlsHint: '连接 Redis 时使用 TLS（公共 CA 证书）'
    },
    admin: {
      title: '管理员账户',
      description: '创建您的管理员账户',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      passwordPlaceholder: '至少 8 个字符',
      confirmPasswordPlaceholder: '确认密码',
      passwordMismatch: '密码不匹配'
    },
    ready: {
      title: '准备安装',
      description: '检查您的配置并完成安装',
      database: '数据库',
      redis: 'Redis',
      adminEmail: '管理员邮箱'
    },
    status: {
      testing: '测试中...',
      success: '连接成功',
      testConnection: '测试连接',
      installing: '安装中...',
      completeInstallation: '完成安装',
      completed: '安装完成！',
      redirecting: '正在跳转到登录页面...',
      restarting: '服务正在重启，请稍候...',
      timeout: '服务重启时间超出预期，请手动刷新页面。'
    }
  },

  // Common
}
