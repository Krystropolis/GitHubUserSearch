import React, { Component } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import ReactPaginate from 'react-paginate';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      elements: [],
      perPage: 10,
      currentPage: 0,
      user: null,
    };
  }

  // sets elements, passed to search result
  setElementsForCurrentPage() {
    this.setState({ elements: this.state.searchResults.items });
  }

  // handles pagination
  handlePageClick = data => {
    const selectedPage = data.selected;
    console.log(selectedPage);
    this.setState({ currentPage: selectedPage }, () => {
      this.handleSearchChange(this.state.user);
    });
  };

  // handles search input
  handleSearchChange = value => {
    this.setState({ user: value });

    if (value) {
      let searchParams = new URLSearchParams('q=' + value);
      if (this.state.currentPage > 0) {
        searchParams.append('page', this.state.currentPage);
      }
      fetch(
        'https://api.github.com/search/users?' +
          searchParams.toString() +
          '&per_page=' +
          this.state.perPage,
      )
        .then(resp => resp.json())
        .then(result => {
          this.setState({ searchResults: result });
          this.setElementsForCurrentPage();
        })
        .catch(err => {
          console.error('Error:', err);
        });
    } else {
      this.setState({ searchResults: null, elements: [] });
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
    const pages =
      count <= 1000
        ? Math.ceil(count / this.state.perPage)
        : Math.ceil(1000 / this.state.perPage); // the GitHub Search API provides up to 1,000 results for each search.
    if (pages > 1) {
      paginationElement = (
        <nav aria-label="Search results pages">
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pages}
            marginPagesDisplayed={0}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            disabledClassName={'disabled'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
          />
        </nav>
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
