import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ShiftService from '../api/ShiftService';
import ApplicationService from '../api/ApplicationService';

export default class ProfileJobDelete extends Component {
	constructor(props) {
		super();
		this.state = {
			open: false,
			deleteConfirmation: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.deleteShift = this.deleteShift.bind(this);
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

	async deleteShift() {
		await ShiftService.deleteShiftById(this.props.shiftData.id);
		this.setState({open : false});
		this.props.update();
	}

	render() {
		return (
			<div>
				<Button variant="contained" color="secondary" onClick={()=>(this.setState({open : true}))}>
					Delete Shift
				</Button>
				<Dialog
				open={this.state.open}
				onClose={this.handleChange}
				>
					<DialogTitle>
						Delete Shift
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete this shift?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={()=>(this.setState({open : false}))} color="primary" variant="outlined">
							Cancel
						</Button>
						<Button onClick={this.deleteShift} color="secondary" variant="outlined">
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}