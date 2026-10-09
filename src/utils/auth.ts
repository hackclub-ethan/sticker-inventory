import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.POSTGRES_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        maxLifetimeSeconds: 60,
    }),
    plugins: [
        genericOAuth({ 
            config: [ 
                { 
                    providerId: "hackclub", 
                    clientId: process.env.clientId as string,
                    clientSecret: process.env.clientSecret as string,
                    discoveryUrl: "https://auth.hackclub.com/.well-known/openid-configuration",
                    scopes: ["openid", "email"],
                    mapProfileToUser: (profile) => ({
						email: profile.email,
					})
                }
            ]
        })
    ]
})