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

  // retrieves data for individual users
  getUserInfo() {
    fetch('https://api.github.com/users/' + this.props.user)
      .then(resp => {
        if (!resp.ok) {
          throw new Error(resp.status);
        }
        return resp.json();
      })
      .then(result => {
        this.setState({ userData: result });
      })
      .catch(err => {
        console.error('Error retrieving user info:', err);
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
        <div className={'search-result-row container'}>
          <div className={'card mb-3'} style={{ maxWidth: '540px' }}>
            <div className={'row no-gutters'}>
              <div className={'col-md-4'}>
                <img
                  src={this.state.userData.avatar_url}
                  className={'card-img'}
                  alt={this.state.userData.login}
                />
              </div>
              <div className={'col-md-8'}>
                <div className={'card-body'}>
                  <h5 className={'card-title'}>
                    <a href={this.state.userData.html_url}>
                      {this.state.userData.login}
                    </a>
                  </h5>
                  <small>{this.state.userData.name}</small>
                  <p className={'card-text'}>{this.state.userData.bio}</p>
                  {twitterComponent}
                  <p className={'card-text'}>
                    <small className={'text-muted'}>
                      <span className={'col-md-6'}>
                        Followers: {this.state.userData.followers}
                      </span>
                      <span className={'col-md-6'}>
                        Following: {this.state.userData.following}
                      </span>
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}
