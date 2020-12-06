import axios from 'axios'
import output from './connections';
import AuthenticationService from './AuthenticationService';

class getUsersListService{
	state = {  
		userTag : output + '/user/'
	}

    executeGetUserListService(){
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(userTag+'getUsers',
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}

	executeCheckRegisteredExternal(emailId) {
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(userTag+'checkEmail/'+emailId,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}

	executeGetUserService(username) {
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(userTag+'getUser/'+username,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}
   
    executePostUserRegisterService(user){
		const {userTag} = this.state;
        let username = 'user'
		let password =  'password'
		
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
        return axios.post(userTag+'register',user,
        {
            headers:{
                authorization: basicAuthHeader,
				'Content-Type': 'application/json'
            }
        }
        )
    }

    registerLogin(user) {
		const {userTag} = this.state;
        let username = 'user'
        let password = 'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
        return axios.post(userTag+'login', user , {
				headers:{
					authorization: basicAuthHeader
				}
			}
        )
    }
	
	async updateUser(id, user) {
		const {userTag} = this.state;
		let username = 'user'
		let password = 'password'
		// let currentUsername = sessionStorage.getItem('authenticatedUser');
		if(user.username.length <= 0)
			user.username = sessionStorage.getItem('authenticatedUser');
		let exist = await this.userExists(user.username);
		if(!exist)
			AuthenticationService.updateUsername(user.username);
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password);
		return axios.post(userTag+'updateUser/'+ id, user, {
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}

	async userExists(username) {
		const {userTag} = this.state;
		let usernameAuth = 'user'
		let passwordAuth = 'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)
		let result = 'new';
		await axios.get(userTag+'checkUsername/'+username, {headers:{authorization: basicAuthHeader}}).then(val => result = val.data);
		console.log("EXISTS? " + result);
		return result === 'registered';
	}

	ForgetPassword(param) {
		const {userTag} = this.state;
        let username = 'user'
        let password = 'password'
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		return axios.get(userTag+'forgotpassword', 
		{	
			params : param,
			headers:{
				authorization: basicAuthHeader
			}
		}
		)
	}
	
	ResetPassword(param) {
		const {userTag} = this.state;
        let username = 'user'
        let password = 'password'
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		return axios.get(userTag+'reset', 
		{	
			params : param,
			headers:{
				authorization: basicAuthHeader
			}
		}
		)
    }
}
export default new getUsersListService();