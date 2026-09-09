# EarnQuest — System Architecture Document

> **Tagline:** *"Turn your computer into an opportunity engine."*  
> **Status:** Architecture Baseline v1.0  
> **Target Audience:** Lead Architect, Senior Engineers, DevOps, Security, and AI Agents.

---

## 1. Executive Summary & Architectural Principles

EarnQuest is an autonomous, global, web-based economic opportunity platform. It enables individuals worldwide—regardless of existing professional background or initial capital—to leverage their personal computers, internet access, free/open-source tools, and AI to discover, build, deploy, and monetize legitimate digital products, workflows, services, and assets.

### Core Architectural Tenets
1. **Never Fake Autonomy or Integrations:** External providers (search, scraping, LLMs, payment gateways, sandbox runtimes) are modeled through clean interfaces with swappable mock adapters and production connectors.
2. **Deterministic Financial Ledger:** All currency values are strictly stored as integer minor units (e.g., cents) with an immutable double-entry style ledger. Platform fee is 20%; creator share is 80% on platform-processed checkouts. External earnings are tracked separately under distinct verification statuses.
3. **Safety & Platform Rule Compliance:** Zero tolerance for fraud, spam, automated engagement abuse, copyright infringement, or deceptive practices. Any opportunity violating third-party terms of service or legal regulations is rejected or flagged as `REQUIRES_REVIEW`.
4. **Resilient Closed Loop:** Discovered tools + validated market needs → verified opportunities → structured step-by-step missions → real-world execution → evidence verification & telemetry → feedback & self-improvement.
5. **Global-First Adaptability:** Built-in localization, multi-currency display, regional eligibility checks, and hardware environment profiling (e.g., low-spec browser workflows vs. high-spec local AI setups).

---

## 2. High-Level System Architecture

```mermaid
graph TD
    subgraph Client Layer
        WebUI[Next.js App Router UI]
        SysCheck[Browser Hardware Profiler]
        GuideWidget[Interactive AI Guide Modal/Panel]
    end

    subgraph API & Application Layer
        APIRoutes[Next.js API Routes & Server Actions]
        AuthModule[Auth & RBAC Middleware]
        Validation[Zod Runtime Validation Pipeline]
    end

    subgraph Core Domain Subsystems
        MissionEngine[Mission & Step Execution Engine]
        ResearchPipeline[Autonomous Research Pipeline]
        OpportunityScoring[Opportunity Evaluation & Scoring Matrix]
        LedgerSystem[Financial Ledger & Payout Subsystem]
        GamificationEngine[XP, Badges, Level Progression]
        SelfImprovement[Feedback & Mission Versioning Loop]
    end

    subgraph Abstraction & Provider Layer
        AIProvider[AI Provider Abstraction<br/>(OpenAI, Anthropic, Gemini, Mock)]
        SearchProvider[Web Research Abstraction<br/>(Brave, Exa, Tavily, Mock)]
        PaymentProvider[Payment Provider Abstraction<br/>(Stripe, PayPal, Mock)]
        StorageProvider[Object Storage Abstraction<br/>(S3, GCS, Local File)]
    end

    subgraph Data & Persistence Layer
        PrismaORM[Prisma ORM Client]
        PostgresDB[(PostgreSQL Database)]
        AuditStore[(Immutable Audit Logs)]
    end

    Client Layer --> APIRoutes
    APIRoutes --> AuthModule
    AuthModule --> Validation
    Validation --> Core Domain Subsystems
    Core Domain Subsystems --> Abstraction & Provider Layer
    Core Domain Subsystems --> PrismaORM
    PrismaORM --> PostgresDB
    Core Domain Subsystems --> AuditStore
```

---

## 3. Technology Stack Specification

| Component | Selected Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | Unified React frontend with server components and edge/node API handlers. |
| **Language** | TypeScript (Strict Mode) | Full type safety across client, server, domain entities, and provider interfaces. |
| **Styling** | Tailwind CSS + Custom Design System | High-performance, responsive, accessible dark/light theme, modern futuristic aesthetic. |
| **Database** | PostgreSQL (via Prisma ORM) | Relational integrity, ACID transactions for financial ledger, rich JSONB support for tool/mission specs. SQLite supported in local dev. |
| **Validation** | Zod | Runtime schema validation for API inputs, environment variables, external API responses, and agent outputs. |
| **Authentication** | Secure Session & Password Hashing (Argon2id / bcrypt) | Cookie-based HTTP-only session tokens with strict CSRF and rate limiting. |
| **Job Queue** | In-Memory Async Worker / Redis-backed Queue | Background orchestration for research cycles, opportunity re-evaluation, and evidence review. |
| **Testing** | Vitest & Node Test Runner | High-speed unit and integration testing of scoring algorithms, ledger calculations, and agent pipelines. |

---

## 4. Subsystem Breakdown

