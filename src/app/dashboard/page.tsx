"use client";

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'

import { authClient } from '@/src/lib/auth-client';

import { Card, Table, TableCell } from '@heroui/react';

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
    
    function getStickerInfo() {
        setStickerCount(67);
        setStickerCountLastUpdate(new Date().toLocaleString());
    };

    useEffect(getStickerInfo);

    function getUniqueStickers() {
        setUniqueStickers(0);
    };
    
    return (
        <span className={pageStyles.page}>
            <h1 className={pageStyles.title}>Dashboard</h1>

            <span className={`grid ${pageStyles.majorStats} ${pageStyles.majorStatsGrid}`}>
                <Card className='row1 col1'>
                    <Card.Header>
                        <Card.Title>{stickerCount}</Card.Title>

                        <Card.Description>
                            Total # of Stickers
                            <br />
                            Last updated {stickerCountLastUpdate}
                        </Card.Description>
                    </Card.Header>
                </Card>

                <Card className='row1 col2'>
                    <Card.Header>
                        <Card.Title>{uniqueStickers}</Card.Title>

                        <Card.Description>
                            Number of unique sticker designs
                        </Card.Description>
                    </Card.Header>
                </Card>
            </span>

            <span className={`grid ${pageStyles.managementTable}`}>
                <Table className='row1 col1'>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader>Stickers You Need</Table.Column>
                                <Table.Column>Picture</Table.Column>
                                <Table.Column>Quantity</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                <StickerCard />
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
                

                <Table className='row1 col2'>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader>Wishlist</Table.Column>
                                <Table.Column>Picture</Table.Column>
                                <Table.Column>Quantity</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                <StickerCard />
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer> 
                </Table>

                <Table className={`${pageStyles.fullGrid}`}>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader>Sticker Name</Table.Column>
                                <Table.Column>Picture</Table.Column>
                                <Table.Column>Quantity</Table.Column>
                            </Table.Header>

                            <Table.Body>
                                <StickerCard />
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </span>
        </span>
    );
};