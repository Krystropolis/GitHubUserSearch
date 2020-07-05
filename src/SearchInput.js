import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SearchInput extends Component {
	constructor(props) {
		super(props);
		this.state = { value: '' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	static propTypes = {
		textChange: PropTypes.func,
	};

	handleChange = event => {
		this.setState({ value: event.target.value });
	};

	handleSubmit = event => {
		event.preventDefault();
		this.props.textChange(this.state.value);
	};

	render() {
		return (
			<div className="component-search-input">
				<div>
					<form
						onSubmit={this.handleSubmit}
						className="form"
						id="userSearchForm"
					>
						<label htmlFor="usersearch">Search GitHub:</label>
						<input
							type="text"
							value={this.state.value}
							placeholder="username"
							id="usersearch"
							name="usersearch"
							onChange={this.handleChange}
							tabIndex="0"
						/>
						<input type="submit" value="Search" />
					</form>
				</div>
			</div>
		);
	}
}
