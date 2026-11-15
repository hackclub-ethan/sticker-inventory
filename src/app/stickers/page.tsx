"use client";

import { useState, useEffect } from "react";

import { toast } from "@heroui/react";

import { StickerCard } from "./sticker";

import { allStickersTable } from "@/src/utils/types";

import styles from "./stickers.module.css";

export default function Page() {
    const [stickers, setStickers] = useState<allStickersTable[]>([]);

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

    useEffect(getStickers, []);

    return (
        <>
            <p>Nothing much here yet. Eventally it will have a list of all Hackclub stickers (hopefully)</p>

            <div className={`grid ${styles.container}`}>
                {stickers.map((sticker: allStickersTable) => (
                    <StickerCard name={sticker.name} image={sticker.image} key={sticker.name} />
                ))}
            </div>
        </>
    );
};