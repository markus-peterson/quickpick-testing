import React, { Component } from 'react';
import { Paper, Grid, List, ListItem, ListItemText, /*ListItemAvatar,*/ Divider, ButtonGroup, Button, ListItemIcon, Collapse/*, TextField, TextareaAutosize */} from '@material-ui/core/';
import { LocationOn as LocationOnIcon, 
    Business as BusinessIcon,
    Link as LinkIcon,
    NotInterested as NotInterestedIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Email as EmailIcon,
    Note as NoteIcon } from '@material-ui/icons';
import { ExpandLess, ExpandMore, EditIcon, SaveIcon } from '@material-ui/icons';
import { green, red } from '@material-ui/core/colors';
// import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';

import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AuthenticationService from '../api/AuthenticationService';
import UserService from '../api/UserService';
import JobService from '../api/JobService';
// import FileService from '../api/FileService';
import ApplicationService from '../api/ApplicationService';
import output from '../api/connections';

class ManagementComponent extends Component {
    constructor(){
        super();
        this.state = {
            selectedJob: null,
            manageState: 0,
            userObj: null,
            selectedJob: null,
            exists: false
        }
        this.updateSelectedJob = this.updateSelectedJob.bind(this)
        this.changeManage = this.changeManage.bind(this)
    }

    async componentDidMount(){
        const data = await	UserService
							.executeGetUserService(sessionStorage.getItem('authenticatedUser'))
                            .then(result => result.data);
        const jobData = await JobService.exectureCheckByAuthor().then(result => result.data);
        this.setState({userObj: data, exists: jobData})
    }

    updateSelectedJob(newJob){
        console.log(newJob)
        this.setState({
            selectedJob: newJob
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
            }
        };
        if(isUserLoggedIn && this.state.exists){
            return(
                <div className="container">
                    <Grid container direction="row" spacing={3} style={{width: "100%", margin: 0}} justify="center">
                        <JobList userObj={this.state.userObj} update={this.updateSelectedJob}/>
                        <Grid item xs={7} justify="flex-start" direction="column">
                            <Grid container item xs={12} alignItems="center" justify="center">
                                <ButtonGroup aria-label="manage secion">
                                    <Button onClick={() => { this.changeManage("jobs") }} style={this.state.manageState === 0 ? style.active : style.inert}>Manage Job</Button>
                                    <Button onClick={() => { this.changeManage("apps") }} style={this.state.manageState === 1 ? style.active : style.inert}>Manage Applicants</Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item xs={12} alignItems="center" justify="center">
                                {this.state.manageState === 0 ? <SelectedManage job={this.state.selectedJob} /> : <AppList job={this.state.selectedJob}/>}
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


// Add editing to this component
class SelectedManage extends Component {
    constructor(){
        super()
        this.state = {
            edit: false,
            job: null
        }
    }

    async componentWillReceiveProps(newProps){
        this.setState({
            job: newProps.job
        })
    }
    async componentDidMount(){
        this.setState({
            job: this.props.job
        })
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
                    <h2>{this.state.job.jobTitle}</h2>
                    <p>{this.state.job.organization}</p>
                    <p>{this.state.job.location + " | " + this.state.job.country}</p>
                    <div className="description" dangerouslySetInnerHTML={{__html: this.state.job.jobDescription}} />
                    <p>{this.state.job.jobSalary}</p>
                    <p>{this.state.job.pageUrl}</p>
                </Paper>
            )
        }
    }
}

class JobList extends Component {
    constructor(){
        super();
        this.state = {
            jobs: [],
            indexList: [],
            index: 0
        }
        // this.updateCurrent = this.updateCurrent.bind(this)
    }

    async componentDidMount(){
        let added = []
        let temp = []
        console.log(this.props.userObj)
        const data = await UserService
                            .executeGetUserService(sessionStorage.getItem('authenticatedUser'))
                            .then(result => result.data);
                            console.log('loading data ...');
		this.setState({userObj : data});

        let jobData = await JobService.executeGetJobListService().then(result => result.data);
        for(let i = 0; i < jobData.length; i++){
			if(jobData[i].author === data.id){
                added.push(<JobItem jobData={jobData[i]}/>)
                temp.push(jobData[i])
            }
        }
        this.props.update(temp[0]);
        this.setState({jobs: added, indexList: temp});
    }

    updateCurrent(index){
        this.props.update(this.state.indexList[index]);
        this.setState({index: index});
    }

    render(){
        const style = {
            paper : {padding: 0, marginTop:65, marginBottom:20, height: "fit-content"},
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
        const style = {
			nested : {
                
            }
		}
        return(
            <>
                <List component="div">
                    <ListItem style={style.nested}>
                        <ListItemIcon title="jobTitle"><BusinessIcon /></ListItemIcon>
                        <ListItemText primary={this.props.jobData.jobTitle} />
                    </ListItem>
                    <ListItem style={style.nested}>
                        <ListItemIcon title="country"><LocationOnIcon /></ListItemIcon>
                        <ListItemText primary={this.props.jobData.location + " | " + this.props.jobData.country} />
                    </ListItem>
                </List>
            </>
        )
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