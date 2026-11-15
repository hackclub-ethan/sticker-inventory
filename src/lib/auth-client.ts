import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin as adminPerms } from "../utils/permissions";

export const authClient = createAuthClient({
    plugins: [
        usernameClient(),
        adminClient({
            ac,
            roles: {
                adminPerms
            }
        })
    ]
});