import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import FacebookLogin from 'react-facebook-login';
import AutheticationService from '../api/AuthenticationService.js'
import UserService from '../api/UserService';

export default class Facebook extends Component {
    constructor(props){
		super(props)
        this.state = {
            isLoggedIn :false,
            userID:'',
            name:'',
            email:'',
            picture:'',
            lastName:'',
			address: "",
			emailId: '',
			password: ''
        }
        this.saveUserinDB= this.saveUserinDB.bind(this);


    }
    responseFacebook = response=>{
        // console.log(response);
        
        this.setState({
            isLoggedIn:true,
            userID:response.userID,
            name: response.name,
            email:response.email,
            picture:response.picture.data.url

        })
        console.log('inside Login')
        console.log(this.state)
        AutheticationService.registerSuccessfulLogin(this.state.email,'')
        
        // Make one call to save the details in db 
        this.saveUserinDB();
    };

    async saveUserinDB(){
        const user = {
			username:this.state.email,
			firstName: this.state.name,
            emailId: this.state.email,
			lastName: this.state.lastName,
			address: this.state.address,
			password: this.state.password
		};
     
        console.log(user)

        await UserService.executePostUserRegisterService(user)
		.then(response=>this.handleSuccessResponse(response))
		.catch(error => this.handleError(error))
    }

    handleSuccessResponse(response){
		console.log(response)
		if (response.status === 200) {
			this.setState({
				errorMessage: ''
			})
            console.log('Register Successful')
            this.props.history.push(`/`)
		}
	}

	handleError(error){
        console.log("Register Failed")
        console.log(error)
		
	}

    componentClicked = () => console.log("clicked");

    render() {
        let fbContent;

        if(this.state.isLoggedIn){
            fbContent=null
            
        }else{
            fbContent=( <FacebookLogin
                appId="655570701797698"
                autoLoad={false}//true
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />
              );
        }

        return (
            <div>
                {fbContent}
            </div>
        )
    }
}
