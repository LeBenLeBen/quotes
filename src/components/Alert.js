import React from 'react';

export default class Alert extends React.Component {

  static propTypes = {
    error: React.PropTypes.object.isRequired
  };

  render() {
    let message, icon;

    switch(this.props.error.code) {
      case 403:
        icon = '⛔️';
        message = 'You don’t have permission to access this Spreadsheet.'
        break;
      case 404:
        icon = '❓';
        message = 'Spreadsheet not found.'
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

}
