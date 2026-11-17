"use client";

import { useState, useEffect } from "react";

import { Button, Form, Input, Label, Modal, toast } from "@heroui/react";

import { StickerCard } from "./sticker";

import { authClient } from "@/src/lib/auth-client";
import { allStickersTable } from "@/src/utils/types";

import styles from "./stickers.module.css";

export default function Page() {    
    const [stickers, setStickers] = useState<allStickersTable[]>([]);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();

    if (session && !isPending && !loggedIn) {
        setLoggedIn(true);
    };

    function getStickers(): void {
        fetch("../api/stickers")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            setStickers(json["all"]);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting stickers", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function createSticker(e: React.SyntheticEvent<HTMLFormElement>): void {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        
        const name: string|undefined = formData.get("name")?.toString();
        const image: string|undefined = formData.get("image")?.toString();

        if (!name || name.trim().length === 0) {
            toast("That is not a valid sticker name", {
                actionProps: {
                    variant: "danger"
                }
            });
        };

        if (!image || image.trim().length === 0) {
            toast("That is not a valid image", {
                actionProps: {
                    variant: "danger"
                }
            });
        };

        fetch("../api/stickers", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                image: image
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);
        });
    };

    useEffect(getStickers, []);

    return (
        <div className={`${styles.page}`}>
            <h1>Every Sticker</h1>
            <p>That is on this site</p>

            {loggedIn ? (
                <Modal>
                    <Button>Create Sticker</Button>

                    <Modal.Backdrop>
                        <Modal.Container>
                            <Modal.Dialog>
                                <Modal.CloseTrigger />
                                
                                <Modal.Header>
                                    <Modal.Heading>Create Sticker</Modal.Heading>
                                </Modal.Header>

                                <Modal.Body>
                                    <Form onSubmit={createSticker}>
                                        <Label htmlFor="name">Sticker Name: </Label>
                                        <Input type="text" name="name" id="name" required />

                                        <br />

                                        <Label htmlFor="image">CDN Image Link: </Label>
                                        <Input type="text" name="image" id="image" required />

                                        <Button type="submit">Create Sticker</Button>
                                    </Form>
                                </Modal.Body>
                            </Modal.Dialog>
                        </Modal.Container>
                    </Modal.Backdrop>
                </Modal>
            )
            : <></>}
            
            <div className={`grid ${styles.container}`}>
                {stickers.map((sticker: allStickersTable) => (
                    <StickerCard name={sticker.name} image={sticker.image} key={sticker.name} />
                ))}
            </div>
        </div>
    );
};