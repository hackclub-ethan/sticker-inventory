# API documentation

Some basic API docs so I dont hate myself when I need to do something with the API in the future...

## Account

Endpoint: `/api/account`
Allowed methods: `DELETE`

Description: Deletes the account of the user currently logged in.
Notes: DOES NOT CURRENTLY WORK. Deletes user data but not account

## Auth

Skipping this stuff since its all Better Auth and their documentaion should be looked at for this.

## Stickers

Endpoint `/api/stickers`
Allowed methods: `GET,PUT,POST,0DELETE`

Description: Does everything with stickers other than wishlists

### GET

Search Params: None
Description: Response with 3 arrays. All stickers, Owned Stickers and Unowned Stickers

### PUT

Body:
```json
editSticker: boolean
stickerName: string

// For editing sticker, atleast one needed
newName: string
newImage: string

// Change amount
amount: number
```

Description: Either changes info about a sticker (ex: name) or changes the number of stickers user has. What is changed is detemeined by the `editSticker` boolean

### POST

Body:
```json
name: string
image: string
```

Description: Creates a new sticker

### DELETE

Body:
```json
name: string
```

Description: Deletes a custom sticker