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

import output from '../api/connections';
import JobService from '../api/JobService';
import UserService from '../api/UserService';
import ApplicationService from '../api/ApplicationService';

export default class ProfileJobList extends Component{
	constructor(props) {
		super(props);
		this.state = {
			urlTag: output + '/load/',
			isLoading: true,
			userObj: null,
			jobs: null,
			jobType: null,
		};
	}

	async componentDidMount(){
		const data = await	UserService
							.executeGetUserService(this.props.username)
							.then(result => result.data);
							console.log('loading data ...');
		this.setState({userObj : data});
		let jobData = await JobService.executeGetJobListService().then(result => result.data);
		let added = [];
		if(this.props.jobType != null && this.props.jobType.toLowerCase() === 'applied') {
			// Push applied jobs
			this.setState({jobType : "applied"});
			let appData = await ApplicationService.getAllApplied().then(result => result.data);
			for(let i = 0; i < appData.length; i++)
				for(let j = 0; j < jobData.length; j++)
					if(appData[i].username === this.state.userObj.username && appData[i].jobId === jobData[j].id)
						added.push(<JobElement jobStatus={appData[i].status} jobType={this.state.jobType} jobData={jobData[j]}/>);
		} else {
			// Push created jobs
			this.setState({jobType : "created"});
			for(let i = 0; i < jobData.length; i++)
				if(jobData[i].author === this.state.userObj.id)
					added.push(<JobElement jobType={this.state.jobType} jobData={jobData[i]}/>)
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
			return(<p>Loading...</p>)
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
					<Grid >
						-no jobs-
					</Grid>
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
		}
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState({open : !this.state.open});
	}

	render(){
		const style = {
			nested : {"paddingLeft": "5%"},
		}
		let hoverText = 'created job';
		let jobIcon = () => (<WorkOutlineIcon />);
		if(this.props.jobType === 'applied') {
			hoverText = this.props.jobStatus.toLowerCase();
			switch(this.props.jobStatus.toLowerCase()) {
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
		return(
			<div>
				{this.props.jobData != null && (
					<>
						<ListItem button onClick={this.handleClick}>
							<ListItemIcon title={hoverText}>
								{jobIcon()}
							</ListItemIcon>
							<ListItemText primary={this.props.jobData.jobTitle} />
							{this.state.open ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={this.state.open} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								{this.props.jobData.organization &&
								<ListItem button style={style.nested}>
									<ListItemIcon title="ogranization"><BusinessIcon /></ListItemIcon>
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