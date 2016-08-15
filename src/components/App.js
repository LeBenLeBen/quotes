import React, { Component } from 'react';
import { orderBy } from 'lodash';

import config from '../config';
import { checkAuth, load, updateCell } from '../helpers/spreadsheet';

import Filters from './Filters';
import Quote from './Quote';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quotes: [],
      random: {},
      authors: [],
      author: '',
      order: 'date'
    }
  }

  componentDidMount() {
    checkAuth(this.handleAuth.bind(this));
  }

  handleAuth(authResult) {
    if (authResult && !authResult.error) {
      this.setState({
        authenticated: true
      });
      load(this.onLoad.bind(this))
    } else {
      this.setState({
        authenticated: false
      })
    }
  }

  onLoad(data, error) {
    if (data) {
      const random = data.quotes[Math.floor(Math.random() * data.quotes.length)];

      this.setState({
        ...data,
        random
      });
    }
    else {
      this.setState({
        error: error
      })
    }
  }

  render() {
    return (
      <div className="app">
        <h1 className="brand">“Quotes”</h1>
        { this.renderContent() }
      </div>
    );
  }

  renderContent() {
    const quotes = this.state.quotes;

    if (this.state.authenticated === false) {
      return (
        <button onClick={ this.authenticate.bind(this) } className="btn">Connect with Google</button>
      );
    }
    else if (quotes.length) {
      return (
        <div className="page">
          <h2>Au bol</h2>
          <Quote
            quote={ this.state.random }
            toggleLike={ this.toggleLike.bind(this) } />

          <hr />

          <h2>Tout le bazar</h2>
          <Filters
            authors={ this.state.authors }
            author={ this.state.author }
            setAuthor={ this.setAuthor.bind(this) }
            order={ this.state.order }
            setOrder={ this.setOrder.bind(this) } />
          <div className="quotes">
            { quotes.map((quote, i) => {
              if (this.state.author && quote.author !== this.state.author) {
                return false;
              }

              return (
                <Quote
                  key={ i }
                  quote={ quote }
                  toggleLike={ this.toggleLike.bind(this) } />
              );
            }) }
          </div>
        </div>
      );
    }
    else if (this.state.error) {
      return this.buildErrorMessage(this.state.error);
    }
    else {
      return (
        <div className="loader" />
      );
    }
  }

  buildErrorMessage(error) {
    let message, icon;

    switch(error.code) {
      case 403:
        icon = '⛔️';
        message = 'You don’t have permission to access this Google Spreadsheet.'
        break;
      case 404:
        icon = '❓';
        message = 'Google Spreadsheet not found.'
        break;
      default:
        icon = '💀';
        message = 'Doh, I couldn’t load the data.'
    }

    return (
      <p className="alert">
        <span className="alert__icon">{ icon }</span>
        { message }
      </p>
    );
  }

  authenticate(e) {
    e.preventDefault();
    window.gapi.auth.authorize({
      client_id: config.clientId,
      scope: config.scope,
      immediate: false
    }, this.handleAuth.bind(this));
  }

  setAuthor(author) {
    this.setState({
      author
    });
  }

  setOrder(order) {
    const quotes = orderBy(this.state.quotes, [order], ['desc']);

    this.setState({
      quotes,
      order
    });
  }

  toggleLike(q, save = true) {
    const quotes = [...this.state.quotes],
          index = quotes.indexOf(q),
          quote = quotes[index];

    if (quote) {
      if (quote.liked) {
        quote.likes--;
        quote.liked = false;
      }
      else {
        quote.likes++;
        quote.liked = true;
      }

      this.setState({
        quotes
      }, () => {
        if (save) {
          updateCell('E', quote.row, quote.likes, null, (error) => {
            this.toggleLike(quote, false);
          });
        }
      });
    }
  }

}

export default App;
