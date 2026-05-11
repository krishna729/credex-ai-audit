# Tests

## How to Run

```bash
npm test
```

## Test Results
7 tests passing, 0 failing.
Test suite: PASS __tests__/auditEngine.test.ts

## Test File
`__tests__/auditEngine.test.ts`

| # | Test Name | What it covers |
|---|-----------|---------------|
| 1 | Cursor Business 1 seat overspending | Flags overspending when Business plan used for 1 user — should downgrade to Pro |
| 2 | Cursor Pro 1 seat optimal | Confirms no action needed when correct plan selected |
| 3 | GitHub Copilot Enterprise small team | Flags Enterprise overkill for teams under 50 seats |
| 4 | Total savings = sum of all tools | Verifies totalMonthlySavings equals sum of per-tool savings |
| 5 | Annual savings = monthly x 12 | Verifies annual calculation is exactly 12x monthly |
| 6 | showCredex threshold | Confirms Credex CTA shown when savings exceed $500/mo |
| 7 | Claude Team 2 seats overspending | Flags Team plan for 2 users — minimum is 5 seats |

## What the Audit Engine Tests Cover
- Per-tool overspending detection logic
- Savings calculation accuracy
- Annual vs monthly math
- Credex CTA threshold logic
- Edge cases: 1 user, small team, mixed tools

## How CI Runs Tests
GitHub Actions runs `npm test` on every push to main.
See `.github/workflows/ci.yml`.
Green check on latest commit confirms all tests passing.