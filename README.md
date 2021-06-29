# RicePlsPlay
A very scuffed suggestion system for Catdrgn's streams

**_This code is horrible and I'm sorry for anyone that has to try and read it_**

## API Endpoints

`/up` - Upvotes that suggestion
```
Request:
{
  "i": 1,
  "id": "143117463788191746"
}
Response:
nice
```
`/down` - Downvotes that suggestion
```
Request:
{
  "i": 1,
  "id": "143117463788191746"
}
Response:
nice
```
`/s` - Suggests that suggestion
```
Request:
{
  "name": "Sakura Clicker",
  "link": "https://store.steampowered.com/app/383080/Sakura_Clicker/",
  "user": "\\\\GGTyler\\\\#4480"
}
Response:
nice
```

## TODO
* Try and add oauth to API
* Add panel for allowed users

## Licensing
This project is under the WTFPL, which lets you do what the fuck you want to.