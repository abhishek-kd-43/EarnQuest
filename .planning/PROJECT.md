# EarnQuest (EQ)

## What We Are Building
**EarnQuest** is a production-oriented global web platform ("Turn your computer into an opportunity engine") that empowers everyday people to discover legitimate, real-world income paths using their personal computer, internet access, free/open-source AI tools, and guided execution workflows.

Rather than being a static list of tools or generic money-making tips, EarnQuest continuously runs an autonomous research-to-execution loop:
**Discover Tools → Validate Market Demand → Combine into Workflows → Evaluate & Score → Generate Step-by-Step Missions → Guide User Execution → Verify Real-World Outcomes → Self-Learn & Self-Improve.**

## Core Constraints & Principles
1. **No Fake Autonomy or Integrations:** External providers (Search, LLM, Payments, Storage) use abstracted interfaces with robust mock adapters for development/testing and production connectors for live deployment.
2. **Deterministic Financial Ledger:** All monetary amounts are handled strictly as integer minor units (cents). Platform fees are 20% on direct checkouts, with 80% to users. External earnings are tracked distinctly with evidence verification.
3. **No Unrealistic Guarantees:** Disclaimers distinguish potential, estimated, and verified earnings. Zero tolerance for spam, fraud, copyright violations, or platform manipulation.
4. **Hardware-Aware Onboarding:** Categorizes user machines into Lite (web-only), Standard (lightweight installs), and Power (local AI/GPU) to deliver tailored, feasible missions.
5. **Multi-Agent Architecture with Strict Least Privilege:** Discrete agents (Research, Tool Analysis, Opportunity, Mission, Guide, Ledger, Evaluation, Security) bounded by explicit permission envelopes and approval gates.

## Key Stakeholders & Personas
- **The Beginner User:** Has a laptop/PC and time, wants to learn legitimate skills and earn income without upfront software costs.
- **The Power Creator / Builder:** Has mid-to-high-spec hardware, seeking advanced workflows (local LLMs, automation scripts, micro-SaaS).
- **The Platform Admin / Verifier:** Oversees mission quality, audits tool sources, verifies earnings claims, and reviews AI-proposed improvements.

## Active Tech Stack
- **Framework:** Next.js 14+ (App Router, Server Components & Server Actions)
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL / SQLite via Prisma ORM
- **Validation:** Zod
- **Styling & UI:** Tailwind CSS, Lucide Icons, Accessible Glassmorphic/Futuristic Dark & Light theme
- **Testing:** Vitest & Node test runner
- **Security:** Argon2/bcrypt password hashing, HTTP-only secure cookies, CSRF protection, rate limiting
