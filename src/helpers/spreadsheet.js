import { orderBy } from 'lodash';

import config from '../config';

export function checkAuth(callback) {
  window.gapi.auth.authorize({
    'client_id': config.clientId,
    'scope': config.scope,
    'immediate': true
  }, callback);
}

export function load(cb) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: 'A2:E'
    }).then((response) => {
      const data = response.result.values || [],
            authors = [];

      let quotes = data.map((quote, i) => {
        let row = i + 2,
            date = quote[0],
            dateParsed = Date.parse(date),
            text = quote[1].split('\n'),
            author = quote[2] && quote[2].trim(),
            interlocutor = quote[3] || '',
            likes = parseInt(quote[4],10) || 0;

        if (!isNaN(dateParsed)) {
          date = dateParsed;
        }

        if (authors.indexOf(author) === -1) {
          authors.push(author);
        }

        return {
          row,
          date,
          text,
          author,
          interlocutor,
          likes
        }
      });

      quotes = orderBy(quotes, ['date'], ['desc']);
      authors.sort();

      cb({
        quotes,
        authors
      });
    }, (response) => {
      cb(false, response.result.error);
    });
  });
}

export function updateCell(column, row, value, successCallback, errorCallback) {
  window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range: 'Sheet1!' + column + row,
    valueInputOption: 'USER_ENTERED',
    values: [ [value] ]
  }).then(successCallback, errorCallback);
}
