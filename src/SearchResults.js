import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResultRow from './SearchResultRow';

export default class SearchResults extends Component {
  static propTypes = {
    searchResults: PropTypes.object,
  };

  render() {
    if (
      this.props.searchResults &&
      this.props.searchResults.total_count != undefined
    ) {
      let resultString =
        this.props.searchResults.total_count === 0 ? 'No results found.' : '';
      return (
        <div className="total-data-results">
          <div className="total-result-count">
            <div>{resultString}</div>
            Total hits: {this.props.searchResults.total_count}
          </div>
          <div className="user-data-results">
            {this.props.searchResults.items.map(user => (
              <SearchResultRow
                key={user.id}
                login={user.login}
                avatar_url={user.avatar_url}
                followers_url={user.followers_url}
                html_url={user.html_url}
                organizations_url={user.organizations_url}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return <div className="total-data-results">Total hits: 0</div>;
    }
  }
}
