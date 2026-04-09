# Sententia

Sententia is a cognitive bias insight dashboard with:

- LocalStorage-based sign-in/sign-up for local development
- Supabase-backed activity data (and optional registration metadata)
- PIPEDA consent gating and audit logging
- Bias insight rendering with Strategy, Proxy, and Repository patterns

## Architecture Map

### Core Domain + Pattern Classes

All core classes are implemented in [src/lib/profileEngine.ts](src/lib/profileEngine.ts):

- `UserProfileRepo`
	- Repository pattern for profile and consent data
	- Methods: `fetchProfileByUserId`, `getConsentRecord`, `updateConsentRecord`
- `ImprovementActivityLog`
	- Activity repository service sourcing from Supabase table `de_biasing_resources` when available, with fallback seed data
	- Methods: `listAllActivities`, `findActivityByBias`, `findActivityById`
- `PIPEDALogger`
	- Consent/profile access audit logger
	- Methods: `log`, `getLastLog`
- `RealProfileService`
	- Service orchestration for profile + consent + activity access
	- Methods: `getProfileData`, `updateConsent`
- `ProfileProxy`
	- Proxy pattern layer that logs via `PIPEDALogger` before delegating to service
	- Methods: `getProfileData`, `handleConsentUpdate`
- `ProfileController`
	- Controller entrypoint for view requests
	- Method: `onViewProfile`
- `AnchoringBiasStrategy` and `OverconfidenceStrategy`
	- Strategy pattern implementations for score/severity mapping

### Auth + Registration Providers

- Local auth/session store: [src/lib/authClient.ts](src/lib/authClient.ts)
- Supabase client: [src/lib/supabaseClient.ts](src/lib/supabaseClient.ts)
- Optional registration metadata helper: [src/lib/registrationRepo.ts](src/lib/registrationRepo.ts)

### UI and Feature Zones

- Zone 1 (Registration & Consent Gate): [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
	- Blocking consent modal, scroll-to-bottom requirement, `I Agree` gate
	- Consent action is routed through `ProfileProxy.handleConsentUpdate`
- Zone 2 (Personal Profile & Bias Insight View): [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
	- Displays profile summary, bias cards, intensity bars, severity, rationale
	- Detailed bias pages:
		- [src/app/dashboard/insights/page.tsx](src/app/dashboard/insights/page.tsx)
		- [src/app/dashboard/insights/[biasSlug]/page.tsx](src/app/dashboard/insights/[biasSlug]/page.tsx)
- Zone 3 (Improvement Activity Log): [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
	- Filtered activities per bias from `ImprovementActivityLog`
	- Activity pages:
		- [src/app/dashboard/activities/page.tsx](src/app/dashboard/activities/page.tsx)
		- [src/app/dashboard/activities/[activityId]/page.tsx](src/app/dashboard/activities/[activityId]/page.tsx)

## Sequence Flow (Implementation vs Diagram)

Implemented flow matches your sequence intent:

1. User lands on dashboard page.
2. Dashboard resolves identity from local session (`authClient`).
3. Dashboard optionally uses Supabase-backed resources for activities.
4. Dashboard calls `profileRuntime.controller.onViewProfile(userId)`.
5. `ProfileController` calls `ProfileProxy.getProfileData(userId)`.
6. `ProfileProxy` writes audit event to `PIPEDALogger.log(userId, 'PROFILE_READ')`, then delegates.
7. `RealProfileService.getProfileData` calls:
	 - `UserProfileRepo.fetchProfileByUserId`
	 - `UserProfileRepo.getConsentRecord`
8. Consent gate evaluates local consent state and repository consent.
9. On `I Agree`, dashboard calls `ProfileProxy.handleConsentUpdate`.
10. `ProfileProxy` logs `CONSENT_UPDATED` and forwards to service/repository update.
11. UI renders profile + insights + activity log.

## ConsentAuditLog Visibility

- User-visible indicators:
	- PIPEDA compliance card/badge in dashboard
	- Last audit timestamp display
- Internal logger object:
	- `profileRuntime.logger` in [src/lib/profileEngine.ts](src/lib/profileEngine.ts)

## Required Environment Variables

Use [\.env.example](.env.example) as template:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Quick Setup (Local Auth + Supabase)

1. Create [\.env.local](.env.local) from [\.env.example](.env.example).
2. Fill in all values (Auth0 and Supabase).
3. Open Supabase SQL Editor and run:
	- [supabase/migrations/20260409_init_sententia_tables.sql](supabase/migrations/20260409_init_sententia_tables.sql)
4. Verify that these tables now exist:
	- `registered_users`
	- `de_biasing_resources`
5. Start app:
	- `npm run dev`

## Supabase Tables Expected

### `registered_users`

- `auth_provider_id` (unique)
- `full_name`
- `email`
- `role`
- `consent_given`
- `consent_date`
- `last_login_at`

### `de_biasing_resources`

- `id`
- `bias_type`
- `title`
- `description`
- `duration`
- `type`
- `why_it_helps`
- `steps` (array/json)
- `reflection_prompt`

## Notes

- If Supabase environment variables are missing, the app falls back to seeded mock activity data.
- The dashboard title and navigation label use "Personal Profile Dashboard" as requested.
