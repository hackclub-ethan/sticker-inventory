"use client";

import { Table, NumberField } from "@heroui/react";

export function StickerCard(props: any) {
    return (
        <Table.Row>
            <Table.Cell>STICKER NAME</Table.Cell>
            <Table.Cell>PICTURE</Table.Cell>
            <Table.Cell>
                <NumberField defaultValue={0}>
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