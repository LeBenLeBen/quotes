import React, { Component } from 'react';
import { orderBy } from 'lodash';

import { checkAuth, load, updateCell } from '../helpers/spreadsheet';
import { hash } from '../helpers/utils';
import * as ls from '../helpers/localStorage';

import Filters from './Filters';
import Quote from './Quote';
import Alert from './Alert';

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
    window.gapi.load('client', () => {
      checkAuth(true, this.handleAuth.bind(this));
    });
  }

  /**
   * Check user authenification status and set app state accordingly
   */
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

  /**
   * Once quotes have been loaded from the spreadsheet
   */
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
          <h2>Randomly picked</h2>
          <Quote
            quote={ this.state.random }
            toggleLike={ this.toggleLike.bind(this) } />

          <hr />

          <h2>{ this.state.quotes.length} quotes</h2>
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
      return (
        <Alert error={ this.state.error } />
      );
    }
    else {
      return (
        <div className="loader" />
      );
    }
  }

  /**
   * Request Google authentification
   */
  authenticate(e) {
    e.preventDefault();
    checkAuth(false, this.handleAuth.bind(this));
  }

  /**
   * Filter by author
   */
  setAuthor(author) {
    this.setState({
      author
    });
  }

  /**
   * Change the order of the quotes
   */
  setOrder(order) {
    const quotes = orderBy(this.state.quotes, [order], ['desc']);

    this.setState({
      quotes,
      order
    });
  }

  /**
   * Add or remove like on the quote
   * The value is incremented/decremented into the spreadsheet
   * User owns likes are saved to its browser LocalStorage
   */
  toggleLike(q, save = true) {
    const quotes = [...this.state.quotes],
          index = quotes.indexOf(q),
          quote = quotes[index],
          userLikes = ls.get('likes') || [];

    if (quote) {
      const id = hash(quote.text);

      if (quote.liked) {
        quote.likes--;
        quote.liked = false;

        const index = userLikes.indexOf(id);

        if (index > -1) {
          userLikes.splice(index, 1);
        }
      }
      else {
        quote.likes++;
        quote.liked = true;

        if (id) {
          userLikes.push(id);
        }
      }

      ls.set('likes', userLikes);

      // Update state immediately for instant visual feedback
      this.setState({
        quotes
      }, () => {
        if (save) {
          // Now save the data to the spreadsheet
          updateCell('E', quote.row, quote.likes, null, (error) => {
            // In case an error occured while saving, toggle the state back
            this.toggleLike(quote, false);
          });
        }
      });
    }
  }

}

export default App;
