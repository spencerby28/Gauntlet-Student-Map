// src/lib/server/appwrite.js
import { Client, Account, Databases } from 'node-appwrite';
import { APPWRITE_KEY } from '$env/static/private';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from '$env/static/public';

export const SESSION_COOKIE = 'gauntlet-students';

export function createAdminClient() {
    const client = new Client()
        .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT)
        .setKey(APPWRITE_KEY);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }
    };
}

export function createAnonClient() {
    const client = new Client()
        .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT);

    return {
        get databases() {
            return new Databases(client);
        }
    };
}

export function createSessionClient(event: any) {
    const client = new Client()
        .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
        .setProject(PUBLIC_APPWRITE_PROJECT);

    // Extract our custom domain's session cookie from the request
    const session = event.cookies.get(SESSION_COOKIE);
    if (!session) {
        throw new Error("No user session");
    }

    client.setSession(session);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }
    };
}
