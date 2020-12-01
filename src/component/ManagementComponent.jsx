import React, { Component } from 'react';
import { Paper, Grid, List, ListItem, ListItemText, Divider, ButtonGroup, Button, ListItemIcon, Collapse, TextField } from '@material-ui/core/';
import { LocationOn as LocationOnIcon, 
         Business as BusinessIcon,
         Link as LinkIcon,
         NotInterested as NotInterestedIcon,
         CheckCircleOutline as CheckCircleOutlineIcon,
         Email as EmailIcon,
         Note as NoteIcon,
         Edit as EditIcon,
         Save as SaveIcon } from '@material-ui/icons';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { green, red } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';

import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AuthenticationService from '../api/AuthenticationService';
import JobService from '../api/JobService';
import RichTextInput from './RichTextInput';
import ApplicationService from '../api/ApplicationService';
import output from '../api/connections';

class ManagementComponent extends Component {
    constructor(){
        super();
        this.state = {
            manageState: 0,
            exists: false,
            jobs: [],
            indexList: [],
            index: 0
        }
        this.updateSelectedJob = this.updateSelectedJob.bind(this)
        this.changeManage = this.changeManage.bind(this)
        this.changesMade = this.changesMade.bind(this)
    }

    async componentDidMount(){
        let added = []
        let temp = []
        const check = await JobService.executeCheckByAuthor().then(result => result.data);
        let jobData = await JobService.executeGetByAuthor().then(result => result.data);
        for(let i = 0; i < jobData.length; i++){
            added.push(<JobItem jobData={jobData[i]}/>)
            temp.push(jobData[i])
        }
        this.setState({jobs: added, indexList: temp, exists: check, index: 0});
    }

    updateSelectedJob(newJob){
        console.log(newJob)
        this.setState({
            index: newJob
        })
    }

    changeManage(event){
        if(event === "jobs" && this.state.manageState === 1) {
            this.setState({
                manageState: 0
            });
        } else if(event === "apps" && this.state.manageState === 0) {
            this.setState({
                manageState: 1
            });
        }
    }

    async changesMade(){
        let added = []
        let temp = []
        let jobData = await JobService.executeGetByAuthor().then(result => result.data);
        for(let i = 0; i < jobData.length; i++){
            added.push(<JobItem jobData={jobData[i]}/>)
            temp.push(jobData[i])
        }
        this.setState({jobs: added, indexList: temp});
    }

    render(){
        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        const style = {
            Paper : {
                padding:20, 
                marginTop:10, 
                marginBottom:10
            },
            active: {
                backgroundColor: "#00a2ff"
            },
            inert: {
                backgroundColor: "#eeeeee"
            },
            container: {
                width: "100%",
                height: "100%",
                margin: 0,
                position: "relative"
            }
        };

        if(isUserLoggedIn && this.state.exists){
            return(
                <div className="container">
                    <Grid container direction="row" spacing={3} style={style.container} justify="center">
                        <Grid item xs={2} className="content-sections">
                            <JobList update={this.updateSelectedJob} jobs={this.state.jobs}/>
                        </Grid>
                        <Grid item xs={7} className="content-sections">
                            <Grid container item xs={12} alignItems="center" justify="center">
                                <ButtonGroup aria-label="manage secion">
                                    <Button onClick={() => { this.changeManage("jobs") }} style={this.state.manageState === 0 ? style.active : style.inert}>Manage Job</Button>
                                    <Button onClick={() => { this.changeManage("apps") }} style={this.state.manageState === 1 ? style.active : style.inert}>Manage Applicants</Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    this.state.manageState === 0 ? 
                                    <SelectedManage job={this.state.indexList[this.state.index]} update={this.changesMade} /> : 
                                    <AppList job={this.state.indexList[this.state.index]}/>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            )
        }else if(!this.state.exists){
            return (
				<Grid container direction="row">
					<Grid container justify="center">
						<Grid item sm={3}></Grid>
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<Grid container>
									<Grid item sm> No jobs posted. </Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			)
        }else{
            return (
				<Grid container direction="row">
					<Grid container justify="center">
						<Grid item sm={3}></Grid>
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<Grid container>
									<Grid item sm> Not Logged In </Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			)
        }
    }
}

class JobList extends Component {
    constructor(){
        super();
        this.state = {
            jobs: [],
            index: 0
        }
    }

