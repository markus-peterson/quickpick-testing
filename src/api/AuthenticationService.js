import axios from 'axios'

class AutheticationService{
    registerSuccessfulLogin(user){
        sessionStorage.setItem('authenticatedUser',user.username);
        sessionStorage.setItem('authenticatedUserId',user.id);
        this.setupAxiosInterceptors()
    }

    updateUsername(username){
        sessionStorage.setItem('authenticatedUser',username);
    }

    logout(){
        sessionStorage.removeItem('authenticatedUser');
        sessionStorage.removeItem('authenticatedUserId');
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