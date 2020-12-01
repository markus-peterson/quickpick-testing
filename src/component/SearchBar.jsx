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
            keyword: '',
            location: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]: value
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();
        let paramString = ''
        if(this.state.keyword !== '' && this.state.location !== ''){
            paramString = '?k='+ this.state.keyword +'?l=' + this.state.location
        }else if(this.state.keyword !== ''){
            paramString = '?k='+ this.state.keyword
        }else if(this.state.location !== ''){
            paramString = '?l=' + this.state.location
        }
        this.props.submit(paramString)
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
                margin: '0 20px',
                backgroundColor: 'var(--light-blue)'
            }
        };
        return (
            <form onSubmit={this.handleSubmit}>
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
                            id="keyword"
                            label="Keyword"
                            name="keyword"
                            autoComplete="keyword"
                            value={this.state.keyword}
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
            </form>
        );
    }
}
export default withStyles(styles, { withTheme: true })(SearchBar);