import React from 'react';
import { Link } from 'react-router-dom';
import AuthenticationService from '../api/AuthenticationService';
import '../css/Navigation.css';
import logo from '../img/quickpick-logo2-transparent-small.png';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Navigation } from '@material-ui/icons';


export default function Navgiation() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const menuId = "primary-search-account-menu";
    const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
    // let user = sessionStorage.getItem('authenticatedUser');
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
    var noLoggedStyles = {visibility: "hidden"};
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
        noLoggedStyles = {
            visibility: "visible"
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
                <Link to={"/profile"} className="profileMenuLink"><MenuItem onClick={handleMenuClose} id="accountIconMenuItem">Profile</MenuItem></Link>
                <Link to="/" className="profileMenuLink"><MenuItem onClick={handleMenuCloseLogout} id="accountIconMenuItem">Log Out</MenuItem></Link>
            </Menu>
        );
    }
    var dash = 'active';
    var other = 'hidden';
    
    //   id={this.index}
    return (
        <div className="navBar">
            <Link to="/"><img src={logo} alt="logo" className="logo"/></Link>
            <div className="leftNav">
                <nav className="navControls">
                    {/* <Link className="navButton" id={other} to="/" >Manage</Link> */}
                    <Link className="navButton" id={other} to="/postjob" style={noLoggedStyles}>Post Job</Link>
                    <Link className="navButton" id={dash} to="/">Dashboard</Link>
                    {/* <td><NavButton page={"hidden"} name={"Profile"} to={"/profile"}/></td> */}
                </nav>
            </div>
            <div className="rightNav">
                <MenuItem onClick={handleProfileMenuOpen} className="account">
                    <IconButton >
                        <AccountCircle id="accountIcon" style={spanStyles}/>
                    </IconButton>
                </MenuItem>
                {renderMenu}
            </div>
        </div>
    )
}

Navigation.defaultProps = {
    index: "dash"
}