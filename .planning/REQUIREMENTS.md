# EarnQuest — System Requirements Specification

## Priority Matrix
- **P0 (Critical for MVP):** REQ-AUTH, REQ-PUBLIC, REQ-MISSION, REQ-GUIDE, REQ-LEDGER, REQ-ADMIN
- **P1 (Core Product):** REQ-RESEARCH, REQ-GAMIFICATION, REQ-PROJECTS, REQ-SECURITY
- **P2 (Advanced Evolution):** REQ-SELF-IMPROVE, REQ-GLOBAL-I18N, REQ-SANDBOX

---

## Requirements Index

### 1. Authentication & Hardware Onboarding (REQ-AUTH)
- **REQ-AUTH-01:** System must allow users to register and sign in securely with email and password (hashed with Argon2/bcrypt).
- **REQ-AUTH-02:** System must implement role-based access control (`USER`, `VERIFIER`, `ADMIN`).
- **REQ-AUTH-03:** System must conduct a client-side environment check (OS, browser, device memory/concurrency) and classify users into hardware tiers (`TIER_1_LITE`, `TIER_2_STANDARD`, `TIER_3_POWER`).

### 2. Public Experience & Transparency (REQ-PUBLIC)
- **REQ-PUBLIC-01:** Landing page must clearly articulate the "Turn your computer into an opportunity engine" philosophy without promising guaranteed income.
- **REQ-PUBLIC-02:** Public directories must display vetted AI tools with explicit free tier restrictions (`FREE`, `FREEMIUM`, `OPEN_SOURCE`, `FREE_WITH_LIMITS`).
- **REQ-PUBLIC-03:** Opportunity Explorer must showcase scored monetization avenues with transparent risk and confidence indicators.

### 3. Mission Execution & Beginner Mode (REQ-MISSION)
- **REQ-MISSION-01:** System must provide structured, 10–15 step beginner missions spanning creation, testing, marketing, and monetization.
- **REQ-MISSION-02:** The Mission Stepper must support non-overwhelming step navigation (`NEXT_STEP`, `BACK`, `EXPLAIN`, `I'M STUCK`, `SHOW_EXAMPLE`).
- **REQ-MISSION-03:** Missions must define clear prerequisites, hardware tier compatibility, and required free tools.

### 4. Personal AI Guide (REQ-GUIDE)
- **REQ-GUIDE-01:** Embedded AI Guide must maintain real-time awareness of user hardware profile, active mission, and current step.
- **REQ-GUIDE-02:** AI Guide must offer prompt templates, simplified explanations, and safe troubleshooting without claiming to execute local PC actions.
- **REQ-GUIDE-03:** Guide operates through a clean provider abstraction (`AIProvider`) with working mock and live API connectors.

### 5. Financial Ledger & Revenue Share (REQ-LEDGER)
- **REQ-LEDGER-01:** All monetary math must be calculated strictly in integer minor units (cents) to eliminate floating-point drift.
- **REQ-LEDGER-02:** Platform-processed sales must automatically divide gross revenue into 20% platform fee and 80% user earnings.
- **REQ-LEDGER-03:** System must log all credits, debits, holds, and payouts in an immutable, append-only ledger.
- **REQ-LEDGER-04:** Users must be able to submit external earnings proof (screenshots, invoice links) with statuses (`UNVERIFIED`, `SUBMITTED`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`).

### 6. User Projects & Workspace (REQ-PROJECTS)
- **REQ-PROJECTS-01:** Users must have a dedicated project workspace tracking deliverables, evidence links, checklist items, and revenue outcomes.
- **REQ-PROJECTS-02:** File uploads for project evidence must enforce strict MIME-type and size limits (max 5MB).

### 7. Gamification & Progression (REQ-GAMIFICATION)
- **REQ-GAMIFICATION-01:** System must award XP upon step completion, project launches, and verified earnings.
- **REQ-GAMIFICATION-02:** Users advance through tiers (`Explorer` -> `Creator` -> `Builder` -> `Entrepreneur`).

### 8. Administrative Operations (REQ-ADMIN)
- **REQ-ADMIN-01:** Admin portal must allow publishing, editing, and versioning of tools, opportunities, and missions.
- **REQ-ADMIN-02:** Reviewers must be able to inspect submitted external earnings claims and approve or reject with audit notes.

### 9. Autonomous Research & Ingestion Pipeline (REQ-RESEARCH)
- **REQ-RESEARCH-01:** System must ingest web research records via an abstracted `SearchProvider`.
- **REQ-RESEARCH-02:** Tools and opportunities must store complete source attribution, citation snippets, and verification dates.
- **REQ-RESEARCH-03:** Opportunities must be scored algorithmically for Opportunity (0-100), Risk (0-100), and Confidence (0-100).

### 10. Security & Compliance (REQ-SECURITY)
- **REQ-SECURITY-01:** All API endpoints must enforce Zod input validation and rate limiting.
- **REQ-SECURITY-02:** Scraped untrusted web content must be sanitized and isolated from execution contexts to prevent prompt injection.
