export interface StoredAccount {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'candidate' | 'manager' | 'admin';
    consentGiven: boolean;
    consentDate?: string;
    createdAt: string;
}

export interface AuthSession {
    userId: string;
    name: string;
    email: string;
    role: 'candidate' | 'manager' | 'admin';
    signedInAt: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: 'candidate' | 'manager' | 'admin';
    consentGiven: boolean;
    consentDate?: string;
}

interface SignInPayload {
    email: string;
    password: string;
}

const USERS_KEY = 'sententia.accounts.v1';
const SESSION_KEY = 'sententia.session.v1';

function canUseStorage() {
    return typeof window !== 'undefined';
}

function readAccounts(): StoredAccount[] {
    if (!canUseStorage()) return [];
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeAccounts(accounts: StoredAccount[]) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

function writeSession(session: AuthSession) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getCurrentSession(): AuthSession | null {
    if (!canUseStorage()) return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthSession;
    } catch {
        return null;
    }
}

export function clearSession() {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(SESSION_KEY);
}

export function registerAccount(payload: RegisterPayload) {
    const email = payload.email.trim().toLowerCase();
    const name = payload.name.trim();

    if (!name) {
        return { ok: false, error: 'Name is required.' };
    }

    if (!email) {
        return { ok: false, error: 'Email is required.' };
    }

    if (payload.password.length < 8) {
        return { ok: false, error: 'Password must be at least 8 characters.' };
    }

    if (!payload.consentGiven) {
        return { ok: false, error: 'PIPEDA consent is required to create an account.' };
    }

    const existing = readAccounts().find((account) => account.email === email);
    if (existing) {
        return { ok: false, error: 'An account with this email already exists.' };
    }

    const account: StoredAccount = {
        id: `${Date.now()}`,
        name,
        email,
        password: payload.password,
        role: payload.role,
        consentGiven: payload.consentGiven,
        consentDate: payload.consentDate,
        createdAt: new Date().toISOString()
    };

    const accounts = readAccounts();
    accounts.push(account);
    writeAccounts(accounts);

    const session: AuthSession = {
        userId: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        signedInAt: new Date().toISOString()
    };
    writeSession(session);

    return { ok: true, account, session };
}

export function signInAccount(payload: SignInPayload) {
    const email = payload.email.trim().toLowerCase();
    const account = readAccounts().find((item) => item.email === email);

    if (!account || account.password !== payload.password) {
        return { ok: false, error: 'Invalid email or password.' };
    }

    const session: AuthSession = {
        userId: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        signedInAt: new Date().toISOString()
    };

    writeSession(session);
    return { ok: true, session };
}
