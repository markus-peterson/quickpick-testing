import React from 'react';
import { Component } from 'react';
import '../css/Dashboard.css'
import JobService from '../api/JobService';
import ApplicationService from '../api/ApplicationService';
import AuthenticationService from '../api/AuthenticationService';
import { Paper, Grid, List, ListItem, Button } from '@material-ui/core/';
import {HourglassEmpty as HourglassEmptyIcon,
        CheckCircleOutline as CheckCircleOutlineIcon,
        NotInterested as NotInterestedIcon } from '@material-ui/icons';
import { green, red, orange } from '@material-ui/core/colors';
import { Alert } from '@material-ui/lab';

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
                    <Grid item xs={3} className="content-sections">
                        <JobListItems update={this.updateSelectedJob} jobs={this.state.jobs}/>
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
            borderBottom: '1px #0000001a solid'
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
                <p>Loading...</p>
            )
        }else{
            if(this.state.jobs.length === 0){
                return(
                    <div className="search-list-container">
                        <div className="job-list">
                            <div className="leftItem" style={this.inactive}>
                                <p style={{'margin': '16px auto'}}>No jobs found</p>
                            </div>
                        </div>
                    </div>
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
                        <ListItem style={{justifyContent: 'center'}}>
                            {this.state.moreToLoad && <Button variant="contained" size="small" onClick={this.loadmore}>Load more</Button>}
                        </ListItem>
                    </List>
                </Paper>
            )
        }
    }
}

class BuildJobItem extends Component{
    render(){
        return(
            <div className="leftInner" >
                <p className="title">{this.props.jobInfo.jobTitle}</p>
                <p className="company">{this.props.jobInfo.organization}</p>
                <p className="location">{this.props.jobInfo.location}</p>
                <p className="salary">{this.props.jobInfo.jobSalary}</p>
            </div>
        )
    }
}


class SelectedJob extends Component {
    constructor(props){
        super(props);
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
            }
        };
        let alert = {
            border: '1px solid',
            borderRadius: 4,
            borderColor: '#ff990066'
        }
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
                <div className="content" id="selectJob">
                    <p style={{margin: '20px auto', width: 'fit-content'}}>No jobs available</p>
                </div>
            )
        } else {
            if(this.props.loading){
                return(
                    <p>Loading...</p>
                )
            }else{
                // console.log(this.state.appStatus)
                return(
                    <Paper style={style.paper}>
                        <Grid container>
                                {!this.state.appiedStatus && isUserLoggedIn &&
                                    <Button variant="contained" size="small" onClick={this.apply} style={{position: 'absolute', right: 40}}>Apply Now</Button>
                                }
                            <Grid item xs={12}>
                                <h2 style={{marginTop: 0}}>{this.props.job.jobTitle}</h2>
                                <p>{this.props.job.organization}</p>
                                <p>{this.props.job.location + " | " + this.props.job.country}</p>
                                <div className="description" dangerouslySetInnerHTML={{ __html: this.props.job.jobDescription }} />
                                <p>{this.props.job.jobSalary}</p>
                                <p>{this.props.job.pageUrl}</p>

                            </Grid>
                            <Grid item xs={12}>
                                {this.state.appiedStatus && isUserLoggedIn && 
                                    <Alert icon={responseDisplay} severity={severity}>{this.state.appiedResponse}</Alert>
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                )
            }
        }
    }
}


export default Dashboard