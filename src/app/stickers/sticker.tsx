import { Card } from "@heroui/react";

export function StickerCard(props: any) {
    const name: string = props["name"];
    // File Path
    const image: string = props["image"];
    const event: string = props["event"]
    return (
        <Card>
            <Card.Header>
                <Card.Title>{name}</Card.Title>
                <Card.Description>
                    <img src={image} alt={`${name} sticker from Hackclub`} width={500} height={500} />
                    <br />
                    {event}
                </Card.Description>
            </Card.Header>
        </Card>
    );
};