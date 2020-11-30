import React, { Component } from "react";
import { Button, Paper } from '@material-ui/core/';

import ProgressBar from './ProgressBar';
import output from '../api/connections';
import FileService from "../api/FileService";
import UserService from '../api/UserService';

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
			resumeCond: false,
			uploadable: false,
		};

		this.selectFile = this.selectFile.bind(this);
		this.uploadResume = this.uploadResume.bind(this);
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

	async uploadResume() {
		let currentFile = this.state.selectedFiles[0];
		this.setState({ progress: 0, currentFile: currentFile});
		console.log(currentFile);
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
			// this.props.updater()
		})
		.catch(() => {
			this.setState({
				progress: 0,
				message: "Could not upload the file!",
				currentFile: undefined,
			});
		});
		this.componentDidMount();

		this.setState({
			selectedFiles: undefined,
		});
	}

	render() {
		const style = {
			Paper : {padding:20, marginTop:10, marginBottom:10}
		}

		if(this.state.isLoading)
			return (<div>Loading...</div>);
		if(!this.state.uploadable)
			return (
				<div>
					{/* <Paper style={style.Paper}> */}
						{this.state.userObj.resumeFileId != null?
							(<a href={this.state.urlTag + this.state.userObj.resumeFileId}>resume download</a>) :
							"Resume Not Uploaded"
						}
					{/* </Paper> */}
				</div>
			);
		return (
			<div>
				<Paper style={style.Paper}>
					{this.state.userObj.resumeFileId != null?
						(<a href={this.state.urlTag + this.state.userObj.resumeFileId}>resume download</a>) :
						"Upload Resume"
					}
				</Paper>
				{/* <label className="btn btn-default">
				<input type="file" onChange={this.selectFile} />
				</label> */}
				<label htmlFor="contained-button-file" className="btn btn-default">
					<input
					accept="application/*"
					id="contained-button-file"
					type="file"
					onChange={this.selectFile}
					style={{"display":"none"}}
					/>
					<Button variant="contained" color="primary" component="span">
						Choose File
					</Button>
				</label>
				<Button variant="contained" color="primary" className="btn btn-success" disabled={!this.state.selectedFiles} onClick={this.uploadResume}>
					Upload
				</Button>
				{/* <button
				className="btn btn-success"
				disabled={!this.state.selectedFiles}
				onClick={this.uploadResume}
				>
				Upload
				</button> */}
				{this.state.currentFile && ( <ProgressBar value={this.state.progress} /> )}
				<div className="alert alert-light" role="alert">
					{this.state.message}
				</div>
			</div>
		);
	}
}