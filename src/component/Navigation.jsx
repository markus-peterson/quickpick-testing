import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withRouter } from "react-router";

import JobService from '../api/JobService';
import logo from '../img/quickpick-logo2-transparent-small.png';
import AuthenticationService from '../api/AuthenticationService';
import SearchBar from './SearchBar';
import '../css/Navigation.css';

class Navgiation extends Component {
    constructor(){
        super();
        this.state = {
            path: false,
            isUserLoggedIn: false,
            checkByAuthor: false
        }
    }

    async componentWillReceiveProps(newProps){
        let logged = AuthenticationService.isUserLoggedIn();
        console.log(logged)
        let check = await JobService.executeCheckByAuthor().then(result => result.data);
        console.log(check)
        this.setState({
            path: newProps.location.pathname.includes('dash'),
            isUserLoggedIn: logged,
            checkByAuthor: check
        });
    }

    async componentDidMount() {
        let logged = AuthenticationService.isUserLoggedIn();
        console.log(logged)
        let check = await JobService.executeCheckByAuthor().then(result => result.data);
        console.log(check)
        this.setState({
            path: this.props.location.pathname.includes('dash'),
            isUserLoggedIn: logged,
            checkByAuthor: check
        });
    }

    render(){
        return(
            <div className="navBar">
            <div className="nav-search-logo">
                <Link to="/"><img src={logo} alt="logo" className="logo"/></Link>
                {this.state.path && <SearchBar />}
            </div>
            <div className="leftNav">
                <nav className="navControls">
                    { this.state.isUserLoggedIn && this.state.checkByAuthor && <Link className="navButton" to="/manage">Manage Posts</Link>}
                    { this.state.isUserLoggedIn && <Link className="navButton" to="/postjob">Post Job</Link>}
                    <Link className="navButton" to="/dash" >Dashboard</Link>
                    <Nav/>
                </nav>
            </div>
        </div>
        )
    }
} 


function Nav() {
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