import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const role: string|undefined|null = session["user"]["role"];

    if (role && role == "admin") {
        return NextResponse.json(
            {
                "admin": true
            },
            { status: 200 }
        );
    };

    return NextResponse.json(
        {
            "admin": false
        },
        { status: 200 }
    );
};