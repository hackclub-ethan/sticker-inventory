import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";
import { sql } from "@/src/utils/sql";

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

    const isAdmin: boolean = session["user"]["role"] === "admin" ? true : false;

    if (!isAdmin) {
        return NextResponse.json(
            {
                "error": "You are not an admin"
            },
            { status: 403 }
        );
    };

    const body = await req.json();
    const email: string|undefined|null = body["email"];
   
    if (!email || email.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "That is not a valid string"
            },
            { status: 400 }
        );
    };

    let users;
    
    try {
        users = await auth.api.listUsers({
            query: {
                filterValue: email.trim()
            },
            headers: await headers()
        });
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting user id"
            },
            { status: 500 }
        );
    };

    if (users.users.length !== 1) {
        return NextResponse.json(
            {
                "error": "That email is not only 1 user"
            },
            { status: 400 }
        );
    };

    try {
        await sql`DELETE FROM stickers WHERE userid=${users.users[0]["id"]};`;
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
                userId: users.users[0]["id"]
            },
            headers: await headers()
        });
    } catch (e) {
        return NextResponse.json(
            {
                "error": "Something went wrong deleting user"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};