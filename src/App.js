import React, { Component } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import ReactPaginate from 'react-paginate';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      elements: [],
      perPage: 10,
      currentPage: 1,
      user: null,
    };
  }

  // sets elements, passed to search result
  setElementsForCurrentPage() {
    this.setState({ elements: this.state.searchResults.items });
  }

  // handles pagination
  handlePageClick = data => {
    const selectedPage = data.selected + 1; // selected page is off by one
    this.setState({ currentPage: selectedPage }, () => {
      this.handleSearchChange(this.state.user);
    });
  };

  // handles search input
  handleSearchChange = value => {
    this.setState({ user: value });

    if (value) {
      let searchParams = new URLSearchParams('q=' + value);
      searchParams.append('page', this.state.currentPage);
      searchParams.append('per_page', this.state.perPage);
      fetch('https://api.github.com/search/users?' + searchParams.toString())
        .then(resp => resp.json())
        .then(result => {
          this.setState({ searchResults: result });
          this.setElementsForCurrentPage();
        })
        .catch(err => {
          console.error('Error retrieving users:', err);
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
        noResults = (
          <div key="noResultsKey" className="col-12">
            <p>
              <em>No results found.</em>
            </p>
          </div>
        );
      }
    }
    totalHits = (
      <div key="totalHitsKey" className="col-12">
        Total hits: {count}
      </div>
    );
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
        <div className={'jumbotron jumbotron-fluid'}>
          <div className={'container'}>
            <h1 className={'display-4 text-center'}>GitHub User Search</h1>
          </div>
        </div>
        <div className={'container'}>
          <div className={'row'}>
            <SearchInput textChange={this.handleSearchChange} />
          </div>
          <div className={'row'}>{displayTotal}</div>
          <div className={'row justify-content-center'}>
            <SearchResults searchResults={this.state.elements} />
          </div>
          <div className={'row justify-content-center'}>
            {paginationElement}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