    componentDidUpdate(prevProps){
        if (this.props !== prevProps) {
            this.setState({
                jobs: this.props.jobs
            })
            // console.log(this.state)
        }
    }
    
    componentDidMount(){
        this.setState({
            jobs: this.props.jobs
        })
    }

    updateCurrent(index){
        this.props.update(index);
    }

    render(){
        const style = {
            paper : {padding: 0, marginTop:55, marginBottom:20, height: "fit-content"},
            list : {padding: 0}
        };
        return(
            <Paper style={style.paper}>
                <List component="div" direction="column" style={style.list}>
                    {
                        this.state.jobs && this.state.jobs.map( function(job, index) {
                            return(
                            <ListItem button style={style.nested} onClick={this.updateCurrent.bind(this, index)} key={index}>
                                {job}
                            </ListItem>
                            );
                        }, this)
                    }
                </List>
            </Paper>
        )
    }
}

class JobItem extends Component{
    render(){
        return(
            <>
                <List component="div">
                    <ListItem>
                        <ListItemIcon title="jobTitle"><BusinessIcon /></ListItemIcon>
                        <ListItemText primary={this.props.jobData.jobTitle} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon title="country"><LocationOnIcon /></ListItemIcon>
                        <ListItemText primary={this.props.jobData.location + " | " + this.props.jobData.country} />
                    </ListItem>
                </List>
            </>
        )
    }
}

// Add editing to this component
class SelectedManage extends Component {
    constructor(){
        super()
        this.state = {
            id: '',
            country: '',
            dateAdded: '',
            hasExpired: '',
            jobBoard: '',
            jobDescription: '',
            jobTitle: '',
            jobType: '',
            location: '',
            organization: '',
            pageUrl: '',
            jobSalary: '',
            sector: '',
            author: '',
            newJobDescription: '',
            edit: false
        }
        this.editing = this.editing.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDescription = this.handleDescription.bind(this)
        this.updateJob = this.updateJob.bind(this)
    }

