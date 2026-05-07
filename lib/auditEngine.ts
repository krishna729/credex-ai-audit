import type { AuditFormData, ToolEntry } from '@/types'

export interface ToolAuditResult {
  tool: string
  currentSpend: number
  recommendedAction: string
  savings: number
  reason: string
  severity: 'overspending' | 'optimal' | 'minor'
}

export interface AuditResult {
  results: ToolAuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  showCredex: boolean
}

// Current pricing data — verified May 2026
const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: 40,
  },
  'github-copilot': {
    Individual: 10,
    Business: 19,
    Enterprise: 39,
  },
  claude: {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30,
    Enterprise: 60,
    'API direct': 0,
  },
  chatgpt: {
    Plus: 20,
    Team: 30,
    Enterprise: 60,
    'API direct': 0,
  },
  'anthropic-api': { 'API direct': 0 },
  'openai-api': { 'API direct': 0 },
  gemini: {
    Pro: 0,
    Ultra: 249,
    API: 0,
  },
  windsurf: {
    Free: 0,
    Pro: 15,
    Teams: 35,
  },
}

function auditCursor(entry: ToolEntry, teamSize: number, useCase: string): ToolAuditResult {
  const spend = entry.monthlySpend || entry.seats * (PRICING.cursor[entry.plan] || 0)

  if (entry.plan === 'Business' && entry.seats <= 3) {
    return {
      tool: 'Cursor',
      currentSpend: spend,
      recommendedAction: `Downgrade to Pro ($20/seat) — Business plan is overkill for ${entry.seats} users`,
      savings: entry.seats * 20,
      reason: `Business plan adds admin controls and SSO — unnecessary for teams under 5. Pro has same core AI features at $20/seat vs $40/seat.`,
      severity: 'overspending',
    }
  }

  if (entry.plan === 'Enterprise' && entry.seats < 20) {
    return {
      tool: 'Cursor',
      currentSpend: spend,
      recommendedAction: 'Downgrade to Business — Enterprise pricing requires 20+ seats minimum',
      savings: 0,
      reason: 'Enterprise is for large orgs needing dedicated support and custom contracts.',
      severity: 'minor',
    }
  }

  return {
    tool: 'Cursor',
    currentSpend: spend,
    recommendedAction: 'No change needed',
    savings: 0,
    reason: `${entry.plan} plan is appropriate for ${entry.seats} seats.`,
    severity: 'optimal',
  }
}

function auditGithubCopilot(entry: ToolEntry, teamSize: number, useCase: string): ToolAuditResult {
  const spend = entry.monthlySpend || entry.seats * (PRICING['github-copilot'][entry.plan] || 0)

  if (entry.plan === 'Business' && entry.seats <= 5 && useCase === 'coding') {
    return {
      tool: 'GitHub Copilot',
      currentSpend: spend,
      recommendedAction: `Switch to Individual plan ($10/seat) — saves $${entry.seats * 9}/mo`,
      savings: entry.seats * 9,
      reason: `Business plan adds policy management and org-wide controls — not needed for small coding teams. Individual plan has identical AI completion at $10 vs $19/seat.`,
      severity: 'overspending',
    }
  }

  if (entry.plan === 'Enterprise' && entry.seats < 50) {
    return {
      tool: 'GitHub Copilot',
      currentSpend: spend,
      recommendedAction: `Downgrade to Business ($19/seat) — saves $${entry.seats * 20}/mo`,
      savings: entry.seats * 20,
      reason: `Enterprise adds fine-tuned models and dedicated support — only worth it at 50+ seats. Business plan covers all core features at $19 vs $39/seat.`,
      severity: 'overspending',
    }
  }

  return {
    tool: 'GitHub Copilot',
    currentSpend: spend,
    recommendedAction: 'No change needed',
    savings: 0,
    reason: `${entry.plan} plan is appropriate for your team size.`,
    severity: 'optimal',
  }
}

