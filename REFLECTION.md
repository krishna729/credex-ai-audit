# Reflection

## 1. Hardest Bug — params.slug Promise Error in Next.js 16

The hardest bug I hit was on Day 3 when I built the shareable audit
URL page at /audit/[slug]. The page was showing "Audit not found"
even when a valid slug existed in Supabase. I checked the database —
the data was there. I checked the query — it looked correct. I
refreshed multiple times. Still nothing.

I started forming hypotheses. First I thought the Supabase anon key
was wrong — tested it directly in the browser, it worked. Then I
thought the slug wasn't being saved correctly — checked the Supabase
dashboard, it was there. Then I looked more carefully at the console
and saw a warning: "params is a Promise and must be unwrapped with
React.use() before accessing properties."

That was the issue. Next.js 16 changed how dynamic route params work
— params is now a Promise, not a plain object. My code was doing
params.slug directly, which returned undefined, so the Supabase query
was searching for undefined and returning nothing.

The fix was a one-line change — import use from React and unwrap
params with const { slug } = use(params). But finding the root cause
took over an hour because the error message appeared in the browser
console as a warning, not a hard error, so the page rendered with
"Audit not found" instead of crashing visibly.

What I learned: warnings in Next.js are often more important than
errors. Read them carefully before assuming the bug is in your
business logic.

---

## 2. Decision I Reversed — Using AI for Audit Logic

On Day 2 I initially planned to use the Anthropic API for the audit
recommendations themselves — not just the summary. My thinking was
that AI could give more nuanced recommendations than hardcoded rules.

I wrote the first draft with an API call inside the audit engine.
It worked but felt wrong immediately. The recommendations were
inconsistent — same inputs gave slightly different outputs each run.
The savings numbers varied by a few dollars each time. I showed it
to a friend and he said "I don't trust this, the number changed when
I refreshed."

That was the signal. Financial recommendations must be deterministic.
A user should be able to refresh the page and see the same number.
A finance person should be able to read the logic and verify it.

I reversed the decision completely — moved all audit logic to
hardcoded TypeScript rules with cited pricing data, and kept AI only
for the 100-word narrative summary where slight variation is fine and
even desirable. This turned out to be the right call. The assignment
brief even said "knowing when not to use AI is part of the test."

---

## 3. What I Would Build in Week 2

Week 2 would focus on three things:

First, a benchmark mode — "your AI spend per developer is $X,
companies your size average $Y." Right now the audit only compares
against vendor pricing. Comparing against peer companies would make
the tool much more compelling. I would collect anonymized spend data
from week 1 users and build a simple percentile calculator.

Second, a PDF export of the full audit report. Multiple early users
asked for this during interviews — they want to share the report with
their CFO or in a Slack channel without sharing a link. A downloadable
PDF with the savings breakdown and Credex branding would double as
a marketing asset.

Third, proper AI summary integration. Right now the Anthropic API
requires paid credits which I did not have during this week. In week
2 I would apply for API access, integrate the real summary, and A/B
test it against the templated fallback to measure whether AI summary
increases email capture rate.

---

## 4. How I Used AI Tools

I used Claude (this AI) extensively throughout the week as a pair
programmer and thinking partner.

**What I used it for:**
- Generating boilerplate code for Supabase API routes and the
  results page layout
- Debugging error messages I hadn't seen before (the Next.js 16
  params Promise issue, the package.json JSON parse error)
- Writing the entrepreneurial files — GTM, ECONOMICS, METRICS —
  where it helped me structure my thinking
- Fixing TypeScript type errors quickly

**What I didn't trust it with:**
- The audit engine pricing logic — I verified every number myself
  against official pricing pages before putting it in PRICING_DATA.md
- The user interview notes — those came from real conversations
- The DEVLOG entries — those reflect what actually happened each day

**One specific time the AI was wrong:**
Claude suggested using `mkdir -p app/audit components/ui lib types`
to create folders. This failed because I'm on Windows CMD which
doesn't support the -p flag. I had to create each folder separately.
Small mistake but it cost 10 minutes of debugging. I learned to
always check if terminal commands are OS-specific before running them.

---

## 5. Self Rating

**Discipline: 6/10**
I started late — Day 1 was spent reading the brief rather than
coding. Lost almost a full day at the start. Commits are spread
across 5+ days but the first commit came on Day 2, not Day 1.

**Code Quality: 7/10**
TypeScript throughout, sensible abstractions (audit engine is a
pure function, API routes are clean). Could be better — some any
types in the slug page, ESLint warnings about using anchor tags
instead of Next.js Link component. Did not fix these before deadline.

**Design Sense: 6/10**
The UI is clean and functional but not distinctive. Tailwind
defaults look like Tailwind defaults. The results page is clear
but not something that would get screenshotted and shared purely
for how it looks. Week 2 would invest in design polish.

**Problem Solving: 8/10**
Debugged the Next.js 16 params issue, the Windows CMD folder
creation issue, the JSON parse error in package.json, and the
arrow character JSX parse error — all without giving up. Formed
hypotheses, tested them, found root causes.

**Entrepreneurial Thinking: 7/10**
The GTM and ECONOMICS files show real founder thinking — specific
channels, unit economics math, realistic conversion funnels. The
user interviews were real conversations that changed design
decisions. Weak point: I did not talk to enough people before
building — I started coding before validating the core assumption
that startups actually want a free audit tool.