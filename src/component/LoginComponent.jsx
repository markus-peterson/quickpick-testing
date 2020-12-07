import React, { Component } from 'react';
import AuthenticationService  from '../api/./AuthenticationService.js'
import UserService from '../api/UserService';
// import Facebook from './Facebook'
import '../css/LoginComponent.css'

import { Avatar, Button, CssBaseline, TextField, Checkbox, Link, Grid, Box, Typography, Container, FormControlLabel } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ReCAPTCHA from "react-google-recaptcha";
import ErrorMessage from './ErrorMessage';

const styles = theme => ({
    body: {
        backgroundColor: theme.palette.common.red,
        backgroundImage: `url(${Image})`,
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        alignItems: 'center',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: theme.palette.common.blue,
    },
});

class LoginComponenet extends Component {
    constructor(){
        super()
        this.state = {
            firstName: '',
			username:'',
            lastName:'',
			address: '',
			emailId: '',
			password: '',
			status: '',
            hasLoginFailed: false,
            showSuccessMessage:false,
            noUserFound:false,
            externalCond: false,
            userObj: null,
            incorrect: 0,
            usernameError: false,
            passwordError: false,
            captchaError: false,
			captcha: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.loginClicked = this.loginClicked.bind(this)
        this.registerClicked = this.registerClicked.bind(this)
        this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
        this.registerGoogle = this.registerGoogle.bind(this);
        this.loginGoogle = this.loginGoogle.bind(this);
        this.captcha = this.captcha.bind(this);
    }

    handleChange(event){
        this.setState({     
            [event.target.name] : event.target.value,
            incorrect: 0
        })
    }

    registerClicked(){
        this.props.history.push(`/register`);
    }

    loginClicked(event){
        let uError = this.state.username === ''
        let pError = this.state.password === ''
        let cError = !this.state.captcha
        
        this.setState({
            usernameError: uError,
            passwordError: pError,
            captchaError: cError
        })
        if(!uError && !pError && !cError){
            console.log('check')
            event.preventDefault()
            const user = {
                password: this.state.password,
                username:this.state.username,
                firstName: null,
                lastName: null,
                address: null,
                emailId: null
            }
            console.log(user)
            console.log('Inside the login function')
            //let loginSccess = false;
            UserService.registerLogin(user)
            .then( response => this.handleSuccessResponse(response))
            .catch((error) => {
                console.log("ALLAL", error);
                console.log("data", { user });
            })
        }
    }

    handleSuccessResponse(response){
        if (response.status === 200) {
            if (response.data.username === this.state.username || response.data.emailId === this.state.emailId || response.data.emailId === this.state.username){
                console.log('Successful Login')
                AuthenticationService .registerSuccessfulLogin(response.data)
                this.props.history.push(`/`)
                window.location.reload() // temp solution to user API call bug
            }else if (response.data.username === "Incorrect Password"){
                this.setState({
                    showSuccessMessage : false,
                    hasLoginFailed: true,
                    incorrect: 2
                })
            }else if (response.data.username === "Not registered"){
                this.setState({
                    showSuccessMessage : false,
                    noUserFound : true,
                    incorrect: 1
                })
            }
        } else {
            window.alert(response)
        }
    }

    handleError(error){
        this.setState({showSuccessMessage : false   })
        this.setState({hasLoginFailed: true})
    }

    handleGoogleLogin(response){
        UserService.emailExists(response.profileObj.email)
        .then((res) => {
            if(res.data === "registered"){
                this.loginGoogle(response);
            }else{
                this.setState({externalCond: true, userObj: response});
            }
        })
		.catch(error => this.handleError(error));
    }
    
    async registerGoogle(event){
        event.preventDefault()
        let uError = await UserService.usernameExists(this.state.username).then(res => res.data === 'registered')
        console.log(uError)
        this.setState({
            usernameError: uError
        })
        if(!uError){
            const response = this.state.userObj
            const user = {
                password: response.profileObj.googleId,
                emailId: response.profileObj.email,
                firstName: response.profileObj.givenName,
                address: null,
                lastName: response.profileObj.familyName,
                username: this.state.username
            };
            this.setState({
                password: response.profileObj.googleId,
                emailId: response.profileObj.email,
                firstName: response.profileObj.givenName,
                address: null,
                lastName: response.profileObj.familyName,
                username: this.state.username,
            });
            UserService.executePostUserRegisterService(user)
            .then(res => {
                if(res.status === 200) {
                    console.log('Register Successful')
                    this.loginGoogle(response)
                }
            })
            .catch(error => this.handleError(error))
        }
    }

    loginGoogle(response){
        this.setState({
            password: response.profileObj.googleId,
            emailId: response.profileObj.email,
        });
        const user = {
            password: response.profileObj.googleId,
            emailId: response.profileObj.email,
            firstName: null,
            lastName: null,
            address: null,
            username: null
        }
        
        UserService.registerLogin(user)
        .then( res => this.handleSuccessResponse(res))
		.catch(function (error) {
            console.log("ALLAL", error);
            console.log("data", { user });
        })
    }

    captcha(){
		this.setState({
			captcha: true,
			captchaError: false
		})
	}

    render(){
        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		if(isUserLoggedIn){
			return (
				<div style={{marginTop : '20px'}}>
					<div className="registerBack"/>
					<ErrorMessage severity='info' text="User Already Logged In"/>
				</div>
            )
        }
        const { classes } = this.props;
		const captchaStyles = {
			normal: {
				border: 'none',
				width: 304,
				height: 78,
				borderRadius: 3,
				margin: 'auto'
			},
			error: {
				border: 'red solid 1px',
				width: 304,
				height: 78,
				borderRadius: 3,
				margin: 'auto'
			}
		}
        if (this.state.externalCond){
            return(
                <Container component="main" maxWidth="xs">
                    <div className="registerBack"></div>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <form className={`${classes.form} login-paper`} noValidate  onSubmit={this.registerGoogle}>
                            <Typography component="h1" variant="h5">Set Username</Typography>
                            <TextField
                                error={ this.state.usernameError}
                                helperText={this.state.usernameError? (this.state.username === '' ? "Please enter a username" :"Username already registered") : ""}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={this.state.username}
                                autoFocus
                                inputProps={{
                                    type: "text",
                                    onChange: this.handleChange,
                                    autoComplete: "off"
                                }}/>
                            <Button type="Button" fullWidth variant="contained" color="primary"
                                className={classes.submit}
                                onClick={this.registerGoogle}>
                                    Finish Registration
                            </Button>
                        </form>
                    </div>
                </Container>
            );
        }else{
            return(
                <Container component="main" maxWidth="xs">
                    <div className="registerBack"></div>
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <form className={classes.form} noValidate  onSubmit={this.loginClicked} >
                            <Typography component="h1" variant="h5">Sign in</Typography>
                            <TextField
                                error={ this.state.incorrect === 1 || this.state.usernameError}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username or Email"
                                name="username"
                                autoComplete="username"
                                helperText={(this.state.incorrect === 1 ? "Username or email not registered" : "") || (this.state.usernameError ? 'Please enter you username' : '')}
                                value={this.state.username}
                                autoFocus
                                inputProps={{
                                    type: "text",
                                    onChange: this.handleChange,
                                    autoComplete: "off"
                                }}/>
                            <TextField
                                error={ this.state.incorrect > 0 || this.state.passwordError}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={this.state.password}
                                autoComplete="current-password"
                                helperText={(this.state.incorrect === 2 ? "Incorrect password" : "") || (this.state.passwordError ? 'Please enter you password' : '')}
                                inputProps={{
                                    type: "password",
                                    onChange: this.handleChange,
                                    autoComplete: "off"
                                }}/>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me" />
                            <ReCAPTCHA 
                                sitekey='6Le7D_wZAAAAAJMN-rZltYW2SHN4aFCBNDHVMg_N'
                                onChange={this.captcha}
                                style={this.state.captchaError ? captchaStyles.error : captchaStyles.normal }
                                className="captch"
                                size='normal'
                                />
                            <Button type="Button" fullWidth variant="contained" color="primary"
                                className={classes.submit}
                                onClick={this.loginClicked}>
                                    Sign In
                            </Button>
                            <div className="google-outer">
                                <Typography component="h5" variant="h5" style={{ "padding-bottom": "10px" }}>or</Typography>
                                <div className="google-button">
                                    <GoogleLogin
                                        clientId="388896389881-5je3ulqa0qfii59cgpq3ldnfiof49pfv.apps.googleusercontent.com"
                                        buttonText="Sign in With Google"
                                        onSuccess={this.handleGoogleLogin}
                                        onFailure={this.handleError}
                                        cookiePolicy={'single_host_origin'} />
                                </div>
                            </div>
                            <div style={{"height": "20px"}}></div>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/ForgotPassword" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                    <Box mt={8}>
                    </Box>
                </Container>
            );
        }
    }
}
export default withStyles(styles, { withTheme: true })(LoginComponenet);
