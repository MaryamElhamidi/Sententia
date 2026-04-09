# Sententia

Sententia is a full-stack-style cognitive bias insight dashboard built with Next.js (frontend + application logic) and Supabase (database backend).

This implementation includes:

- LocalStorage-based user sign-up/sign-in for local development.
- Supabase-backed activity/resource retrieval (with fallback seed data).
- PIPEDA consent gate with audit logging behavior.
- Strategy, Proxy, and Repository design patterns in the insight engine.

## Tech Stack

- Frontend: Next.js App Router + React + Tailwind CSS
- Application Logic: TypeScript services and domain classes in `src/lib`
- Database: Supabase Postgres

## Class Coverage (Grading Map)

This section maps your original design classes to implemented code.

### Core Class Implementations

In [src/lib/profileEngine.ts](src/lib/profileEngine.ts):

- `ProfileProxy`
  - Implements Proxy pattern.
  - Wraps `RealProfileService`.
  - Logs access/consent events via `PIPEDALogger` before delegation.

- `RealProfileService`
  - Service layer used by proxy.
  - Reads profile and consent via repository.
  - Updates consent record.

- `UserProfileRepo`
  - Implements Repository pattern abstraction for user profile and consent records.
  - Methods:
    - `fetchProfileByUserId()`
    - `getConsentRecord()`
    - `updateConsentRecord()`

- `PIPEDALogger`
  - Implements consent/profile access audit log behavior.
  - Methods:
    - `log()`
    - `getLastLog()`

- `ProfileController`
  - Controller entry point from UI.
  - Method:
    - `onViewProfile()`

- `AnchoringBiasStrategy`
- `OverconfidenceStrategy`
  - Implements Strategy pattern behavior for score/severity mapping.

- `ImprovementActivityLog`
  - Implements activity repository/service for de-biasing resources.
  - Methods:
    - `listAllActivities()`
    - `findActivityByBias()`
    - `findActivityById()`

### Domain Model Equivalents

- `CognitiveProfile`:
  - Implemented as typed payload `CognitiveProfilePayload` and repository-generated profile object in [src/lib/profileEngine.ts](src/lib/profileEngine.ts).
- `CognitiveBias`:
  - Implemented as typed item `CognitiveBiasInsight` in [src/lib/profileEngine.ts](src/lib/profileEngine.ts).
- `ImprovementActivityLog`:
  - Implemented as concrete class in [src/lib/profileEngine.ts](src/lib/profileEngine.ts).

Note: `IBiasCalculationStrategy` is represented by concrete strategy classes and `strategyRegistry` instead of a separate explicit interface declaration.

## Sequence Diagram Alignment

Implemented runtime flow (aligned to your sequence intent):

1. User opens dashboard.
2. UI calls `ProfileController.onViewProfile(userId)`.
3. Controller calls `ProfileProxy.getProfileData(userId)`.
4. Proxy logs with `PIPEDALogger.log(userId, 'PROFILE_READ')`.
5. Proxy delegates to `RealProfileService.getProfileData(userId)`.
6. Service calls:
   - `UserProfileRepo.fetchProfileByUserId(userId)`
   - `UserProfileRepo.getConsentRecord(userId)`
7. UI checks consent state and displays blocking consent gate if required.
8. On `I Agree`, UI calls `ProfileProxy.handleConsentUpdate()`.
9. Proxy logs `CONSENT_UPDATED` and delegates to service/repository update.
10. UI renders profile + bias insights + activity log.

## Zone Mapping (UI Responsibility)

### Zone 1 — Registration & Consent Gate

File: [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)

- Blocking modal on first load.
- Scroll-to-bottom required before enabling `I Agree`.
- Consent update routed through proxy (logged).

### Zone 2 — Personal Profile & Bias Insight View

Files:

- [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
- [src/app/dashboard/insights/page.tsx](src/app/dashboard/insights/page.tsx)
- [src/app/dashboard/insights/[biasSlug]/page.tsx](src/app/dashboard/insights/[biasSlug]/page.tsx)

Features:

- Profile summary (`profileID`, generation date, summary).
- Bias cards with intensity bar, severity badge, plain-English explanation.
- Detailed bias pages with score rationale.

### Zone 3 — Improvement Activity Log

Files:

- [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
- [src/app/dashboard/activities/page.tsx](src/app/dashboard/activities/page.tsx)
- [src/app/dashboard/activities/[activityId]/page.tsx](src/app/dashboard/activities/[activityId]/page.tsx)

Features:

- Per-bias filtered activities.
- 2-3 tailored exercises shown in dashboard zone.
- Click-through full activity pages.

## How Supabase Is Used

Supabase is used as the database backend for resource-driven behavior:

1. `de_biasing_resources` table is queried in `ImprovementActivityLog.listAllActivities()`.
2. If rows are available, activities are rendered from Supabase data.
3. If Supabase is unavailable or empty, fallback seed data is used.
4. Optional registration metadata support is available in [src/lib/registrationRepo.ts](src/lib/registrationRepo.ts) and `registered_users` schema.

## Environment Setup

Use [\.env.example](.env.example) to create [\.env.local](.env.local).

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Migration

Run this SQL in Supabase SQL Editor:

- [supabase/migrations/20260409_init_sententia_tables.sql](supabase/migrations/20260409_init_sententia_tables.sql)

This creates:

- `registered_users` (with unique `auth_provider_id`)
- `de_biasing_resources` (with seed activities)

## Security Note

- Do not place your Supabase project password or service-role secret in source files or README.
- Only use the public anon key in `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side access patterns.

## Run Locally

1. `npm install`
2. Configure [\.env.local](.env.local)
3. Run migration SQL in Supabase
4. `npm run dev`

## Notes

- Dashboard label is set to Personal Profile Dashboard.
- Consent audit state is visible via PIPEDA compliance indicators while full log remains internal.
