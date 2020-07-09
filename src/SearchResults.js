import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResultRow from './SearchResultRow';

export default class SearchResults extends Component {
	static propTypes = {
		searchResults: PropTypes.array,
	};

	render() {
		return (
			<div className="user-data-results">
				{this.props.searchResults.map(user => (
					<SearchResultRow key={user.id} user={user.login} />
				))}
			</div>
		);
	}
}
