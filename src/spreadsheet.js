import config from './config';

export function load(cb) {
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: 'A2:E'
    }).then((response) => {
      let data = response.result.values || [],
          authors = [];

      let quotes = data.map((quote) => {
        let date = quote[0],
            text = quote[1].split('\n'),
            author = quote[2] && quote[2].trim(),
            interlocutor = quote[3] || '';

        if (authors.indexOf(author) === -1) {
          authors.push(author);
        }

        return {
          date,
          text,
          author,
          interlocutor
        }
      }).reverse();

      authors.sort();

      cb({
        quotes,
        authors
      });
    }, function(response) {
      console.log('Error: ' + response.result.error.message);
      cb(false);
    });
  });
}
