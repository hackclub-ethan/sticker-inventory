import { useEffect, useState } from "react";

import { Table, toast } from "@heroui/react";

import { StickerCard } from '../dashboard/components/sticker';

export function WishList() {
    const [wishList, setWishList] = useState([]);
    
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

    useEffect(getWishList, []);

    return (
        <Table.Body>
            {wishList.map((sticker: any) => (
                <StickerCard name={sticker["stickername"]} image={sticker["image"]} key={sticker["stickername"]} amount={0} /> 
            ))}
        </Table.Body>
    )
};