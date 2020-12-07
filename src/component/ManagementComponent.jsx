import React, { Component } from 'react';
import { Paper, Grid, List, ListItem, ListItemText, Divider, ButtonGroup, Button, ListItemIcon, Collapse, TextField } from '@material-ui/core/';
import {LocationOn as LocationOnIcon,
        Business as BusinessIcon,
        Link as LinkIcon,
        NotInterested as NotInterestedIcon,
        CheckCircleOutline as CheckCircleOutlineIcon,
        Email as EmailIcon,
        Note as NoteIcon,
        Edit as EditIcon,
        Save as SaveIcon,
        VerifiedUser as VerifiedUserIcon,
        FormatQuote as FormatQuoteIcon,
        AttachMoney as AttachMoneyIcon,
        Description as DescriptionIcon,
        Timer as StartIcon,
        TimerOff as StopIcon,
        EventAvailable as ApprovedIcon,
        DateRange as PendingIcon,
        EventBusy as DeniedIcon,
        ExpandLess, ExpandMore } from '@material-ui/icons';
import { green, red, orange } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

import AuthenticationService from '../api/AuthenticationService';
import JobService from '../api/JobService';
import RichTextInput from './RichTextInput';
import ApplicationService from '../api/ApplicationService';
import ViewCertificates from './ViewCertificates';
import ProfileJobDelete from './ProfileJobDelete';
import ErrorMessage from './ErrorMessage';
import CertifyService from '../api/CertifyService';
import LoadingComponent from './LoadingComponent';
import ShiftService from '../api/ShiftService';

