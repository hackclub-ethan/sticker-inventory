export interface allStickersTable {
    name: string,
    image: string,
    userid: string
};

export interface stickersTable {
    id: number,
    stickername: string,
    userid: string,
    quantity: number,
    image: string
};

export interface wishlistTable {
    id: number,
    stickername: string,
    userid: string,
    image: string
};