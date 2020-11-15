import React, { Component } from 'react';
import UserService from '../api/UserService';
import FileComponent from './FileComponent';
import blank_profile from '../img/blank-profile.png';
import { Paper, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from '@material-ui/core/';
import { AccountCircle, Email, ContactMail } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import output from '../api/connections';
import '../css/RegisterComponent.css'
import '../css/Profile.css'

import AuthenticationService from '../api/AuthenticationService';

class ProfileComponent extends Component {
	constructor() {
		super();
		this.state = {
			isLoading: true,
			userObj: null,
			resumeName: '',
			profileName: '',
			resume_loaded: false,
			profile_loaded: false,
			edit_mode: false,
			isSubmitted: false,
			newFirstName: '',
			newLastName: '',
			newEmail: '',
			newAddress: ''
		}
		this.update = this.update.bind(this);
		this.editing = this.editing.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	async componentDidMount() {
		const data = await	UserService
							.executeGetUserService(sessionStorage
							.getItem('authenticatedUser'))
							.then(result => result.data);
							console.log('loading data ...');
		
		this.setState({userObj : data, isLoading : false});
		try {
			if(data.resumeFileId !== null){
				this.setState({resume_loaded: true});
			}
		} catch(error) {}
		try {
			if(data.profileFileId !== null){
				this.setState({profile_loaded: true});
			}
		} catch(error) {}
		var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
		window.dispatchEvent(evt);
	}

	async update() {
		const data = await	UserService
							.executeGetUserService(sessionStorage
							.getItem('authenticatedUser'))
							.then(result => result.data);
							console.log('loading data ...');
		this.setState({userObj : data, isLoading : false});
		try {
			if(data.resumeFileId !== null){
				this.setState({resume_loaded: true});
			}
		} catch(error) {}
		try {
			if(data.profileFileId !== null){
				this.setState({profile_loaded: true});
			}
		} catch(error) {}
	}

	editing() {
		this.setState({edit_mode : true});
		if(this.state.edit_mode === true) {
			this.updateUser();
		}
	}

	async updateUser() {
        const user = {
            firstName : this.state.newFirstName,
            lastName : this.state.newLastName,
            emailId : this.state.newEmail,
            address : this.state.newAddress
        }
		await UserService.updateUser(user);
		this.componentDidMount();
        this.setState({edit_mode: false});
    }

	handleChange(event) {
		const value = event.target.value;
		this.setState({
			...this.state,
			[event.target.name]: value
		});
	}

	render() {
		const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		const style = {
			Paper : {padding:20, marginTop:10, marginBottom:10},
			image : {'borderRadius':'50px', width:"200px", height:"200px", "objectfit":"cover"}
		}
		if(this.state.isLoading)
			return (<div>Loading...</div>);
		return (
			<div className="container">
				<Grid container justify="center">
					<Grid item sm={6}>
						<Paper style={style.Paper}>
							{!isUserLoggedIn &&
								<Grid container>
									<Grid item sm>
										Not Logged In
									</Grid>
								</Grid>
							}
							{isUserLoggedIn &&
								<Grid container>
									<Grid item sm className="profile-image-section">
											{this.state.profile_loaded && (
												<img src={output + '/load/' + this.state.userObj.profileFileId} alt={this.state.userObj.username + "-profile-image"} style={style.image}/>
											)}
											{!this.state.profile_loaded && (
												<img src={blank_profile} alt="profile-blank" style={style.image}/>
											)}
											<h2>{this.state.userObj.username}</h2>
									</Grid>
									{!this.state.edit_mode &&
										<Grid container direction="row">
											<Grid item sm>
												<List>
													<ListItem>
														<ListItemAvatar>
															<Avatar>
																<AccountCircle />
															</Avatar>
														</ListItemAvatar>
														<ListItemText primary={this.state.userObj.firstName+" "+this.state.userObj.lastName}/>
													</ListItem>
													<Divider variant="inset" component="li" />
													<ListItem>
														<ListItemAvatar>
															<Avatar>
																<Email />
															</Avatar>
														</ListItemAvatar>
														<ListItemText primary={this.state.userObj.emailId}/>
													</ListItem>
													<Divider variant="inset" component="li" />
													<ListItem>
														<ListItemAvatar>
															<Avatar>
																<ContactMail />
															</Avatar>
														</ListItemAvatar>
														<ListItemText primary={this.state.userObj.address}/>
													</ListItem>
												</List>
											</Grid>
											<Grid item sm={1}>
												<EditIcon onClick={this.editing}/>
											</Grid>
										</Grid>
									}
									{this.state.edit_mode &&
										<Grid container direction="row">
											<Grid item sm>
												<List>
													<ListItem>
														<ListItemAvatar>
															<Avatar>
																<AccountCircle />
															</Avatar>
														</ListItemAvatar>
														<TextField label={this.state.userObj.firstName} placeholder="firstname" name="newFirstName" onChange={this.handleChange}/>
														<TextField label={this.state.userObj.lastName} placeholder="lastname" name="newLastName" onChange={this.handleChange}/>
													</ListItem>
													<Divider variant="inset" component="li" />
													<ListItem>
														<ListItemAvatar>
															<Avatar>
																<Email />
															</Avatar>
														</ListItemAvatar>
														<TextField label={this.state.userObj.emailId} placeholder="email" name="newEmail" onChange={this.handleChange}/>
													</ListItem>
													<Divider variant="inset" component="li" />
													<ListItem>
														<ListItemAvatar>
															<Avatar>
																<ContactMail />
															</Avatar>
														</ListItemAvatar>
														<TextField label={this.state.userObj.address} placeholder="address" name="newAddress" onChange={this.handleChange}/>
													</ListItem>
												</List>
											</Grid>
											<Grid item sm={1}>
												<SaveIcon onClick={this.editing}/>
											</Grid>
										</Grid>
									}
								</Grid>
							}
						</Paper>
					</Grid>
				</Grid>
				<Grid container justify="center">
					<Grid item sm={3}>
						<FileComponent updater={this.update}/>
					</Grid>
				</Grid>
			</div>
		);
	}
}
export default ProfileComponent;
