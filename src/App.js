import React, { Component } from 'react';

import Filters from './Filters';
import Quote from './Quote';

import { load } from './spreadsheet';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quotes: [],
      random: {},
      authors: [],
      author: ''
    }
  }

  componentDidMount() {
    load(this.onLoad.bind(this));
  }

  onLoad(data) {
    if (data) {
      let random = data.quotes[Math.floor(Math.random() * data.quotes.length)];

      this.setState({
        ...data,
        random
      });
    }
  }

  render() {
    const quotes = this.state.quotes;

    return (
      <div className="app">
        <h1 className="brand">“Quotes”</h1>

        { quotes.length ? (
          <div className="page">
            <h2>Au bol</h2>
            <Quote quote={ this.state.random } />

            <hr />

            <h2>Tout le bazar</h2>
            <Filters
              authors={ this.state.authors }
              author={ this.state.author }
              setAuthor={ this.setAuthor.bind(this) } />
            <div className="quotes">
              { quotes.map((quote, i) => {
                if (this.state.author && quote.author !== this.state.author) {
                  return false;
                }

                return (
                  <Quote key={ i } quote={ quote } />
                );
              }) }
            </div>
          </div>
        ) : (
          <div className="loader" />
        ) }
      </div>
    );
  }

  setAuthor(author) {
    this.setState({
      author
    });
  }

}

export default App;
