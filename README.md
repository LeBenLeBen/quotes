# Quotes

A simple React App which displays quotes from a Google Spreadsheet.
It use Google oAuth to allow writing into the spreadsheet (for likes).
Nothing secure prevent somebody to vote a gazillion times, you’ve been warned.

Spreadsheet should respect the following column order:

1. date (Have to be in a standard format, such as `yyyy-mm-dd`).
4. text
3. author
4. interlocutor
5. likes

Use the first row for labels, data will load from 2nd row.

An example can be found [here](https://docs.google.com/spreadsheets/d/1WvsatMBiRx_yXooxwmoN1CW237OTFHPesqR3QXmSL44/edit#gid=0).

## Config

Copy the example config file:

```
cp src/config.example.js src/config.js
```

Fill-in the fields with your own settings. You can create an app and generate a
Client-ID on [console.developers.google.com/apis](https://console.developers.google.com/apis/).

## Work

```
npm start
```

## Build

```
npm run build
```

## Deploy to Github Pages

```
npm run deploy
```
