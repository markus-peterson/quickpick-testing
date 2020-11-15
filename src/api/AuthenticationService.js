import axios from 'axios'

class AutheticationService{
    registerSuccessfulLogin(username,password){
        sessionStorage.setItem('authenticatedUser',username);
        this.setupAxiosInterceptors()
    }

    logout(){
        sessionStorage.removeItem('authenticatedUser');
    }

    isUserLoggedIn(){
        let user = sessionStorage.getItem('authenticatedUser');
        if(user===null) return false
        return true
	}

    //Adds authorization Header to every request if user is logged In
    setupAxiosInterceptors(){
        let username = 'user'
        let password =  'password'

        let basicAuthHeader = 'Basic '+window.btoa(username+':'+password)

        axios.interceptors.request.use(
            (config)=> {
                if(this.isUserLoggedIn()){
                    config.headers.Authorization = basicAuthHeader
                }
                return config;
            }
        )
    }
}
export default new AutheticationService()