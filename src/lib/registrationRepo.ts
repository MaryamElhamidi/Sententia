import { supabase, hasSupabaseConfig } from '@/lib/supabaseClient';

const PENDING_REGISTRATION_KEY = 'sententia.pending.registration.v1';

export interface PendingRegistrationMeta {
    role: 'candidate' | 'manager' | 'admin';
    consentGiven: boolean;
    consentDate?: string;
}

export function savePendingRegistration(meta: PendingRegistrationMeta) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PENDING_REGISTRATION_KEY, JSON.stringify(meta));
}

function consumePendingRegistration(): PendingRegistrationMeta | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(PENDING_REGISTRATION_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as PendingRegistrationMeta;
        window.localStorage.removeItem(PENDING_REGISTRATION_KEY);
        return parsed;
    } catch {
        window.localStorage.removeItem(PENDING_REGISTRATION_KEY);
        return null;
    }
}

export async function upsertRegisteredUser(user: { id: string; name: string; email: string }) {
    const pending = consumePendingRegistration();
    const role = pending?.role || 'candidate';
    const consentGiven = Boolean(pending?.consentGiven);
    const consentDate = pending?.consentDate || null;

    if (!hasSupabaseConfig || !supabase) {
        return {
            provider: 'mock',
            role,
            consentGiven,
            source: 'fallback'
        };
    }

    const payload = {
        auth_provider_id: user.id,
        full_name: user.name,
        email: user.email,
        role,
        consent_given: consentGiven,
        consent_date: consentDate,
        last_login_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('registered_users')
        .upsert(payload, { onConflict: 'auth_provider_id' })
        .select('*')
        .maybeSingle();

    if (error) {
        return {
            provider: 'supabase',
            role,
            consentGiven,
            source: 'upsert-error'
        };
    }

    return {
        provider: 'supabase',
        role: (data?.role || role) as 'candidate' | 'manager' | 'admin',
        consentGiven: Boolean(data?.consent_given ?? consentGiven),
        source: 'registered_users'
    };
}
