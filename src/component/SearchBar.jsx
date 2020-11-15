import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Component } from 'react';

class SearchBar extends Component{
    constructor() {
        super();
        this.state = {
            value: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.search(this.state.value);
    }

    render(){
        return (
            <form onSubmit={this.handleSubmit} id="searchBar">
                <div className="searchIcon">
                        <SearchIcon id="svgIcon"/>
                </div>
                <input type="text" placeholder={this.props.holder} className="searchInput" onChange={this.handleChange} value={this.state.value}/>
                <input type="submit" value="Search" className="searchButton"/>
                <input type="submit" style={{display: "none"}} />
            </form>
        );
    }
  }
  export default SearchBar