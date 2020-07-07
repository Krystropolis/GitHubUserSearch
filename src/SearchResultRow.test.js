import React from 'react';
import ReactDOM from 'react-dom';
import SearchResultRow from './SearchResultRow';

it('returns "Loading..." prior to receiving user data', () => {
	const div = document.createElement('div');
	ReactDOM.render(<SearchResultRow />, div);
	expect(div.textContent).toEqual('Loading...');
});