    async componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.setState({
                id: this.props.job.id,
                country: this.props.job.country,
                dateAdded: this.props.job.dateAdded,
                hasExpired: this.props.job.hasExpired,
                jobBoard: this.props.job.jobBoard,
                jobDescription: this.props.job.jobDescription,
                jobTitle: this.props.job.jobTitle,
                jobType: this.props.job.jobType,
                location: this.props.job.location,
                organization: this.props.job.organization,
                pageUrl: this.props.job.pageUrl,
                jobSalary: this.props.job.jobSalary,
                sector: this.props.job.sector,
                author: this.props.job.author,
                newJobDescription: this.props.job.jobDescription,
                edit: false
            })
        }
    }
    async componentDidMount(){
        if(this.props.job !== null){
            this.setState({
                id: this.props.job.id,
                country: this.props.job.country,
                dateAdded: this.props.job.dateAdded,
                hasExpired: this.props.job.hasExpired,
                jobBoard: this.props.job.jobBoard,
                jobDescription: this.props.job.jobDescription,
                jobTitle: this.props.job.jobTitle,
                jobType: this.props.job.jobType,
                location: this.props.job.location,
                organization: this.props.job.organization,
                pageUrl: this.props.job.pageUrl,
                jobSalary: this.props.job.jobSalary,
                sector: this.props.job.sector,
                author: this.props.job.author,
                newJobDescription: this.props.job.jobDescription,
                edit: false
            })
        }
    }

    editing() {
        if(this.state.edit) {
            this.updateJob();
            this.setState({edit: false});
        }else{
            this.setState({edit: true});
        }
    }

    async updateJob(){
        const job = {
            id: this.state.id,
            country: this.state.country,
            dateAdded: this.props.job.dateAdded,
            hasExpired: this.props.job.hasExpired,
            jobBoard: this.props.job.jobBoard,
            jobDescription: this.state.newJobDescription,
            jobTitle: this.state.jobTitle,
            jobType: this.props.job.jobType,
            location: this.state.location,
            organization: this.state.organization,
            pageUrl: this.state.pageUrl,
            jobSalary: this.state.jobSalary,
            sector: this.props.job.sector,
            author: this.props.job.author
        }
        const data = await JobService.executeUpdateJobService(job);
        this.props.update()
    }

    handleChange(event) {
		const value = event.target.value;
		this.setState({
			...this.state,
			[event.target.name]: value
		});
    }
    
    handleDescription(event) {
        this.setState({
            newJobDescription : event
        });
    }
    
    render(){
        const style = {
            paper : {padding:40, margin:20, textAlign: "left", flexGrow: 1},
            paper2 : {padding:40, margin:20, textAlign: "center", flexGrow: 1}
        };
        if(this.state.job === null){
            return(
                <Paper style={style.paper2}>
                    <p>No job selected.</p>
                </Paper>
            )
        }else {

            return(
                <Paper style={style.paper}>
                    <Grid container>
                        <Grid item xs={12} container justify="flex-end">
                            {!this.state.edit ? <EditIcon style={{cursor: "pointer"}} onClick={this.editing}/> : <SaveIcon style={{cursor: "pointer"}} onClick={this.editing}/>}
                        </Grid>
                        {this.state.edit ?
                        <Grid item container xs={12} spacing={2} justify="center">
                            <Grid item container xs={10} spacing={2} justify="center">
                                <Grid item xs={12} style={{textAlign: "center"}}>
                                    <Divider style={{margin: "0 0 10px 0"}} />
                                    <p style={{padding: 0, margin: 0}}>Job Information</p>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField  label="Job Title"
                                                defaultValue={this.state.jobTitle}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder={this.state.jobTitle} name="jobTitle"
                                                onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField  label="Salary"
                                                defaultValue={this.state.jobSalary}
                                                fullWidth
                                                variant="outlined"
                                                placeholder={this.state.jobSalary} name="jobSalary"
                                                onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField  label="Job Location"
                                                defaultValue={this.state.location}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder={this.state.location} name="location"
                                                onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField  label="Job Country"
                                                defaultValue={this.state.country}
                                                fullWidth
                                                variant="outlined"
                                                placeholder={this.state.country} name="country"
                                                onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} style={{textAlign: "center"}}>
                                    <Divider style={{margin: "10px 0"}} />
                                    <p style={{padding: 0, margin: 0}}>Company Information</p>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField  label="Company Name"
                                                defaultValue={this.state.organization}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder={this.state.organization} name="organization"
                                                onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField  label="Page URL"
                                                defaultValue={this.state.pageUrl}
                                                fullWidth
                                                variant="outlined"
                                                placeholder={this.state.pageUrl} name="pageUrl"
                                                onChange={this.handleChange}/>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} style={{border: "rgba(0, 0, 0, 0.42) 1px solid", marginTop: 15, borderRadius: 5, padding: 10}}>
                                <RichTextInput updateParent={this.handleDescription} starter={this.state.jobDescription}/>
                            </Grid>
                        </Grid>:
                        <Grid item>
                            <h2>{this.state.jobTitle}</h2>
                            <p>{this.state.organization}</p>
                            <p>{this.state.location + " | " + this.state.country}</p>
                            <div className="description" dangerouslySetInnerHTML={{__html: this.state.jobDescription}} />
                            <p>{this.state.jobSalary}</p>
                            <p>{this.state.pageUrl}</p>
                        </Grid>
                        }
                    </Grid>
                </Paper>
            )
        }
    }
}

class AppList extends Component {
    constructor(){
        super()
        this.state = {
            applicants: []
        }
    }

    async componentDidMount(){
        const data = await ApplicationService.getAllApplicants(this.props.job.id).then(result => result.data);
        let userList = []
        for(let i = 0; i < data[0].length; i++){
            let application = {
                jobId: data[0][i].jobId,
                status: data[0][i].status,
                userId: data[0][i].userId,
                firstName: data[1][i].firstName,
                lastName: data[1][i].lastName,
                resumeFileId: data[1][i].resumeFileId,
                emailId: data[1][i].emailId,
                username: data[1][i].username
            }
            userList.push(application)
        }
        this.setState({
            applicants: userList
        })
    }

    async componentWillReceiveProps(newProps){
        const data = await ApplicationService.getAllApplicants(newProps.job.id).then(result => result.data);
        let userList = []
        for(let i = 0; i < data[0].length; i++){
            let application = {
                jobId: data[0][i].jobId,
                status: data[0][i].status,
                userId: data[0][i].userId,
                firstName: data[1][i].firstName,
                lastName: data[1][i].lastName,
                resumeFileId: data[1][i].resumeFileId,
                emailId: data[1][i].emailId,
                username: data[1][i].username
            }
            userList.push(application)
            
        }
        this.setState({
            applicants: userList
        })
    }

