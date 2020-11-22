import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthenticationService from '../api/AuthenticationService';
import SearchBar from './SearchBar';
import '../css/Navigation.css';
import logo from '../img/quickpick-logo2-transparent-small.png';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withRouter } from "react-router";

class Navgiation extends Component {
    constructor(){
        super();
        this.state = {
            path: false
        }
        this.isUserLoggedIn = AuthenticationService.isUserLoggedIn();
    }

    componentWillReceiveProps(newProps){
        this.setState({
            path: window.location.href.includes('dash')
        });
    }

    async componentDidMount() {
        this.setState({
            path: window.location.href.includes('dash')
        });
    }

    render(){
        var noLoggedStyles = {visibility: "hidden"};
        if (this.isUserLoggedIn === true){
            noLoggedStyles = {
                visibility: "visible"
            };
        }
        return(
            <div className="navBar">
            <div className="nav-search-logo">
                <Link to="/"><img src={logo} alt="logo" className="logo"/></Link>
                {this.state.path && <SearchBar />}
            </div>
            <div className="leftNav">
                <nav className="navControls">
                    <Link className="navButton" to="/postjob" style={noLoggedStyles} >Post Job</Link>
                    <Link className="navButton" to="/dash" >Dashboard</Link>
                    <Nav/>
                </nav>
            </div>
        </div>
        )
    }
} 


function Nav(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const menuId = "primary-search-account-menu";
    const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
    let user = sessionStorage.getItem('authenticatedUser');
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuCloseLogout = () => {
        setAnchorEl(null);
        AuthenticationService.logout();
    };

    var spanStyles = {};
    var renderMenu = (
        <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}

        onClose={handleMenuClose}
        >
            <Link to="/login" className="profileMenuLink"><MenuItem onClick={handleMenuClose} id="accountIconMenuItem">Login</MenuItem></Link>
            <Link to="/register" className="profileMenuLink"><MenuItem onClick={handleMenuClose} id="accountIconMenuItem">Register</MenuItem></Link>
        </Menu>
    );

    if (isUserLoggedIn === true){
        spanStyles = {
            color: "#00a2ff"
        };
        renderMenu = (
            // Add information here to check if already logged in and have a seperate menu with if conditionals
            <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            >
                <Link to={"/profile/"+user} className="profileMenuLink"><MenuItem onClick={handleMenuClose} id="accountIconMenuItem">Profile</MenuItem></Link>
                <Link to="/" className="profileMenuLink"><MenuItem onClick={handleMenuCloseLogout} id="accountIconMenuItem">Log Out</MenuItem></Link>
            </Menu>
        );
    }
    
    return (
        <>
        <MenuItem onClick={handleProfileMenuOpen} className="account">
            <IconButton >
                <AccountCircle id="accountIcon" style={spanStyles}/>
            </IconButton>
        </MenuItem>
        {renderMenu}
        </>
    )
}

export default withRouter(Navgiation)