import React from 'react';
import ErrorMessage from './ErrorMessage';

function ErrorComponent(){
	return (
		<div style={{marginTop : '20px'}}>
			<div className="profile-background-container"/>
			<ErrorMessage text="Please Enter Valid URL"/>
		</div>
	)
    // return <div>Error Occured!! Please Enter the Valid URl!!!</div>
}

export default ErrorComponent
