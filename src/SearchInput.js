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
			<div className="container component-search-input">
				<form
					onSubmit={this.handleSubmit}
					className="form"
					id="userSearchForm"
				>
					<input
						className="col-10"
						type="text"
						value={this.state.value}
						placeholder="Supercalafragilisticexpialidocious... enter the username here"
						id="usersearch"
						name="usersearch"
						onChange={this.handleChange}
						tabIndex="0"
					/>
					<input className="col-2" type="submit" value="Search" />
				</form>
			</div>
		);
	}
}
