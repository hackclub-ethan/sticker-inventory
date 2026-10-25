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

    try {
        const wishList = await sql`SELECT * FROM wishlist WHERE userid=${userId};`;

        return NextResponse.json(
            {
                "wishlist": wishList
            },
            { status: 200 }
        );
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting your wishlist"
            },
            { status: 500 }
        );
    };
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
    
    const body = await req.json();
    const stickerName = body["sticker"];

    if (!stickerName || stickerName.trim() === "") {
        return NextResponse.json(
            {
                "error": "That is not a valid sticker name"
            },
            { status: 400 }
        );
    };

    let stickerData;
    
    try {
        stickerData = await sql`SELECT * FROM allstickers WHERE name=${stickerName};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting data about the sticker"
            },
            { status: 500 }
        );
    };

    if (!(stickerData.length > 0)) {
        return NextResponse.json(
            {
                "error": "That sticker does not exist"
            },
            { status: 404 }
        );
    };

    try {
        await sql`INSERT INTO wishlist (stickername, userid, image) VALUES (${stickerName}, ${userId}, ${stickerData[0]["image"]});`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong adding to wishlist"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};

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
    
    const body = await req.json();
    const stickerName = body["name"];

    if (!stickerName || stickerName.trim() === "") {
        return NextResponse.json(
            {
                "error": "Invaild sticker name"
            },
            { status: 400 }
        );
    };

    let wishlistData;

    try {
        wishlistData = await sql`SELECT * FROM wishlist WHERE userid=${userId} AND stickername=${stickerName};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting wishlist data"
            },
            { status: 500 }
        );
    };

    if (!(wishlistData.length > 0)) {
        return NextResponse.json(
            {
                "error": "Wishlist entry does not exist"
            },
            { status: 404 }
        );
    };

    try {
        await sql`DELETE FROM wishlist WHERE userid=${userId} AND stickername=${stickerName};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong removing the sticker from your wishlist"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};