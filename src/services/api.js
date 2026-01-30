import axios from 'axios';

import { Configuration } from '../assets/data/config'
const apiUrl = Configuration.apiService.key;

const instance = axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'}
});

instance.interceptors.request.use(function (request) {
    let token =  localStorage.getItem('BasicAuth');
    if(token){
        request.headers.authorization = token;
    }
    return request;
}, function (error, response) {
    //showAlert();
    return Promise.reject(error);
});

/*instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let { response } = error;
    if (!response.data.error) {
        return Promise.resolve(response);
    } else {
        showAlert();
        return Promise.reject(error);
    }
});*/

export default instance;