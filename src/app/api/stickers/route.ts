import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";
import { sql } from "@/src/utils/sql";
import { isUriImage } from "@/src/utils/functions";

import { allStickersTable, stickersTable } from "@/src/utils/types";

// Get all/owned/unowned Stickers
export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) {
        try {
            const allStickers: allStickersTable[] = await sql`SELECT * FROM allstickers;`;

            return NextResponse.json(
                {
                    "all": allStickers
                },
                { status: 200 }
            );
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting stickers"
                },
                { status: 500 }
            );
        };
    } else {
        const userId: string = session["session"]["userId"];

        let allStickers: allStickersTable[];
        let ownedStickers: any[];

        try {
            allStickers = await sql`SELECT * FROM allstickers;`;
            ownedStickers = await sql`SELECT stickername, quantity, image FROM stickers WHERE userid = ${userId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting stickers"
                },
                { status: 500 }
            );
        };

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
            },
            { status: 200 }
        );
    };
};

// Change Sticker Amount/Edit custom Sticker
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
    const isAdmin: boolean = session["user"]["role"] === "admin" ? true : false;

    const body: any = await req.json();
    const editSticker: boolean|null|undefined = body["editSticker"];
    const stickerName: string|null|undefined = body["stickerName"];

    if (typeof editSticker !== "boolean") {
        return NextResponse.json(
            {
                "error": "editSticker did not have a valid value"
            },
            { status: 400 }
        );
    };

    if (!stickerName || stickerName.trim() === "") {
        return NextResponse.json(
            {
                "error": "Invaild Sticker Name"
            },
            { status: 400 }
        );
    };

    if (editSticker) {
        let currentStickerData: allStickersTable[];

        try {
            currentStickerData = await sql`SELECT * FROM allstickers WHERE userid=${userId} AND name=${stickerName.trim()};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting the sticker"
                },
                { status: 500 }
            );
        };

        if (currentStickerData.length <= 0 && !isAdmin) {
            return NextResponse.json(
                {
                    "error": "No sticker with that name found that you created"
                },
                { status: 404 }
            );
        };

        const newName: string = body["newName"];
        const newImage: string = body["newImage"];

        if ((!newName || newName.trim() === "") && (!newImage || newImage.trim() === "")) {
            return NextResponse.json(
                {
                    "error": "You need to change something"
                },
                { status: 400 }
            );
        };

        if (!newName || newName.trim() === "") {
            // Change the image
            try {
                if (isAdmin) {
                    await sql`UPDATE allstickers SET image=${newImage.trim()} WHERE name=${stickerName};`;
                } else {
                    await sql`UPDATE allstickers SET image=${newImage.trim()} WHERE userid=${userId} AND name=${stickerName};`;
                };

                await sql`UPDATE wishlist SET image=${newImage.trim()} WHERE stickername=${stickerName};`;
            } catch (e) {
                console.error(e);

                return NextResponse.json(
                    {
                        "error": "Something went wrong editing sticker image"
                    },
                    { status: 500 }
                );
            };
        } else if (!newImage || newImage.trim() === "") {
            // Change the name
            try {
                if (isAdmin) {
                    await sql`UPDATE allstickers SET name=${newName.trim()} WHERE image=${currentStickerData[0]["image"]};`;
                } else {
                    await sql`UPDATE allstickers SET name=${newName.trim()} WHERE userid=${userId} AND image=${currentStickerData[0]["image"]};`;
                };
            } catch (e) {
                console.error(e);

                return NextResponse.json(
                    {
                        "error": "Something went wrong editing the sticker name"
                    },
                    { status: 500 }
                );
            };
        } else if ((newImage && newImage.trim() !== "") && (newName || newName.trim() !== "")) {
            // Change both
            try {
                if (isAdmin) {
                    await sql`UPDATE allstickers SET name=${newName.trim()}, image=${newImage.trim()} WHERE name=${stickerName};`;
                } else {
                    await sql`UPDATE allstickers SET name=${newName.trim()}, image=${newImage.trim()} WHERE userid=${userId} AND name=${stickerName};`;
                };

                await sql`UPDATE wishlist SET image=${newImage.trim()} WHERE stickername=${stickerName};`;
                await sql`UPDATE wishlist SET stickername=${newName.trim()} WHERE stickername=${stickerName};`;
            } catch(e) {
                console.error(e);

                return NextResponse.json(
                    {
                        "error": "Something went wrong updating the name and/or image"
                    },
                    { status: 500 }
                );
            };
        };

        return NextResponse.json(
            {},
            { status: 200 }
        ); 
    } else {
        const newAmount: number|null|undefined = body["amount"];

        if (!newAmount || Number.isNaN(newAmount) || newAmount < 0) {
            return NextResponse.json(
                {
                    "error": "Invaild Sticker Amount"
                },
                { status: 400 }
            );
        };

        let stickerExists: boolean = false;

        let allStickers: allStickersTable[];

        try {
            allStickers = await sql`SELECT * FROM allstickers WHERE name=${stickerName};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting sticker"
                },
                { status: 500 }
            );
        };

        if (allStickers.length > 0) {
            stickerExists = true;
        };

        if (!stickerExists) {
            return NextResponse.json(
                {
                    "error": "That sticker does not exist"
                },
                { status: 404 }
            );
        };

        let inDb: boolean = false;

        try {
            const dbResult: stickersTable[] = await sql`SELECT * FROM stickers WHERE stickername=${stickerName} AND userid=${userId};`;

            if (dbResult.length > 0) {
                inDb = true;
            };
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong reading the database"
                },
                { status: 500 }
            );
        };

        try {
            if (inDb) {
                if (isAdmin) {
                    await sql`UPDATE stickers SET quantity = ${newAmount} WHERE stickername=${stickerName};`;
                } else {
                    await sql`UPDATE stickers SET quantity = ${newAmount} WHERE stickername=${stickerName} AND userid = ${userId};`;
                };
            } else {
                await sql`INSERT INTO stickers (stickername, userid, quantity, image) VALUES (${stickerName}, ${userId}, ${newAmount}, ${allStickers[0].image});`;
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
        const stickerData: allStickersTable[] = await sql`SELECT * FROM allstickers WHERE name=${name.trim()} OR image=${image.trim()};`;

        if (stickerData.length === 0) {
            return NextResponse.json(
                {
                    "error": "That sticker already exists"
                },
                { status: 400 }
            )
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong checking if the sticker exists"
            },
            { status: 500 }
        );
    };

    try {
        await sql`INSERT INTO allstickers (name, image, userid) VALUES (${name.trim()}, ${image.trim()}, ${userId});`;
    } catch (e) {
        console.error(e);

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
    const isAdmin: boolean = session["user"]["role"] === "admin" ? true : false;

    const body: any = await req.json();
    const stickerName: string|undefined|null = body["name"];

    if (!stickerName || stickerName.trim() === "") {
        return NextResponse.json(
            {
                "error": "That is not a valid sticker name"
            },
            { status: 400 }
        );
    };

    try {
        const sticker: allStickersTable[] = await sql`SELECT * FROM allstickers WHERE name=${stickerName.trim()};`;

        if (sticker.length === 0) {
            return NextResponse.json(
                {
                    "error": "That sticker does not exist"
                },
                { status: 404 }
            );
        } else if (sticker[0].userid !== userId && !isAdmin) {
            return NextResponse.json(
                {
                    "error": "You did not make that sticker"
                },
                { status: 403 }
            );
        };
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong checking if the sticker exists/you own it"
            },
            { status: 500 }
        );
    };

    try {
        if (isAdmin) {
            await sql`DELETE FROM allstickers WHERE name=${stickerName};`;
        } else {
            await sql`DELETE FROM allstickers WHERE userid=${userId} AND name=${stickerName};`;
        };

        await sql`DELETE FROM stickers WHERE stickername=${stickerName};`;
        await sql`DELETE FROM wishlist WHERE stickername=${stickerName};`;
    } catch (e) {
        console.error(e);
        
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