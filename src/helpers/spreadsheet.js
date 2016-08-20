import { orderBy } from 'lodash';
import { hash } from './utils';
import { get } from './localStorage';

import config from '../config';

/**
 * Get the user authentication status
 */
export function checkAuth(immediate, callback) {
  window.gapi.auth.authorize({
    'client_id': config.clientId,
    'scope': config.scope,
    'immediate': immediate
  }, callback);
}

/**
 * Load the quotes from the spreadsheet
 * Embellish them with user own likes
 */
export function load(callback) {
  let userLikes = get('likes') || [];

  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: 'A2:E'
    }).then((response) => {
      const data = response.result.values || [],
            authors = [];

      let quotes = data.map((quote, i) => {
        let row = i + 2, // Save row ID fore later update
            date = quote[0],
            dateParsed = Date.parse(date),
            text = quote[1].split('\n'), // Split paragraphs
            author = quote[2] && quote[2].trim(),
            interlocutor = quote[3] || '',
            likes = parseInt(quote[4], 10) || 0,
            id = hash(text), // Generate an ID by hashing the quote
            liked = userLikes.indexOf(id) > -1 ? true : false;

        // There might be no date or in an unrecognized format
        if (!isNaN(dateParsed)) {
          date = dateParsed;
        }

        // Save an array of unique authors for the filters
        if (authors.indexOf(author) === -1) {
          authors.push(author);
        }

        return {
          row,
          date,
          text,
          author,
          interlocutor,
          likes,
          liked
        }
      });

      // Initially order quotes by date, most recent first
      quotes = orderBy(quotes, ['date'], ['desc']);
      // And authors alphabetically
      authors.sort();

      callback({
        quotes,
        authors
      });
    }, (response) => {
      callback(false, response.result.error);
    });
  });
}

/**
 * Update a single cell value
 */
export function updateCell(column, row, value, successCallback, errorCallback) {
  window.gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range: 'Sheet1!' + column + row,
    valueInputOption: 'USER_ENTERED',
    values: [ [value] ]
  }).then(successCallback, errorCallback);
}
