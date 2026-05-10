# Metrics

## North Star Metric

**Qualified audits completed per week**

Definition: An audit where the user selected at least 2 tools,
filled in real spend numbers (not $0), and reached the results page.

Why this and not something else:
- "Total visits" is vanity — someone who bounces on the form is
  worthless to Credex
- "Email captures" is a lagging indicator — it follows audit quality
- "Revenue" is too downstream for a tool this early
- Qualified audits directly predict consultation bookings, which
  predict revenue

If qualified audits per week is growing, everything downstream
(emails, consultations, deals) will follow. If it's flat, fixing
anything else is rearranging deck chairs.

## 3 Input Metrics That Drive the North Star

**1. Form completion rate**
Definition: % of users who land on the form and click "Run my audit"
Target: >40%
Why it matters: If people land and don't complete, the form is
too long, too confusing, or the value prop isn't clear enough.
How to improve: Reduce fields, add progress indicator, show
"takes 2 minutes" copy above the form.

**2. Traffic to the audit tool**
Definition: Unique sessions on the landing page per week
Target: 500+ in week 1, 2000+ by month 2
Why it matters: No traffic = no audits, regardless of conversion.
This is the top of funnel.
How to improve: Reddit posts, HN submission, Credex email list,
shared audit URLs driving referral traffic.

**3. Referral rate from shared audit URLs**
Definition: % of audits that come from someone clicking a shared
/audit/[slug] link
Target: >15% of all audits by month 2
Why it matters: This is the viral loop. If people share their
audit, growth compounds without paid spend.
How to improve: Make the shared page visually striking — something
worth screenshotting. Add "Run your own audit" CTA prominently.

## What to Instrument First

In priority order:

1. **Audit completion event** — fire when user hits results page
   with valid data. This is the North Star.
2. **Form abandonment** — which step do people drop off on?
   Tool selection? Spend input? This shows where to fix the form.
3. **Email capture rate** — % of audit completions that submit email
4. **Share link clicks** — how many people click the shareable URL
5. **Credex CTA clicks** — how many high-savings users click
   "Book a consultation"

Simple implementation: Vercel Analytics for pageviews,
custom events via a lightweight analytics call on key actions.

## What Number Triggers a Pivot Decision

**Trigger 1: Form completion rate below 20% after 200 sessions**
Action: Simplify the form. Remove optional fields. Add social proof
above the fold. A/B test shorter vs longer form.

**Trigger 2: Email capture rate below 10% after 100 audits**
Action: The audit results are not showing enough value. Either the
savings numbers are too low (audit logic problem) or the email CTA
is too aggressive. Test showing email gate later.

**Trigger 3: Zero consultation bookings after 50 high-savings audits**
Action: The Credex CTA is broken or unconvincing. Rewrite the copy,
add a face + name to the consultation offer, or lower the threshold
from $500 to $200 savings to qualify more users.

**Trigger 4: Referral rate below 5% after 4 weeks**
Action: The shared audit page is not compelling enough to share.
Redesign it to be more visual — big number, shareable graphic,
clear "what is this" explanation for cold visitors.