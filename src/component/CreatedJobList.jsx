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
		} from '@material-ui/icons';

import output from '../api/connections';
import JobService from '../api/JobService';
import UserService from '../api/UserService';

export default class CreatedJobList extends Component{
	constructor(props) {
		super(props);
		this.state = {
			urlTag: output + '/load/',
			isLoading: true,
			userObj: null,
			jobs: null,
		};
	}

	async componentDidMount(){
		const data = await	UserService
							.executeGetUserService(sessionStorage
							.getItem('authenticatedUser'))
							.then(result => result.data);
							console.log('loading data ...');
		this.setState({userObj : data});
        let jobData = await JobService.executeGetJobListService().then(result => result.data);
		let added = [];
		for(var i = 0; i < jobData.length; i++)
			if(jobData[i].author === this.state.userObj.id)
				added.push(<JobElement jobData={jobData[i]}/>)
		this.setState({jobs: added});
		if(this.state.userObj && this.state.jobs)
			this.setState({isLoading : false});
	}

	render() {
		// console.log(this.state.jobs);
		if(this.state.isLoading)
			return(<p>Loading...</p>)
		return (
			<Grid container direction="column">
				<Grid >
					Created Jobs
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
        return(
            <div>
				{this.props.jobData != null && (
					<>
						<ListItem button onClick={this.handleClick}>
							<ListItemIcon>
								<WorkOutlineIcon />
							</ListItemIcon>
							<ListItemText primary={this.props.jobData.jobTitle} />
							{this.state.open ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={this.state.open} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								{this.props.jobData.organization &&
								<ListItem button style={style.nested}>
									<ListItemIcon><BusinessIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.organization} />
								</ListItem>}
								{this.props.jobData.country && this.props.jobData.location &&
								<ListItem button style={style.nested}>
									<ListItemIcon><LocationOnIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.location + ", " + this.props.jobData.country} />
								</ListItem>}
								{this.props.jobData.jobDescription &&
								<ListItem button style={style.nested}>
									<ListItemIcon><DescriptionIcon /></ListItemIcon>
									<div className="description" dangerouslySetInnerHTML={{__html: this.props.jobData.jobDescription}} />
								</ListItem>}
								{this.props.jobData.dateAdded &&
								<ListItem button style={style.nested}>
									<ListItemIcon><QueryBuilderIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.dateAdded} />
								</ListItem>}
								{this.props.jobData.pageUrl &&
								<ListItem button style={style.nested}>
									<ListItemIcon><HttpIcon /></ListItemIcon>
									<ListItemText primary={this.props.jobData.pageUrl} />
								</ListItem>}
								{this.props.jobData.jobSalary &&
								<ListItem button style={style.nested}>
									<ListItemIcon><AttachMoneyIcon /></ListItemIcon>
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