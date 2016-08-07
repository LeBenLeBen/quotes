import React from 'react';
import ReactDOM from 'react-dom';

import config from './config';
import App from './App';

import './index.css';

window.gapi.load('client', () => {
  window.gapi.client.setApiKey(config.googleApiKey);

  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
});
