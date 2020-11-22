import React, { Component } from 'react';
import { Paper, Grid, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@material-ui/core/';
import { PersonOutline as AccountCircle, MailOutline as Email, LocationOnOutlined as ContactMail } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import ResumeUploader from './ResumeUploader';
import ProfileUploader from './ProfileUploader';
import CreatedJobList from './CreatedJobList';
import AppliedJobList from './AppliedJobList';
import UserService from '../api/UserService';
import AuthenticationService from '../api/AuthenticationService';
import '../css/RegisterComponent.css'


class ProfileComponent extends Component {
	constructor() {
		super();
		this.state = {
			isLoading: true,
			userObj: null,
			resumeName: '',
			profileName: '',
			edit_mode: false,
			isSubmitted: false,
			newFirstName: '',
			newLastName: '',
			newEmail: '',
			newAddress: '',
			newBiography: '',
			newUsername: '',
			editable: false
		}
		this.editing = this.editing.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	async componentWillReceiveProps(newProps){ // Handles when the path updates as that does not call a remount of the component
		const pathUser = newProps.match.params.name;
		const data = await	UserService
							.executeGetUserService(pathUser)
							.then(result => result.data);
							console.log('loading data ...');
		let edit = false;
		if(pathUser === sessionStorage.getItem('authenticatedUser')){
			edit = true
		}
		this.setState({userObj : data, isLoading : false, editable : edit});
		// console.log(data);
		var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
		window.dispatchEvent(evt);
	}

	async componentDidMount() {
		const pathUser = window.location.href.split('profile/')[1];
		const data = await	UserService
							.executeGetUserService(pathUser)
							.then(result => result.data);
							console.log('loading data ...');
		let edit = false;
		if(pathUser === sessionStorage.getItem('authenticatedUser')){
			edit = true
		}
		this.setState({userObj : data, isLoading : false, editable : edit});
		// console.log(data);
		var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
		window.dispatchEvent(evt);
	}
	
	editing() {
		if(this.state.editable){
			this.setState({edit_mode : true});
			if(this.state.edit_mode === true) {
				this.updateUser();
			}
		}
	}

	async updateUser() {
        const user = {
            firstName : this.state.newFirstName,
            lastName : this.state.newLastName,
            emailId : this.state.newEmail,
			address : this.state.newAddress,
			biography : this.state.newBiography,
			username : this.state.newUsername,
        }
		await UserService.updateUser(this.state.userObj.id, user)
		.then((response) => {
			AuthenticationService.updateUsername(response.data.username)
			this.setState({
				userObj: response.data
			});
		});
		// this.componentDidMount();
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
			image : {'borderRadius':'50%', width:"200px", height:"200px", "objectfit":"cover"}
		}

		const editingFalse = () => (
			<List>
				<ListItem>
					<ListItemAvatar><AccountCircle fontSize="large" /></ListItemAvatar>
					<ListItemText primary={this.state.userObj.firstName+" "+this.state.userObj.lastName}/>
				</ListItem>
				<Divider variant="inset" component="li" />
				<ListItem>
					<ListItemAvatar><Email fontSize="large" /></ListItemAvatar>
					<ListItemText primary={this.state.userObj.emailId}/>
				</ListItem>
				<Divider variant="inset" component="li" />
				<ListItem>
					<ListItemAvatar><ContactMail fontSize="large"/></ListItemAvatar>
					<ListItemText primary={this.state.userObj.address}/>
				</ListItem>
			</List>
		);

		const editingTrue = () => (
			<List>
				<ListItem>
					<ListItemAvatar><AccountCircle fontSize="large" /></ListItemAvatar>
					<TextField label={this.state.userObj.firstName} placeholder="firstname" name="newFirstName" onChange={this.handleChange}/>
					<TextField label={this.state.userObj.lastName} placeholder="lastname" name="newLastName" onChange={this.handleChange}/>
				</ListItem>
				<Divider variant="inset" component="li" />
				<ListItem>
					<ListItemAvatar><Email fontSize="large" /></ListItemAvatar>
					<TextField label={this.state.userObj.emailId} placeholder="email" name="newEmail" onChange={this.handleChange}/>
				</ListItem>
				<Divider variant="inset" component="li" />
				<ListItem>
					<ListItemAvatar><ContactMail fontSize="large" /></ListItemAvatar>
					<TextField label={this.state.userObj.address} placeholder="address" name="newAddress" onChange={this.handleChange}/>
				</ListItem>
			</List>
		);

		if(this.state.isLoading)
			return (<div>Loading...</div>);
		return (
			<div className="container">
				<Grid container direction="row">
					<Grid container justify="center">
						<Grid item sm={3}></Grid>
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<Grid container>
									{!isUserLoggedIn ?
										<Grid item sm>
											Not Logged In
										</Grid>
										:
										<>
											<Grid container direction="row" spacing={6}>
												<Grid item sm={3}>
													<ProfileUploader/>
												</Grid>
												<Grid item sm={8}>
													<Grid container direction="column" alignItems="flex-start" spacing={2}>
														<Grid item>
															{!this.state.edit_mode ?
																<h2>{this.state.userObj.username}</h2> :
																<TextField label={this.state.userObj.username} placeholder="Username" name="newUsername" onChange={this.handleChange}/>
															}
														</Grid>
														<Grid item >
															{!this.state.edit_mode ?
																<div align="left" style={{'wordBreak': 'break-word'}}>{this.state.userObj.biography !== null ? this.state.userObj.biography : "bio"}</div> :
																<div width="10%">
																	<TextareaAutosize cols="50" rows="4" name="newBiography" defaultValue={this.state.userObj.biography} onChange={this.handleChange}/>
																</div>
															}
														</Grid>
													</Grid>
												</Grid>
												<Grid item sm={1}>
													{!this.state.edit_mode ? <EditIcon style={{cursor: "pointer"}} onClick={this.editing}/> : <SaveIcon style={{cursor: "pointer"}} onClick={this.editing}/>}
												</Grid>
											</Grid>
											<Grid container direction="row">
												<Grid item sm>
													{!this.state.edit_mode ? editingFalse() : editingTrue()}
												</Grid>
											</Grid>
										</>
									}
								</Grid>
							</Paper>
						</Grid>
						<Grid item sm={3}>
							<Grid container direction="row">
								<Paper style={style.Paper}>
									<ResumeUploader/>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
					<Grid container justify="center">
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<CreatedJobList/>
							</Paper>
						</Grid>
					</Grid>
					<Grid container justify="center">
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<AppliedJobList/>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	}
}
export default ProfileComponent;
