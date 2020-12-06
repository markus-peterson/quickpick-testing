import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import ProductSection from "./ProductSection"
import { Grid, Button } from '@material-ui/core/';

import '../css/LandingPage.css'

const styles = theme => ({

    body: {
		"z-index": "-1",
		backgroundColor: theme.palette.common.red
    },
    
	paper: {
        zIndex: "12",
		marginTop: theme.spacing(8),
		display: 'flex',
        flexDirection: 'row',
        "flex-wrap": 'nowrap',
        alignItems: 'center',
        width: '100%'
        
	},
	textField: {
        height: '60%',
		margin:"10px",
		marginTop: theme.spacing(3)
    },
    inputField:{
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(3)
    },
    inputButton:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(3)
    },
    container: {
         'display': 'inline',
        'position': 'absolute',
        right: 0,
        bottom: '0px',
        'overflow-y': 'auto',
    },
	submit: {
		margin: theme.spacing(3, 0, 2),
		backgroundColor: theme.palette.info.light
    },
    spacing:{
        height:'700px'
    }
});

class LandingComponent extends Component {
    constructor(props) {
        super()
        this.state = {
            keyword: '',
            location: '',
            errorMessage: ''
        };
        this.update = this.update.bind(this);
        this.searchClicked = this.searchClicked.bind(this);
    }

    update(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    searchClicked(){
        let paramString = ''
        if(this.state.keyword !== '' && this.state.location !== ''){
            paramString = '?k='+ this.state.keyword +'?l=' + this.state.location
        }else if(this.state.keyword !== ''){
            paramString = '?k='+ this.state.keyword
        }else if(this.state.location !== ''){
            paramString = '?l=' + this.state.location
        }
        if(paramString !== ''){
            this.props.history.push('/dash/' + paramString)
        }else{
            this.props.history.push('/dash')
        }
    }

    render() {
        const { classes } = this.props;
        const style = {
            paper: {
                zIndex: "12",
                display: 'flex',
                flexDirection: 'row',
                "flex-wrap": 'nowrap',
                alignItems: 'center',
                width: '100%', // Fix IE 11 issue.
                marginTop: "-20px",
            },
            feat: {
                marginTop: '-20px'
            },
            name: {
                color: '#37474f',
                fontWeight: 'bold'
            },
            spec: {
                color: '#37474f'
            },
            space: {
                marginTop: '20px'
            },
            body: {
                fontSize: '14px',
                lineHeight: '175%'
            },
            searchSection: {
                zIndex: 0,
                height: '500px',
                margin: 'auto auto',
                alignItems: 'center'
            },
            fullContain: {
                zIndex: 0,
                overflowX: 'hidden',
                // width: '98%',
                margin: 'auto',
                height: 'fit-content'
            },
            search: {
                backgroundColor: 'white',
                opacity: '0.9',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px'
            },
            button: {
                margin: '0 20px',
                // backgroundColor: 'var(--light-blue)',
                // color: 'black'
            }
        };
		return(
            <div style={style.fullContain}>
                <div className="LandingBack"></div>
				<CssBaseline /> 
				<div style={{'marginBottom': '100px'}}>
                    <form onSubmit={this.searchClicked}>
                        <Grid container justify="center" alignItems="center" direction="column" style={style.searchSection} spacing={3}>
                            <Grid container justify="center" alignItems="center">
                                <h1 style={{color: "var(--yellow-color)", fontSize: 70, textShadow: "1px 1px 10px var(--light-shadow)"}}>Quick-Pick</h1>
                            </Grid>
                            <Grid container justify="center" alignItems="center" direction="row" spacing={3}>
                                <Grid item xs={12} sm={3} >
                                    <TextField
                                            variant="filled"
                                            margin="normal"
                                            fullWidth
                                            style={style.search}
                                            className={classes.textField}
                                            id="keyword"
                                            label="Keyword"
                                            name="keyword"
                                            autoComplete="keyword"
                                            value={this.state.keyword}
                                            // autoFocus
                                            inputProps={{
                                                type: "text",
                                                onChange: this.update,
                                                autoComplete: "off"
                                            }}
                                        />
                                </Grid>
                                <Grid item xs={12} sm={3} style={{position: 'relative', display: 'inline-block'}}>
                                    <TextField
                                            variant="filled"
                                            margin="normal"
                                            fullWidth
                                            style={style.search}
                                            className={classes.textField}
                                            id="location"
                                            label="Location"
                                            name="location"
                                            autoComplete="location"
                                            value={this.state.location}
                                            // autoFocus
                                            inputProps={{
                                                type: "text",
                                                onChange: this.update,
                                                autoComplete: "off"
                                            }}
                                        />
                                </Grid>
                                <Grid item xs={12} sm={1} className={classes.inputButton} >
                                    <Button
                                            type="button"
                                            fullWidth
                                            fullHeight
                                            variant="contained"
                                            color="primary"
                                            style={style.button}
                                            className={classes.submit}
                                            onClick={this.searchClicked}
                                        >
                                        Search 
                                        </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
				</div>
		        {/* <div className={classes.spacing}></div> */}
                <div style={{'marginTop': '110px'}}>
                    <ProductSection />
                </div>  
        </div>
		)
	}
}
export default withStyles(styles, { withTheme: true })(LandingComponent);
