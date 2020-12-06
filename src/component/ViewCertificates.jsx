import React from 'react';
import { Component } from 'react';
import { List, ListItem, ListItemText, Container, ListItemIcon } from '@material-ui/core/';
import CertifyService from '../api/CertifyService';
import {CheckCircleOutline as CheckCircleOutlineIcon,
        NotInterested as NotInterestedIcon,
        Star as StarIcon} from '@material-ui/icons';
import { green, red, blue } from '@material-ui/core/colors';
import ErrorMessage from './ErrorMessage';
import Alert from '@material-ui/lab/Alert';

class ViewCertificates extends Component {
    constructor(){
        super();
        this.state = {
            certificates: [],
            direction: ''
        }
    }

    async componentDidMount(){
        let directionSet = 'column'
        if(this.props.row){
            directionSet = 'row'
        }else if(this.props.column){
            directionSet = 'column'
        }
        const data = await CertifyService.executeGetCertifications(this.props.userId).then(result => result.data)
        let certObjects = []
        for(let i = 0; i < data.length; i++){
			console.log("HELLO " + this.props.showFailed + " " + this.props.userId)
			if(data[i].score >= 80)
				certObjects.push(<CertItem cert={data[i]} />)
			else if(this.props.showFailed === 'true')
            	certObjects.push(<CertItem cert={data[i]} />)
        }
        this.setState({
            certificates: certObjects,
            direction: directionSet
        })
    }

    render(){
        const style = {
            List : {
                display: 'flex',
                flexDirection: this.state.direction,
                flexWrap: 'wrap'
            }
        };
        return(
			<>
			{this.state.certificates.length === 0 ?
				<Alert variant="outlined" severity='info' style={{'width':'fit-content'}}>no certifications completed</Alert> :
				<List style={style.List}>
					{this.state.certificates}
				</List>
			}
			</>
        )
    }
}

export class CertItem extends Component {
    render(){
        let responseDisplay = null
        let hoverText = ''
        if(this.props.cert.score === 100) {
            responseDisplay = (<StarIcon style={{color: blue[500]}} />)
            hoverText = 'Perfect Score'
        }else if(this.props.cert.score >= 80){
            responseDisplay = (<CheckCircleOutlineIcon style={{color: green[500]}} />)
            hoverText = 'Passed'
        }else{
            responseDisplay = (<NotInterestedIcon style={{color: red[500]}} />)
            hoverText = 'Not Passed'
        }
        return(
            <ListItem style={{width: 'fit-content'}}>
                <ListItemIcon title={hoverText}>{responseDisplay}</ListItemIcon>
                <ListItemText primary={this.props.message === undefined ? this.props.cert.certificate : this.props.message} />
            </ListItem>
        )
    }
}

export default ViewCertificates