"use client";

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'

import { authClient } from '@/src/lib/auth-client';

import { Card, Table, toast } from '@heroui/react';

import pageStyles from "./dashboardStyles.module.css";
import { StickerCard } from './components/sticker';

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

    const [stickerCount, setStickerCount] = useState(0);
    const [stickerCountLastUpdate, setStickerCountLastUpdate] = useState("");
    const [uniqueStickers, setUniqueStickers] = useState(0);
    const [neededStickers, setNeededStickers] = useState(<></>);
    const [wishList, setWishList] = useState(<></>);
    const [ownedStickers, setOwnedStickers] = useState(<></>);

    function generateStickerList(stickers: any[]) {
        return (
            <>
                {stickers.map((sticker: any) => (
                    <StickerCard name={sticker["name"] ? sticker["name"] : sticker["stickername"]} image={sticker["image"]} key={sticker["name"] ? sticker["name"] : sticker["stickername"]} amount={sticker.quantity ? sticker.quantity : 0} />
                ))}
            </>
        );
    };
    
    function getStickerInfo() {
        fetch("../api/stickers")
        .then(res => {
            if (!res.ok) {
                throw new Error("Response was not ok");
            };

            return res.json()
        })
        .then(json => {
            const unOwned = json["unOwned"];
            const owned = json["owned"];
            const all = json["all"];

            setUniqueStickers(owned.length);
            
            let numOfStickers = 0;

            for (let i = 0; i < owned.length; i++) {
                numOfStickers += owned[i]["quantity"];
            };

            setStickerCount(numOfStickers);
            setStickerCountLastUpdate(new Date().toLocaleString());

            setNeededStickers(generateStickerList(unOwned));
            setOwnedStickers(generateStickerList(owned));

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

    useEffect(getStickerInfo, []);
    
    return (
        <span className={pageStyles.page}>
            <h1 className={pageStyles.title}>Dashboard</h1>

            <span className={`grid ${pageStyles.majorStats} ${pageStyles.majorStatsGrid}`}>
                <Card className='row1 col1' aria-labelledby="stickerCountTitle">
                    <Card.Header>
                        <Card.Title id="stickerCountTitle">{stickerCount}</Card.Title>

                        <Card.Description>
                            Total # of Stickers
                            <br />
                            Last updated {stickerCountLastUpdate}
                        </Card.Description>
                    </Card.Header>
                </Card>

                <Card className='row1 col2' aria-labelledby='uniqueStickerCountTitle'>
                    <Card.Header>
                        <Card.Title id="uniqueStickerCountTitle">{uniqueStickers}</Card.Title>

                        <Card.Description>
                            Number of unique sticker designs
                        </Card.Description>
                    </Card.Header>
                </Card>
            </span>

            <span className={`grid ${pageStyles.managementTable}`}>
                <Table className='row1 col1'>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Sticker you do not have">
                            <Table.Header>
                                <Table.Column isRowHeader>Stickers You Need</Table.Column>
                                <Table.Column>Picture</Table.Column>
                                <Table.Column>Quantity</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                {neededStickers}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
                

                <Table className='row1 col2'>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Stickers on your wishlist">
                            <Table.Header>
                                <Table.Column isRowHeader>Wishlist</Table.Column>
                                <Table.Column>Picture</Table.Column>
                                <Table.Column>Quantity</Table.Column>
                            </Table.Header>

                            <Table.Body>

                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer> 
                </Table>

                <Table className={`${pageStyles.fullGrid}`}>
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Stickers you own">
                            <Table.Header>
                                <Table.Column isRowHeader>Sticker Name</Table.Column>
                                <Table.Column>Picture</Table.Column>
                                <Table.Column>Quantity</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                {ownedStickers}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </span>
        </span>
    );
};