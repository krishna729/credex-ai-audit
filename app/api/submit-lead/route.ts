import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, companyName, role, auditData, totalMonthlySavings, totalAnnualSavings, teamSize, useCase } = body

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Save lead
    const { error: leadError } = await supabase.from('leads').insert({
      email,
      company_name: companyName,
      role,
      team_size: teamSize,
      audit_data: auditData,
      total_savings: totalMonthlySavings,
    })

    if (leadError) throw leadError

    // Save shareable audit
    const slug = nanoid(10)
    const { error: auditError } = await supabase.from('audits').insert({
      slug,
      audit_data: auditData,
      total_monthly_savings: totalMonthlySavings,
      total_annual_savings: totalAnnualSavings,
      use_case: useCase,
      team_size: teamSize,
    })

    if (auditError) throw auditError

    return NextResponse.json({ success: true, slug })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}