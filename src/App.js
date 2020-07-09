import React, { Component } from 'react';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import ReactPaginate from 'react-paginate';
import './App.css';

const GITHUB_API = 'https://api.github.com';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      elements: [],
      perPage: 10,
      currentPage: 1,
      user: null,
      coreLimit: null,
      searchLimit: null,
    };
  }

  // handles pagination
  handlePageClick = data => {
    const selectedPage = data.selected + 1; // selected page is off by one
    this.setState({ currentPage: selectedPage }, () => {
      this.handleSearchChange(this.state.user);
    });
  };

  // get current rate limit from github
  getRateLimit() {
    return fetch(GITHUB_API + '/rate_limit')
      .then(response => response.json())
      .then(result => {
        this.setState({
          searchLimit: result.resources.search,
          coreLimit: result.rate,
        });
        return (
          result.resources.search.remaining === 0 || result.rate.remaining < 15
        );
      })
      .catch(error => {
        console.error('Rate limit check failed.');
      });
  }

  // search for all users with search term
  searchUsers(rateExceeded) {
    this.setState({ rateExceeded: rateExceeded });
    if (!rateExceeded) {
      let searchParams = new URLSearchParams('q=' + this.state.user);
      searchParams.append('page', this.state.currentPage);
      searchParams.append('per_page', this.state.perPage);
      fetch(GITHUB_API + '/search/users?' + searchParams.toString())
        .then(resp => {
          if (!resp.ok) {
            throw new Error(resp.status);
          }
          return resp.json();
        })
        .then(result => {
          this.setState({
            searchResults: result,
            elements: result.items,
          });
        })
        .catch(err => {
          console.error('Error retrieving users:', err);
        });
    }
  }

  // handles search input
  handleSearchChange = value => {
    if (!value) {
      this.setState({ searchResults: null, elements: [] });
    } else {
      this.setState({ user: value });

      // check rate limit
      this.getRateLimit().then(response => {
        this.searchUsers(response);
      });
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

    // set up rate limit message if limit exceeded
    let rateLimitMessage;
    if (this.state.rateExceeded) {
      const time = Math.max(
        this.state.searchLimit.reset,
        this.state.coreLimit.reset,
      );
      rateLimitMessage = (
        <div className="alert alert-danger rate-limit">
          Rate limit reached. Please try again at{' '}
          {new Date(time).toTimeString()}.
        </div>
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
          <div className={'row justify-content-center'}>
            {rateLimitMessage}
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
