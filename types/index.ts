export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface ToolEntry {
  tool: ToolName
  plan: string
  seats: number
  monthlySpend: number
}

export interface AuditFormData {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}