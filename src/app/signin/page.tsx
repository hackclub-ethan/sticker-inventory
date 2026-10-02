"use client";

import { useEffect } from 'react';

import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
//import { cookies } from 'next/headers'

import { authClient } from '@/src/lib/auth-client';
import { getAuthAppInfo } from '@/src/utils/getAuthAppInfo';

// import { setCookieCache } from 'better-auth/cookies';

export default function Page() {
    const router = useRouter();
    //const cookieStore = await cookies();

    let ifRan = false;

    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();
    
    if (session && !isPending) {
        router.replace("/dashboard");
    };

    useEffect(() => {
        if (!ifRan) {
            ifRan = true;
            
            getAuthAppInfo().then((json) => {
                console.log(json.state)
                /*
                cookieStore.set({
                    name: "state",
                    value: json.state,
                    secure: true,
                    sameSite: "none"
                });
                */
               //&state=${json.state}
                const authURL = `https://auth.hackclub.com/oauth/authorize?client_id=${json.clientId}&redirect_uri=${json.redirect}&response_type=${json.responseType}&scope=${json.scope}`;

                redirect(authURL); 
            });
        };
    }, [])

    return (
        <p>Loading</p>
    );
};