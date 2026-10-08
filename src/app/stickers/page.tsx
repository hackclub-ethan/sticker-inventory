import { StickerCard } from "./sticker";

export default function Page() {
    return (
        <>
            <p>Nothing much here yet. Eventally it will have a list of all Hackclub stickers (hopefully)</p>

            <StickerCard event="General" name="Orpheus Flag" image="https://user-cdn.hackclub-assets.com/019d730b-8eb6-7050-9ba5-cd9ed9949958/Ud0ZsmQ08LUg6Zdz1UiAoqUSrP9VXz19VGWb4ZL-nJs" />
            <br />
            <StickerCard event="General" name="Orphmoji Yippee" image="https://user-cdn.hackclub-assets.com/019d730b-ad49-752d-b352-3d2476050a80/k9mMHxhtueYKK9F1p7WcTNrplskR78joIsvFkLAWNHw" />
            <br />
            <StickerCard event="General" name="Inside" image="https://user-cdn.hackclub-assets.com/019d730b-44d5-7dff-a0ac-98a3be898a20/mhABU_nGcch7Baek8TdOGxLTZzi0l8oiBBlweCJfKT8" />
        </>
    );
};