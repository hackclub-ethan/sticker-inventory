import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { htmlparser, DefaultHandler } from "htmlparser";

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

    const res = await fetch("https://stickers.hackclub.com/catalog");
    const data = await res.text();

    const handler = new DefaultHandler(function (error: any, dom: any) {
        if (error) {
            console.error(error);

            return NextResponse.json(
                {
                    "error": "Something went wrong parsing HTML"
                },
                { status: 500 }
            );
        } else {
            const stickers = dom.getElementsByClassName("sticker-card");
            console.log(stickers);
        };
    });

    const parser = new htmlparser.Parser(handler);
    parser.parseComplete(data);

    return NextResponse.json(
        {},
        { status: 200 }
    );
};