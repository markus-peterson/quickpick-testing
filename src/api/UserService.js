import axios from 'axios'
import output from './connections';

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
	
	updateUser(id, user) {
		const {userTag} = this.state;
        let username = 'user'
		let password = 'password'
		let currentUsername = sessionStorage.getItem('authenticatedUser');
        console.log("UPDATING INFO : " + currentUsername)
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
        return axios.post(userTag+'updateUser/'+ id, user, {
				headers:{
					authorization: basicAuthHeader
				}
			}
        )
	}

}
export default new getUsersListService();
