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
handleDemoLogin
    async function handleDemoLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username")?.toString();
        const password = formData.get("pwd")?.toString();

        console.log(username)
        console.log(password)

        const { data, error } = await authClient.signIn.username({
            username: username || "",
            password: password || "",
        });
    };
    
    return (
        <>
            <form onSubmit={handleSignIn}>
                <Button type='submit'>Sign In with Hackclub</Button>
            </form>

            <form onSubmit={handleDemoLogin}>
                <h2>Demo login</h2>

                <label htmlFor='username'>Username:</label>
                <input type='text' name="username" id="name" required />

                <label htmlFor='pwd'>Password:</label>
                <input type='password' name='pwd' id='pwd' required />

                <Button type='submit'>Sign in</Button>
            </form>
        </>
    );
};