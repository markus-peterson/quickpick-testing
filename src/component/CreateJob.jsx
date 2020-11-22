import React from 'react';
import { Component } from 'react';
import '../css/CreateJob.css';
import RichTextInput from './RichTextInput';
import AuthenticationService from '../api/AuthenticationService';
import JobService from '../api/JobService';
import { Link } from 'react-router-dom';
import { Paper, Grid } from '@material-ui/core/';


class CreateJob extends Component {
    constructor(){
        super();
        this.state = {
            buttonText: 'Next',
            page: 0,
            jobTitle: '',
            jobDescription: '',
            organization: '',
            country: '',
            hasExpired: '',
            jobBoard: '',
            dateAdded: '',
            location: '',
            pageUrl: '',
            jobSalary: '',
            sector: '',
            isSubmitted: false
        }
        // const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        // let user = sessionStorage.getItem('authenticatedUser');
        // this.handleNext = this.handleNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFirst = this.handleFirst.bind(this);
        this.handleSecond = this.handleSecond.bind(this);
        this.back = this.back.bind(this);
        this.hiddenStyle = {
            display: "none"
        };
    }

    back(){
        this.setState({
            page: this.state.page - 1,
            buttonText: 'Next'
        });
    }

    handleFirst(initial) {
        this.setState({
            jobTitle: initial.jobTitle,
            organization: initial.organization,
            country: initial.country,
            dateAdded: '', //current date
            location: initial.location,
            pageUrl: initial.pageUrl,
            jobSalary: initial.jobSalary
        });
    }
    
    handleSecond(initial) {
        this.setState({
            jobDescription : initial
        });
    }

    handleSubmit() {
        if(this.state.page === 0){
            this.setState({
                buttonText: 'Submit',
                page: 1
            })
        } else{
            const job = {
                jobTitle : this.state.jobTitle,
                jobDescription : this.state.jobDescription,
                organization : this.state.organization,
                country : this.state.country,
                hasExpired : this.state.hasExpired,
                jobBoard : this.state.jobBoard,
                dateAdded : this.state.dateAdded,
                location : this.state.location,
                pageUrl : this.state.pageUrl,
                jobSalary : this.state.jobSalary,
                sector : this.state.sector,
                author : sessionStorage.getItem('authenticatedUser')
            }
            JobService.executePostJobService(job);
            this.setState({isSubmitted: true});
        }
    }

    render(){
		const style = {Paper : {padding:20, marginTop:10, marginBottom:10}}
		const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		if(!isUserLoggedIn) {
			return( <Grid container justify="center">
						<Grid item sm={6}>
							<Paper style={style.Paper}>
								<Grid container>
									<Grid item sm>
										Not Logged In
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>)
		}
        if(this.state.isSubmitted){
            return(
                <div className='jobContainer'>
                    <div className="inner">
                        <form className="successForm">
                            <div className="alert alert-success">Job successfully posted</div>
                            <div id='field'>
                                <Link to="/"><button type="button">Okay</button></Link>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }else{
            return(
                <div className='jobContainer'>
                    <div className="registerBack"></div>
                    <div className="inner">
                        <form >
                            {this.state.page === 0 && <StartCreate updateParent={this.handleFirst}/>}
                            {this.state.page === 1 && <RichTextInput updateParent={this.handleSecond}/>}
                            <div className='field' id="buttons-set">
                                {this.state.page !== 0 && <button type="button" onClick={this.back}>Back</button>}
                                <button type="button" onClick={this.handleSubmit}>{this.state.buttonText}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
    }
}

class StartCreate extends Component {
    constructor(){
        super();
        this.state = {
            jobTitle: '',
            organization: '',
            country: '',
            dateAdded: '',
            location: '',
            pageUrl: '',
            jobSalary: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
        this.props.updateParent(this.state);
    }

    render(){
        return(
            <div>
                <div className='field'>
                    <label htmlFor="jobTitle">Job title: </label>
                    <input type="text" id="jobTitle" onChange={this.handleChange} required></input>
                </div>
                <div className='field'>
                    <label htmlFor="organization">Company: </label>
                    <input type="text" id="organization" autocomplete="on" onChange={this.handleChange} required></input>
                </div>
                <div className='field'>
                    <label htmlFor="country">Country: </label>
                    <input type="text" id="country" autocomplete="on" onChange={this.handleChange} required></input>
                </div>
                <div className='field'>
                    <label htmlFor="location">Job location: </label>
                    <input type="text" id="location" onChange={this.handleChange} required></input>
                </div>
                <div className='field'>
                    <label htmlFor="jobSalary">Salary for job: </label>
                    <input type="text" id="jobSalary" onChange={this.handleChange} required></input>
                </div>
                <div className='field'>
                    <label htmlFor="pageUrl">Company URL: </label>
                    <input type="url" id="pageUrl" onChange={this.handleChange}></input>
                </div>
            </div>
        )
    }
}



export default CreateJob