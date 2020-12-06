import axios from 'axios'
import output from './connections';

class getJobListService{
	state = {  
		jobTag : output + '/job/'
	}

    executeGetJob(jobId){
		const {jobTag} = this.state;
		
        let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

	   return axios.get(`${jobTag}getJob/${jobId}`,{
		   headers:{
			   authorization: basicAuthHeader
		   }
	   })
    }

	executeGetJobListService() {
		const {jobTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(jobTag+'getAllJobs',
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}

	executePostJobService(job){
		const {jobTag} = this.state;

        let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		
        return axios.post(jobTag+'createJob', job,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
	}

	executeCheckByAuthor(){
		const {jobTag} = this.state;
        let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		let currentUserId = sessionStorage.getItem('authenticatedUserId');

        return axios.get(jobTag+'checkByAuthor/' + currentUserId,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
	}

	executeGetByAuthor(userId){
		const {jobTag} = this.state;
        let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		let currentUserId = userId === '' ? sessionStorage.getItem('authenticatedUserId'): userId

        return axios.get(jobTag+'getByAuthor/' + currentUserId,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
	}

	executeUpdateJobService(job){
		const {jobTag} = this.state;

        let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		
        return axios.post(jobTag+'updateJob', job,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
	}

	executeGetSearch(param) {
		const {jobTag} = this.state;
        let username = 'user'
        let password = 'password'
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
		return axios.get(jobTag+'getJobsByFilter', 
		{	
			params : param,
			headers:{
				authorization: basicAuthHeader
			}
		})
    }
	
	executeDeleteJob(jobId){
		const {jobTag} = this.state;
		
		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.delete(`${jobTag}deleteJob/${jobId}`,
		{
			headers:{
				authorization: basicAuthHeader
			}
		})
	}
}

export default new getJobListService();