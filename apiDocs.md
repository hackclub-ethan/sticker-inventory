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
Allowed methods: `GET`, `PUT`, `POST`, `DELETE`

Description: Does everything with stickers other than wishlists

### GET

Search Params: None
Description: Response with 3 arrays. All stickers, Owned Stickers and Unowned Stickers

### PUT

Body:
```json
{
    editSticker: boolean
    stickerName: string

    /* For editing sticker, atleast one needed */
    newName: string
    newImage: string

    /* Change amount */
    amount: number
}
```

Description: Either changes info about a sticker (ex: name) or changes the number of stickers user has. What is changed is detemeined by the `editSticker` boolean

### POST

Body:
```json
{
    name: string
    image: string
}
```

Description: Creates a new sticker

### DELETE

Body:
```json
name: string
```

Description: Deletes a custom sticker

## Admin

Endpoint: `/api/admin`
Allowed Methods: `GET`, `PUT`

Description: Does all admin actions (that are not shared with normal users)

### GET

Search Params: None

Description: The get methods returns if the current user is an admin. Only for testing admin auth is done with BetterAuth apis and not this api

### PUT

Body: Empty

Description: Scrapes stickers.hackclub.com for all the stickers and adds them to the DB

## Admin users

Endpoint: `/api/admin/user`
Allowed Methods: `PUT`, `DELETE`

Description: Admin routes to manage users

### PUT

Body:

```json
{
    email: string
}
```

Description: Promotes the user with the proivided email to admin

### DELETE

Body:

```json
{
    email: string
}
```

Description: Deletes the user with the specified user

## Find

Endpoint: `/api/find`
Allowed methods: `GET`, `PUT`

### GET

Search Params: `sticker`: `string|undefined`

Description: 
If the search param is undified the API will return if the user is opted in or out to being found.
If it is defined the API will return users that have the specified sticker (that are opted in)

### PUT

Body:

```json
{
    optIn: boolean
}
```

Description: Changes if a user is opted in or out of being found

## Wishlist

Allowed Methods: `GET`, `PUT`, `DELETE`
Description: Does everything involving a users wishlist

### GET

Search Params: None
Description: GETs the users wishlist

### PUT

Body:
```json
{
    sticker: string
}
```
Description: Adds the specified sticker to the users wishlist

### DELETE

Body:
```json
{
    name: string
}
```

Description: Removes the specified sticker (`name`) from the users wishlist