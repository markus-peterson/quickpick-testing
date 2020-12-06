import React, { Component } from "react";

import {ListItem, List, Button} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {FindInPageOutlined as FindInPageOutlinedIcon, 
		AnnouncementOutlined as AnnouncementOutlinedIcon} from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';

import ProgressBar from './ProgressBar';
import LoadingComponent from './LoadingComponent';

import FileService from "../api/FileService";
import UserService from '../api/UserService';


export default class ResumeUploader extends Component {
	constructor() {
		super();
		
		this.state = {
			urlTag: window.location.href.split('profile/')[0]+'resume/',
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
			uploaded: false,
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
			progress: 0,
			uploaded: false
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
			uploaded: true
		});
	}

	render() {
		let fileName = this.state.selectedFiles && this.state.selectedFiles.length > 0 ? this.state.selectedFiles[0].name : null;
		const FileLoaded = () => (
			<Alert severity="info">
				{fileName} Selected
			</Alert>
		)
		const ResumeLink = () => (
			<List>
				<a style={{'color': 'inherit', 'text-decoration' : 'none'}} href={this.state.urlTag + this.state.userObj.username} target="_blank">
					<ListItem button>
						<ListItemIcon title="PDF"><FindInPageOutlinedIcon /></ListItemIcon>
						<ListItemText primary={'View Resume'} />
					</ListItem>
				</a>
			</List>
		)
		const NoResumeLink = (props) => (
			<List>
				<ListItem>
					<ListItemIcon title="Not Uploaded"><AnnouncementOutlinedIcon /></ListItemIcon>
					<ListItemText primary={props.message} />
				</ListItem>
			</List>
		)

		if(this.state.isLoading)
			return (
				<div style={{marginTop:'20px', marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
			);
		if(!this.state.uploadable)
			return (
				<div>
					{this.state.userObj.resumeFileId != null?
						// (<a href={this.state.urlTag + this.state.userObj.username} target="_blank">view resume</a>) :
						(<ResumeLink/>) :
						<NoResumeLink message="Resume Not Uploaded"/>
					}
				</div>
			);
		return (
			<div>
				{this.state.userObj.resumeFileId != null?
					(<ResumeLink/>) :
					<NoResumeLink message="Resume Not Found"/>
				}
				{/* <label className="btn btn-default">
				<input type="file" onChange={this.selectFile} />
				</label> */}
				<div style={{'paddingBottom' : '10px'}}>
					<label
						htmlFor="contained-button-file"
						className="btn btn-default"
						style={{'paddingRight' : '10px'}}
					>
						<input
						accept="application/*"
						id="contained-button-file"
						type="file"
						onChange={this.selectFile}
						style={{"display":"none"}}
						/>
						<Button variant="contained" color="default" component="span">
							Choose File
						</Button>
					</label>
					<Button variant="contained" color="primary" className="btn btn-success" disabled={!fileName} onClick={this.uploadResume}>
						Upload
					</Button>
				</div>
				{fileName !== null && <FileLoaded/>}
				{this.state.uploaded && ( <ProgressBar value={this.state.progress} /> )}
				<div className="alert alert-light" role="alert">
					{this.state.message}
				</div>
			</div>
		);
	}
}