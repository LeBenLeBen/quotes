import React from 'react';

export default class Quote extends React.Component {
  static propTypes = {
    quote: React.PropTypes.object.isRequired
  };

  render() {
    const quote = this.props.quote,
          author = quote.author && (quote.author + (quote.interlocutor && ' à ' + quote.interlocutor) + ',');

    return (
      <div className="quote">
        <blockquote className="quote__body">
          { quote.text.map((sentence, i) => {
            return (
              <p key={ i }>{ sentence }</p>
            );
          }) }
        </blockquote>
        <div className="quote__meta-wrapper">
          <cite className="quote__meta">
            <span className="quote__meta-content">
              { author } { quote.date }
            </span>
          </cite>
        </div>
      </div>
    );
  }
}
