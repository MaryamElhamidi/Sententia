-- Sententia core tables for Auth0 registration metadata and de-biasing resources

-- Optional if you want UUID generation defaults
create extension if not exists pgcrypto;

create table if not exists public.registered_users (
  id uuid primary key default gen_random_uuid(),
  auth_provider_id text not null unique,
  full_name text not null,
  email text not null,
  role text not null check (role in ('candidate', 'manager', 'admin')),
  consent_given boolean not null default false,
  consent_date date,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_registered_users_email on public.registered_users(email);
create index if not exists idx_registered_users_role on public.registered_users(role);

create table if not exists public.de_biasing_resources (
  id text primary key,
  bias_type text not null,
  title text not null,
  description text not null,
  duration text not null,
  type text not null check (type in ('reflection', 'behavioral', 'interactive')),
  why_it_helps text not null,
  steps jsonb not null default '[]'::jsonb,
  reflection_prompt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_de_biasing_resources_bias_type on public.de_biasing_resources(bias_type);
create index if not exists idx_de_biasing_resources_type on public.de_biasing_resources(type);

insert into public.de_biasing_resources (
  id,
  bias_type,
  title,
  description,
  duration,
  type,
  why_it_helps,
  steps,
  reflection_prompt
)
values
(
  'act-anchor-price-flip',
  'Anchoring Bias',
  'The Price Flip Exercise',
  'Look at a product price. Estimate what it would cost if you had never seen the label.',
  '5 min',
  'reflection',
  'This separates your raw estimate from the initial anchor to retrain independent valuation.',
  '["Pick one product and note the listed price.", "Hide the listed price and write your independent estimate.", "Compare both values and explain the gap in one sentence."]'::jsonb,
  'Which assumptions made your estimate drift toward the original anchor?'
),
(
  'act-anchor-counter',
  'Anchoring Bias',
  'Counter-Anchor Challenge',
  'Before accepting any estimate in a meeting, generate three alternative reference points.',
  'Ongoing',
  'behavioral',
  'Creating counter-anchors broadens your decision frame before commitment.',
  '["Pause when the first estimate appears.", "Write three alternatives from different contexts.", "Choose a final range only after comparing all anchors."]'::jsonb,
  'Did your final range change after listing counter-anchors?'
),
(
  'act-overconfidence-calibration',
  'Overconfidence',
  'Confidence Calibration Quiz',
  'Answer 10 trivia questions and rate confidence for each answer from 0 to 100.',
  '10 min',
  'interactive',
  'It creates a measurable link between confidence and actual accuracy.',
  '["Answer each question without revising.", "Add a confidence percentage beside every answer.", "Score correctness and compare confidence average to accuracy average."]'::jsonb,
  'Where did confidence exceed evidence, and what cue did you miss?'
),
(
  'act-overconfidence-premortem',
  'Overconfidence',
  'Pre-mortem Thinking',
  'Assume your project failed and list all plausible reasons before execution.',
  '15 min',
  'reflection',
  'Pre-mortems force risk awareness and reduce certainty bias.',
  '["Write the project goal in one sentence.", "Assume failure happened 6 months later.", "List at least five concrete failure causes and one mitigation each."]'::jsonb,
  'Which failure cause surprised you the most once you wrote it down?'
)
on conflict (id) do update set
  bias_type = excluded.bias_type,
  title = excluded.title,
  description = excluded.description,
  duration = excluded.duration,
  type = excluded.type,
  why_it_helps = excluded.why_it_helps,
  steps = excluded.steps,
  reflection_prompt = excluded.reflection_prompt,
  updated_at = now();
