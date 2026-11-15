"use client";

import { useRouter } from 'next/navigation'

import { Button, Form, Input, Label, toast } from "@heroui/react";

import { authClient } from "@/src/lib/auth-client";

export default function Page() {
    const router = useRouter();
            
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();

    if (!session && !isPending) {
        router.replace("/signin");
    };
        
    function deleteUser(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email: string|undefined = formData.get("email")?.toString();

        fetch("../api/admin/user", {
            method: "DELETE",
            body: JSON.stringify({
                email: email
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong deleting user", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function editSticker(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name")?.toString();
        const image = formData.get("image")?.toString();

        if (!name || name.trim().length === 0) {
            toast("That is not a valid sticker name", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        if (!image || image.trim().length === 0) {
            toast("That is not a valid sticker image", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };
    
        fetch("../api/stickers", {
            method: "PUT",
            body: JSON.stringify({
                editSticker: true,
                newName: name,
                newImage: image
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong", {
                actionProps: {
                    variant: "danger"
                },
                description: "Something went wrong editing the sticker"
            });
        });
    };

    function deleteSticker(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name: string|undefined = formData.get("name")?.toString();

        if (!name || name.trim().length === 0) {
            toast("That is not a valid sticker name", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch("../api/stickers", {
            method: "DELETE",
            body: JSON.stringify({
                name: name
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong deleting sticker", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };
    
    return (        
        <>
            <h1>Admin</h1>

            <div className={`grid`}>
                <div className={`col1 row1`}>
                    <Form onSubmit={deleteUser}>
                        <Label htmlFor="email">Users Email:</Label>
                        <Input type="email" name="email" id="email" required />

                        <Button type="submit">Delete user</Button>
                    </Form>
                </div>

                <div className={`col2 row1`}>
                    <Form onSubmit={deleteSticker}>
                        <Label htmlFor="stickerName">Sticker Name</Label>
                        <Input type="text" name="stickerName" id="stickerName" />
                        
                        <Label htmlFor="stickerImage">Sticker Image (CDN Link)</Label>
                        <Input type="text" name="stickerImage" id="stickerImage" />

                        <Button type="submit">Delete Sticker</Button>
                    </Form>
                </div>

                <div className={`col1 row2`}>
                    <Form onSubmit={editSticker}>

                    </Form>
                </div>
            </div>
        </>
    );
};