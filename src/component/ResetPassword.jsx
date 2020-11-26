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

class ResetPasswordComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            password: '',
            ConfirmPassword:'',
            showSuccessMessage:false,
            showFailureMessage:false,
            noUserFound:false
        }
        this.handleChange = this.handleChange.bind(this)
        this.ResetClicked = this.ResetClicked.bind(this)
        this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    handleChange(event){
        this.setState({     
            [event.target.name] : event.target.value 
        })
    }

    ResetClicked(){
        const token = this.props.match.params.token;
        const user = {
            password: this.state.password,
            token: token,        
        }
        console.log('Inside the Reset Password function')
        
        UserService.ResetPassword(user)
        .then( response => this.handleSuccessResponse(response))
		.catch(function (error) {
            console.log("ALLAL", error);
            console.log("data", { user });
        })
    }

    handleSuccessResponse(response){
        if (response.status === 200) {
                console.log('Password Updated !! ')
                if (response.data === "Successful"){
                    this.setState({showSuccessMessage : true   })
                }else if(response.data === "Invalid reset link."){
                    this.setState({showFailureMessage : true   })
                }
        } else {
            window.alert(response)
        }
    }

    handleError(error){
        this.setState({showSuccessMessage : false   })
        this.setState({hasLoginFailed: true})
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
                        {this.state.showFailureMessage && <Alert severity="error">Something Went Wrong Try Again!!</Alert>}
                        {this.state.showSuccessMessage && <Alert severity="success">A password is successfully Updated !!</Alert>}
                            <Typography component="h1" variant="h5">Reset Password</Typography>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={this.state.password}
                                autoComplete="current-password"
                                inputProps={{
                                    type: "password",
                                    onChange: this.handleChange,
                                    autoComplete: "off"
                                }}/>
                          
                          <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="ConfirmPassword"
                                label="Confirm Password"
                                type="ConfirmPassword"
                                id="ConfirmPassword"
                                value={this.state.ConfirmPassword}
                                autoComplete="current-password"
                                inputProps={{
                                    type: "password",
                                    onChange: this.handleChange,
                                    autoComplete: "off"
                                }}/>
                            <Button type="Button" fullWidth variant="contained" color="primary"
                                className={classes.submit}
                                onClick={this.ResetClicked}>
                                    Submit Password
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
export default withStyles(styles, { withTheme: true })(ResetPasswordComponent);
