import React, { Component } from "react";
import FileService from "../api/FileService";
import UserService from '../api/UserService';
import ProgressBar from './ProgressBar';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AuthenticationService from '../api/AuthenticationService';

// import PDFViewer from 'pdf-viewer-reactjs'

export default class FileComponent extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
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
		this.uploadProfile = this.uploadProfile.bind(this);
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

	async uploadProfile() {
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
			console.log(response)
			this.props.updater()
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
			window.location.reload();
			console.log(response)
			this.props.updater()
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
		const classes = makeStyles({ table: { minWidth: 650 } });

		if(this.state.isLoading)
			return (<div>Loading...</div>);
		if(!isUserLoggedIn)
			return <></>
		return (
			<div>
				{this.state.currentFile && ( <ProgressBar value={this.state.progress} /> )}
				<label className="btn btn-default">
				<input type="file" onChange={this.selectFile} />
				</label>
				<button
				className="btn btn-success"
				disabled={!this.state.selectedFiles}
				onClick={this.uploadProfile}
				>
				Upload Profile
				</button>
				
				<button
				className="btn btn-success"
				disabled={!this.state.selectedFiles}
				onClick={this.uploadResume}
				>
				Upload Resume
				</button>
				<div className="alert alert-light" role="alert">
				{this.state.message}
				</div>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>List of Files</TableCell>
							</TableRow>
						</TableHead>
					</Table>
					{this.state.profileCond && (
						<TableRow>
							<TableCell component="th" scope="row">Profile</TableCell>
							<TableCell align="right"> <a href={this.state.profile.fileDownloadUri}>{this.state.profile.fileName}</a>{this.state.profile.fileType}</TableCell>
							{/* {userObj.profile.type.includes("image") && ( <TableCell align="right"><img style={{width:"100%"}} src={"http://localhost:9090/files/"+userObj.profile.id} alt={userObj.profile.name}/ ></TableCell> )} */}
						</TableRow>
					)}
					{this.state.resumeCond && (
						<TableRow>
							<TableCell component="th" scope="row">Resume</TableCell>
							<TableCell align="right"> <a href={this.state.resume.fileDownloadUri}>{this.state.resume.fileName}</a>{this.state.resume.fileType}</TableCell>
							{/* {userObj.resume.type.includes("image") && ( <TableCell align="right"><img style={{width:"100%"}} src={"http://localhost:9090/files/"+userObj.resume.id} alt={userObj.resume.name}/ ></TableCell> )} */}
						</TableRow>
					)}
				</TableContainer>
			</div>
		);
	}
}