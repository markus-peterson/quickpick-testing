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
	constructor(props){
		super(props)
		
		this.state = {
			firstName: '',
			username:'',
			lastName:'',
			address: "",
			emailId: '',
			password: '',
			retype_password: '',
			status: '',
			errorMessage : ''
		};
		
		this.update = this.update.bind(this);
		this.registerClicked = this.registerClicked.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
	}

	update(e) {
		let name = e.target.name;
		let value = e.target.value;
		this.setState({
			[name]: value
		});
	}

	registerClicked(){
		
		const user = {
			username:this.state.username,
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


	render(){
		const { classes } = this.props;
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
