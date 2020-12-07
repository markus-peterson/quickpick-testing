import React, { Component } from "react";
import {ListItem, List, Grid} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {EventAvailable as ApprovedIcon,
		DateRange as PendingIcon,
		EventBusy as DeniedIcon,
		TimerOff as StopIcon,
		Timer as StartIcon,
		} from '@material-ui/icons';
import { green, red, orange } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';

import LoadingComponent from './LoadingComponent';
import ProfileShiftDelete from './ProfileShiftDelete';

import JobService from '../api/JobService';
import UserService from '../api/UserService';
import ShiftService from '../api/ShiftService';
import ApplicationService from '../api/ApplicationService';

export default class ProfileShiftList extends Component{
	constructor() {
		super();
		this.state = {
			isLoading: true,
			userObj: null,
			shifts: null,
		};
		this.update = this.update.bind(this);
	}

	update() {
		this.componentDidMount();
	}

	componentDidUpdate(oldProps){
		if(oldProps.username !== this.props.username){
			this.componentDidMount();
		}
	}

	async componentDidMount(){
		const data = await	UserService
							.executeGetUserService(this.props.username)
							.then(result => result.data);
							console.log('loading data ...');
		this.setState({userObj : data});
		let added = [];
		let shiftData = await ShiftService.getShiftsByUser(data.id).then(result => result.data);
		for(let i = 0; i < shiftData.length; i++) {
			let app = await ApplicationService.getApplication(shiftData[i].applicationId).then(result => result.data);
			let job = await JobService.executeGetJob(app.jobId).then(result => result.data);
			added.push(<ShiftElement title={job.jobTitle} shiftData={shiftData[i]} update={this.update}/>)
		}
		this.setState({shifts: added});
		if(this.state.userObj && this.state.shifts)
			this.setState({isLoading : false});
	}

	render() {
		if(this.state.isLoading)
			return(
				<div style={{marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
			)
		return (
			<Grid container direction="column">
				<Grid >
					Shifts
				</Grid>
				{this.state.shifts.length > 0 ?
					<Grid>
						<List>
							{this.state.shifts && this.state.shifts.map (shift =>
								<div>{shift}</div>
							)}
						</List>
					</Grid> :
					<div style={{marginTop : '10px'}}>
						<Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>no shifts</Alert>
					</div>
				}
			</Grid>
		)
	}
}

class ShiftElement extends Component {
	constructor(){
		super();
		this.state = {
			open: false,
		}
		this.handleClick = this.handleClick.bind(this);
		this.formatAMPM = this.formatAMPM.bind(this);
	}

	handleClick() {
		this.setState({	open : !this.state.open});
	}

	formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}

	render(){
		const style = {
			nested : {"paddingLeft": "5%"},
		}
		let shiftIcon;
		let shiftData = this.props.shiftData;
		let hoverText = shiftData.status.toLowerCase();
		switch(hoverText) {
		case 'pending':
			shiftIcon = () => (<PendingIcon style={{color: orange[500]}} />);
			break;
		case 'accepted':
			shiftIcon = () => (<ApprovedIcon style={{color: green[500]}} />);
			break;
		default: // denied
			shiftIcon = () => (<DeniedIcon style={{color: red[500]}} />);
			break;
		}
		let startDate = new Date(shiftData.startYear, shiftData.startMonth, shiftData.startDay, shiftData.startHour, shiftData.startMinute);
		let endDate = new Date(shiftData.endYear, shiftData.endMonth, shiftData.endDay, shiftData.endHour, shiftData.endMinute)
		console.log(startDate, endDate);
		return(
			<div>
				{(shiftData !== null || shiftData !== undefined) && (
					<>
						<ListItem button onClick={this.handleClick}>
							<ListItemIcon title={hoverText}>
								{shiftIcon()}
							</ListItemIcon>
							<ListItemText primary={`${this.props.title} | ${startDate.toDateString()}`} />
							{this.state.open ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={this.state.open} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								<ListItem button style={style.nested}>
									<ListItemIcon title="shift start"><StartIcon /></ListItemIcon>
									<ListItemText primary={`${startDate.toDateString().split(' ')[1]} ${startDate.toDateString().split(' ')[2]} ${this.formatAMPM(startDate)}`} />
								</ListItem>
								<ListItem button style={style.nested}>
									<ListItemIcon title="shift end"><StopIcon /></ListItemIcon>
									<ListItemText primary={`${endDate.toDateString().split(' ')[1]} ${endDate.toDateString().split(' ')[2]} ${this.formatAMPM(endDate)}`} />
								</ListItem>
								<ListItem style={style.nested}>
									<ProfileShiftDelete shiftData={shiftData} update={this.props.update}/>
								</ListItem>
								<hr/>
							</List>
						</Collapse>
					</>
				)}
			</div>
		)
	}
}