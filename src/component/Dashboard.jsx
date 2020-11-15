import React from 'react';
import { Component } from 'react';
import '../css/Dashboard.css'
import SearchBar from './SearchBar';
import JobService from '../api/JobService';
import ApplicationService from '../api/ApplicationService';
import AuthenticationService from '../api/AuthenticationService';


class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            job : null
        }
        this.changeJob = this.changeJob.bind(this);
    }
    
    
    changeJob(id){
        this.setState({job : id});
    }

    render(){
        return(
            <div className="dash-contianer">
                <div className="background-container"/>
                <div className="dash-inner">
                    <JobListItems jobSelect={this.changeJob}/>
                    <div className="content-container">
                        <SelectedJob job={this.state.job} />
                    </div>
                </div>
            </div>
        )
    }
}

class JobListItems extends Component {
    constructor(){
        super();
        this.state = {
            jobs: [],
            jobsIndex: [],
            activeIndex: 0,
            isLoading: true,
            currentJob: null,
            moreToLoad: true
        }
        this.total = 0;
        this.loadmore = this.loadmore.bind(this);
        this.handleUpdateCurrent = this.handleUpdateCurrent.bind(this); 
        this.leftToLoad = 0;
        this.allJobs = null;
        this.inactive = {
            border: "gray solid 1px",
            background: "var(--yellow-color-transparent)"
        };
        this.active = {
            border: "var(--light-blue) solid 1px",
            background: "var(--light-blue-transparent)"
        };
    }

    async componentDidMount(){
        const data = await JobService.executeGetJobListService().then(result => result.data);
        this.allJobs = data;
        var tempJob = null;
        const added = [];
        const indexes = [];
        if(this.allJobs.length >= 10){
            this.leftToLoad = 10;
        }else{
            this.leftToLoad = this.allJobs.length;
        }
        this.total = this.leftToLoad;
        while(this.leftToLoad > 0){
            tempJob = this.allJobs[this.total - this.leftToLoad];
            added.push(<BuildJobItem changeJob={this.handleSelect} jobInfo={tempJob}/>);
            indexes.push(tempJob);
            this.leftToLoad = this.leftToLoad - 1;
        }
        if(this.allJobs.length - this.total === 0){
            this.setState({moreToLoad: false});
            
        }
        this.setState({jobs: added, isLoading: false, jobsIndex: indexes});
        this.props.jobSelect(this.state.jobsIndex[0]);
    }

    handleSelect(id) {
        this.props.jobSelect(id);
    }

    handleUpdateCurrent(index){
        this.props.jobSelect(this.state.jobsIndex[index]);
        this.setState({activeIndex: index});
    }
    
    loadmore() {
        this.setState({isLoading: true});
        if((this.allJobs.length - this.total) >= 10){
            this.leftToLoad = 10;
        }else{
            this.leftToLoad = this.allJobs.length - this.total;
        }
        this.total = this.total + this.leftToLoad;
        var tempJob = null;
        const added = this.state.jobs.slice();
        const indexes = this.state.jobsIndex.slice();
        while(this.leftToLoad > 0){
            tempJob = this.allJobs[this.total - this.leftToLoad];
            added.push(<BuildJobItem changeJob={this.handleSelect} jobInfo={tempJob}/>);
            indexes.push(tempJob);
            this.leftToLoad= this.leftToLoad - 1;
        }
        if(this.allJobs.length - this.total === 0){
            this.setState({moreToLoad: false});
        }
        this.setState({isLoading: false, jobs: added, jobsIndex: indexes});
        console.log(this.state.jobs.length);
        // this.forceUpdate();
    }
    
    render(){
        console.log();
        if(this.state.isLoading){
            return(
                <p>Loading...</p>
            )
        }else{
            if(this.state.jobs.length === 0){
                return(
                    <p>No jobs found</p>
                )
            }
            return(
                <div className="job-list">
                    {
                        this.state.jobs.map(function(JobItem, index) {
                            const style = this.state.activeIndex === index ? this.active : this.inactive;
                            return(
                            <div className="leftItem" onClick={this.handleUpdateCurrent.bind(this, index, this.props)} style={style} key={index}>
                                {JobItem}
                            </div>
                            );
                        }, this)
                    }
                    {this.state.moreToLoad && <button type="button" onClick={this.loadmore}>Load more</button>}
                </div>
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
    constructor(){
        super();
        this.state = {
            appResponse: '',
            appStatus: false
        }
        this.apply = this.apply.bind(this);
    }


    async apply(){
        const application = {
            jobID : this.props.job.uniqueId,
            username : sessionStorage.getItem('authenticatedUser')
        }
        console.log(application);
        await ApplicationService.executeApplication(application)
        .then((response) => {
			this.setState({
				appResponse: response.data,
				appStatus: true
			});
		})
		.catch(() => {});
    }

    render(){
        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        if (this.props.job == null){
            return(
                <div className="content" id="selectJob">
                    <p className="NoJob">No jobs available</p>
                </div>
            )
        } else {
            if(this.props.loading){
                return(
                    <p>Loading...</p>
                )
            }else{
                if(!this.state.appStatus){
                    const application = {
                        jobID : this.props.job.uniqueId,
                        username : sessionStorage.getItem('authenticatedUser')
                    }
                    ApplicationService.checkApplied(application)
                    .then((response) => {
                        console.log(response);
                        if(response.data !== ""){
                            this.setState({
                                appResponse: 'Application ' + response.data,
                                appStatus: true
                            });
                        }
                    })
                    .catch(() => {});
                }
                return(
                    <div className="content" id="job">
                        <h2>{this.props.job.jobTitle}</h2>
                        <p>{this.props.job.organization}</p>
                        <p>{this.props.job.location} {this.props.job.country}</p>
                        <div className="description" dangerouslySetInnerHTML={{__html: this.props.job.jobDescription}} />
                        <p>{this.props.job.jobSalary}</p>
                        <p>{this.props.job.pageUrl}</p>
                        {!this.state.appStatus && isUserLoggedIn && <button type="button" onClick={this.apply}>Apply</button>}
                        {this.state.appStatus && isUserLoggedIn && <div>{this.state.appResponse}</div>}
                    </div>
                )
            }
        }
    }
}

SelectedJob.defaultProps = {
    status: null
}


export default Dashboard