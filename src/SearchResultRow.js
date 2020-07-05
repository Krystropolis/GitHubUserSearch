import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SearchResultRow.css';
import { FaTwitter } from 'react-icons/fa';

export default class SearchResultsRow extends Component {
  static propTypes = {
    id: PropTypes.number,
    user: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    };
  }

  getUserInfo() {
    fetch('https://api.github.com/users/' + this.props.user)
      .then(resp => resp.json())
      .then(result => {
        this.setState({ userData: result });
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

  componentDidMount() {
    this.getUserInfo();
  }

  render() {
    if (this.state.userData) {
      let twitterComponent = null;
      if (this.state.userData.twitter_username) {
        twitterComponent = (
          <a
            href={`https://twitter.com/${this.state.userData.twitter_username}`}
            className={'twitter-follow-button'}
            data-size={'large'}
            data-show-count={'false'}
          >
            <FaTwitter />
            Follow {this.state.userData.twitter_username}
          </a>
        );
      }
      return (
        <div className="user-row">
          <div>
            <a
              className="component-user-result-row"
              href={this.state.userData.html_url}
            >
              <img
                alt={this.state.userData.login}
                src={this.state.userData.avatar_url}
                className="avatar"
              />
              <span className="login">{this.state.userData.login}</span>
            </a>
          </div>
          <div>
            <span>Followers: {this.state.userData.followers}</span>
            <span>Following: {this.state.userData.following}</span>
          </div>
          <div>
            {this.state.userData.name}
            {this.state.userData.bio}
          </div>
          {twitterComponent}
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}
