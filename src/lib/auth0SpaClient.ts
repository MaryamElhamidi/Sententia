import { createAuth0Client } from '@auth0/auth0-spa-js';

const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
const configuredRedirectUri = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI;

export const hasAuth0Config = Boolean(domain && clientId);

let auth0ClientPromise: ReturnType<typeof createAuth0Client> | null = null;

async function getClient() {
    if (!hasAuth0Config) return null;

    if (!auth0ClientPromise) {
        auth0ClientPromise = createAuth0Client({
            domain: domain as string,
            clientId: clientId as string,
            authorizationParams: {
                redirect_uri: configuredRedirectUri || `${window.location.origin}/dashboard`,
                ...(audience ? { audience } : {})
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

export const auth0Gateway = {
    async getSessionUser() {
        const client = await getClient();
        if (!client) {
            return {
                provider: 'mock',
                isAuthenticated: false,
                user: null
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

        const user = await client.getUser();
        return {
            provider: 'auth0',
            isAuthenticated: true,
            user: {
                id: user?.sub || user?.email || 'auth0-user',
                name: user?.name || user?.nickname || 'User',
                email: user?.email || ''
            }
        };
    },

    async login(loginHint?: string) {
        const client = await getClient();
        if (!client) return;
        await client.loginWithRedirect({
            appState: { returnTo: '/dashboard' },
            authorizationParams: {
                ...(loginHint ? { login_hint: loginHint } : {})
            }
        });
    },

    async signup(loginHint?: string) {
        const client = await getClient();
        if (!client) return;
        await client.loginWithRedirect({
            appState: { returnTo: '/dashboard' },
            authorizationParams: {
                screen_hint: 'signup',
                ...(loginHint ? { login_hint: loginHint } : {})
            }
        });
    },

    async logout() {
        const client = await getClient();
        if (!client) return;
        await client.logout({
            logoutParams: {
                returnTo: `${window.location.origin}/auth/signin`
            }
        });
    }
};
