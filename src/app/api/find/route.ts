import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";
import { sql } from "@/src/utils/sql";

import { stickersTable, findUsers } from "@/src/utils/types";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not authenticated"
            },
            { status: 403 }
        );
    };

    const searchParams = req.nextUrl.searchParams;
    const stickerName: string|undefined|null = searchParams.get("sticker");

    if (!stickerName || stickerName.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid sticker name"
            },
            { status: 400 }
        );
    };

    let stickerOccurrence: stickersTable[];

    try {
        stickerOccurrence = await sql`SELECT * FROM stickers WHERE stickername=${stickerName};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting who has the sticker"
            },
            { status: 500 }
        );
    };

    // better auth IDs not Slack IDs for now
    const people: findUsers[] = [];

    for (let i = 0; i < stickerOccurrence.length; i++) {
        try {
            const userTableRes = await sql`SELECT * FROM "user" WHERE id=${stickerOccurrence[i]["userid"]};`;
            const accountTableRes = await sql`SELECT * FROM account WHERE "userId"=${stickerOccurrence[i]["userid"]};`;
            
            if(userTableRes && userTableRes[i] && userTableRes[i]["name"] && accountTableRes && accountTableRes[i] && accountTableRes[i]["accountId"]) {
                people.push({
                    slackId: accountTableRes[i]["accountId"],
                    name: userTableRes[i]["name"]
                });
            }
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting user data"
                },
                { status: 500 }
            );
        };
    };
    
    return NextResponse.json(
        {
            "users": people
        },
        { status: 200 }
    );
};