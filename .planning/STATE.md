# EarnQuest — Project State & Memory

**Active Phase:** Phase 1 (MVP Platform Foundation & Core Loop)  
**Status:** In Progress — Architecture & Planning Complete  
**Last Updated:** 2026-09-09

---

## Current Status Summary
- **Architecture Documentation:** Complete (`docs/architecture.md`, `roadmap.md`, `agents.md`, `security.md`, `research-system.md`, `payment-architecture.md`).
- **GSD Specifications:** Complete (`.planning/PROJECT.md`, `config.json`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`).
- **Next Milestone:** Phase 1 Execution — Scaffold Next.js project, implement Prisma schema, auth, hardware check, missions, AI guide, ledger, seed data, and tests.

---

## Decision Log
1. **Integer Minor Units:** All financial math uses integer cents to eliminate floating-point precision issues.
2. **Provider Abstraction Layer:** All external capabilities (AI, Search, Payments, Storage) use interfaces with working mock adapters to ensure the app is immediately runnable and testable without requiring proprietary API keys.
3. **Hardware-Aware Profiling:** System classifies users into Lite, Standard, and Power tiers so beginners on low-spec laptops receive only browser/lightweight tool recommendations.
4. **Seed Data Transparency:** MVP includes 10 realistic, practical sample missions with real free tools (Audacity, Blender, Canva Free, Ollama, Hugging Face, etc.), explicitly marked as curated initial data.
