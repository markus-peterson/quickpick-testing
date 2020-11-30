import React from 'react';
import { Component } from 'react';
import RichTextInput from './RichTextInput';
import AuthenticationService from '../api/AuthenticationService';
import JobService from '../api/JobService';
import { Link } from 'react-router-dom';
import { Paper, Grid, Container, Button} from '@material-ui/core/';
import StartCreate from './StartCreate';
import { withStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        alignItems: 'center',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: 'fit-content', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: theme.palette.common.blue,
    },
});

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
                author : sessionStorage.getItem('authenticatedUserId')
            }
            JobService.executePostJobService(job);
            this.setState({isSubmitted: true});
        }
    }

    render(){
		const style = {
            container:{
                backgroundColor: 'white',
                borderRadius: 5,
                marginTop: 100
            }
        }
		const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		if(!isUserLoggedIn) {
			return( 
                <Grid container justify="center">
                    <Grid item sm={6}>
                        <Paper style={style.Paper}>
                            <Grid container>
                                <Grid item sm>
                                    <Alert severity="warning" variant="filled">Not Logged In</Alert>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            )
		}
        if(this.state.isSubmitted){
            return(
                <div className='jobContainer'>
                    <div className="registerBack">
                        <Container component="main" maxWidth="sm" style={style.container}>
                            <Grid container spacing={3} direction="column" alignContent="center" justify="center">
                                <Grid item></Grid>
                                <Grid item sm style={{width: '100%'}}>
                                    <Alert severity="success" variant="filled" >Job successfully posted</Alert>
                                </Grid>
                                <Grid item sm style={{margin: 'auto'}}>
                                    <Link to="/dash" style={{textDecoration: 'none'}}><Button variant="contained" size="large">Okay</Button></Link>
                                </Grid>
                                <Grid item></Grid>
                            </Grid>
                        </Container>
                    </div>
                </div>
            )
        }else{
            return(
                <div className='jobContainer'>
                    <div className="registerBack"></div>
                    <form>
                        <Container component="main" maxWidth={this.state.page === 1 ? "md":"sm"} style={style.container}>
                            <Grid container justify="center" spacing={3} direction="column">
                                {this.state.page === 0 && <StartCreate updateParent={this.handleFirst}/>}
                                {this.state.page === 1 && <RichTextInput updateParent={this.handleSecond} starter='' />}
                                <Grid item></Grid>
                                <Grid container spacing={3} justify="center" alignItems="center">
                                    <Grid item xs={2}>
                                        <Button
                                            variant="contained"
                                            disabled={this.state.page === 0}
                                            onClick={this.back}>
                                            Back
                                        </Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                                            {this.state.page === 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item></Grid>
                            </Grid>
                        </Container>
                    </form>
                </div>
            )
        }
    }
}

export default withStyles(styles, { withTheme: true })(CreateJob);