export const TOOLS = {
  cursor: {
    label: 'Cursor',
    plans: ['Hobby', 'Pro', 'Business', 'Enterprise'],
  },
  'github-copilot': {
    label: 'GitHub Copilot',
    plans: ['Individual', 'Business', 'Enterprise'],
  },
  claude: {
    label: 'Claude',
    plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API direct'],
  },
  chatgpt: {
    label: 'ChatGPT',
    plans: ['Plus', 'Team', 'Enterprise', 'API direct'],
  },
  'anthropic-api': {
    label: 'Anthropic API',
    plans: ['API direct'],
  },
  'openai-api': {
    label: 'OpenAI API',
    plans: ['API direct'],
  },
  gemini: {
    label: 'Gemini',
    plans: ['Pro', 'Ultra', 'API'],
  },
  windsurf: {
    label: 'Windsurf',
    plans: ['Free', 'Pro', 'Teams'],
  },
} as const