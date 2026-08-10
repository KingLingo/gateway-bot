export default {
  batchImageGuide: {
    title: 'Batch Image Generation',
    description: 'Submit multiple prompts in one job and download the generated images when complete'
  },
  // Home Page
  home: {
    title: 'Every model. One interchange.',
    titleLead: 'Every model.',
    titleAccent: 'One interchange.',
    description: 'Change one environment variable and Claude Code, Codex, and any OpenAI- or Anthropic-compatible SDK are already pointed here.',
    heroEyebrow: 'the gateway that works nights',
    heroDiagramLabel: 'Upstream models converge on one endpoint, then fan out to your tools',
    compactHint: 'Open the console and continue your AI integration',
    customHomeTitle: 'Custom home page',
    viewDocs: 'View Documentation',
    docs: 'Docs',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',
    dashboard: 'Dashboard',
    login: 'Login',
    getStarted: 'Get Started',
    goToDashboard: 'Go to Dashboard',
    heroProof: 'Claude · GPT — Anthropic/OpenAI-compatible endpoint, one key.',
    heroFoot: {
      subscription: 'Subscription status at a glance',
      keys: 'One API Key, one access point',
      usage: 'Clear usage for every cycle'
    },
    access: {
      snippetLabel: 'Unified endpoint',
      title: 'One curl and you are through',
      description: 'Pick a plan, mint a key, swap the endpoint. After step three, not one line of your code changes.',
      choose: { title: 'Choose a subscription', description: 'Compare cycles, quotas, and available models.' },
      key: { title: 'Create a key', description: 'Generate an API Key with the limits you need.' },
      call: { title: 'Start calling', description: 'Use one endpoint and track every request in the console.' }
    },
    subscription: {
      title: 'A balance you can actually account for',
      description: 'Current plan, cycle, quota progress, expiry — there when you need them, not buried.',
      ledgerLabel: 'Subscription panel · what you get to see',
      period: 'Cycle', periodValue: 'Defined by your plan',
      quota: 'Quota progress', quotaValue: 'Updated with usage',
      expiry: 'Expiry', expiryValue: 'Visible before renewal',
      action: 'View my subscriptions'
    },
    models: {
      title: 'Switching models is a config change, not a code change',
      description: 'Same endpoint, different model, any time. Coverage grows with the service.',
      railLabel: 'Supported model platforms',
      comingSoon: 'More models coming soon'
    },
    visibility: {
      title: 'At 3 a.m. you still know what the gateway is doing',
      description: 'Sessions, requests, channel health — all of it stays on the console after you connect. No guessing.',
      session: { title: 'Session continuity', description: 'Keep request context on a consistent path.' },
      tracking: { title: 'Usage tracking', description: 'Review real usage by cycle, model, and key.' },
      status: { title: 'Channel status', description: 'Spot availability and exceptions without guessing.' }
    },
    final: { eyebrow: 'The night shift is already on.', title: 'Now grab a key' },
    // User-focused value proposition
    heroDescription: 'No need to manage multiple subscriptions. Access Claude, GPT, Gemini and more with a single API key',
    // Pain points section
    // Solutions section
    // Comparison section
    // CTA section
    footer: {
      allRightsReserved: 'All rights reserved.'
    }
  },

  // Key Usage Query Page
  keyUsage: {
    title: 'API Key Usage',
    subtitle: 'Enter your API Key to view real-time spending and usage status',
    placeholder: 'sk-ant-mirror-xxxxxxxxxxxx',
    query: 'Query',
    querying: 'Querying...',
    privacyNote: 'Your Key is processed locally in the browser and will not be stored',
    dateRange: 'Date Range:',
    dateRangeToday: 'Today',
    dateRange7d: '7 Days',
    dateRange30d: '30 Days',
    dateRange90d: '90 Days',
    dateRangeCustom: 'Custom',
    apply: 'Apply',
    used: 'Used',
    detailInfo: 'Detail Information',
    tokenStats: 'Token Statistics',
    dailyDetail: 'Daily Detail',
    modelStats: 'Model Usage Statistics',
    // Table headers
    date: 'Date',
    model: 'Model',
    requests: 'Requests',
    inputTokens: 'Input Tokens',
    outputTokens: 'Output Tokens',
    cacheCreationTokens: 'Cache Creation',
    cacheReadTokens: 'Cache Read',
    cacheWriteTokens: 'Cache Write',
    totalTokens: 'Total Tokens',
    cost: 'Cost',
    // Status
    quotaMode: 'Key Quota Mode',
    walletBalance: 'Wallet Balance',
    // Ring card titles
    totalQuota: 'Total Quota',
    limit5h: '5-Hour Limit',
    limitDaily: 'Daily Limit',
    limit7d: '7-Day Limit',
    limitWeekly: 'Weekly Limit',
    limitMonthly: 'Monthly Limit',
    // Detail rows
    remainingQuota: 'Remaining Quota',
    expiresAt: 'Expires At',
    todayExpires: '(expires today)',
    daysLeft: '({days} days)',
    usedQuota: 'Used Quota',
    resetNow: 'Resetting soon',
    subscriptionType: 'Subscription Type',
    subscriptionExpires: 'Subscription Expires',
    // Usage stat cells
    todayRequests: 'Today Requests',
    todayInputTokens: 'Today Input',
    todayOutputTokens: 'Today Output',
    todayTokens: 'Today Tokens',
    todayCacheCreation: 'Today Cache Creation',
    todayCacheRead: 'Today Cache Read',
    todayCost: 'Today Cost',
    rpmTpm: 'RPM / TPM',
    totalRequests: 'Total Requests',
    totalInputTokens: 'Total Input',
    totalOutputTokens: 'Total Output',
    totalTokensLabel: 'Total Tokens',
    totalCacheCreation: 'Total Cache Creation',
    totalCacheRead: 'Total Cache Read',
    totalCost: 'Total Cost',
    avgDuration: 'Avg Duration',
    // Messages
    enterApiKey: 'Please enter an API Key',
    querySuccess: 'Query successful',
    queryFailed: 'Query failed',
    queryFailedRetry: 'Query failed, please try again later',
    noDailyUsage: 'No daily usage data',
  },

  // Setup Wizard
  setup: {
    title: 'Gateway Bot Setup',
    description: 'Configure your Gateway Bot instance',
    database: {
      title: 'Database Configuration',
      description: 'Connect to your PostgreSQL database',
      host: 'Host',
      port: 'Port',
      username: 'Username',
      password: 'Password',
      databaseName: 'Database Name',
      sslMode: 'SSL Mode',
      passwordPlaceholder: 'Password',
      ssl: {
        disable: 'Disable',
        require: 'Require',
        verifyCa: 'Verify CA',
        verifyFull: 'Verify Full'
      }
    },
    redis: {
      title: 'Redis Configuration',
      description: 'Connect to your Redis server',
      host: 'Host',
      port: 'Port',
      username: 'Username (optional)',
      password: 'Password (optional)',
      database: 'Database',
      usernamePlaceholder: 'Leave empty for default user',
      passwordPlaceholder: 'Password',
      enableTls: 'Enable TLS',
      enableTlsHint: 'Use TLS when connecting to Redis (public CA certs)'
    },
    admin: {
      title: 'Admin Account',
      description: 'Create your administrator account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'Min 8 characters',
      confirmPasswordPlaceholder: 'Confirm password',
      passwordMismatch: 'Passwords do not match'
    },
    ready: {
      title: 'Ready to Install',
      description: 'Review your configuration and complete setup',
      database: 'Database',
      redis: 'Redis',
      adminEmail: 'Admin Email'
    },
    status: {
      testing: 'Testing...',
      success: 'Connection Successful',
      testConnection: 'Test Connection',
      installing: 'Installing...',
      completeInstallation: 'Complete Installation',
      completed: 'Installation completed!',
      redirecting: 'Redirecting to login page...',
      restarting: 'Service is restarting, please wait...',
      timeout: 'Service restart is taking longer than expected. Please refresh the page manually.'
    }
  },

  // Common
}
