import http from "./http-common";

class FileService {

	
	uploadProfile(file, onUploadProgress) {
		let formData = new FormData();
		let user = sessionStorage.getItem('authenticatedUser');

		formData.append("file", file);
		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return http.post("/uploadProfile/"+user, formData, {
		    headers: {
			    "Content-Type": "multipart/form-data",
			    authorization: basicAuthHeader
		    },
		    onUploadProgress,
		});
    }
    
    uploadResume(file, onUploadProgress) {
		let formData = new FormData();
		let user = sessionStorage.getItem('authenticatedUser');

		formData.append("file", file);
		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)

		return http.post("/uploadResume/"+user, formData, {
		    headers: {
			    "Content-Type": "multipart/form-data",
			    authorization: basicAuthHeader
		    },
		    onUploadProgress,
		});
	}
    
    getFile(id) {
		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)
		return http.get("/load/" + id,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		);
	}

	getFileName(id){
		let usernameAuth = 'user'
		let passwordAuth =  'password'
		let basicAuthHeader = 'Basic '+window.btoa(usernameAuth+':'+passwordAuth)
		return http.get("/getFileName/" + id,
			{
				headers:{
					authorization: basicAuthHeader
				}
			}
		);
	}
}

export default new FileService();
