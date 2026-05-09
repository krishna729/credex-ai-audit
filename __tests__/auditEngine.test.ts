import { runAudit } from '../lib/auditEngine'

// Test 1: Cursor Business with 1 seat — should flag overspending
test('Cursor Business plan with 1 seat should be flagged as overspending', () => {
  const result = runAudit({
    tools: [{ tool: 'cursor', plan: 'Business', seats: 1, monthlySpend: 40 }],
    teamSize: 1,
    useCase: 'coding',
  })
  expect(result.results[0].severity).toBe('overspending')
  expect(result.results[0].savings).toBeGreaterThan(0)
})

// Test 2: Cursor Pro with 1 seat — should be optimal
test('Cursor Pro plan with 1 seat should be optimal', () => {
  const result = runAudit({
    tools: [{ tool: 'cursor', plan: 'Pro', seats: 1, monthlySpend: 20 }],
    teamSize: 1,
    useCase: 'coding',
  })
  expect(result.results[0].severity).toBe('optimal')
  expect(result.results[0].savings).toBe(0)
})

// Test 3: GitHub Copilot Enterprise with small team — should flag overspending
test('GitHub Copilot Enterprise with 5 seats should be flagged as overspending', () => {
  const result = runAudit({
    tools: [{ tool: 'github-copilot', plan: 'Enterprise', seats: 5, monthlySpend: 195 }],
    teamSize: 5,
    useCase: 'coding',
  })
  expect(result.results[0].severity).toBe('overspending')
  expect(result.results[0].savings).toBeGreaterThan(0)
})

// Test 4: Total savings calculation correct
test('Total monthly savings should be sum of all tool savings', () => {
  const result = runAudit({
    tools: [
      { tool: 'cursor', plan: 'Business', seats: 2, monthlySpend: 80 },
      { tool: 'github-copilot', plan: 'Enterprise', seats: 2, monthlySpend: 78 },
    ],
    teamSize: 2,
    useCase: 'coding',
  })
  const expectedSavings = result.results.reduce((sum, r) => sum + r.savings, 0)
  expect(result.totalMonthlySavings).toBe(expectedSavings)
})

// Test 5: Annual savings = monthly * 12
test('Annual savings should be 12x monthly savings', () => {
  const result = runAudit({
    tools: [{ tool: 'cursor', plan: 'Business', seats: 3, monthlySpend: 120 }],
    teamSize: 3,
    useCase: 'coding',
  })
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
})

// Test 6: showCredex true when savings > 500
test('showCredex should be true when monthly savings exceed $500', () => {
  const result = runAudit({
    tools: [
      { tool: 'cursor', plan: 'Business', seats: 2, monthlySpend: 80 },
      { tool: 'github-copilot', plan: 'Enterprise', seats: 30, monthlySpend: 1170 },
    ],
    teamSize: 30,
    useCase: 'coding',
  })
  expect(result.showCredex).toBe(true)
})

// Test 7: Claude Team with 2 seats — overspending
test('Claude Team plan with 2 seats should be flagged as overspending', () => {
  const result = runAudit({
    tools: [{ tool: 'claude', plan: 'Team', seats: 2, monthlySpend: 60 }],
    teamSize: 2,
    useCase: 'writing',
  })
  expect(result.results[0].severity).toBe('overspending')
})