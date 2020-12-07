import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import UserService from '../api/UserService';
import '../css/RegisterComponent.css'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from "@material-ui/core/styles";
import ReCAPTCHA from "react-google-recaptcha";

const styles = theme => ({
	body: {
		"z-index": "-1",
		backgroundColor: theme.palette.common.red
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

class RegisterComponenet extends Component {
	constructor(){
		super()
		
		this.state = {
			firstName: '',
			username:'',
			lastName:'',
			address: '',
			emailId: '',
			password: '',
			retype_password: '',
			status: '',
			errorMessage : '',
			usernameError: false,
			firstNameError: false,
			lastNameError: false,
			addressError: false,
			emailError: false,
			passwordError: false,
			captchaError: false,
			captcha: false
		};
		
		this.update = this.update.bind(this);
		this.registerClicked = this.registerClicked.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
		this.captcha = this.captcha.bind(this);
	}

	update(e) {
		let name = e.target.name;
		let value = e.target.value;
		this.setState({
			[name]: value,
			[name + 'Error']: false
		});
		if(name === 'retype_password' && this.state.passwordError){
			console.log(name + ' | ' + this.state.passwordError)
			this.setState({
				passwordError: false
			})
		}
	}

	async registerClicked(){
		let uError = this.state.username === ''
		if(!uError){
			uError = (await UserService.usernameExists(this.state.username).then(res => res.data === 'registered')) || this.state.username.includes(' ')
		}
		let fError = this.state.firstName === ''
		let lError = this.state.lastName === ''
		let aError = this.state.address === ''
		let eError = this.state.emailId === ''
		if(!eError){
			eError = await UserService.emailExists(this.state.emailId).then(res => res.data === 'registered')
		}
		let pError = this.state.password === '' || this.state.password !== this.state.retype_password
		let cError = !this.state.captcha
		this.setState({
			usernameError: uError,
			firstNameError: fError,
			lastNameError: lError,
			addressError: aError,
			emailError: eError,
			passwordError: pError,
			captchaError: cError
		})

		if(!uError && !fError && !lError && !aError && !eError && !pError && !cError){
			const user = {
				username: this.state.username,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				address: this.state.address,
				emailId: this.state.emailId,
				password: this.state.password
			};
			console.log(`before-${user}`);
			console.log(user);
			UserService.executePostUserRegisterService(user)
			.then(response=>this.handleSuccessResponse(response))
			.catch(error => this.handleError(error))
		}
	}
	handleSuccessResponse(response){
		console.log(response)
		if (response.status === 200) {
			this.setState({
				errorMessage: ''
			})
			console.log('Register Successful')
			this.props.history.push(`/login`)
			window.location.reload() // temp solution to user API call bug
		}

	}

	handleError(error){
		let errorM = ''
		console.log(error.response)
		if(error.message){
			errorM += error.message
		}
		if(error.response && error.response.data){
			errorM += error.response.data.message
		}
		this.setState({errorMessage:errorM})
	}

	captcha(){
		this.setState({
			captcha: true,
			captchaError: false
		})
	}

	render(){
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

		return(
			<Container component="main" maxWidth="xs" style={{"z-index":-1}}>
					<div className="registerBack"></div>
				<CssBaseline />
				<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Register
				</Typography>
				<form className={classes.form} noValidate >
				{this.state.registerFailure && <Alert severity="error">User Not Registered. Try using diffrent Username!!</Alert>}
				{this.state.registerSuccess && <Alert severity="success">User Successfully Registered !!</Alert>}
					<TextField
						error={ this.state.usernameError}
						helperText={this.state.usernameError?
										(this.state.username === '' ? 
											"Please enter a username" : 
											(this.state.username.includes(' ')? "Invalid character" : "Username already registered")) : ""}
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
							onChange: this.update,
							autoComplete: "off"
						}}
					/>
					<TextField
						error={ this.state.firstNameError}
						helperText={this.state.firstNameError? "Please enter your first name" : ""}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="firstName"
						label="First Name"
						name="firstName"
						autoComplete="firstName"
						value={this.state.firstName}
						autoFocus
						inputProps={{
							type: "text",
							onChange: this.update,
							autoComplete: "off"
						}}
					/>
					<TextField
						error={ this.state.lastNameError}
						helperText={this.state.lastNameError? "Please enter your last name" : ""}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="lastName"
						label="Last Name"
						name="lastName"
						autoComplete="lastName"
						value={this.state.lastName}
						autoFocus
						inputProps={{
							type: "text",
							onChange: this.update,
							autoComplete: "off"
						}}
					/>
					<TextField
						error={ this.state.addressError}
						helperText={this.state.addressError? "Please enter your address" : ""}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="address"
						label="Address"
						name="address"
						autoComplete="address"
						value={this.state.address}
						autoFocus
						inputProps={{
							type: "text",
							onChange: this.update,
							autoComplete: "off"
						}}
					/>
					<TextField
						error={ this.state.emailError}
						helperText={this.state.emailError? (this.state.emailId === '' ? "Please enter an email address" :"Email address already registered") : ""}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="emailId"
						autoComplete="email"
						value={this.state.emailId}
						autoFocus
						inputProps={{
							type: "text",
							onChange: this.update,
							autoComplete: "off"
						}}
					/>
					<TextField
						error={ this.state.passwordError}
						helperText={this.state.passwordError? (this.state.password === ''? "Please enter a password": "Passwords do not match") : ""}
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
						inputProps={{
							type: "password",
							onChange: this.update,
							autoComplete: "off"
						}}
					/>
					<TextField
						error={ this.state.passwordError}
						helperText={this.state.passwordError? (this.state.retype_password === ''? "Please retype your password" : "Passwords do not match") : ""}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="retype_password"
						label="Retype Password"
						type="password"
						id="retype_password"
						value={this.state.retype_password}
						autoComplete="current-password"
						inputProps={{
							type: "password",
							onChange: this.update,
							autoComplete: "off"
						}}
					/>
					<ReCAPTCHA 
						sitekey='6Le7D_wZAAAAAJMN-rZltYW2SHN4aFCBNDHVMg_N'
						onChange={this.captcha}
						style={this.state.captchaError ? captchaStyles.error : captchaStyles.normal }
						className="captch"
						size='normal'
						/>
					<Button
						type="button"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={this.registerClicked}
					>
					Register
					</Button>
					<Grid container>
						<Grid item >
							<Link href="login" variant="body2">
							{"Already have an Account? Sign In"}
							</Link>
						</Grid>
					</Grid>
				</form>
				</div>
				<Box mt={8}>
				</Box>
			</Container>
		)
	}
}
export default withStyles(styles, { withTheme: true })(RegisterComponenet);
