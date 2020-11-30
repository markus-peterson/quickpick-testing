import axios from 'axios';
import output from './connections';

export default axios.create({
	baseURL: output,
	headers: {
		"Content-type": "application/json"
	}
});