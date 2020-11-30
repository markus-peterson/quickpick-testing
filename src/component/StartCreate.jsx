import React from 'react';
import { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import { Grid } from '@material-ui/core/';

const styles = theme => ({
	textField: {
        width: '100%',
		margin:"10px",
		marginTop: theme.spacing(3),
    },
	submit: {
		margin: theme.spacing(3, 0, 2),
		backgroundColor: theme.palette.info.light,
    },
    spacing:{
        height:'700px',
    }
    
});

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
        this.props.updateParent(event);
        this.setState({[event.target.id]: event.target.value});
    }

    render(){
        const { classes } = this.props;
        return(
            <Grid container justify="center">
                <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        className={classes.textField}
                        id="jobTitle"
                        label="Job Title"
                        name="jobTitle"
                        autoComplete="jobTitle"
                        value={this.state.jobTitle}
                        inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            autoComplete: "off"
                        }}
                    />
                <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        className={classes.textField}
                        id="organization"
                        label="Company Name"
                        name="organization"
                        autoComplete="organization"
                        value={this.state.organization}
                        inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            autoComplete: "off"
                        }}
                    />
                <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        className={classes.textField}
                        id="country"
                        label="Country"
                        name="country"
                        value={this.state.country}
                        inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            autoComplete: "off"
                        }}
                    />
                <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        className={classes.textField}
                        id="location"
                        label="Job Location"
                        name="location"
                        value={this.state.location}
                        inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            autoComplete: "off"
                        }}
                    />
                <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        className={classes.textField}
                        id="jobSalary"
                        label="Job Salary"
                        name="jobSalary"
                        value={this.state.jobSalary}
                        inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            autoComplete: "off"
                        }}
                    />
                <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        className={classes.textField}
                        id="pageUrl"
                        label="Company URL"
                        name="pageUrl"
                        value={this.state.pageUrl}
                        inputProps={{
                            type: "url",
                            onChange: this.handleChange,
                            autoComplete: "off"
                        }}
                    />
            </Grid>
        )
    }
}
export default withStyles(styles, { withTheme: true })(StartCreate);