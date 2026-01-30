import React, { Component } from 'react'
import { connect } from "react-redux";
import axios from 'axios';
import { Configuration } from '../assets/data/config'
import OfflineDb from '../db'
import { decryptData, encryptData } from '../imon/encryption/AesEnc';


let apiUrl = "";
let apiSurveyUrl = "";
let configBasicAuth = ""

export const setApiUrls = () => {
  const runtime = window.RUNTIME_CONFIG || {};
  apiUrl = runtime.apiServiceKey;
  apiSurveyUrl = runtime.apiSurveyKey;
  configBasicAuth = runtime.basicAuth
};
let header = {}

let basicAuth = localStorage.getItem('basicAuth');
let decryptedAuth = null;

if (basicAuth) {
    try {
        decryptedAuth = decryptData(basicAuth);
    } catch (error) {
        console.error("Failed to decrypt basicAuth:", error);
    }
}


header = {
    'Cache-Control': 'no-cache',
     Authorization: decryptedAuth != null ? decryptedAuth : configBasicAuth,
    'Content-Security-Policy': 'self',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': "1; mode=block"
}

/*const instance = axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('BasicAuth');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
},
(error) => Promise.reject(error)
);*/


export const apiServices = {
    apiUrl,
    generateUIC,
    generateRandomNumber,
    registerCaseTEI,
    registerCaseEnrollments,
    loginApi,
    getAPI,
    getBlobAPI,
    postAPI,
    putAPI,
    getAPIFacility,
    postMultiPartFormDataAPI,
    getSurveyAPI,
    getDatasetData,
    postAPIClouinary,
    deleteFromDataStoreAPI,
    getedAPI,
    getAPIWithDomain,
    loginEncApi,
    sendTokenAPI,
    updatePasswordAPI,
    validateTokenAPI
};

function sendTokenAPI(param) {
    let subURL = `save/mfa/user/sendToken`
    let url = `${apiUrl}${subURL}`

   return axios({
        method: 'POST',
        url: `${url}`,
        headers: { Authorization: basicAuth },
        data: param
    }).then((response => {
        return response.data
    }))
}

function validateTokenAPI(param) {
    let subURL = `save/mfa/user/validate/token`
    let url = `${apiUrl}${subURL}`

   return axios({
        method: 'POST',
        url: `${url}`,
        headers: { Authorization: basicAuth },
        data: param
    }).then((response => {
        return response.data
    }))
}

function updatePasswordAPI(param) {
    let subURL = `rtmpro/subscribe/updatePassword`
    let url = `${apiUrl}${subURL}`

   return axios({
        method: 'POST',
        url: `${url}`,
        headers: { Authorization: basicAuth },
        data: param
    }).then((response => {
        return response.data
    }))
}

function generateUIC(entityID) {

    let subURL = `trackedEntityAttributes/${entityID}/generate?-`

    let url = `${apiUrl}${subURL}`

    return axios.get(url, {
        withCredentials: true,
        headers: header
    }).then((response => {


        return response.data
    }))
}

function generateRandomNumber(param) {

    let subURL = `randomnumber/generate`

    let url = `${apiUrl}${subURL}`

    return axios({
        method: 'post',
        url: `${apiUrl}${subURL}`,
        withCredentials: true,
        headers: header,
        data: param
    }).then((response => {


        return response.data
    }))
}

function registerCaseTEI(caseData) {

    let subURL = 'trackedEntityInstances'

    return axios({
        method: 'post',
        url: `${apiUrl}${subURL}`,
        headers: header,
        withCredentials: true,
        data: caseData
    })
}

function registerCaseEnrollments(caseData) {

    let subURL = 'enrollments'

    return axios({
        method: 'post',
        url: `${apiUrl}${subURL}`,
        headers: header,
        withCredentials: true,
        data: caseData
    })
}
function loginApi(param) {


    let subURL = 'me?fields=:all,attributeValues[:all,attribute[id,name,displayName]],organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user],userRoles[id,name]'

    // Old api call

    return axios({
        method: 'GET',
        url: `${apiUrl}${subURL}`,
        headers: { Authorization: param },
        // data: param
    }).then(res => {
        header = {
            'Cache-Control': 'no-cache',
            // Used only for localhost (token-based auth).
            // Production uses JSESSIONID cookie authentication.
            Authorization: param // For production deployment comment this line
        }
        return res
    })
}

function getAPIWithDomain(subURL) {

    // let tempHolder = {
    //     "type":"GET",
    //     "url":subURL,
    //     "data":null,

    // }

    // const encryptedData = encryptData(tempHolder);

    // return axios({
    //     method: 'POST',
    //     url: `${apiUrl}` + `commonencryption/decrypt`,
    //     headers: header,
    //     data: {"data":encryptedData}
    // }).then(res => {
    //     let response ={
    //         data : decryptData(res.data)
    //     } 
    //     return response
    // })
    // OLD code
    return axios({
        method: 'GET',
        url: `${apiSurveyUrl}${subURL}`,
        withCredentials: true,
        headers: header
    })
    // return instance.get(subURL)
    // .then(res => res)
    // .catch(reason => Promise.reject(reason));;
    // return axios.get(apiUrl+subURL)
    //   .then(res => res)
    //   .catch(reason => Promise.reject(reason));

}

