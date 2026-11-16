"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, Form, Label, Input, Table, toast, Link } from "@heroui/react";

import { authClient } from "@/src/lib/auth-client";

import { findUsers } from "@/src/utils/types";

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

    const [people, setPeople] = useState<findUsers[]>([]);
    
    function findPeople(e: React.SyntheticEvent<HTMLFormElement>): void {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const stickerName: string|undefined = formData.get("stickerName")?.toString();

        if (!stickerName || stickerName.trim().length === 0) {
            toast("That is not a valid sticker name", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        };

        fetch(`../api/find?sticker=${stickerName}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
        })
        .then(json => {
            const users: findUsers[] = json["users"];

            setPeople(users);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong finding people", {
                actionProps: {
                    variant: "danger"
                }
            });

            return;
        });
    };

    return (
        <span>
            <h1>Find who has a sticker</h1>

            <p>Be careful about sharing your address and sending stickers.</p>

            <Form onSubmit={findPeople}>
                <Label htmlFor="stickerName">Sticker Name:</Label>
                <Input type="text" id="stickerName" name="stickerName" />

                <Button type="submit">Find people</Button>
            </Form>

            <Table>
                <Table.ScrollContainer>
                    <Table.Content aria-label="List of people with the sticker you want">
                        <Table.Header>
                            <Table.Header>
                                <Table.Column isRowHeader>Name</Table.Column>
                                <Table.Column>DM</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                {people.map((person: findUsers) => (
                                    <Table.Row key={person.slackId}>
                                        <Table.Cell>{person.name}</Table.Cell>
                                        <Table.Cell>
                                            <Link href={`https://hackclub.slack.com/team/${person["slackId"]}`}>DM them!</Link>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Header>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </span>
    );
};