import { promises as fs } from "fs";

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";
import { sql } from "@/src/utils/sql";
import { isUriImage } from "@/src/utils/functions";

// Get all/owned/unowned Stickers
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

    const allStickers = await sql`SELECT * FROM allstickers;`;
    const ownedStickers = await sql`SELECT stickername, quantity FROM stickers WHERE userid = ${userId};`;
    const ownedNames: string[] = [];

    for (let i = 0; i < ownedStickers.length; i++) {
        ownedNames.push(ownedStickers[i]["stickername"]);
    };
    
    const unOwnedStickers = allStickers.filter((sticker: any) => !ownedNames.includes(sticker["name"]));

    return NextResponse.json(
        {
            unOwned: unOwnedStickers,
            owned: ownedStickers,
            all: allStickers
        }
    );
};

// Change Sticker Amount
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

    if (!stickerName || stickerName.trim() === "") {
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

    const allStickers = await sql`SELECT * FROM allstickers;`;

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

// Create Stickers
export async function POST(req: NextRequest): Promise<NextResponse> {
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

    const name: string|null|undefined = body["name"];
    // CDN link
    const image: string|null|undefined = body["image"];

    if (!name || name.trim() === "") {
        return NextResponse.json(
            {
                "error": "That is not a valid sticker name"
            },
            { status: 400 }
        );
    };

    if (!image || image.trim() === "") {
        return NextResponse.json(
            {
                "error": "That is not a valid image link"
            },
            { status: 400 }
        );
    };

    if (!isUriImage(image.trim())) {
        return NextResponse.json(
            {
                "error": "Nice try that URI is not one for an image. If it is make sure it ends with the correct file extention"
            },
            { status: 400 }
        );
    };

    try {
        await sql`INSERT INTO allstickers (name, image, userid) VALUES (${name}, ${image.trim()}, ${userId});`;
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong creating sticker"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};

// Delete custom sticker
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

    const body: any = await req.json();
    const stickerName = body["name"];

    if (!stickerName || stickerName.trim() === "") {
        return NextResponse.json(
            {
                "error": "That is not a valid sticker name"
            },
            { status: 400 }
        );
    };

    try {
        const sticker = await sql`SELECT * FROM allstickers WHERE name=${stickerName};`;

        if (sticker.length === 0) {
            return NextResponse.json(
                {
                    "error": "That sticker does not exist"
                },
                { status: 404 }
            );
        } else if (sticker.userid !== userId) {
            return NextResponse.json(
                {
                    "error": "You did not make that sticker"
                },
                { status: 403 }
            );
        };
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong checking if the sticker exists/you own it"
            },
            { status: 500 }
        );
    };

    try {
        await sql`DELETE FROM allstickers WHERE userid=${userId} AND name=${stickerName};`;
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong deleting the sticker"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};