'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TOOLS } from '@/lib/tools'
import type { AuditFormData, ToolEntry, ToolName, UseCase } from '@/types'

const DEFAULT_TOOL_ENTRY = (tool: ToolName): ToolEntry => ({
  tool,
  plan: TOOLS[tool].plans[0],
  seats: 1,
  monthlySpend: 0,
})

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding / Engineering' },
  { value: 'writing', label: 'Writing / Content' },
  { value: 'data', label: 'Data Analysis' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed / General' },
]

const STORAGE_KEY = 'credex_audit_form'

export default function SpendForm() {
  const router = useRouter()
  const [teamSize, setTeamSize] = useState(5)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [selectedTools, setSelectedTools] = useState<ToolName[]>([])
  const [toolEntries, setToolEntries] = useState<Record<ToolName, ToolEntry>>(
    {} as Record<ToolName, ToolEntry>
  )

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data: AuditFormData = JSON.parse(saved)
      setTeamSize(data.teamSize)
      setUseCase(data.useCase)
      const tools = data.tools.map((t) => t.tool)
      setSelectedTools(tools)
      const entries: Record<string, ToolEntry> = {}
      data.tools.forEach((t) => (entries[t.tool] = t))
      setToolEntries(entries as Record<ToolName, ToolEntry>)
    }
  }, [])

  const toggleTool = (tool: ToolName) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    )
    if (!toolEntries[tool]) {
      setToolEntries((prev) => ({ ...prev, [tool]: DEFAULT_TOOL_ENTRY(tool) }))
    }
  }

  const updateEntry = (tool: ToolName, field: keyof ToolEntry, value: string | number) => {
    setToolEntries((prev) => ({ ...prev, [tool]: { ...prev[tool], [field]: value } }))
  }

  const handleSubmit = () => {
    if (selectedTools.length === 0) return alert('Kam se kam ek tool select karo!')
    const formData: AuditFormData = {
      tools: selectedTools.map((t) => toolEntries[t]),
      teamSize,
      useCase,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    router.push('/audit/results')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">AI Spend Audit</h1>
      <p className="text-gray-500 mb-8">
        Select the AI tools your team pays for. We'll find where you're overspending.
      </p>

      {/* Team info */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Team size</label>
          <input
            type="number"
            min={1}
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary use case</label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value as UseCase)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            {USE_CASES.map((uc) => (
              <option key={uc.value} value={uc.value}>{uc.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tool selection */}
      <p className="text-sm font-medium text-gray-700 mb-3">Which tools do you pay for?</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(Object.keys(TOOLS) as ToolName[]).map((tool) => (
          <button
            key={tool}
            onClick={() => toggleTool(tool)}
            className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
              selectedTools.includes(tool)
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
            }`}
          >
            {TOOLS[tool].label}
          </button>
        ))}
      </div>

      {/* Per-tool detail */}
      {selectedTools.length > 0 && (
        <div className="space-y-4 mb-8">
          <p className="text-sm font-medium text-gray-700">Fill in details for each tool:</p>
          {selectedTools.map((tool) => (
            <div key={tool} className="border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-800 mb-3">{TOOLS[tool].label}</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Plan</label>
                  <select
                    value={toolEntries[tool]?.plan}
                    onChange={(e) => updateEntry(tool, 'plan', e.target.value)}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                  >
                    {TOOLS[tool].plans.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={toolEntries[tool]?.seats}
                    onChange={(e) => updateEntry(tool, 'seats', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Monthly spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={toolEntries[tool]?.monthlySpend}
                    onChange={(e) => updateEntry(tool, 'monthlySpend', Number(e.target.value))}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
      >
        Run my audit →
      </button>
    </div>
  )
}