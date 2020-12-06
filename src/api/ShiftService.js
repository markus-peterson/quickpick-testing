import axios from 'axios'
import output from './connections';

class ShiftService{
	state = {  
		userTag : output + '/shift/'
	}

	// return all shifts in database
	getShifts(){
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(userTag+'getShifts',
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}
	
	// returns shift with given id
	getShiftById(id){
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(userTag+'getShiftById/'+id,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}
	
	// return all shifts in database
	getShiftsByUser(userId){
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(userTag+'getShiftUser/'+userId,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}

	// posts shift to application a valid application
	// if application doesn't exist, nothing will happen
	postShift(applicationId, shift) {
		console.log('POSTING ID : ' + applicationId)
		console.log('POSTING SHIFT : ' + JSON.stringify(shift))
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.post(userTag+'postShift/'+applicationId, shift,
			{
				headers:{
					authorization: basicAuthHeader,
					'Content-Type': 'application/json'
				}
			}
		)
	}

	// returns all shifts created for application
	getShiftsByApp(applicationId) {
		const {userTag} = this.state;

		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return axios.get(userTag+'getShiftApp/'+applicationId,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}

	approveShift(id){
		const {userTag} = this.state;
		let username = 'user'
		let password =  'password'
		
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
			return axios.post(userTag+'approveShift/'+id,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}

	denyShift(id){
		const {userTag} = this.state;
		let username = 'user'
		let password =  'password'
		
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
			return axios.post(userTag+'denyShift/'+id,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}
	
	updateShift(id, shift) {
		const {userTag} = this.state;
		let username = 'user'
		let password =  'password'
		
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
			return axios.post(userTag+'updateShift/'+id, shift,
			{
				headers:{
					authorization: basicAuthHeader,
					'Content-Type': 'application/json'
				}
			}
		)
	}
	
	deleteShiftById(id) {
		const {userTag} = this.state;
		let username = 'user'
		let password =  'password'
		
		let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)
			return axios.delete(userTag+'deleteShiftById/'+id,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		)
	}
}
export default new ShiftService();