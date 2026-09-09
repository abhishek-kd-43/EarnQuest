# AGENTS.md — EarnQuest Project Instructions & Agent Guidelines

## 1. Project Overview
EarnQuest ("Turn your computer into an opportunity engine") is a production-oriented global web platform helping ordinary people discover legitimate real-world income paths using their PC/laptop, free AI tools, and guided missions.

## 2. Mandatory Architectural Constraints
- **Zero Fake Implementations:** Do not claim real integrations or autonomy where mocks exist. Providers (`AIProvider`, `SearchProvider`, `PaymentProvider`, `StorageProvider`) must use clean interfaces with swappable mock adapters and production connectors.
- **Financial Rigor:** All monetary calculations MUST use integer minor currency units (cents). Platform fee is 20%; user share is 80%. Never compute currency using floating-point math.
- **Security & Safety:** Strict input validation with Zod. Never recommend fraud, scams, fake reviews, scraping copyrighted content, or violating third-party platform terms.
- **Hardware-Aware Workflow:** Respect user environment tiers (`TIER_1_LITE`, `TIER_2_STANDARD`, `TIER_3_POWER`). Never recommend heavy local models to low-spec hardware without warning.

## 3. Documentation Reference
- Architecture: [docs/architecture.md](file:///c:/Users/cw/Downloads/EarnQuest/docs/architecture.md)
- Roadmap: [docs/roadmap.md](file:///c:/Users/cw/Downloads/EarnQuest/docs/roadmap.md)
- Multi-Agent Architecture: [docs/agents.md](file:///c:/Users/cw/Downloads/EarnQuest/docs/agents.md)
- Security Architecture: [docs/security.md](file:///c:/Users/cw/Downloads/EarnQuest/docs/security.md)
- Research Engine: [docs/research-system.md](file:///c:/Users/cw/Downloads/EarnQuest/docs/research-system.md)
- Payment Architecture: [docs/payment-architecture.md](file:///c:/Users/cw/Downloads/EarnQuest/docs/payment-architecture.md)
