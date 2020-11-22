import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';

import ProgressBar from './ProgressBar';
import output from '../api/connections';
import FileService from "../api/FileService";
import UserService from '../api/UserService';
import AuthenticationService from '../api/AuthenticationService';

// import PDFViewer from 'pdf-viewer-reactjs'

export default class ResumeUploader extends Component {
	constructor(props) {
		super(props);
		
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
			resumeI: null,
			resumeCond: false
		};

		this.selectFile = this.selectFile.bind(this);
		this.uploadResume = this.uploadResume.bind(this);
	}

	async componentDidMount() {
		const data = await	UserService
							.executeGetUserService(sessionStorage
							.getItem('authenticatedUser'))
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

	async uploadResume() {
		let currentFile = this.state.selectedFiles[0];
		this.setState({ progress: 0, currentFile: currentFile});

		await FileService.uploadResume(currentFile, (event) => {
			this.setState({
				progress: Math.round((100 * event.loaded) / event.total),
			});
		})
		.then((response) => {
			this.setState({
				resume: response.data,
				resumeCond: true
			});
			// window.location.reload();
			// console.log(response)
			// this.props.updater()
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
	}

	render() {
		const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		const style = {
			Paper : {padding:20, marginTop:10, marginBottom:10}
		}

		if(this.state.isLoading)
			return (<div>Loading...</div>);
		if(!isUserLoggedIn)
			return <></>
		return (
			<div>
				<Paper style={style.Paper}>
					{this.state.userObj.resumeFileId != null?
						(<a href={this.state.urlTag + this.state.userObj.resumeFileId}>resume download</a>) :
						"Upload Resume"
					}
				</Paper>
				<label className="btn btn-default">
				<input type="file" onChange={this.selectFile} />
				</label>
				
				<button
				className="btn btn-success"
				disabled={!this.state.selectedFiles}
				onClick={this.uploadResume}
				>
				Upload
				</button>
				{this.state.currentFile && ( <ProgressBar value={this.state.progress} /> )}
				<div className="alert alert-light" role="alert">
					{this.state.message}
				</div>
			</div>
		);
	}
}