'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SharedAuditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAudit() {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!error && data) setAudit(data)
      setLoading(false)
    }
    fetchAudit()
  }, [slug])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
      Loading audit...
    </div>
  )

  if (!audit) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-500">
      Audit not found.{' '}
      <a href="/" className="text-emerald-600 underline">Create your own.</a>
    </div>
  )

  const results = audit.audit_data?.results || []

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-1">Shared AI Spend Audit</p>
        <h1 className="text-2xl font-bold text-gray-900">Audit Results</h1>
      </div>

      {/* Hero */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-8 text-center">
        <p className="text-sm text-emerald-600 font-medium mb-1">Total potential savings</p>
        <p className="text-5xl font-bold text-emerald-700 mb-1">
          ${audit.total_monthly_savings?.toLocaleString()}
          <span className="text-2xl">/mo</span>
        </p>
        <p className="text-gray-500 text-sm">
          ${audit.total_annual_savings?.toLocaleString()} saved annually
        </p>
      </div>

      {/* Per tool */}
      <div className="space-y-4 mb-8">
        {results.map((r: any, i: number) => (
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
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                r.severity === 'overspending'
                  ? 'bg-red-100 text-red-700'
                  : r.severity === 'minor'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {r.severity === 'overspending'
                  ? 'Overspending'
                  : r.severity === 'minor'
                  ? 'Can optimize'
                  : 'Optimal'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{r.recommendedAction}</p>
            <p className="text-xs text-gray-400">{r.reason}</p>
            {r.savings > 0 && (
              <p className="mt-2 text-sm font-semibold text-emerald-600">
                Save ${r.savings}/mo (${r.savings * 12}/yr)
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-xl p-5 text-center">
        <p className="font-medium text-gray-700 mb-1">Want to audit your own AI stack?</p>
        <a
          href="/"
          className="inline-block mt-2 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Run your free audit
        </a>
      </div>
    </div>
  )
}