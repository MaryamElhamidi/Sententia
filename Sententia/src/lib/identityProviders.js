import { createClient } from '@supabase/supabase-js';
import { createAuth0Client } from '@auth0/auth0-spa-js';

const mockUser = {
    id: '7',
    displayName: 'Yammy A.',
    email: 'yammy@example.com'
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

let supabaseClient;
let auth0ClientPromise;

function getSupabaseClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }

    return supabaseClient;
}

async function getAuth0Client() {
    if (!auth0Domain || !auth0ClientId) {
        return null;
    }

    if (!auth0ClientPromise) {
        auth0ClientPromise = createAuth0Client({
            domain: auth0Domain,
            clientId: auth0ClientId,
            authorizationParams: {
                redirect_uri: window.location.origin
            },
            cacheLocation: 'localstorage',
            useRefreshTokens: true
        });
    }

    const client = await auth0ClientPromise;

    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        await client.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    return client;
}

export const authGateway = {
    async getSessionUser() {
        const client = await getAuth0Client();

        if (!client) {
            return {
                provider: 'mock',
                isAuthenticated: true,
                user: mockUser
            };
        }

        const isAuthenticated = await client.isAuthenticated();
        if (!isAuthenticated) {
            return {
                provider: 'auth0',
                isAuthenticated: false,
                user: null
            };
        }

        const auth0User = await client.getUser();
        return {
            provider: 'auth0',
            isAuthenticated: true,
            user: {
                id: auth0User?.sub || mockUser.id,
                displayName: auth0User?.name || auth0User?.nickname || mockUser.displayName,
                email: auth0User?.email || mockUser.email
            }
        };
    },
    async login() {
        const client = await getAuth0Client();
        if (!client) return;
        await client.loginWithRedirect();
    }
};

export const registrationGateway = {
    async getRegistrationRecord(user) {
        const client = getSupabaseClient();
        const userId = user?.id || mockUser.id;

        if (!client) {
            return {
                provider: 'mock',
                status: 'registered',
                userId,
                source: 'fallback'
            };
        }

        const { data, error } = await client
            .from('registered_users')
            .select('*')
            .eq('auth_provider_id', userId)
            .maybeSingle();

        if (error) {
            return {
                provider: 'supabase',
                status: 'unknown',
                userId,
                source: 'query-error'
            };
        }

        if (!data) {
            return {
                provider: 'supabase',
                status: 'missing',
                userId,
                source: 'registered_users'
            };
        }

        return {
            provider: 'supabase',
            status: 'registered',
            userId,
            source: 'registered_users',
            record: data
        };
    }
};

export const integrationFlags = {
    hasSupabaseConfig: Boolean(supabaseUrl && supabaseAnonKey),
    hasAuth0Config: Boolean(auth0Domain && auth0ClientId)
};
