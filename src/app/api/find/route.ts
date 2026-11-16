import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";
import { sql } from "@/src/utils/sql";

import { stickersTable, findUsers, findTable } from "@/src/utils/types";

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

    const userId: string = session["session"]["userId"];

    const searchParams = req.nextUrl.searchParams;
    const stickerName: string|undefined|null = searchParams.get("sticker");

    if (!stickerName) {
        try {
            const optIn = await sql`SELECT * FROM find WHERE userid=${userId};`;

            return NextResponse.json(
                {
                    "optIn": optIn[0]["optin"]
                },
                { status: 200 }
            );
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting "
                }
            )
        };
    } else if (stickerName.trim().length === 0) {
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

    let allowedToFind: findTable[];

    try {
        allowedToFind = await sql`SELECT * FROM find WHERE optin=TRUE;`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong trying to get who you can find"
            },
            { status: 500 }
        );
    };

    const optedInUsers: string[] = [];

    for (let i = 0; i < allowedToFind.length; i++) {
        optedInUsers.push(allowedToFind[i]["userid"]);
    };

    const people: findUsers[] = [];

    for (let i = 0; i < stickerOccurrence.length; i++) {
        try {
            const userTableRes = await sql`SELECT * FROM "user" WHERE id=${stickerOccurrence[i]["userid"]};`;
            const accountTableRes = await sql`SELECT * FROM account WHERE "userId"=${stickerOccurrence[i]["userid"]};`;
            
            if(userTableRes && userTableRes[i] && userTableRes[i]["name"] && accountTableRes && accountTableRes[i] && accountTableRes[i]["accountId"]) {
                if (!optedInUsers.includes(accountTableRes[i]["accountId"])) {
                    continue;
                };

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

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return NextResponse.json(
            {
                "error": "Not Authenticated"
            },
            { status: 403 }
        );
    };

    const userId: string = session["session"]["userId"];

    const body = await req.json();
    const optIn: boolean|undefined = body["optIn"];

    if (typeof optIn !== "boolean") {
        return NextResponse.json(
            {
                "error": "That is not a valid opt in value"
            },
            { status: 400 }
        );
    };

    try {
        await sql`UPDATE find SET optin=${optIn} WHERE userid=${userId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong changing status"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    )
};