import React, { Component } from 'react';
import { Paper, Grid, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@material-ui/core/';
import { PersonOutline as AccountCircle, MailOutline as Email, LocationOnOutlined as ContactMail } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Alert from '@material-ui/lab/Alert';

import LocationAutofill from './LocationAutofill';
import ErrorMessage from './ErrorMessage';
import LoadingComponent from './LoadingComponent';
import ResumeUploader from './ResumeUploader';
import ProfileUploader from './ProfileUploader';
import ProfileJobList from './ProfileJobList';
import ProfileShiftList from './ProfileShiftList';
import ViewCertificates from './ViewCertificates';
import CertifyService from '../api/CertifyService';

import UserService from '../api/UserService';
import AuthenticationService from '../api/AuthenticationService';
import '../css/RegisterComponent.css'
import '../css/ProfileComponent.css'

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
			editBiography: false,
			newUsername: '',
			editable: false,
			userTag: window.location.href.split('profile/')[0] + 'profile/',
			exists: false,
			certsExist: false
		}
		this.editing = this.editing.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.editNewAddress = this.editNewAddress.bind(this);
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
		const certData = await CertifyService.executeGetCertifications(data.id).then(res => res.data)
		this.setState({userObj : data, isLoading : false, editable : edit, certsExist: certData.length > 0});
		var evt = document.createEvent('Event');
		evt.initEvent('load', false, false);
		window.dispatchEvent(evt);
	}

	async componentDidMount() {
		const pathUser = window.location.href.split('profile/')[1];
		let exist = await UserService.usernameExists(pathUser);
		this.setState({exists : exist.data !== 'new'});
		const data = await	UserService
							.executeGetUserService(pathUser)
							.then(result => result.data);
							console.log('loading data ...');
		let edit = false;
		if(pathUser === sessionStorage.getItem('authenticatedUser')){
			edit = true
		}
		const certData = await CertifyService.executeGetCertifications(data.id).then(res => res.data)
		this.setState({userObj : data, isLoading : false, editable : edit, certsExist: certData.length > 0});
		var evt = document.createEvent('Event');
		evt.initEvent('load', false, false);
		window.dispatchEvent(evt);
	}

	editNewAddress(value) {
		if(value === null)
			this.setState({newAddress : this.state.newAddress}, () => {
				console.log(this.state.newAddress);	// this needs to be here
			});
		else
			this.setState({newAddress : value}, () => {
				console.log(this.state.newAddress);	// this needs to be here
			});
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
		let user = {
			firstName : this.state.newFirstName,
			lastName : this.state.newLastName,
			emailId : this.state.newEmail,
			address : this.state.newAddress,
			biography : (this.state.editBiography ? this.state.newBiography : this.state.userObj.biography),
			username : this.state.newUsername,
		}
		let reload = false;
		if(user.username !== '' && user.username !== sessionStorage.getItem('authenticatedUser'))
			reload = true;
		this.setState({editBiography : false});
		await UserService.updateUser(this.state.userObj.id, user);
		await this.componentDidMount();
		if(reload)
			window.location.replace(this.state.userTag + sessionStorage.getItem('authenticatedUser'));
		this.setState({edit_mode: false});
	}

	handleChange(event) {
		const value = event.target.value;
		this.setState({
			...this.state,
			[event.target.name]: value
		});
		if(event.target.name === 'newBiography')
			this.setState({editBiography : true});
	}

	render() {
		const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		const style = {
			Paper : {padding:20, marginTop:20, marginRight:20},
			image : {'borderRadius':'50%', width:"200px", height:"200px", "objectfit":"cover"}
		}
		if(this.state.isLoading)
			return (
				<div>
					<div className="profile-background-container"/>
					<div style={{marginTop:'20px', marginRight: '20px'}}>
						<LoadingComponent/>
					</div>
				</div>);
		if(!isUserLoggedIn || !this.state.exists)
			return (
				<div style={{marginTop : '20px'}}>
					<div className="profile-background-container"/>
					<ErrorMessage text={!isUserLoggedIn ? "Not Logged In" : "User Not Found"}/>
				</div>
			)
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
				{(this.state.userObj.address != null && this.state.userObj.address.length > 0) &&
					<ListItem>
						<ListItemAvatar><ContactMail fontSize="large"/></ListItemAvatar>
						<ListItemText primary={this.state.userObj.address}/>
					</ListItem>
				}
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
					{/* <TextField label={this.state.userObj.emailId} placeholder="email" name="newEmail" onChange={this.handleChange}/> */}
					<TextField disabled label="Disabled" defaultValue={this.state.userObj.emailId}/>
				</ListItem>
				<Divider variant="inset" component="li" />
				{/* <ListItem>
					<ListItemAvatar><ContactMail fontSize="large" /></ListItemAvatar>
					<TextField label={this.state.userObj.address} placeholder="address" name="newAddress" onChange={this.handleChange}/>
				</ListItem> */}
				<ListItem alignItems="flex-start">
					<ListItemAvatar><ContactMail fontSize="large"/></ListItemAvatar>
					<LocationAutofill text={this.state.userObj.address} update={this.editNewAddress}/>
				</ListItem>
			</List>
		);
		return (
			<div className="container">
				<div className="profile-background-container"/>
				<Grid container direction="row">
					<Grid container justify="center">
						<Grid item sm={3}>
							{/* <Grid container direction="row" justify="flex-end">
								<Paper style={style.Paper}>
									<ListItem>
										<ListItemText primary="Certifications" />
									</ListItem>
									{this.state.certsExist ? 
										<ViewCertificates userId={this.state.userObj.id}/>:
										<Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>no certifications completed</Alert>
									}
								</Paper>
							</Grid> */}
						</Grid>
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<Grid container>
									<>
										<Grid container direction="row" spacing={3}>
											<div style={{"paddingRight" : "2.5%"}}>
												<ProfileUploader key={this.state.userObj.username} username={this.state.userObj.username}/>
											</div>
											<Grid item sm={7}>
												<Grid container direction="column" alignItems="flex-start" spacing={2}>
													<Grid item>
														{!this.state.edit_mode ?
															<h2>{this.state.userObj.username}</h2> :
															<TextField label={this.state.userObj.username} placeholder="Username" name="newUsername" onChange={this.handleChange}/>
														}
													</Grid>
													<Grid item >
														{!this.state.edit_mode ?
															<div align="left" style={{'wordBreak': 'break-word'}}>
																{this.state.userObj != null && this.state.userObj.biography !== null && this.state.userObj.biography !== undefined && this.state.userObj.biography.length > 0 ? this.state.userObj.biography :
																<Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>no biography</Alert>}
																{/* <Alert severity='info'>empty biography</Alert> */}
															</div> :
															<div width="10%">
																<TextareaAutosize cols="50" rows="4" name="newBiography" defaultValue={this.state.userObj.biography} onChange={this.handleChange}/>
															</div>
														}
													</Grid>
												</Grid>
											</Grid>
											{/* <div>
												{this.state.editable && (!this.state.edit_mode ? <EditIcon style={{cursor: "pointer"}} onClick={this.editing}/> : <SaveIcon style={{cursor: "pointer"}} onClick={this.editing}/>)}
											</div> */}
											{/* <Grid item sm={1}>
												{this.state.editable && (!this.state.edit_mode ? <EditIcon style={{cursor: "pointer"}} onClick={this.editing}/> : <SaveIcon style={{cursor: "pointer"}} onClick={this.editing}/>)}
											</Grid> */}
										</Grid>
										<Grid container direction="row">
											<Grid item sm>
												{!this.state.edit_mode ? editingFalse() : editingTrue()}
											</Grid>
										</Grid>
									</>
								</Grid>
								<span style={{'display' : 'inline', 'position':'absolute', 'right':'27%', 'top' : '5%'}}>
									{this.state.editable && (!this.state.edit_mode ? <EditIcon style={{cursor: "pointer"}} onClick={this.editing}/> : <SaveIcon style={{cursor: "pointer"}} onClick={this.editing}/>)}
								</span>
							</Paper>
						</Grid>
						<Grid item sm={3}>
							<Grid container direction="row">
								<Paper style={style.Paper}>
									<ResumeUploader key={this.state.userObj.username} username={this.state.userObj.username}/>
								</Paper>
							</Grid>
							<Grid container direction="row" justify="flex-start">
								<Paper style={style.Paper}>
									<ListItem>
										<ListItemText primary="Certifications" />
									</ListItem>
									{this.state.certsExist ?
										// I added key to have it so that the component will update on userObj update
										// I added showFailed bc no one wants other people to see that they failed something (so shows passed and perfect score)
										<ViewCertificates key={this.state.userObj.username} showFailed={this.state.editable ? 'true' : 'false'} userId={this.state.userObj.id}/>:
										<Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>no certifications completed</Alert>
									}
								</Paper>
							</Grid>
						</Grid>
					</Grid>
					<Grid container justify="center">
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<ProfileJobList key={this.state.userObj.username} username={this.state.userObj.username} jobType="created"/>
							</Paper>
						</Grid>
					</Grid>
					{this.state.editable && 
						<Grid container justify="center">
							<Grid item sm={6}>
								<Paper style={style.Paper}>
									<ProfileJobList key={this.state.userObj.username} username={this.state.userObj.username} jobType="applied"/>
								</Paper>
							</Grid>
						</Grid>
					}
					{this.state.editable && 
						<Grid container justify="center">
							<Grid item sm={6}>
								<Paper style={style.Paper}>
									<ProfileShiftList key={this.state.userObj.username} username={this.state.userObj.username}/>
								</Paper>
							</Grid>
						</Grid>
					}
				</Grid>
				<div style={{marginBottom : '20px'}}/>
			</div>
		);
	}
}
export default ProfileComponent;
