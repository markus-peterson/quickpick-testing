import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

import JobService from '../api/JobService';
import ApplicationService from '../api/ApplicationService';

//	props.jobData [Required]
//		- must contain information of valid job model
//	props.jobType [Required]
//		- if props.jobType === 'applied'
//			- delete given application based off of its id
//		- else props.jobType === 'created'
//			- delete given job based off of its id
//	props.appData (required if props.jobType === 'applied')
//		- must contain information of valid application model
export default class ProfileJobDelete extends Component {
	constructor(props) {
		super();
		this.state = {
			open: false,
			deleteConfirmation: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.deleteJob = this.deleteJob.bind(this);
	}

	handleClose() {
		this.setState({
			open : false
		})
	}

	handleChange(event) {
		const value = event.target.value;
		this.setState({
			...this.state,
			[event.target.name]: value
		});
	}

	async deleteJob() {
		if(this.props.jobType !== null && this.props.jobType !== undefined && this.props.jobType.toLowerCase() === 'applied') {
			await ApplicationService.deleteApplication(this.props.appData.id);
			this.setState({open : false});
			this.props.update();
		} else {
			await JobService.executeDeleteJob(this.props.jobData.id);
			this.setState({open : false});
			this.props.update();
		}
		window.location.reload();
		// this is here since idk how to refresh the navbar in case
		// we delete a job and no more jobs are available to be managed
	}

	render() {
		let activateDelete = this.state.deleteConfirmation !== this.props.jobData.jobTitle;

		const WarningMessage = () => (
			<>
				{this.props.jobType.toLowerCase() === 'applied' ? 
					<>This action cannot be undone. This will permanently delete application to <em>{this.props.jobData.jobTitle}</em>.</> :
					<>This action cannot be undone. This will permanently delete job <em>{this.props.jobData.jobTitle}</em>.</>
				}
			</>
		);

		return (
			<div>
				<Button variant="contained" color="secondary" onClick={()=>(this.setState({open : true}))}>
					{this.props.jobType.toLowerCase() === 'applied' ? <>Delete Application</> : <>Delete Job</>}
				</Button>
				<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Are you absolutely sure?</DialogTitle>
					<DialogContent>
					<DialogContentText>
						<Alert severity="warning">
							<WarningMessage/>
						</Alert>
						<br/>
						Please type <em>{this.props.jobData.jobTitle}</em> to confirm.
					</DialogContentText>
					<TextField
						autoComplete="off"
						autoFocus
						margin="dense"
						label="Job Title"
						placeholder={this.props.jobData.jobTitle}
						fullWidth
						name="deleteConfirmation"
						onChange={this.handleChange}
					/>
					</DialogContent>
					<DialogActions>
					<Button variant="outlined" color='primary' onClick={()=>(this.setState({open : false}))} >
						Cancel
					</Button>
					<Button variant="outlined" onClick={this.deleteJob} color="secondary" disabled={activateDelete}>
						Delete
					</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}