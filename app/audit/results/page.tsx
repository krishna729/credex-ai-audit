'use client'

import { useEffect, useState } from 'react'
import { runAudit } from '@/lib/auditEngine'
import type { AuditResult } from '@/lib/auditEngine'
import type { AuditFormData } from '@/types'

const STORAGE_KEY = 'credex_audit_form'

export default function ResultsPage() {
  const [result, setResult] = useState<AuditResult | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const formData: AuditFormData = JSON.parse(saved)
      setResult(runAudit(formData))
    }
  }, [])

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-500">
        No audit data found.{' '}
        <a href="/" className="text-emerald-600 underline">Go back and fill the form.</a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Hero savings */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-8 text-center">
        <p className="text-sm text-emerald-600 font-medium mb-1">Total potential savings</p>
        <p className="text-5xl font-bold text-emerald-700 mb-1">
          ${result.totalMonthlySavings.toLocaleString()}
          <span className="text-2xl">/mo</span>
        </p>
        <p className="text-gray-500 text-sm">
          ${result.totalAnnualSavings.toLocaleString()} saved annually
        </p>
      </div>

      {/* Per-tool breakdown */}
      <div className="space-y-4 mb-8">
        {result.results.map((r, i) => (
          <div
            key={i}
            className={`rounded-xl border p-5 ${
              r.severity === 'overspending'
                ? 'border-red-200 bg-red-50'
                : r.severity === 'minor'
                ? 'border-amber-200 bg-amber-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-800">{r.tool}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  r.severity === 'overspending'
                    ? 'bg-red-100 text-red-700'
                    : r.severity === 'minor'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {r.severity === 'overspending'
                  ? 'Overspending'
                  : r.severity === 'minor'
                  ? 'Can optimize'
                  : 'Optimal'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{r.recommendedAction}</p>
            <p className="text-xs text-gray-400">{r.reason}</p>
            {r.savings > 0 && (
              <p className="mt-3 text-sm font-semibold text-emerald-600">
                Save ${r.savings}/mo (${r.savings * 12}/yr)
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Credex CTA — only for high savings */}
      {result.showCredex && (
        <div className="bg-gray-900 text-white rounded-2xl p-6 mb-8">
          <p className="font-semibold text-lg mb-1">
            You are leaving real money on the table
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Credex provides discounted AI credits — same tools, significantly lower cost.
            Teams saving $500+/mo are our best fit.
          </p>
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors"
          >
            Book a Credex consultation
          </a>
        </div>
      )}

      {/* Honest message for low savings */}
      {result.totalMonthlySavings < 100 && (
        <div className="border border-gray-200 rounded-xl p-5 mb-8 text-center">
          <p className="font-medium text-gray-700 mb-1">You are spending well</p>
          <p className="text-sm text-gray-500 mb-3">
            Your current AI stack looks optimized. We will notify you when better options appear.
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2"
          />
          <button className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            Notify me of new optimizations
          </button>
        </div>
      )}

      {/* Back */}
      <a
        href="/"
        className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        Redo audit
      </a>
    </div>
  )
}