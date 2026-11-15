import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/src/utils/auth";

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
    const email: string = body["email"];
    
    const users = await auth.api.listUsers({
        query: {
            filterValue: email
        },
        headers: await headers()
    });

    console.log(users);

    /*
    Get id from the value returned above
    
    try {
        await auth.api.removeUser({
            body: {
                userId: userId
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
    */

    return NextResponse.json(
        {},
        { status: 200 }
    );
};