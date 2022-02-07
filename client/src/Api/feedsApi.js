import axios from 'axios';

let baseURL = 'http://localhost:8080/api';

if (process.env.NODE_ENV === 'production') {
	baseURL = 'api';
}

console.log(process.env.NODE_ENV);

export default axios.create({
	baseURL,
});