function loginEncApi(username, password, param) {
    let subURL = 'me?fields=:all,attributeValues[:all,attribute[id,name,displayName]],organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user],userRoles[id,name]'
    let tempHolder = {
        "type": "GET",
        "url": "dhis-web-commons-security/login.action",
        "data": {
            "username": username,
            "password": password
        }
    }
    const encryptedData = encryptData(tempHolder);
    return axios({
        method: 'POST',
        url: `${apiUrl}${'commonencryption/login'}`,
        headers: { Authorization: param },
        data: { "data": encryptedData },
        withCredentials: true
    }).then(res => {
        return axios({
            method: 'get',
            url: `${apiUrl}${subURL}`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                // ...(decryptData(res.data)["JSESSIONID"] ? { 'Cookie': `JSESSIONID=${decryptData(res.data)["JSESSIONID"]}` } : {})
            }
        }).then(ress => {
            return ress
        })
    })
}
function getAPI(subURL) {

    // let tempHolder = {
    //     "type":"GET",
    //     "url":subURL,
    //     "data":null,

    // }

    // const encryptedData = encryptData(tempHolder);

    // return axios({
    //     method: 'POST',
    //     url: `${apiUrl}` + `commonencryption/decrypt`,
    //     headers: header,
    //     data: {"data":encryptedData}
    // }).then(res => {
    //     let response ={
    //         data : decryptData(res.data)
    //     } 
    //     return response
    // })
    // OLD code
    return axios({
        method: 'GET',
        url: `${apiUrl}${subURL}`,
        withCredentials: true,
        headers: header
    })
    // return instance.get(subURL)
    // .then(res => res)
    // .catch(reason => Promise.reject(reason));;
    // return axios.get(apiUrl+subURL)
    //   .then(res => res)
    //   .catch(reason => Promise.reject(reason));

}

function getedAPI(tempHolder) {

    const encryptedData = encryptData(tempHolder);
    return axios({
        method: 'POST',
        url: `${apiUrl}` + `commonencryption/getDecrypt`,
        headers: header,
        withCredentials: true,
        data: { "data": encryptedData }
    }).then(res => {
        let response = {
            data: decryptData(res.data)

        }
        // let response=decryptData(res.data)
        return response
    })


}

function getBlobAPI(subURL) {
    return axios({
        method: 'GET',
        url: `${apiUrl}${subURL}`,
        headers: header,
        withCredentials: true,
        responseType: "blob"
    })
    // return instance.get(subURL)
    // .then(res => res)
    // .catch(reason => Promise.reject(reason));;
    // return axios.get(apiUrl+subURL)
    //   .then(res => res)
    //   .catch(reason => Promise.reject(reason));

}

function getSurveyAPI(subURL) {
    return axios({
        method: 'GET',
        url: `${apiSurveyUrl}${subURL}`,
        withCredentials: true,
        headers: header
    })
    // return instance.get(subURL)
    // .then(res => res)
    // .catch(reason => Promise.reject(reason));;
    // return axios.get(apiUrl+subURL)
    //   .then(res => res)
    //   .catch(reason => Promise.reject(reason));

}

function getDatasetData(subURL) {
    return axios({
        method: 'GET',
        url: `${apiSurveyUrl}${subURL}`,
        withCredentials: true,
        headers: header
    })
}

function getAPIFacility(subURL) {

    return axios({
        method: 'GET',
        url: `${apiUrl}${subURL}`,
        withCredentials: true,
        headers: header

    })
}

function postAPI(subURL, params) {
    return axios({
        method: 'POST',
        url: `${apiUrl}${subURL}`,
        withCredentials: true,
        headers: header,
        data: params
    })
}

function deleteFromDataStoreAPI(subURL, params) {
    return axios({
        method: 'DELETE',
        url: `${apiUrl}${subURL}`,
        withCredentials: true,
        headers: header,
        data: {}
    })
}
function postAPIClouinary(subURL, params) {
    return axios({
        method: 'POST',
        url: subURL,
        withCredentials: true,
        headers: {
            'Cache-Control': 'no-cache',
            Authorization: basicAuth,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data',
            'Content-Security-Policy': 'self',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': "1; mode=block"
        },
        data: params
    })
}

function putAPI(subURL, params) {
    return axios({
        method: 'put',
        url: `${apiUrl}${subURL}`,
        withCredentials: true,
        headers: header,
        data: params
    })
}

function mapStateToProps(state) {
    const { storeState } = state;

    return { userbo: storeState.userBO }
}

function postMultiPartFormDataAPI(subURL, params) {
    return axios({
        method: 'POST',
        url: `${apiUrl}${subURL}`,
        withCredentials: true,
        //headers: {...header,...{'Content-Type': 'multipart/form-data' }},
        headers: {
            'Cache-Control': 'no-cache', 'Content-Type': 'multipart/form-data',
            'Content-Security-Policy': 'self',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': "1; mode=block"
        },
        data: params
    })
}
// export default connect(mapStateToProps, {setUserDetail, setBasicAuth})(LoginPage);