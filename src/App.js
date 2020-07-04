import React, { Component } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import ReactPaginate from 'react-paginate';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      offset: 0,
      data: [],
      elements: [],
      perPage: 10,
      currentPage: 0,
    };
  }

  // sets elements, passed to search result
  setElementsForCurrentPage() {
    let elements = this.state.searchResults.items.slice(
      this.state.offset,
      this.state.offset + this.state.perPage,
    );
    this.setState({ elements: elements });
  }

  // handles pagination
  handlePageClick = data => {
    const selectedPage = data.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState({ currentPage: selectedPage, offset: offset }, () => {
      this.setElementsForCurrentPage();
    });
  };

  // handles search input
  handleSearchChange = value => {
    if (value) {
      fetch('https://api.github.com/search/users?q=' + value)
        .then(resp => resp.json())
        .then(result => {
          this.setState({ searchResults: result });
          this.setElementsForCurrentPage();
        })
        .catch(err => {
          console.error('Error:', err);
        });
    } else {
      this.setState({ searchResults: null });
    }
  };

  render() {
    // set up totalHits
    let displayTotal, totalHits;
    let noResults = null;
    let count = 0;
    if (
      this.state.searchResults &&
      this.state.searchResults.total_count !== undefined
    ) {
      count = this.state.searchResults.total_count;
      if (count === 0) {
        noResults = <div>No results found.</div>;
      }
    }
    totalHits = <div key="totalHitsKey">Total hits: {count}</div>;
    displayTotal = [noResults, totalHits];

    // set up pagination when greater than 1 page of results
    let paginationElement;
    const pages = count > 0 ? Math.ceil(count / this.state.perPage) : 0;
    if (pages > 1) {
      paginationElement = (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          pageCount={pages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      );
    }

    return (
      <div>
        <SearchInput textChange={this.handleSearchChange} />
        {displayTotal}
        <SearchResults searchResults={this.state.elements} />
        {paginationElement}
      </div>
    );
  }
}

export default App;
