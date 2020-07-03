import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SearchResultRow.css';

export default class SearchResultsRow extends Component {
  static propTypes = {
    id: PropTypes.number,
    login: PropTypes.string,
    avatar_url: PropTypes.string,
    followers_url: PropTypes.string,
    html_url: PropTypes.string,
    organizations_url: PropTypes.string,
  };

  render() {
    return (
      <div>
        <a className="component-user-result-row" href={this.props.html_url}>
          <img
            alt={this.props.login}
            src={this.props.avatar_url}
            className="avatar"
          />
          <span className="login">{this.props.login}</span>
        </a>
      </div>
    );
  }
}
