# Bhartiya Bazar Flagship Execution Checklist

## 0) Deep project understanding
- [x] Inventory key app routes/components/libs in `src/app`, `src/components`, `src/lib`.
- [x] Review current Settings, Dashboard, Studio, Search, Jobs, Products, AI/search APIs.
- [ ] Crawl and document every behavior on deployed Vercel site end-to-end.
- [ ] Cross-check all prior conversation requirements and convert to acceptance criteria.

## 1) Settings + User dashboard (flagship)
- [x] Build multi-tab Settings shell (profile/account/notifications/privacy/appearance/danger).
- [x] Add LinkedIn/GitHub-style profile inputs (skills/experience/education/social links).
- [x] Add location/media profile fields (mapLink, lat/lng, coverImage, introVideo, gallery URLs).
- [ ] Add direct photo/video uploaders (not only URL fields) for cover/gallery/video.
- [ ] Add profile theme presets, animations, typography and section toggles.
- [ ] Add account sessions list + revoke-all sessions.
- [ ] Add audit log of profile/security changes.

## 2) Business page customization
- [ ] Add business profile studio editor (hero, sections, templates, themes).
- [ ] Add drag/drop section ordering and live preview.
- [ ] Add CTA modules (call, WhatsApp, website, booking).
- [ ] Add custom domain/readiness fields.

## 3) Studio QA and feature hardening
- [ ] Enumerate every studio control/button and map to tests.
- [ ] Add integration tests for CRUD, media upload, publish/unpublish flows.
- [ ] Add loading/error empty states for all studio actions.

## 4) AI search + maps
- [ ] Integrate AI search deeply into home search with intent parsing and ranking.
- [ ] Add map-first search UI with pins/clusters and distance-aware sorting.
- [ ] Add geocoding/reverse-geocoding fallback + permission UX.

## 5) Jobs platform
- [x] Jobs Hub discover/post/mine flow.
- [x] Vacancy + wanted post types.
- [ ] Add advanced job filters (experience, salary range, remote/onsite, freshness).
- [ ] Add job detail pages + apply/contact workflows.

## 6) Product aggregation + external links
- [ ] Expand `/api/fetch-product` into robust parser with schema validation and rate limits.
- [ ] Add business-side “import by URL” wizard (single + bulk).
- [ ] Add buyer-side product search, facets, and redirect tracking.

## 7) Security + privacy hardening
- [ ] Firestore/Storage rules review and least-privilege tightening.
- [ ] Input validation + sanitization layer for user content.
- [ ] Add abuse/rate-limit controls to public APIs.
- [ ] Add CSP/security headers and dependency vulnerability review.

## 8) Performance + quality
- [ ] Add lint/typecheck/build/test CI gates.
- [ ] Add route-level performance budgets and image optimization checks.
- [ ] Add analytics/events for key funnels.

## 9) Delivery workflow
- [ ] Break work into milestone PRs with acceptance criteria and screenshots.
- [ ] Deploy each milestone to Vercel preview and run regression checklist.
- [ ] Merge to `main` and publish release notes.

---

## Current status summary
Completed foundations: settings shell, profile enrichment, map/media profile fields, jobs hub baseline, and type-check fixes.
Remaining work: full flagship scope across studio QA, AI+maps search, complete product aggregation, end-to-end security hardening, and full business page website-builder capabilities.
