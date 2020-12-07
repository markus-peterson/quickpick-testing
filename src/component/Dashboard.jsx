import React from 'react';
import { Component } from 'react';

import { Paper, Grid, List, ListItem, Button, ListItemIcon, ListItemText } from '@material-ui/core/';
import {HourglassEmpty as HourglassEmptyIcon,
        CheckCircleOutline as CheckCircleOutlineIcon,
        NotInterested as NotInterestedIcon,
        LocationOn as LocationOnIcon, 
        Business as BusinessIcon,
        AttachMoney as AttachMoneyIcon,
        Description as DescriptionIcon,
        Note as NoteIcon,
        Edit as EditIcon,
        Save as SaveIcon,
        VerifiedUser as VerifiedUserIcon,
        FormatQuote as FormatQuoteIcon} from '@material-ui/icons';
import { green, red, orange } from '@material-ui/core/colors';
import { Alert } from '@material-ui/lab';

import LoadingComponent from './LoadingComponent';

import JobService from '../api/JobService';
import ApplicationService from '../api/ApplicationService';
import AuthenticationService from '../api/AuthenticationService';

import '../css/Dashboard.css'

class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            jobs: [],
            indexList: [],
            index: 0,
            appResponse: '',
            appStatus: false
        }
        this.updateSelectedJob = this.updateSelectedJob.bind(this)
        this.loadJobs = this.loadJobs.bind(this)
    }
    
    async componentDidMount(){
        console.log(this.props)
        let keyword = ''
        let location = ''
        if(this.props.location.search !== ""){
            let paramArray = []
            let stringParams = this.props.location.search
            if(this.props.location.search.startsWith('?k=')){
                stringParams = stringParams.split('?k=')[1]
                if(stringParams.includes('?l=')){
                    paramArray = stringParams.split('?l=')
                    keyword = paramArray[0]
                    location = paramArray[1]
                }else{
                    keyword = stringParams
                }
            }else if(this.props.location.search.startsWith('?l=')){
                stringParams = stringParams.split('?l=')[1]
                location = stringParams
            }
        }
        this.loadJobs(keyword, location)
    }

    async componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.componentDidMount()
        }
    }

    async loadJobs(keyword, location){
        let jobData = []
        let added = []
        let temp = []
        if(keyword === '' && location === ''){
            jobData = await JobService.executeGetJobListService().then(result => result.data);
        }else{
            const params = {
                searchKey: keyword,
                location: location
            }
            console.log(params)
            jobData = await JobService.executeGetSearch(params).then(result => result.data);
        }
        for(let i = 0; i < jobData.length; i++){
            added.push(<BuildJobItem jobInfo={jobData[i]}/>)
            temp.push(jobData[i])
        }
        console.log(temp.length)
        this.setState({jobs: added, indexList: temp});
    }
    
    updateSelectedJob(newIndex){
        this.setState({
            index: newIndex
        })
    }

    render(){
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
        return(
            <div className="container">
                <div className="background-container"/>
                <Grid container direction="row" spacing={3} style={style.container} justify="center">
                    <Grid item container xs={3} className="content-sections" justify='flex-end'>
                        <Grid item xs={12} sm={10}>
                            <JobListItems update={this.updateSelectedJob} jobs={this.state.jobs}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} className="content-sections">
                        <SelectedJob job={this.state.indexList[this.state.index]} appResponse={this.state.appResponse} appStatus={this.state.appStatus}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

class JobListItems extends Component {
    constructor(){
        super();
        this.state = {
            jobs: [],
            activeIndex: 0,
            isLoading: false,
            moreToLoad: true,
            total: 0,
            loaded: 0
        }
        this.loadmore = this.loadmore.bind(this);
        this.updateCurrent = this.updateCurrent.bind(this); 
        this.inactive = {
            borderBottom: '1px #0000001a solid'
        };
        this.active = {
            backgroundColor: "var(--light-blue-transparent)",
            backdropFilter: 'blur(2px)',
            borderBottom: '1px #0000001a solid',
        };
    }

    async componentDidMount(){
        const initTotal = this.props.jobs.length
        const initLoaded = initTotal > 10 ? 10 : this.props.jobs.length
        const moreToLoad = initTotal > initLoaded
        this.setState({
            jobs: this.props.jobs,
            total: initTotal,
            loaded: initLoaded,
            moreToLoad: moreToLoad
        })
        this.setState({activeIndex: 0});
        this.props.update(0);
    }

    async componentDidUpdate(oldProps){
        if(oldProps.jobs !== this.props.jobs){
            this.componentDidMount()
        }
    }

    updateCurrent(index){
        this.props.update(index);
        this.setState({activeIndex: index});
    }
    
    loadmore() {
        const leftToLoad = this.state.total - this.state.loaded
        const initLoaded = leftToLoad > 10 ? (this.state.loaded + 10) : this.state.total
        const moreToLoad = this.state.total > initLoaded
        this.setState({
            loaded: initLoaded,
            moreToLoad: moreToLoad
        })
    }
    
    render(){
        const style = {
            paper: {
                padding: 0,
                marginTop:0,
                marginBottom:20,
                height: "fit-content",
                backgroundColor: 'var(--white-transparent)',
                backdropFilter: 'blur(10px)'
            },
            list: {
                padding: 0
            }
        };
        console.log();
        if(this.state.isLoading){
            return(
				<div style={{marginTop:'20px', marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
            )
        }else{
            if(this.state.jobs.length === 0){
                return(
                    <Paper style={style.paper}>
                        <Grid container>
                            <Grid item xs={12}>
                                <p style={{margin: '20px auto', width: 'fit-content'}}>No jobs found</p>
                            </Grid>
                        </Grid>
                    </Paper>
                )
            }
            return(
                <Paper style={style.paper}>
                    <List component="div" direction="column" style={style.list}>
                        {
                            this.state.jobs && this.state.jobs.slice(0,this.state.loaded).map( function(job, index) {
                                const active = this.state.activeIndex === index ? this.active : this.inactive;
                                return(
                                <ListItem button style={active} onClick={this.updateCurrent.bind(this, index)} key={index}>
                                    {job}
                                </ListItem>
                                );
                            }, this)
                        }
                        {this.state.moreToLoad && 
                            <ListItem style={{justifyContent: 'center'}}>
                                <Button variant="contained" size="small" onClick={this.loadmore}>Load more</Button>
                            </ListItem>
                        }
                    </List>
                </Paper>
            )
        }
    }
}

class BuildJobItem extends Component{
    render(){
        const style = {
            paper : {
                padding: 40,
                textAlign: "left",
                flexGrow: 1,
                backgroundColor: 'var(--white-transparent)',
                backdropFilter: 'blur(10px)'
            },
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
        return(
            <List>
                <ListItem>
                    <ListItemIcon title="jobTitle"><FormatQuoteIcon /></ListItemIcon>
                    <ListItemText>{this.props.jobInfo.jobTitle}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon title="jobTitle"><BusinessIcon /></ListItemIcon>
                    <ListItemText>{this.props.jobInfo.organization}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon title="jobTitle"><LocationOnIcon /></ListItemIcon>
                    <ListItemText>{this.props.jobInfo.location}</ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemIcon title="jobTitle"><AttachMoneyIcon /></ListItemIcon>
                    <ListItemText>{this.props.jobInfo.jobSalary !== "" ? this.props.jobInfo.jobSalary : 'Unspecified'}</ListItemText>
                </ListItem>
                {/* <p className="company">{this.props.jobInfo.organization}</p>
                <p className="location">{this.props.jobInfo.location}</p>
                <p className="salary">{this.props.jobInfo.jobSalary}</p> */}
            </List>
        )
    }
}


class SelectedJob extends Component {
    constructor(){
        super();
        this.state = {
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
            appiedResponse: '',
            appiedStatus: false
        }
        this.apply = this.apply.bind(this);
    }

    async componentDidMount(){
        let appliedResponse = ''
        let appliedStatus = false
        if(this.props.job !== undefined){
            const application = {
                jobId : this.props.job.id,
                userId : sessionStorage.getItem('authenticatedUserId')
            }
            await ApplicationService.checkApplied(application)
                .then((response) => {
                    if (response.data !== "") {
                        appliedResponse = 'Application ' + response.data
                        appliedStatus = true
                    }else {
                        appliedResponse = ''
                        appliedStatus = false
                    }
                })
            this.setState({
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
                appiedResponse: appliedResponse,
                appiedStatus: appliedStatus
            })
        }
    }

    async componentDidUpdate(oldProps){
        if(oldProps.appStatus !== this.props.appStatus || oldProps.appResponse !== this.props.appResponse || oldProps.job !== this.props.job){
            this.componentDidMount()
        }
    }

    async apply(){
        const application = {
            jobId : this.props.job.id,
            userId : sessionStorage.getItem('authenticatedUserId')
        }
        await ApplicationService.executeApplication(application)
        .then((response) => {
			this.setState({
				appiedResponse: response.data,
				appiedStatus: true
			});
		})
		.catch(() => {});
    }

    render(){
        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        const style = {
            paper : {
                padding: 40,
                textAlign: "left",
                flexGrow: 1,
                backgroundColor: 'var(--white-transparent)',
                backdropFilter: 'blur(10px)'
            },
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
        let responseDisplay = (<HourglassEmptyIcon style={{color: orange[500]}} />);
        let severity = 'info'
        if(this.state.appiedStatus) {
            if(this.state.appiedResponse.toLowerCase().includes('denied')) {
                responseDisplay = (<NotInterestedIcon style={{color: red[500]}} />);
                severity = 'error'
            }else if(this.state.appiedResponse.toLowerCase().includes('accepted')){
                responseDisplay = (<CheckCircleOutlineIcon style={{color: green[500]}} />);
                severity = 'success'
            }else{
                responseDisplay = (<HourglassEmptyIcon style={{color: orange[500]}} />);
                severity = 'warning'
            }
		}

        if (this.props.job == null){
            return(
                <Paper style={style.paper}>
                    <Grid container>
                        <Grid item xs={12}>
                            <h2 style={{margin: '20px auto', width: 'fit-content'}}>No jobs found</h2>
                        </Grid>
                    </Grid>
                </Paper>
            )
        } else {
            if(this.props.loading){
                return(
                    <div style={{marginTop:'20px', marginRight: '20px'}}>
                        <LoadingComponent/>
                    </div>
                )
            }else{
                return(
                    <Paper style={style.paper}>
                        <Grid container spacing={3}>
                            {!this.state.appiedStatus && isUserLoggedIn &&
                                <Button variant="contained" size="small" onClick={this.apply} style={{position: 'absolute', right: 40, zIndex: 5}}>Apply Now</Button>
                            }
                        
                            {this.state.appiedStatus && isUserLoggedIn && 
                                <Grid item xs={12}>
                                    <Alert icon={responseDisplay} severity={severity}>{this.state.appiedResponse}</Alert>
                                </Grid>
                            }
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
                        </Grid>
                    </Paper>
                )
            }
        }
    }
}


export default Dashboard