    render(){
        const style = {
            paper : {padding:20, margin:20, flexGrow: 1}
        };
        if(this.props.job === null){
            return(
                <p>ugh</p>
            )
        }else {
            return(
                <Paper style={style.paper}>
                    <List>
                        {this.state.applicants.length > 0 ?
                        this.state.applicants.map( function(app, index) {
                            return (
                                <Application application={app} key={index}/>
                            );
                        }, this):
                        <ListItem>
                            <ListItemText primary="No applicants yet" style={{textAlign: "center"}}/>
                        </ListItem>
                        }
                    </List>
                </Paper>
            )
        }
    }
}

class Application extends Component {
    constructor(props){
        super()
        this.state = {
            open: false,
            application: props.application
        }
        this.handleClick = this.handleClick.bind(this);
        this.decide = this.decide.bind(this);
    }

    async componentDidMount(){
        this.setState({
            application: this.props.application
        })
    }

    async componentWillReceiveProps(newProps){
        this.setState({
            application: newProps.application
        })
    }

    handleClick() {
		this.setState({open : !this.state.open});
    }

    async decide(event){
        console.log(event)
        if(event === 'accept'){
            const ids = [this.state.application.jobId, this.state.application.userId]
            const res = await ApplicationService.acceptApplication(ids)
            let temp = this.state.application
            temp.status = res.data.status
            this.setState({
                application: temp
            })
        }else if(event === 'deny'){
            const ids = [this.state.application.jobId, this.state.application.userId]
            const res = await ApplicationService.denyApplication(ids)
            console.log(res)
            let temp = this.state.application
            temp.status = res.data.status
            this.setState({
                application: temp
            })
        }
    }
    
    render(){
        let hoverText = this.state.application.firstName + ' ' + this.state.application.lastName
        let resumeExists = this.state.application.resumeFileId !== null

        return(
            <>
                <Divider style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}} />
                <ListItem button onClick={this.handleClick}>
                    <ListItemIcon title={hoverText}>
                        <AccountCircleOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={this.state.application.firstName + ' ' + this.state.application.lastName} />
                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <ListItem>
                        <ListItemIcon title="email"><EmailIcon /></ListItemIcon>
						<ListItemText primary={this.state.application.emailId} />
                    </ListItem>
                    <Link to={'/profile/' + this.state.application.username}>
                        <ListItem button display="row">
                            <ListItemIcon title="profile link"><LinkIcon /></ListItemIcon>
                            <ListItemText primary="Profile Page" />
                        </ListItem>
                    </Link>
                    <ListItem>
                        <ListItemIcon title="resume"><NoteIcon /></ListItemIcon>
                        {resumeExists? 
                        <a href={output + '/load/' + this.state.link}><ListItemText primary="Download Resume" /></a>:
                        <ListItemText primary={this.state.application.firstName + ' has not uploaded a resume.'} />
                        }
                    </ListItem>
                    <ListItem style={{justifyContent: "center"}}>
                        {this.state.application.status === "Pending" &&
                        <ButtonGroup aria-label="manage secion">
                            <Button onClick={() => { this.decide('accept') }} style={{backgroundColor: "#58fd52", fontWeight: 600}}>Accept</Button>
                            <Button onClick={() => { this.decide('deny') }} style={{backgroundColor: "#ff6464", fontWeight: 600}}>Deny</Button>
                        </ButtonGroup>}
                        {this.state.application.status === "Accepted" &&
                        <>
                            <ListItemIcon title="status"><CheckCircleOutlineIcon style={{color: green[500]}}/></ListItemIcon>
						    <ListItemText primary={this.state.application.status} style={{color: green[500]}}/>
                        </>}
                        {this.state.application.status === "Denied" &&
                        <>
                            <ListItemIcon title="status"><NotInterestedIcon style={{color: red[500]}}/></ListItemIcon>
						    <ListItemText primary={this.state.application.status} style={{color: red[500]}}/>
                        </>}
                    </ListItem>
                </Collapse>
            </>
        )
    }
}

export default ManagementComponent;