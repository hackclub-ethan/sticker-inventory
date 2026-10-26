"use client";

import { useRouter } from 'next/navigation'

import { FormEvent, useEffect, useState } from 'react';

import { Button, Form, Label, ListBox, Table, toast, Select } from '@heroui/react';

import { authClient } from '@/src/lib/auth-client';

import { StickerCard } from '../stickers/sticker';

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

    const [wishList, setWishList] = useState([]);
    const [wishListJSX, setWishListJSX] = useState(<></>);
    const [allStickers, setAllStickers] = useState([]);

    function getWishList() {
         fetch("../api/wishlist")
         .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json();
         })
         .then(json => {            
            setWishList(json["wishlist"]);
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong getting wishlist", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    function getAllStickers() {
        fetch("../api/stickers")
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong getting all stickers");
            };

            return res.json();
        })
        .then(json => {
            setAllStickers(json["unOwned"]);
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

    function addWishListItem(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        const sticker = data["sticker"];

        fetch("../api/wishlist", {
            method: "PUT",
            body: JSON.stringify({
                sticker: sticker
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Something went wrong adding to wishlist");
            };
        })
        .catch(e => {
            console.error(e);

            toast("Something went wrong adding to wishlist", {
                actionProps: {
                    variant: "danger"
                }
            });
        });
    };

    useEffect(() => {
        getWishList();
        getAllStickers();
    }, []);

    useEffect(() => {
        setWishListJSX(
            <Table.Body>
                {wishList.map((sticker: any) => (
                    <StickerCard name={sticker["stickername"]} image={sticker["image"]} key={sticker["stickername"]} amount={sticker["amount"]} /> 
                ))}
            </Table.Body>
        );
    }, [wishList]);

    return (
        <>
            <h1>Wishllist</h1>

            <Form onSubmit={addWishListItem}>
                <Select placeholder='Sticker to add to Wishlist' name="sticker">
                    <Label>What to add</Label>

                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover>
                        <ListBox>
                            {allStickers.map((sticker: any) => (
                                <ListBox.Item key={sticker.name} id={sticker.name} textValue={sticker.name}>
                                    {sticker.name}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
                </Select>

                <Button type='submit'>Add to Wishlist</Button>
            </Form>

            <Table>
                <Table.ScrollContainer>
                    <Table.Content aria-label='Wishlist'>
                        <Table.Header>
                            <Table.Column isRowHeader>Sticker</Table.Column>
                            <Table.Column>Picture</Table.Column>
                            <Table.Column>Amount</Table.Column>
                        </Table.Header>

                        
                        {wishListJSX}
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </>
    );
};