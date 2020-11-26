import React, { Component } from 'react';
import { Paper, Grid, List, ListItem, ListItemText, ListItemAvatar, Divider, ButtonGroup, Button, Typography } from '@material-ui/core/';
import { PersonOutline as AccountCircle, MailOutline as Email, LocationOnOutlined as ContactMail } from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Alert } from '@material-ui/lab';

import AuthenticationService from '../api/AuthenticationService';
import UserService from '../api/UserService';
import JobService from '../api/JobService';
import ApplicationService from '../api/ApplicationService';
import CreatedJobList from './CreatedJobList';

class ManagementComponent extends Component {
    constructor(){
        super();
        this.state = {
            selectedJob: null,
            manageState: 0
        }
        this.updateSelectedJob = this.updateSelectedJob.bind(this)
        this.changeManage = this.changeManage.bind(this)
    }

    async componentDidMount(){

    }

    updateSelectedJob(){

    }

    changeManage(event){
        console.log(event)
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

        return(
            <div className="container">
                <Grid container direction="row" spacing={3} style={{width: "100%", margin: 0}}>
                    <Grid item xs={1} />
                    <Grid container item xs={2}>
                        {/* render submitted jobs here as small list items */}
                    </Grid>
                    <Grid item xs={1} />
                    <Grid container item xs={7} sm >
                        <Grid container item xs={12} alignItems="center" justify="center" >
                            <ButtonGroup aria-label="manage secion">
                                <Button onClick={() => { this.changeManage("jobs") }} style={this.state.manageState === 0 ? style.active : style.inert}>Manage Job</Button>
                                <Button onClick={() => { this.changeManage("apps") }} style={this.state.manageState === 1 ? style.active : style.inert}>Manage Applicants</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid container item xs={12} style={{textAlign: "center"}} alignItems="center" justify="center" >
                            {this.state.manageState === 0 ? <p style={{width: 300, height: 300}}>Hello</p> : <p>other</p>}
                        </Grid>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
            </div>
        )
    }
}

class JobItem extends Component {
    render(){
        const style = {
            Paper : {padding:20, marginTop:10, marginBottom:10}
        };
        return(
            <Paper style={style.paper}>
                {}
            </Paper>
        )
    }
}

export default ManagementComponent;