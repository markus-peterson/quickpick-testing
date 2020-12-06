import React, { Component } from 'react';
import { Paper, Grid } from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';

export default class ErrorMessage extends Component {
	render() {
		let text = "Error";
		if(this.props.text !== null)
		text = this.props.text;
		
		let severity = 'error';
		if(this.props.severity !== null && this.props.severity !== undefined) {
			switch(this.props.severity.toLowerCase()) {
			case 'success' : severity = 'success'; break;
			case 'warning' : severity = 'warning'; break;
			case 'info' : severity = 'info'; break;
			default : severity = 'error'; break;
			}
		}

		return (
			<Grid container justify={this.props.justify === undefined ? "center" : this.props.justify} direction="row">
				<Grid item sm={this.props.sm === undefined ? '' : this.props.sm}>
					<Paper style={{'width' : '100%'}}>
						<Alert severity={severity}>{text}</Alert>
					</Paper>
				</Grid>
			</Grid>
		)
	}
}