import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import * as cheerio from 'cheerio';

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

    const isAdmin: boolean = session["user"]["role"] === "admin" ? true : false;

    if (!isAdmin) {
        return NextResponse.json(
            {
                "error": "You are not an admin"
            },
            { status: 403 }
        );
    };

    const $: any = await cheerio.fromURL("https://stickers.hackclub.com/catalog");
    const stickers: any = $(".sticker-card");

    interface sticker {
        name: string,
        image: string
    };

    const stickerList: sticker[] = [];

    stickers.each((index: any, element: any) => {
        const sticker: any = $(element);

        const name: string = sticker.find(".sticker-name").text();
        
        const image: string = sticker.find("img").attr("src");

        stickerList.push({
            name: name,
            image: image
        });
    });

    for (let i = 0; i < stickerList.length; i++) {
        try {
            await sql`INSERT INTO allstickers VALUES (${stickerList[i]["name"]}, ${stickerList[i]["image"]}, 'Poobert');`;
        } catch (e) {
            console.error(e);
        };
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};