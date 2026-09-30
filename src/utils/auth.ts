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
                    providerId: "hackclub-auth", 
                    clientId: process.env.clientId || "", 
                    clientSecret: process.env.clientSecret || "", 
                    discoveryUrl: "https://auth.hackclub.com/oauth/authorize", 
                }
            ]
        })
    ]
})