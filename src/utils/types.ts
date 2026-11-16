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

export interface findTable {
    id: number,
    userid: string,
    optin: boolean
};

export interface accountTable {
    id: string,
    accountId: string,
    providerId: string,
    userId: string,
    accessToken: string|undefined|null
    refreshToken: string|undefined|null
    accessTokenExpiresAt: any, // Not sure what JS type this is
    refreshTokenExpiresAt: any, // Not sure what JS type this is
    scope: string|undefined|null,
    password: string|undefined|null,
    createdAt: any, // Not sure what JS type this is
    updatedAt: any // Not sure what JS type this is
};

export interface userTable {
    id: string,
    name: string,
    email: string,
    emailVerified: boolean,
    image: string|undefined|null,
    createdAt: any, // Not sure what JS type this is
    updatedAt: any, // Not sure what JS type this is
    username: string|undefined|null,
    displayUsername: string|undefined|null,
    role: string|undefined|null,
    banned: boolean,
    banReason: string|undefined|null,
    banExpires: any // Not sure what JS type this is
};

export interface findUsers {
    name: string,
    slackId: string
};