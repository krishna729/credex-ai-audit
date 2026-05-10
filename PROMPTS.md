# Prompts

## AI Summary Prompt

### Production Prompt (used in audit summary generation)

```text
You are a financial advisor specializing in AI tool cost optimization for startups.

Given the following audit data for a team:
- Team size: {{teamSize}}
- Primary use case: {{useCase}}
- Tools audited: {{toolsList}}
- Total monthly savings identified: ${{totalMonthlySavings}}
- Total annual savings identified: ${{totalAnnualSavings}}

Per-tool breakdown:
{{toolBreakdown}}

Write a 100-word personalized summary paragraph that:
1. Acknowledges their current AI stack
2. Highlights the biggest savings opportunity specifically
3. Gives one concrete next action they should take this week
4. Ends with encouragement — not generic, but specific to their use case

Tone: Direct, honest, like a trusted advisor. Not salesy. No fluff.
Format: Single paragraph, exactly 80-120 words.
```

### Why I wrote it this way

- **Specific word count** — "100 words" alone gives inconsistent output. "80-120 words" gives better control.
- **Role framing** — "financial advisor" produces more defensible, numbers-focused output than "helpful assistant"
- **Concrete next action** — without this constraint, LLMs give vague recommendations. Forcing one specific action this week makes output more useful.
- **"Not salesy, no fluff"** — negative constraints matter. Without them, Claude defaults to marketing language.

### What I tried that didn't work

**Attempt 1:**
```text
Summarize this AI spend audit in 100 words.
```
Result: Too generic, no personalization, read like a template.

**Attempt 2:**
```text
You are a helpful assistant. Write a summary of the user's AI spending.
```
Result: Overly positive, didn't highlight savings clearly, too much filler.

**Attempt 3 (current):**
Added role, word count range, specific constraints, negative instructions.
Result: Consistent, specific, actionable output.

### Fallback Template

When Anthropic API is unavailable, this template is used:

```text
Your team of {{teamSize}} is spending on {{toolCount}} AI tools
with a primary focus on {{useCase}}. Our audit identified 
${{totalMonthlySavings}}/month in potential savings 
(${{totalAnnualSavings}}/year). {{topRecommendation}} 
Reviewing your AI tool subscriptions quarterly can help ensure 
you're always on the right plan as your team grows.
```

### Where AI is NOT used

The audit engine logic (plan comparisons, savings calculations) uses
hardcoded rules — not AI. This is intentional: deterministic logic
is more trustworthy and auditable for financial recommendations.
AI is only used for the narrative summary layer on top of rule-based output.