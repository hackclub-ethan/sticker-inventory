"use server";

import * as crypto from 'node:crypto';

import { cookies } from 'next/headers'

export async function getAuthAppInfo() {
    const cookieStore = await cookies()

    const state = crypto
		.randomBytes(16)
		.toString('base64')
		.replace(/[^a-zA-Z0-9]/g, '')
		.slice(0, 16);

    cookieStore.set("state", state);

    return {
        clientId: process.env.clientId,
        redirect: process.env.redirectURI,
        scope: "slack_id",
        responseType: "code",
        state : state
    };
};