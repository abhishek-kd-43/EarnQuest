# EarnQuest — Execution Roadmap

**Phases:** 5 | **Requirements Mapped:** 100% | **Status:** Active

---

## Phase Overview

| Phase | Description | Key Requirements Covered | Success Criteria |
|---|---|---|---|
| **Phase 1** | **MVP Platform Foundation & Core Loop** | REQ-AUTH, REQ-PUBLIC, REQ-MISSION, REQ-GUIDE, REQ-LEDGER (MVP), REQ-PROJECTS, REQ-ADMIN (MVP), REQ-GAMIFICATION | 9 criteria |
| **Phase 2** | **Autonomous Research & Scoring Pipeline** | REQ-RESEARCH-01, REQ-RESEARCH-02, REQ-RESEARCH-03, REQ-SECURITY-02 | 4 criteria |
| **Phase 3** | **Real-Money Payment Rails & Verification** | REQ-LEDGER-02, REQ-LEDGER-03, REQ-LEDGER-04, PaymentProvider | 4 criteria |
| **Phase 4** | **Self-Learning & Mission Optimization** | REQ-MISSION-01 (versioning), Telemetry, Feedback loop | 3 criteria |
| **Phase 5** | **Global Localization & Multi-Agent Evolution** | i18n, Regional rules, Autonomy levels 1–4 | 3 criteria |

---

## Phase Details

### Phase 1: MVP Platform Foundation & Core Loop
**Goal:** Deploy a fully functional production-grade MVP featuring authenticated user onboarding with hardware profiling, rich futuristic public portal, 10 realistic seeded missions across diverse categories, step-by-step beginner mission execution, context-aware AI guide, project workspace, integer minor unit financial ledger with external earnings submission, gamification XP/levels, and admin oversight.
- **Requirements:** REQ-AUTH-01..03, REQ-PUBLIC-01..03, REQ-MISSION-01..03, REQ-GUIDE-01..03, REQ-LEDGER-01, REQ-LEDGER-04, REQ-PROJECTS-01..02, REQ-GAMIFICATION-01..02, REQ-ADMIN-01..02
- **Success Criteria:**
  1. User can register, authenticate, and complete the hardware profile onboarding flow (Lite / Standard / Power tiers).
  2. Public visitors can browse transparent landing page, searchable AI tool directory, and opportunity explorer.
  3. User can start an active mission, navigate through beginner steps with `NEXT`, `BACK`, `EXPLAIN`, `I'M STUCK`, and `SHOW EXAMPLE`.
  4. AI Guide provides responsive, context-aware guidance tailored to the user's specific step and hardware tier.
  5. User can manage project workspace with notes, links, and evidence submissions.
  6. Financial ledger accurately calculates 80/20 splits using integer minor units (cents) with no float drift.
  7. External earnings claims can be submitted with proof and reviewed by administrators.
  8. XP and level progression trigger reliably upon step completion.
  9. Admin portal enables creation and moderation of tools, opportunities, and missions.

---

### Phase 2: Autonomous Research & Scoring Pipeline
**Goal:** Implement automated ingestion using SearchProvider abstraction (Brave, Exa, Tavily, Mock), source verification, pricing classifier, and opportunity scoring matrix.
- **Requirements:** REQ-RESEARCH-01, REQ-RESEARCH-02, REQ-RESEARCH-03, REQ-SECURITY-02
- **Success Criteria:**
  1. Search provider queries and ingests real-time tool and opportunity data.
  2. Untrusted web data is sanitized and parsed into validated Zod schemas.
  3. Transparent Opportunity (0-100), Risk (0-100), and Confidence (0-100) scores are computed.
  4. Admin dashboard reflects automated research jobs with source attributions.

---

### Phase 3: Real-Money Payment Rails & Verification
**Goal:** Enable direct platform checkouts with live Stripe Connect adapters, automated ledger payouts, and image hashing anti-fraud verification.
- **Requirements:** REQ-LEDGER-02, REQ-LEDGER-03, REQ-LEDGER-04
- **Success Criteria:**
  1. Stripe checkout generates payment session and verifies webhooks.
  2. Double-entry journal entries reconcile balances with zero discrepancies.
  3. External earnings verification console detects duplicate evidence hashes.

---

### Phase 4: Self-Learning & Mission Optimization
**Goal:** Track user telemetry on step drop-offs and generate versioned mission iterations.
- **Success Criteria:**
  1. Step abandonment rates trigger improvement proposals.
  2. Candidate mission versions (`v1.1`) are generated and evaluated.

---

### Phase 5: Global Localization & Multi-Agent Evolution
**Goal:** Deploy multi-language support, regional eligibility rules, and Level 1–4 autonomy guardrails.
- **Success Criteria:**
  1. Multi-currency and regional tool filtering operate dynamically.
  2. Sandboxed agent code improvements pass strict test and security gates.
