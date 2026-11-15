import { createAccessControl } from "better-auth/plugins/access";

const statement = { 
    stickers: ["all", "share", "update", "delete"], 
} as const; 

export const ac = createAccessControl(statement); 

export const admin = ac.newRole({
    stickers: ["all"]
});