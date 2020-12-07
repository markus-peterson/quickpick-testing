import React, { Component } from "react";
import {ListItem, List, Grid} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {Description as DescriptionIcon,
		AttachMoney as AttachMoneyIcon,
		Http as HttpIcon,
		QueryBuilder as QueryBuilderIcon,
		LocationOn as LocationOnIcon,
		Business as BusinessIcon,
		HourglassEmpty as HourglassEmptyIcon,
		CheckCircleOutline as CheckCircleOutlineIcon,
		NotInterested as NotInterestedIcon,
		} from '@material-ui/icons';
import { green, red, orange } from '@material-ui/core/colors';
import Alert from '@material-ui/lab/Alert';

import LoadingComponent from './LoadingComponent';
import ProfileJobDelete from './ProfileJobDelete';

import JobService from '../api/JobService';
import UserService from '../api/UserService';
import ApplicationService from '../api/ApplicationService';
import Badge from '@material-ui/core/Badge';

export default class ProfileJobList extends Component{
	constructor() {
		super();
		this.state = {
			isLoading: true,
			userObj: null,
			jobs: null,
			jobType: null,
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
		let getJobsId = ''
		if(data.id !== sessionStorage.getItem('authenticatedUserId')){
			getJobsId = data.id
		}
		this.setState({userObj : data});
		let added = [];
		if(this.props.jobType != null && this.props.jobType.toLowerCase() === 'applied') {
			// Push applied jobs
			this.setState({jobType : "applied"});
			let appData = await ApplicationService.getAllApplied().then(result => result.data);
			for(let i = 0; i < appData.length; i++) {
				let appliedJob = await JobService.executeGetJob(appData[i].jobId).then(result => result.data);
				added.push(<JobElement appData={appData[i]} jobType={this.state.jobType} jobData={appliedJob} update={this.update}/>);
			}
		} else {
			// Push created jobs
			let jobData = await JobService.executeGetByAuthor(getJobsId).then(result => result.data);
			this.setState({jobType : "created"});
			for(let i = 0; i < jobData.length; i++)
				added.push(<JobElement jobType={this.state.jobType} jobData={jobData[i]} update={this.update}/>)
		}
		this.setState({jobs: added});
		if(this.state.userObj && this.state.jobs)
			this.setState({isLoading : false});
	}

	render() {
		let jobType = this.state.jobType;
		if(jobType != null)
			jobType = jobType.slice(0,1).toUpperCase() + jobType.slice(1).toLowerCase();
		if(this.state.isLoading)
			return(
				<div style={{marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
			)
		return (
			<Grid container direction="column">
				<Grid >
					{`${jobType} Jobs`}
				</Grid>
				{this.state.jobs.length > 0 ?
					<Grid>
						<List>
							{this.state.jobs && this.state.jobs.map ( job =>
								<div>{job}</div>
							)}
						</List>
					</Grid> :
					<div style={{marginTop : '10px'}}>
						<Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>no jobs</Alert>
					</div>
				}
			</Grid>
		)
	}
}

class JobElement extends Component {
	constructor(){
		super();
		this.state = {
			open: false,
			// notify: true,
			notify: false,
		}
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState({	open : !this.state.open,
						notify : false});
	}

	render(){
		let notify = this.state.notify;
		if(this.props.jobType !== 'applied')
			notify = false;

		const style = {
			nested : {"paddingLeft": "5%"},
		}
		let hoverText = 'created job';
		let jobIcon = () => (<WorkOutlineIcon />);
		if(this.props.jobType.toLowerCase() === 'applied') {
			hoverText = this.props.appData.status.toLowerCase();
			switch(this.props.appData.status.toLowerCase()) {
			case 'pending':
				jobIcon = () => (<HourglassEmptyIcon style={{color: orange[500]}} />);
				break;
			case 'accepted':
				jobIcon = () => (<CheckCircleOutlineIcon style={{color: green[500]}} />);
				break;
			default: // denied
				jobIcon = () => (<NotInterestedIcon style={{color: red[500]}} />);
				break;
			}
		}
		let mainIcon = () => (
			<ListItemIcon title={hoverText}>
				{jobIcon()}
			</ListItemIcon>
		);
		if(notify) {
			mainIcon = () => (
				<ListItemIcon title={hoverText}>
					<Badge color="secondary" variant="dot">
							{jobIcon()}
					</Badge>
				</ListItemIcon>
			)
		}
		return(
			<div>
				{this.props.jobData != null && (
					<>
						<ListItem button onClick={this.handleClick}>
							{mainIcon()}
							<ListItemText primary={this.props.jobData.jobTitle} />
							{this.state.open ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={this.state.open} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								{this.props.jobData.organization &&
								<ListItem button style={style.nested}>
									<ListItemIcon title="organization"><BusinessIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.organization} />
								</ListItem>}
								{this.props.jobData.country && this.props.jobData.location &&
								<ListItem button style={style.nested}>
									<ListItemIcon title="country"><LocationOnIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.location + ", " + this.props.jobData.country} />
								</ListItem>}
								{this.props.jobData.jobDescription &&
								<ListItem button style={style.nested}>
									<ListItemIcon title="description"><DescriptionIcon /></ListItemIcon>
									<div className="description" dangerouslySetInnerHTML={{__html: this.props.jobData.jobDescription}} />
								</ListItem>}
								{this.props.jobData.dateAdded &&
								<ListItem button style={style.nested}>
									<ListItemIcon title="date added"><QueryBuilderIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.dateAdded} />
								</ListItem>}
								{this.props.jobData.pageUrl &&
								<ListItem button style={style.nested}>
									<ListItemIcon title="url"><HttpIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.pageUrl} />
								</ListItem>}
								{this.props.jobData.jobSalary &&
								<ListItem button style={style.nested}>
									<ListItemIcon title="salary"><AttachMoneyIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.jobSalary} />
								</ListItem>}
								<ListItem style={style.nested}>
									{this.props.jobType === 'applied' ?
										<ProfileJobDelete jobData={this.props.jobData} update={this.props.update} appData={this.props.appData} jobType='applied'/> :
										(sessionStorage.getItem('authenticatedUserId') === this.props.jobData.author &&
												<ProfileJobDelete jobData={this.props.jobData} update={this.props.update} jobType='created'/>
										)
									}
								</ListItem>
								<hr/>
							</List>
						</Collapse>
						{/* <p>{this.props.jobData.hasExpired}</p>
						<p>{this.props.jobData.jobType}</p>
						<p>{this.props.jobData.sector}</p> */}
					</>
				)}
			</div>
		)
	}
}