"use client";

import { useRouter } from 'next/navigation'

import { Button, Modal, toast } from '@heroui/react';

import { authClient } from '@/src/lib/auth-client';

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

    function deleteAccount(e: any) {
        fetch("../../account", {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong deleting your account", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    return (
        <>
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
        </>
    );
};