import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      term: ''
    };

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }

  search(){
    this.props.onSearch(this.state.term);
    window.localStorage.setItem('searchText', this.state.term);
  }

  handleTermChange(e){
    this.setState({
      term: e.target.value
    });
  }

  handleEnterKey(e){
    if (e.keyCode === 13){
      document.getElementById('search').click();
    }
  }

  render(){
    return (
      <div className="SearchBar">
        <input id="search-input" placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={this.handleEnterKey} autoFocus/>
        <button id="search" onClick={this.search}>SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;


// WEBPACK FOOTER //
// ./src/Components/SearchBar/SearchBar.js