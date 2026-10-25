"use client";

import Image from "next/image";

import { Table, NumberField } from "@heroui/react";

export function StickerCard(props: any) {
    const name = props.name;
    const image = props.image;
    const amount = props.amount;

    function updateValue(e: number): void {
        fetch("../api/stickers", {
            method: "PUT",
            body: JSON.stringify({
                editSticker: false,
                stickerName: name,
                amount: e
            })
        })
    };

    return (
        <Table.Row>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>
                <Image
                    src={image}
                    alt={`Sticker called ${name}`}
                    width={200}
                    height={200}
                    unoptimized
                />
            </Table.Cell>
            <Table.Cell>
                <NumberField defaultValue={amount} minValue={0} onChange={updateValue} aria-label="Sticker Amount">
                    <NumberField.Group>
                        <NumberField.DecrementButton />
                        <NumberField.Input />
                        <NumberField.IncrementButton />
                    </NumberField.Group>
                </NumberField>
            </Table.Cell>
        </Table.Row>
    )
};