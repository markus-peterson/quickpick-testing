import React from 'react';
import { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import GridContainer from "../Design/Grid/GridContainer.js";
import GridItem from "../Design/Grid/GridItem.js";
import Button from "../Design/CustomButtons/Button.js";

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

class SearchBar extends Component{
    constructor() {
        super();
        this.state = {
            value: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.search(this.state.value);
    }

    render(){
        const { classes } = this.props;
        const style = {
            search: {
                backgroundColor: 'white',
                opacity: '0.9',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                margin: '0 10px'
            },
            button: {
                margin: '0 20px'
            }
        };
        return (
            <GridContainer container justify="center" alignItems="center">
                <GridItem item xs={12} sm={5}>
                <TextField
                        variant="filled"
                        margin="normal"
                        fullWidth
                        fullHeight
                        size="small"
                        style={style.search}
                        className={classes.textField}
                        id="searchKey"
                        label="KeyWord"
                        name="Keyword"
                        autoComplete="Keyword"
                        value={this.state.Keyword}
                        inputProps={{
                            type: "text",
                            onChange: this.handleChange,
                            autoComplete: "off"
                        }}
                    />
                </GridItem>
                <GridItem item xs={12} sm={5}>
                    <TextField
                            variant="filled"
                            margin="normal"
                            fullWidth
                            fullHeight
                            size="small"
                            style={style.search}
                            className={classes.textField}
                            id="location"
                            label="Location"
                            name="location"
                            autoComplete="location"
                            value={this.state.location}
                            inputProps={{
                                type: "text",
                                onChange: this.handleChange,
                                autoComplete: "off"
                            }}
                        />
                </GridItem>
                <GridItem item xs={12} sm={2}>
                    <Button
                            type="button"
                            // fullWidth
                            // fullHeight
                            variant="contained"
                            color="primary"
                            style={style.button}
                            className={classes.submit}
                            onClick={this.handleSubmit}
                        >
                        Search 
                        </Button>
                </GridItem>
            </GridContainer>
        );
    }
  }
  export default withStyles(styles, { withTheme: true })(SearchBar);