import React, { Component } from 'react';
import PDFViewer from 'pdf-viewer-reactjs';

import ErrorMessage from './ErrorMessage';
import LoadingComponent from './LoadingComponent';

import output from '../api/connections';
import UserService from '../api/UserService';
import AuthenticationService from '../api/AuthenticationService';

export default class ResumeViewer extends Component {
	constructor() {
		super();
		
		this.state = {
			isLoading: true,
			userObj: null,
			urlTag: output + '/load/',
		};
	}

	async componentDidMount() {
		const location = window.location.href.split('/');
		console.log(location);
		if(location.length >= 5) {
			const pathUser = window.location.href.split('/')[4];
			const data = await	UserService
								.executeGetUserService(pathUser)
								.then(result => result.data);
								console.log('loading data ...');
			this.setState({userObj : data, isLoading : false});
			var evt = document.createEvent('Event');
			evt.initEvent('load', false, false);
			window.dispatchEvent(evt);
		}
	}

	render() {
		const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		if(this.state.isLoading)
			return (
				<div style={{marginTop:'20px', marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
			);
		if(!isUserLoggedIn)
			return (
				<div style={{marginTop : '20px'}}>
					<div className="profile-background-container"/>
					<ErrorMessage text="Not Logged In"/>
				</div>
			)
		if(this.state.userObj === undefined || this.state.userObj.resumeFileId === null || this.state.userObj.length <= 0)
			return (
				<div style={{marginTop : '20px'}}>
					<div className="profile-background-container"/>
					<ErrorMessage text="Resume Not Found" severity='error'/>
				</div>
			)
		return (
			<div>
				<div className="profile-background-container"/>
				<PDFViewer
					// navbarOnTop='true'
					// hideRotation='true'
					canvasCss='div'
					hideNavbar='true'
					showThumbnail={{
						scale: 1,
						rotationAngle: 0,
					}}
					document={{url: (this.state.urlTag + this.state.userObj.resumeFileId)}}
				/>
			</div>
		)
	}
}