function auditClaude(entry: ToolEntry, teamSize: number): ToolAuditResult {
  const spend = entry.monthlySpend || entry.seats * (PRICING.claude[entry.plan] || 0)

  if (entry.plan === 'Team' && entry.seats <= 2) {
    return {
      tool: 'Claude',
      currentSpend: spend,
      recommendedAction: `Switch to Pro ($20/seat) — Team plan minimum is 5 seats`,
      savings: spend - 40,
      reason: `Claude Team requires minimum 5 seats at $30/seat. For 1-2 users, Pro at $20/seat gives same model access without overpaying for unused seats.`,
      severity: 'overspending',
    }
  }

  if (entry.plan === 'Max' && entry.seats > 5) {
    return {
      tool: 'Claude',
      currentSpend: spend,
      recommendedAction: `Consider Team plan ($30/seat) for collaborative features`,
      savings: entry.seats * 70,
      reason: `Max is $100/seat for heavy individual usage. For teams of 5+, Team plan at $30/seat includes collaboration features and is significantly cheaper.`,
      severity: 'overspending',
    }
  }

  return {
    tool: 'Claude',
    currentSpend: spend,
    recommendedAction: 'No change needed',
    savings: 0,
    reason: `${entry.plan} plan is well-matched to your usage.`,
    severity: 'optimal',
  }
}

function auditChatGPT(entry: ToolEntry, teamSize: number): ToolAuditResult {
  const spend = entry.monthlySpend || entry.seats * (PRICING.chatgpt[entry.plan] || 0)

  if (entry.plan === 'Team' && entry.seats <= 2) {
    return {
      tool: 'ChatGPT',
      currentSpend: spend,
      recommendedAction: `Switch to Plus ($20/seat) — saves $${entry.seats * 10}/mo`,
      savings: entry.seats * 10,
      reason: `ChatGPT Team is $30/seat but requires minimum 2 users and adds workspace management. For 1-2 users, Plus at $20/seat gives same GPT-4o access.`,
      severity: 'overspending',
    }
  }

  if (entry.plan === 'Plus' && entry.seats >= 10) {
    return {
      tool: 'ChatGPT',
      currentSpend: spend,
      recommendedAction: `Upgrade to Team plan for better per-seat pricing at scale`,
      savings: 0,
      reason: `At 10+ seats, Team plan adds admin controls and shared workspace which becomes essential for coordination.`,
      severity: 'minor',
    }
  }

  return {
    tool: 'ChatGPT',
    currentSpend: spend,
    recommendedAction: 'No change needed',
    savings: 0,
    reason: `${entry.plan} plan is appropriate for your usage.`,
    severity: 'optimal',
  }
}

function auditGeneric(entry: ToolEntry, toolLabel: string): ToolAuditResult {
  const spend = entry.monthlySpend
  return {
    tool: toolLabel,
    currentSpend: spend,
    recommendedAction: spend > 500 ? 'Review usage and set budget alerts' : 'Spending looks reasonable',
    savings: 0,
    reason: spend > 500
      ? `API spend of $${spend}/mo warrants a usage audit. Set hard limits in your dashboard to prevent bill shock.`
      : `API usage is within a reasonable range for your team size.`,
    severity: spend > 500 ? 'minor' : 'optimal',
  }
}

export function runAudit(formData: AuditFormData): AuditResult {
  const results: ToolAuditResult[] = formData.tools.map((entry) => {
    switch (entry.tool) {
      case 'cursor': return auditCursor(entry, formData.teamSize, formData.useCase)
      case 'github-copilot': return auditGithubCopilot(entry, formData.teamSize, formData.useCase)
      case 'claude': return auditClaude(entry, formData.teamSize)
      case 'chatgpt': return auditChatGPT(entry, formData.teamSize)
      case 'anthropic-api': return auditGeneric(entry, 'Anthropic API')
      case 'openai-api': return auditGeneric(entry, 'OpenAI API')
      case 'gemini': return auditGeneric(entry, 'Gemini')
      case 'windsurf': return auditGeneric(entry, 'Windsurf')
      default: return auditGeneric(entry, entry.tool)
    }
  })

  const totalMonthlySavings = results.reduce((sum, r) => sum + r.savings, 0)
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings,
    showCredex: totalMonthlySavings > 500,
  }
}