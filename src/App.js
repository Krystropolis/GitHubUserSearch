import React, { Component } from 'react';
import SearchInput from './SearchInput';
import search from './searchByLogin';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchResults: [],
    };
  }

  handleSearchChange = value => {
    this.setState({
      searchResults: search(value),
    });
  };

  updateSearch = event => {
    this.setState({
      search: event.target.value,
      searchResults: search(event.target.value),
    });
  };

  // <SearchResults searchResults={this.state.searchResults} />
  render() {
    return (
      <div>
        <SearchInput textChange={this.handleSearchChange} />
      </div>
    );
  }
}

export default App;
