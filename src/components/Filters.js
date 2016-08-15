import React from 'react';

export default class Filters extends React.Component {

  static propTypes = {
    authors: React.PropTypes.array.isRequired,
    setAuthor: React.PropTypes.func.isRequired,
    order: React.PropTypes.string.isRequired,
    setOrder: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <ul className="filters">
        <li>
          <select value={ this.props.author } onChange={ this.handleAuthorChange.bind(this) }>
            <option value="">Filter by poet</option>
            { this.props.authors.map((author, i) => {
              if (!author) { return false; };

              return (
                <option key={ i }>{ author }</option>
              );
            }) }
          </select>
        </li>
        <li>
          <select value={ this.props.order } onChange={ this.handleOrderChange.bind(this) }>
            <option value="" disabled>Order by</option>
            <option value="date">Date</option>
            <option value="likes">Popularity</option>
          </select>
        </li>
      </ul>
    );
  }

  handleAuthorChange(e) {
    this.props.setAuthor(e.target.value);
  }

  handleOrderChange(e) {
    this.props.setOrder(e.target.value);
  }

}
