import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import './styles/index.css';

window.gapi.load('client', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
});