class ManagementComponent extends Component {
    constructor(){
        super();
        this.state = {
            isLoading: true,
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
        let jobData = await JobService.executeGetByAuthor('').then(result => result.data);
        for(let i = 0; i < jobData.length; i++){
            added.push(<JobItem jobData={jobData[i]}/>)
            temp.push(jobData[i])
        }
        this.setState({jobs: added, indexList: temp, exists: check, index: 0, isLoading: false});
    }

    componentDidUpdate(oldProps){
        if(oldProps !== this.props){
            this.componentDidMount()
        }
    }

    updateSelectedJob(newJob){
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

    async changesMade(jobId){
        let added = this.state.jobs
        let temp = this.state.indexList
        let jobData = await JobService.executeGetJob(jobId).then(result => result.data);
        temp[this.state.index] = jobData
        added[this.state.index] = (<JobItem jobData={jobData}/>)
        this.setState({jobs: added, indexList: temp});
    }

    render(){
        if(this.state.isLoading){
            return (
                <div style={{marginTop:'20px', marginRight: '20px'}}>
                    <LoadingComponent/>
                </div>
            )
        }
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
        if(!isUserLoggedIn) {
			return (
				<div>
					<div className="background-container"/>
					<div style={{marginTop : '20px'}}>
						<ErrorMessage text="Not Logged In"/>
					</div>
				</div>
			)
		}
        if(isUserLoggedIn && this.state.exists){
            return(
                <div className="container">
                    <div className="background-container"/>
                    <Grid container direction="row" spacing={3} style={style.container} justify="center">
                        <Grid item container xs={3} className="content-sections" justify='flex-end'>
                            <Grid item xs={12} sm={10}>
                                <JobList update={this.updateSelectedJob} jobs={this.state.jobs}/>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} className="content-sections">
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
					<div className="background-container"/>
					<Grid container justify="center">
						<Grid item sm={3}></Grid>
						<Grid item sm={6}>
							<Paper style={{marginTop:20, marginBottom:20}}>
								<Grid container>
									<Alert style={{'width' : '100%'}}severity='info'>No jobs posted</Alert>
								</Grid>
							</Paper>
						</Grid>
						<Grid item sm={3}></Grid>
					</Grid>
				</Grid>
			)
        }else{
            return (
				<Grid container direction="row">
					<div className="background-container"/>
					<Grid container justify="center">
						<Grid item sm={3}></Grid>
						<Grid item sm={6}>
							<Paper style={{marginTop:20, marginBottom:20}}>
								<Grid container>
									<Alert style={{'width' : '100%'}}severity='error'>Not logged in</Alert>
								</Grid>
							</Paper>
						</Grid>
						<Grid item sm={3}></Grid>
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
            activeIndex: 0
        }
        this.inactive = {
            borderBottom: '1px #0000001a solid'
        };
        this.active = {
            backgroundColor: "var(--light-blue-transparent)",
            backdropFilter: 'blur(2px)',
            borderBottom: '1px #0000001a solid'
        };
    }

    componentDidMount(){
        this.setState({
            jobs: this.props.jobs
        })
    }

    updateCurrent(index){
        this.props.update(index);
        this.setState({activeIndex: index})
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
                            const active = this.state.activeIndex === index ? this.active : this.inactive;
                            return(
                            <ListItem button style={active} onClick={this.updateCurrent.bind(this, index)} key={index}>
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
                        <ListItemIcon title="jobTitle"><FormatQuoteIcon /></ListItemIcon>
                        <ListItemText primary={this.props.jobData.jobTitle} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon title="country"><LocationOnIcon /></ListItemIcon>
                        <ListItemText primary={this.props.jobData.location} />
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
        if(prevProps.job !== this.props.job){
            this.componentDidMount();
        }
    }
    async componentDidMount(){
        if(this.props.job !== undefined){
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
        await this.props.update(job.id)
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
            paper2 : {padding:40, margin:20, textAlign: "center", flexGrow: 1},
            listItem: {
                padding: 0
            },
            salaryItem: {
                padding: 0,
                marginTop: 10
            },
            titleItem: {
                padding: 0,
                marginBottom: 20
            }
        };
        if(this.state.job === null){
            return(
                <ErrorMessage severity='info' text='No job selected'/>
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
							<Grid style={{border: "#FFF 1px solid", marginTop: 15, borderRadius: 5, padding: 10}} justify="center" alignItems="center">
								<ProfileJobDelete jobData={this.props.job} jobType='created' update={this.componentDidMount}/>
							</Grid>
                        </Grid>:
                        // <Grid item>
                        <Grid item xs={12}>
                                <List style={style.listItem}>
                                    <ListItem style={style.titleItem}>
                                        <ListItemIcon title="jobTitle"><FormatQuoteIcon /></ListItemIcon>
                                        <h2 style={{margin: 0}}>{this.props.job.jobTitle}</h2>
                                    </ListItem>
                                    <ListItem style={style.listItem}>
                                        <ListItemIcon title="jobTitle"><BusinessIcon /></ListItemIcon>
                                        {this.props.job.pageUrl !== "" ?
                                            (this.props.job.pageUrl.includes('http')?
                                                <a href={this.props.job.pageUrl} target="_blank"><p style={{margin: 0}}>{this.props.job.organization}</p></a>:
                                                <a href={'https://' + this.props.job.pageUrl} target="_blank"><p style={{margin: 0}}>{this.props.job.organization}</p></a>
                                                
                                            ) :
                                            <p>{this.props.job.organization}</p>
                                        }
                                    </ListItem>
                                    <ListItem divider style={style.listItem}>
                                        <ListItemIcon title="jobTitle"><LocationOnIcon /></ListItemIcon>
                                        {this.props.job.country !== "" ?
                                            <p>{this.props.job.location + " | " + this.props.job.country}</p> :
                                            <p>{this.props.job.location}</p>
                                        }
                                        
                                    </ListItem>
                                    <ListItem style={style.salaryItem}>
                                        <ListItemIcon title="jobTitle"><AttachMoneyIcon /></ListItemIcon>
                                        {this.props.job.jobSalary !== "" ?
                                            <p>{this.props.job.jobSalary}</p>:
                                            <p>Unspecified</p>
                                        }
                                    </ListItem>
                                    <ListItem style={style.listItem}>
                                        <ListItemIcon title="jobTitle" style={{alignSelf: 'flex-start', marginTop: 20}}><DescriptionIcon /></ListItemIcon>
                                        <div className="description" dangerouslySetInnerHTML={{ __html: this.props.job.jobDescription }} />
                                    </ListItem>
                                </List>
                            
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
        if(this.props.job !== undefined){
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
    }

    componentDidUpdate(oldProps){
        if(oldProps.job !== this.props.job){
            this.componentDidMount()
        }
    }

    render(){
        const style = {
            paper  : {padding:20, margin:20, flexGrow: 1},
        };
        return(
            <>
            {this.state.applicants.length > 0 ?
                <Paper style={style.paper}>
                    <List>
                        {this.state.applicants.map( function(app, index) {
                            return (
                                <Application application={app} key={index}/>
                            );
                        }, this)}
                    </List>
                </Paper>:
                <div style={{marginTop : '20px'}}>
                    <div className="background-container"/>
                    <ErrorMessage severity='info' text="No applicants yet" sm={6}/>
                </div>
            }</>
        )
    }
}

class Application extends Component {
    constructor(props){
        super()
        this.state = {
            open: false,
            application: props.application,
            certsExist: false,
            shiftsExist: false,
            shiftData: undefined,
        }
        this.handleClick = this.handleClick.bind(this);
        this.decide = this.decide.bind(this);
    }

    async componentDidMount(){
        const data = await CertifyService.executeGetCertifications(this.props.application.userId).then(res => res.data)
        console.log(data)
        if(data.length !== 0){
            this.setState({
                application: this.props.application,
                certsExist: true
            })
        }else{
            this.setState({
                application: this.props.application
            })
        }
		const shiftData = await ShiftService.getShiftsByUser(this.props.application.userId).then(result => result.data);
		this.setState({shiftsExist : (shiftData.length !== 0), shiftData : shiftData})
    }

    async componentDidUpdate(oldProps){
        if(oldProps.application !== this.props.application){
            this.componentDidMount()
        }
    }

    handleClick() {
		this.setState({open : !this.state.open});
    }

    async decide(event){
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
                    <Link to={'/profile/' + this.state.application.username} target="_blank">
                        <ListItem button display="row">
                            <ListItemIcon title="profile link"><LinkIcon /></ListItemIcon>
                            <ListItemText primary="Profile Page" />
                        </ListItem>
                    </Link>
                    {resumeExists? 
                    <Link to={'/resume/' + this.state.application.username} target="_blank">
                        <ListItem button>
                            <ListItemIcon title="resume"><NoteIcon /></ListItemIcon>
                            <ListItemText primary={this.state.application.firstName + "'s resume"} />
                        </ListItem>
                    </Link>:
                    <ListItem>
                        <ListItemIcon title="resume"><NoteIcon /></ListItemIcon>
                        <Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>{this.state.application.firstName + ' has not uploaded a resume.'}</Alert>
                    </ListItem>
                    }
                    <ListItem>
                        <ListItemIcon title="certification"><VerifiedUserIcon /></ListItemIcon>
                        {this.state.certsExist ?
                            <ViewCertificates userId={this.state.application.userId} row/>:
                            <Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>No certifications completed</Alert>
                        }
                    </ListItem>
                    {this.state.shiftsExist ?
						<ShiftList application={this.state.application} shiftData={this.state.shiftData}/>:
						<ListItem>
							<ListItemIcon title="shift"><PendingIcon /></ListItemIcon>
							<Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>no shifts created</Alert>
						</ListItem>
					}
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

class ShiftList extends Component {
	constructor(props){
		super()
		this.state = {
			open: false,
			application: props.application,
			shifts: undefined,
			isLoading: true,
			shiftData: props.shiftData,
		}
		this.handleClick = this.handleClick.bind(this);
		// this.decide = this.decide.bind(this);
	}

	async componentDidMount(){
		let application = this.props.application;
		const appData = await ApplicationService.getAllAppliedById(application.userId).then(result => result.data);
		let currentApp;
		for(let i = 0; i < appData.length; i++) {
			if(appData[i].jobId === application.jobId)
				currentApp = appData[i];
		}
		let shifts = [];
		if(currentApp !== undefined) {
			const shiftData = this.state.shiftData;
			for(let i = 0; i < shiftData.length; i++)
				if(shiftData[i].applicationId === currentApp.id)
					shifts.push(<ShiftListElement key={shiftData[i]} update={this.componentDidMount} shiftData={shiftData[i]} application={application} />);
			this.setState({shifts : shifts, isLoading : false});
		}
	}

	handleClick() {
		this.setState({	open : !this.state.open});
	}

	render() {
		return (
			<>
				<ListItem button onClick={this.handleClick}>
					<ListItemIcon title="shifts">
						<PendingIcon/>
					</ListItemIcon>
					<ListItemText primary={`Shifts`} />
					{this.state.open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
				<Collapse in={this.state.open} timeout="auto">
					<List component="div" disablePadding>
						{this.state.shifts && this.state.shifts.map (shift =>
							<>{shift}</>
						)}
					</List>
				</Collapse>
			</>
		)
	}
}

class ShiftListElement extends Component {
	constructor() {
		super();
		this.state = {
			status: 'pending',
		}
		this.formatAMPM = this.formatAMPM.bind(this);
		this.handleStatus = this.handleStatus.bind(this);
	}

	componentDidMount() {
		this.setState({status : this.props.shiftData.status.toLowerCase()});
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

	async handleStatus(event, newStatus) {
		if(newStatus !== null) {
			this.setState({status : newStatus});
			switch(newStatus) {
			case 'accepted'	: await ShiftService.approveShift(this.props.shiftData.id).then(console.log('accepted')); break;
			case 'denied'	: await ShiftService.denyShift(this.props.shiftData.id).then(console.log('denied')); break;
			default			: await ShiftService.pendingShift(this.props.shiftData.id).then(console.log('pending')); break;
			}
		}
	}

	render() {
		const style = {
			nested : {"paddingLeft": "5%"},
		}
		let shiftData = this.props.shiftData;
		let startDate = new Date(shiftData.startYear, shiftData.startMonth, shiftData.startDay, shiftData.startHour, shiftData.startMinute);
		let endDate = new Date(shiftData.endYear, shiftData.endMonth, shiftData.endDay, shiftData.endHour, shiftData.endMinute)
		return (
			<div>
				<ListItem style={style.nested}>
					<ListItem style={style.nested}>
						<ListItemIcon title="shift start"><StartIcon /></ListItemIcon>
						<ListItemText primary={`${startDate.toDateString().split(' ')[1]} ${startDate.toDateString().split(' ')[2]} ${this.formatAMPM(startDate)}`} />
					</ListItem>
					<ListItem style={style.nested}>
						<ListItemIcon title="shift end"><StopIcon /></ListItemIcon>
						<ListItemText primary={`${endDate.toDateString().split(' ')[1]} ${endDate.toDateString().split(' ')[2]} ${this.formatAMPM(endDate)}`} />
					</ListItem>
					<ToggleButtonGroup
					value={this.state.status}
					exclusive
					onChange={this.handleStatus}
					aria-label="text alignment"
					>
					<ToggleButton value="denied" aria-label="left aligned">
						{this.state.status === 'denied'
						? <DeniedIcon style={{color: red[500]}} />
						: <DeniedIcon style={{color: red[0]}} />
						}
					</ToggleButton>
					<ToggleButton value="pending" aria-label="centered">
						{this.state.status === 'pending'
						? <PendingIcon style={{color: orange[500]}} />
						: <PendingIcon style={{color: orange[0]}} />
						}
					</ToggleButton>
					<ToggleButton value="accepted" aria-label="right aligned">
						{this.state.status === 'accepted'
						? <ApprovedIcon style={{color: green[500]}} />
						: <ApprovedIcon style={{color: green[0]}} />
						}
					</ToggleButton>
					</ToggleButtonGroup>
				</ListItem>
			</div>
		)
	}
}

export default ManagementComponent;