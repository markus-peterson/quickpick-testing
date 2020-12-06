import React, { Component } from "react";

import LoadingComponent from './LoadingComponent';

import output from '../api/connections';
import FileService from "../api/FileService";
import UserService from '../api/UserService';

import blank_profile from '../img/blank-profile.png';
import '../css/ProfileUploader.css';

// import PDFViewer from 'pdf-viewer-reactjs'

export default class ProfileUploader extends Component {
	constructor() {
		super();
		this.state = {
			urlTag: output + '/load/',
			selectedFiles: undefined,
			currentFile: undefined,
			progress: 0,
			message: "",
			isLoading: true,
			userObj: null,
			profile: null,
			profileCond: false,
			uploaded: false,
			uploadable: false,
		};

		this.selectFile = this.selectFile.bind(this);
		this.uploadProfile = this.uploadProfile.bind(this);
	}

	async componentDidMount() {
		if(this.props.username === sessionStorage.getItem('authenticatedUser'))
			this.setState({uploadable : true});
		const data = await	UserService
							.executeGetUserService(this.props.username)
							.then(result => result.data);
							console.log('loading data ...');
		this.setState({userObj : data, isLoading : false});
		var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
        window.dispatchEvent(evt);
	}

	selectFile(event) {
		this.setState({
			selectedFiles: event.target.files,
			progress: 0
		});
	}

	async uploadProfile() {
		if(!this.state.uploadable)
			return null;
		let currentFile = this.state.selectedFiles[0];
		this.setState({ progress: 0, currentFile: currentFile});

		FileService.uploadProfile(currentFile, (event) => {
			this.setState({
				progress: Math.round((100 * event.loaded) / event.total),
			});
		})
		.then((response) => {
			this.setState({
				profile: response.data,
				profileCond: true
			});
			window.location.reload();
		})
		.catch(() => {
			this.setState({
				progress: 0,
				message: "Could not upload the file!",
				currentFile: undefined,
			});
		});

		const data = await	UserService
							.executeGetUserService(sessionStorage
							.getItem('authenticatedUser'))
							.then(result => result.data);
		this.setState({userObj: data});

		this.setState({
			selectedFiles: undefined,
		});
		this.setState({uploaded: false});
	}

	render() {
		const style = {
			Paper : {padding:20, marginTop:10, marginBottom:10},
			image : {'borderRadius':'50%', width:"200px", height:"200px", "objectFit":"cover"}
		}
		// Upload once selected file exists
		if(this.state.selectedFiles !== undefined && !this.state.uploaded) {
			this.uploadProfile();
			this.setState({uploaded: true});
		}
		if(this.state.isLoading)
			return (
				<div style={{marginTop:'20px', marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
			);
		if(!this.state.uploadable)
			return (
				<div>
				{this.state.userObj.profileFileId != null ?
					(<img className="image" src={this.state.urlTag + this.state.userObj.profileFileId} alt={this.state.userObj.username + "-profile-image"} style={style.image}/>) :
					(<img className="image" src={blank_profile} alt="profile-blank" style={style.image}/>)
				}
				</div>
			);
		return (
			<label htmlFor="image" className="hovereffect">
				<input type="file" accept="image/*" name="image" id="image" onChange={this.selectFile} style={{"display":"none"}}/>
				{this.state.userObj.profileFileId != null ?
					(<img className="image" src={this.state.urlTag + this.state.userObj.profileFileId} alt={this.state.userObj.username + "-profile-image"} style={style.image}/>) :
					(<img className="image" src={blank_profile} alt="profile-blank" style={style.image}/>)
				}
				<div style={style.image} className="overlay">
					<div style={{marginTop:'12px'}}>+</div>
				</div>
			</label>
		);
	}
}