import axios from "axios";
import { setEncryptedItem,getDecryptedItem } from '../../config/validationutils'

/**
 * dev: https://dev.nextgen.imonitorplus.com/nextgendevservice/v1.0/
 * QA: https://qa.nextgen.imonitorplus.com/qaservice/v1.0/
 * prod: https://v1.nextgen.imonitorplus.com/service/v1.0/
 * uat: https://uat.nextgen.imonitorplus.com/uatservice/v1.0/
 * const mainURL = "https://ng.imonitorplus.com/service/v1.0/";
 */

// const mainURL = "https://ng.imonitorplus.com/dpcbservice/v1.0/";
const mainURL = "https://v1.nextgen.imonitorplus.com/service/v1.0/"
if(!localStorage.getItem('ServiceUrl')){
  setEncryptedItem('ServiceUrl', mainURL);
  //localStorage.setItem('ServiceUrl', mainURL);
  //}else if(localStorage.getItem('ServiceUrl') && localStorage.getItem('ServiceUrl') != mainURL){
  }else if(getDecryptedItem('ServiceUrl') && getDecryptedItem('ServiceUrl') != mainURL){
    console.log("ServiceUrl changed!")
   // localStorage.setItem('ServiceUrl', mainURL);
   setEncryptedItem('ServiceUrl', mainURL);
    localStorage.setItem('NewServiceUrl', true);
  }

const googleplacesAPI = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";

/**
 * _1: salt
 * _2: iv
 */

let header = {
  "Content-Type": "application/json",
};

class RestServices {
  getRequest(url) {
    return axios({
      method: "get",
      url: mainURL + url,
      headers: header,
    })
      .then((response) => {
        console.log("getRequest res>>", response.status);
        return Promise.resolve(response);
      })
      .catch((error) => {
        console.log("getRequest err>>", error);
        return Promise.reject(error.message);
      });
  }
  postRequest(url, data, customheaders) {
    console.log("check online2", navigator.onLine)
    return axios({
      method: "post",
      url: mainURL + url,
      headers: Object.assign({ ...header, ...customheaders }),
      data: data,
    })
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        console.log(error);

        return Promise.reject(error.message);
      });
  }
  notiRequest(url, data, customheaders) {
    return axios({
      method: "post",
      url: url,
      headers: Object.assign({ ...header, ...customheaders }),
      data: data,
    }).then((response) => {
      return Promise.resolve(response);
    }).catch((error) => {
      console.log(error);

      return Promise.reject(error.message);
    });
  }
  putRequest(url, data, customheaders) {
    return axios({
      method: "put",
      url: mainURL + url,
      headers: Object.assign({ ...header, ...customheaders }),
      data: data,
    })
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        console.log(error);

        return Promise.reject(error.message);
      });
  }
  multiPart(url, data) {
    this.setAuth(url);
    return axios
      .post(mainURL + url, data, {
        headers: header,
      })
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        console.log(error);

        return Promise.reject(error.message);
      });
  }
  newpostRequest(url, data, customheaders) {
    return axios({
      method: "post",
      url: mainURL + url,
      headers: Object.assign({ ...header, ...customheaders }),
      data: data,
    })
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        console.log(error);
        return Promise.resolve(error);
      });
  }

  getGoogleNearme(url) {
    return axios({
      method: 'get',
      url: googleplacesAPI + url,
      headers: header
    })
      .then(response => {
        //this.hideLoader();
        console.log('getRequest res>>', response.status)
        return Promise.resolve(response);
      })
      .catch(error => {
        //this.hideLoader();
        console.log('getRequest err>>', error)
        return Promise.reject(error.message);
      })
  }

  getBotResponse(params) {
    console.log("inside service getBotResponse");
    return axios({
      method: 'post',
      url: params.url,
      data: params.text
    })
      .then(response => {
        //this.hideLoader();
        console.log('getRequest res>>', response.status)
        return Promise.resolve(response);
      })
      .catch(error => {
        //this.hideLoader();
        console.log('getRequest err>>', error)
        return Promise.reject(error.message);
      })
  }

  getDataFromUrl(params) {
    console.log("inside service getDataFromUrl");
    return axios({
      method: 'get',
      url: params.url,
      data: params.text
    })
      .then(response => {
        //this.hideLoader();
        console.log('getRequest res>>', response.status)
        return Promise.resolve(response);
      })
      .catch(error => {
        //this.hideLoader();
        console.log('getRequest err>>', error)
        return Promise.reject(error.message);
      })
  }

  crossApipostRequest(url, data, customheaders) {
    return axios({
      method: "post",
      url: url,
      headers: Object.assign({ ...header, ...customheaders }),
      data: data,
    }).then((response) => {
      return Promise.resolve(response);
    }).catch((error) => {
      console.log(error);
      return Promise.resolve(error);
    });
  }

  twilioOtpRequest(url,data){
    return axios({
      method: "post",
      url: url,
      headers:{ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + btoa('YOUR-TWILIO-API-KEY') },
      data: data,
    }).then((response) => {
      return Promise.resolve(response);
    }).catch((error) => {
      console.log(error);
      return Promise.resolve(error);
    });
  }

}

const service = new RestServices();
export default service;
