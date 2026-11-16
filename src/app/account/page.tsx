"use client";

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'

import { Button, Modal, Switch, toast } from '@heroui/react';

import { authClient } from '@/src/lib/auth-client';

import styles from "./accountStyles.module.css";

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

    const [isOptedIn, setOptedIn] = useState<boolean>(false);
    const [canApiChange, setCanApiChange] = useState<boolean>(false);

    function deleteAccount(e: any): void {
        fetch("../../api/account", {
            method: "DELETE"
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
                description: "Your account was not deleted. Some user data may have but not everything"
            });
        });
    };

    function getOptInStatus(): void {
        fetch("../api/find")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            setOptedIn(json["optIn"]);

            setCanApiChange(true);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong setting opt in setting on your computer", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function optInOut(): void {
        if (!canApiChange) {
            return;
        };

        fetch("../api/find", {
            method: "PUT",
            body: JSON.stringify({
                optIn: isOptedIn
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong opting in/out", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    useEffect(getOptInStatus, []);
    useEffect(optInOut, [isOptedIn])

    return (
        <div className={`${styles.page}`}>
            <h1>Account</h1>

            <Modal>
                <Button variant="danger">Delete Account</Button>
                
                <Modal.Backdrop>
                    <Modal.Container>
                        <Modal.Dialog>
                            <Modal.CloseTrigger />
                            <Modal.Header>
                                <Modal.Heading>DELETE ACCOUNT?</Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                Are you ABSOLUTLY SURE you want to delete your account? This will delete MOST user data and CAN NOT be undone. The only that will not be deleted are stickers you created (if applicable)
                                <br />
                                <br />
                                <b>Disregard above, that is a placeholder until I make the API</b>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button slot="close">DO NOT delete account</Button>
                                <Button variant="danger" slot="close" onPress={deleteAccount}>I am sure. DELETE ACCOUNT</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            <h1>Show up on Find People</h1>
            <p>This feature is where you can see who else has a sticker. Opt in</p>
            
            <Switch isSelected={isOptedIn} onChange={setOptedIn}>
                <Switch.Content>
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                    Opted in/Out
                </Switch.Content>
            </Switch>
        </div>
    );
};