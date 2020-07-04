import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchResultRow from './SearchResultRow';

export default class SearchResults extends Component {
	static propTypes = {
		searchResults: PropTypes.array,
	};

	constructor(props) {
		super(props);

		this.state = {
			elements: [],
		};
	}

	// turns search results into rows
	createRowsForCurrentPage() {
		let elements = this.props.searchResults.map(user => (
			<SearchResultRow
				key={user.id}
				login={user.login}
				avatar_url={user.avatar_url}
				followers_url={user.followers_url}
				html_url={user.html_url}
				organizations_url={user.organizations_url}
			/>
		));
		this.setState({ elements: elements });
	}

	render() {
		return (
			<div className="user-data-results">
				{this.props.searchResults.map(user => (
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
		);
	}
}
