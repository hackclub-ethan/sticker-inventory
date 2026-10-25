import { promises as fs } from "fs";

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";
import { sql } from "@/src/utils/sql";

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

    const userId: string = session["session"]["userId"];

    const allStickers = JSON.parse(await fs.readFile(process.cwd() + "/src/app/api/stickers.json", "utf8"))["stickers"];
    const ownedStickers = await sql`SELECT stickername, quantity FROM stickers WHERE userid = ${userId};`;
    const ownedNames: string[] = [];

    for (let i = 0; i < ownedStickers.length; i++) {
        ownedNames.push(ownedStickers[i]["stickername"]);
    };
    
    const unOwnedStickers = allStickers.filter((sticker: any) => !ownedNames.includes(sticker["stickername"]));

    return NextResponse.json(
        {
            unOwned: unOwnedStickers,
            owned: ownedStickers,
            all: allStickers
        }
    );
};

export async function PUT(req: NextRequest): Promise<NextResponse> {
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

    const body: any = await req.json();

    const stickerName: string|null|undefined = body["stickerName"];
    const newAmount: number|null|undefined = body["amount"];

    if (!stickerName || stickerName === "") {
        return NextResponse.json(
            {
                "error": "Invaild Sticker Name"
            },
            { status: 400 }
        );
    };

    if (!newAmount || Number.isNaN(newAmount) || newAmount < 0) {
        return NextResponse.json(
            {
                "error": "Invaild Sticker Amount"
            },
            { status: 400 }
        );
    };

    let stickerExists = false;

    const allStickers = JSON.parse(await fs.readFile(process.cwd() + "/src/app/api/stickers.json", "utf8"))["stickers"];

    for (let i = 0; i < allStickers.length; i++) {
        if (allStickers["stickername"] == stickerName) {
            stickerExists = true;
        };
    };

    if (!stickerExists) {
        return NextResponse.json(
            {
                "error": "That sticker does not exist"
            },
            { status: 404 }
        );
    };

    let inDb = false;

    try {
        const dbResult = await sql`SELCT * FROM stickers WHERE stickername = ${stickerName} AND userid = ${userId};`;

        if (dbResult.length > 0) {
            inDb = true;
        };
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Somethign went wrong reading the database"
            },
            { status: 500 }
        );
    };

    try {
        if (inDb) {
            await sql`UPDATE stickers SET quantity = ${newAmount} WHERE stickername = ${stickerName} AND userid = ${userId};`;
        } else {
            await sql`INSERT INTO stickers (stickername, userid, quantity) VALUES (${stickerName}, ${userId}, ${newAmount});`;
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong updating the database"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};