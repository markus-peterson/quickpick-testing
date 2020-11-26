import React, { Component } from 'react';
import UserService from '../api/UserService';
import '../css/LoginComponent.css'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from "@material-ui/core/styles";
import { Alert } from '@material-ui/lab';


const styles = theme => ({
    body: {
        backgroundColor: theme.palette.common.red,
        backgroundImage: `url(${Image})`,
    },
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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: theme.palette.common.blue,
    },
});

class ForgotPasswordComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
			emailId: '',
            showSuccessMessage:false,
            showFailureMessage:false
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
        this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
        // this.handleError = this.handleError.bind(this);
       
    }

    handleChange(event){
        this.setState({     
            [event.target.name] : event.target.value 
        })
    }

    // registerClicked(){
    //     this.props.history.push(`/register`);
    // }

    sendEmail(){
        const params = {
            email: this.state.emailId          
        }
        console.log('Inside the Forgot Password function')

        UserService.ForgetPassword(params)
        .then( response => this.handleSuccessResponse(response))
		.catch(function (error) {
            //this.setState({ showSuccessMessage : false   })
            console.log("Error While Sending the Email to reset Password", error);
        })
    }

    handleSuccessResponse(response){
        if (response.status === 200) {
            console.log('Successful Backend Call')
            this.setState({showSuccessMessage : false   })
            // this.props.history.push(`/`)
            // window.location.reload() // temp solution to user API call bug
            if (response.data === "A password reset link has been sent to registered Email."){
                this.setState({showSuccessMessage : true   })
                console.log('Email Successfully sent to registered Email')
            }else if(response.data === "Email Not Registered"){
                console.log('Email is not registered')
                this.setState({showFailureMessage : true   })
            }
        } else {
            window.alert(response)
        }
    }

    render(){
        const { classes } = this.props;
        return(
            <Container component="main" maxWidth="xs">
                <div className="registerBack"></div>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <form className={classes.form} noValidate  onSubmit={this.onSubmit} >

                    {this.state.showFailureMessage && <Alert severity="error">Email Not Registered !!</Alert>}
                    {this.state.showSuccessMessage && <Alert severity="success">A password reset link has been sent to Registered Email !!</Alert>}
                        <Typography component="h1" variant="h5">Forget Password</Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="emailId"
                            autoComplete="Email"
                            value={this.state.emailId}
                            autoFocus
                            inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            autoComplete: "off"
                            }}/>
                        
                        
                        <Button type="Button" fullWidth variant="contained" color="primary"
                            className={classes.submit}
                            onClick={this.sendEmail}>
                                Send Mail
                        </Button>
                        
                        <div style={{"height": "20px"}}></div>
                        <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Go back to login page."}
                                </Link>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                </Box>
            </Container>
        );        
    }
}

export default withStyles(styles, { withTheme: true })(ForgotPasswordComponent);
