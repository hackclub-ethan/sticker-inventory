"use client";

import { FormEvent } from 'react';

import { useRouter } from 'next/navigation'

import { authClient } from '@/src/lib/auth-client';
import { Button } from '@heroui/react';

export default function Page() {
    const router = useRouter();
    
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();
    
    if (session && !isPending) {
        router.replace("/dashboard");
    };

    async function handleSignIn(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const { data, error } = await authClient.signIn.social({
            provider: "hackclub",
            callbackURL: "/api/auth/callback/hackclub"
        });
    };
    
    return (
        <form onSubmit={handleSignIn}>
            <Button type='submit'>Sign In with Hackclub</Button>
        </form>
    );
};