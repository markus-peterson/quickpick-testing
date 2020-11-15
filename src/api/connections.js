const local  = 'http://localhost:9090';
const markus = 'https://quickpick-back.herokuapp.com';
const team   = 'https://quick-pick1.herokuapp.com';
const daniel = 'https://backend-test-quickpick.herokuapp.com';
const location = window.location.hostname;
let output;

if(location === 'quick-pick-job.herokuapp.com'){
    output = team;
}else if(location === 'quickpick-front.herokuapp.com'){
    output = markus;
}else if(location === 'frontend-test-quickpick.herokuapp.com'){
    output = daniel;
}else{
    output = local;
}


export default output;