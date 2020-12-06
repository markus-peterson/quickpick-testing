import axios from 'axios'
import output from './connections';

class CertifyService{
	state = {  
		certTag : output + '/certify/'
	}

	executeGetCertifications(userId){
		const {certTag} = this.state;
        let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)

        return axios.get(certTag+'getCertifications/' + userId,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
    }
    
    executeAddCertification(certification){
		const {certTag} = this.state;
        let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)

        return axios.post(certTag+'addCertification', certification,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
    }
    
    executeCheckCertified(userId, certification){
		const {certTag} = this.state;
        let username = 'user'
		let password =  'password'
        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)

        return axios.get(certTag +`checkCertified/${userId}/${certification}`,
        {
            headers:{
                authorization: basicAuthHeader
            }
        })
	}
}

export default new CertifyService()