### 4.1. Hardware & Environment Profiling
- Detects OS, browser capabilities, approximate device concurrency, and user-provided RAM/GPU status.
- Tags user profiles with an environment tier:
  - `TIER_1_LITE`: Chromebooks, low-spec PCs (<8GB RAM, integrated GPU) -> Focus on web-based free tools (Canva, Google Colab, Hugging Face Spaces, web app builders).
  - `TIER_2_STANDARD`: Mid-tier PCs (8-16GB RAM) -> Lightweight local installs, Node.js/Python micro-tools, standard audio/image generation APIs.
  - `TIER_3_POWER`: High-tier workstations (16GB+ RAM, dedicated GPU) -> Local LLMs (Ollama, LM Studio), Stable Diffusion/Flux local generation, Docker containers, full-stack compilation.

### 4.2. Autonomous Research & Ingestion Pipeline
- **Discovery:** Scrapes/queries search providers on scheduled cron intervals for AI tools, APIs, and commercial workflows.
- **Normalization & Deduplication:** Generates normalized slugs, deduplicates domains and canonical tool identities.
- **Verification & Sourcing:** Stores source URLs, retrieved dates, citation evidence, and pricing tier checks (`FREE`, `FREEMIUM`, `OPEN_SOURCE`, `FREE_WITH_LIMITS`).
- **Safety Gate:** Rejects blacklisted domains, deceptive affiliate farms, or opportunities involving spam/fraud.

### 4.3. Opportunity Evaluation & Scoring Matrix
- Calculates:
  - **Opportunity Score (0-100):** Weighted composite of beginner accessibility (25%), market demand (25%), free tool availability (20%), monetization clarity (15%), scalability (15%).
  - **Risk Score (0-100):** Platform risk, compliance liability, commercial license restrictions, saturation level.
  - **Confidence Score (0-100):** Verifiability of sources, primary vs secondary documentation, freshness.

### 4.4. Mission Generation & Step Engine
- Converts qualified opportunities into structured, versioned missions (`v1.0.0`).
- Generates 10-15 atomic steps in **Beginner Mode** (e.g., Open browser -> Visit official site -> Configure -> Prompt -> Build -> Verify -> Market -> Monetize).
- Supports interactive actions: `NEXT_STEP`, `BACK`, `EXPLAIN`, `I_AM_STUCK`, `SHOW_EXAMPLE`.

### 4.5. Financial Ledger & Revenue Distribution
- Built on integer minor units (USD cents or localized minor units).
- Direct platform checkouts trigger an automated 80/20 split:
  $$\text{Gross} = \text{PlatformFee (20\%)} + \text{UserShare (80\%)}$$
- External revenue (Upwork, Gumroad, Stripe external, client invoices) tracked as self-reported evidence requiring verification (`UNVERIFIED` -> `SUBMITTED` -> `UNDER_REVIEW` -> `VERIFIED`).

### 4.6. Self-Improvement & Mission Optimization Loop
- Tracks telemetry on drop-off rates per step, error reports, and user feedback.
- If a step exhibits >30% abandonment, triggers an automated revision proposal:
  $$\text{ImprovementScore} = \frac{\text{Benefit} + \text{Confidence}}{\text{Risk}}$$
- Evaluates candidate mission versions (`v1.1.0`) against control benchmarks before human admin promotion.

---

## 5. Directory & File Organization

```text
EarnQuest/
├── docs/                      # Master engineering specifications
│   ├── architecture.md
│   ├── roadmap.md
│   ├── agents.md
│   ├── security.md
│   ├── research-system.md
│   └── payment-architecture.md
├── prisma/                    # Database schema and migration scripts
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/                   # Next.js App Router pages & layouts
│   │   ├── (public)/          # Landing, how-it-works, explore, pricing
│   │   ├── (auth)/            # Login, register, onboarding
│   │   ├── (dashboard)/       # User dashboard, missions, active projects
│   │   ├── admin/             # Operational admin control center
│   │   └── api/               # REST API route handlers
│   ├── components/            # Reusable UI component library
│   │   ├── ui/                # Buttons, cards, modals, badges, inputs
│   │   ├── mission/           # Stepper, checklist, AI guide chat
│   │   ├── tools/             # Tool cards, filter drawer, details modal
│   │   └── ledger/            # Financial charts, transaction table
│   ├── lib/                   # Core business logic & shared modules
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # Authentication utilities
│   │   └── utils.ts           # String, date, currency helpers
│   ├── providers/             # Abstracted external interfaces & adapters
│   │   ├── ai/                # AIProvider (Mock, OpenAI, Anthropic, Gemini)
│   │   ├── search/            # SearchProvider (Mock, Brave, Tavily)
│   │   ├── payment/           # PaymentProvider (Mock, Stripe)
│   │   └── storage/           # StorageProvider (Mock, Local, S3)
│   └── services/              # Domain orchestrators
│       ├── research.service.ts
│       ├── opportunity.service.ts
│       ├── mission.service.ts
│       ├── ledger.service.ts
│       └── feedback.service.ts
└── tests/                     # Unit, integration, and scoring tests
```
