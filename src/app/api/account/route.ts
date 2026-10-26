import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { sql } from "@/src/utils/sql";
import { auth } from "@/src/utils/auth";
import { authClient } from "@/src/lib/auth-client";

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});
    
    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    try {
        await sql`DELETE FROM stickers WHERE userid=${userId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong deleting user data"
            },
            { status: 500 }
        );
    };

    try {
        await auth.api.removeUser({
            body: {
                userId: userId
            }
        });

        
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong deleting your account"
            },
            { status: 500 }
        );
    };
    
    return NextResponse.json(
        {},
        { status: 200 }
    );
};