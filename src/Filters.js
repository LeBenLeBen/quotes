import React from 'react';

export default class Filters extends React.Component {
  static propTypes = {
    authors: React.PropTypes.array.isRequired,
    setAuthor: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="filters">
        <select value={ this.props.author } onChange={ this.handleChange.bind(this) }>
          <option value="">Filtrer par poète</option>
          { this.props.authors.map((author, i) => {
            if (!author) { return false; };

            return (
              <option key={ i }>{ author }</option>
            );
          }) }
        </select>
      </div>
    );
  }

  handleChange(e) {
    this.props.setAuthor(e.target.value);
  }
}
