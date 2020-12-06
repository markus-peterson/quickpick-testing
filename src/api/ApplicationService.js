import axios from 'axios'
import output from './connections';

class ApplicationService{
	state = {  
		appsTag : output + '/apps/'
    }
    executeApplication(application){
		const {appsTag} = this.state;
		let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		return axios.post(appsTag+'apply', application,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
    }

    getApplication(id){
		const {appsTag} = this.state;
        let username = 'user'
		let password = 'password'
        let basicAuthHeader = 'Basic '+ window.btoa(username+':'+password)
		return axios.get(appsTag+'getApplication/'+ id, {
				headers:{
					authorization: basicAuthHeader
				}
			}
        )
	}
	
    getAllApplied(){
		const {appsTag} = this.state;
        let username = 'user'
		let password = 'password'
		let currentUserId = sessionStorage.getItem('authenticatedUserId');
        let basicAuthHeader = 'Basic '+ window.btoa(username+':'+password)
		return axios.get(appsTag+'userApplications/'+ currentUserId, {
				headers:{
					authorization: basicAuthHeader
				}
			}
        )
    }
    
    getAllApplicants(jobId){
		const {appsTag} = this.state;
        let username = 'user'
		let password = 'password'
        let basicAuthHeader = 'Basic '+ window.btoa(username+':'+password)
		return axios.get(appsTag+'jobApplicants/'+ jobId, {
				headers:{
					authorization: basicAuthHeader
				}
			}
        )
	}
    
    checkApplied(application){
        const {appsTag} = this.state;
		let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		return axios.post(appsTag +'checkIfApplied', application,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
    }

    acceptApplication(ids){
        const {appsTag} = this.state;
		let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		return axios.post(appsTag +'acceptApp/', ids,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
    }

    denyApplication(ids){
        const {appsTag} = this.state;
		let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		return axios.post(appsTag +'denyApp/', ids,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
    }
	
	deleteApplication(id){
		const {appsTag} = this.state;
		
		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.delete(`${appsTag}deleteApplicationById/${id}`,{
			headers:{
				authorization: basicAuthHeader
			}
		})
	}
}

export default new ApplicationService();