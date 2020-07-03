import React, { Component } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
    };
  }

  handleSearchChange = value => {
    if (value) {
      fetch('https://api.github.com/search/users?q=' + value + '+in:login')
        .then(res => {
          return res.json();
        })
        .then(res => {
          this.setState({ searchResults: res });
        });
    } else {
      this.setState({ searchResults: null });
    }
  };

  render() {
    return (
      <div>
        <SearchInput textChange={this.handleSearchChange} />
        <SearchResults searchResults={this.state.searchResults} />
      </div>
    );
  }
}

export default App;
