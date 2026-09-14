# ADR 0001: Reference-first development

Status: Accepted

## Context

We are building a production-grade Greek pharmacy e-commerce platform from
scratch. A public reference site (`https://www.wecare.gr/`) demonstrates the
expected breadth of a pharmacy storefront (catalogue navigation, product and
brand pages, content/blog areas, informational pages). We have not yet fixed
storefront implementation details (framework, data model, integrations).

The risk of starting implementation immediately is rebuilding the wrong
information architecture: wrong page taxonomy, wrong navigation model, wrong
catalogue/brand/content boundaries — all expensive to fix after code exists.

## Decision

1. **Map before building.** In Phase 0 we inventory the reference site's
   public information architecture and user flows (page types, sections,
   internal-link structure, representative URLs) using polite, read-only
   tooling, before selecting or finalising storefront implementation details.
2. **Reference, do not mirror.** We explicitly do **NOT** download a mirror
   of the reference site and modify/ship it. Raw captures stay local-only
   under `reference-private/` (git-ignored) and serve analysis only.
3. **Clean implementation.** The production application will be a clean
   implementation from our own codebase, with our own design, copy, product
   data (from ERP/vendor/manufacturer sources), and integrations.

## Consequences

- **Positive:** implementation phases start from an evidence-based sitemap
  and page-type catalogue; less rework; clear boundary between
  third-party reference material and our source code; lower legal/quality
  risk (no proprietary assets leak into production).
- **Negative / costs:** Phase 0 produces tooling and inventories rather than
  user-facing features; crawler coverage is heuristic (max-pages capped,
  bot-protection may limit observations) and must be labelled as such.
- **Neutral:** framework choice (e.g. Next.js), data schemas, cart/checkout,
  auth, ERP, payments, couriers, Skroutz, AI assistant, and deployment
  decisions are deliberately deferred to later ADRs.
