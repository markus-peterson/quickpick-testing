import axios from 'axios'
import output from './connections';

class getJobListService{
	state = {  
		jobTag : output + '/job/'
	}
// UNIQUE_ID  	COUNTRY  	DATE_ADDED  	HAS_EXPIRED  	JOB_BOARD  	JOB_DESCRIPTION  	JOB_SALARY  	JOB_TITLE  	JOB_TYPE  	LOCATION  	ORGANIZATION  	PAGE_URL  	SECTOR
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
}




export default new getJobListService();