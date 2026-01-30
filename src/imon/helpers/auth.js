import { auth, db, storageRef, firebaseConfig } from "../service/firebase";
import firebase from "firebase/app";

export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function signInAnonymously() {
  return auth().signInAnonymously();
}

export function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  return auth().signInWithPopup(provider);
}

export function signInWithGitHub() {
  const provider = new auth.GithubAuthProvider();
  return auth().signInWithPopup(provider);
}

export function logout() {
  return auth().signOut();
}

export function logError(params) {
  console.log("inside logError", params);
  let fbRoom = localStorage.getItem('CommunityId') + "/exception";
  let error = params.error;
  let deviceinfo = {}
  let userId = localStorage.getItem("obj") ? JSON.parse(localStorage.getItem("obj")).userId : '';

  if(params.error && params.error.stack){
    error = params.error.stack;
  }
  if (window.cordova && window.device) {
    deviceinfo['manufacturer'] = window.device.manufacturer
    deviceinfo['model'] = window.device.model
    deviceinfo['platform'] = window.device.platform
    deviceinfo['serialNumber'] = window.device.uuid
    deviceinfo['version'] = window.device.version
  }
  let data = {
    userid: userId,
    component: params.component || '',
    method: params.method || '',
    error: error || '',
    manufacturer: deviceinfo.manufacturer || '',
    model: deviceinfo.model || '',
    platform: deviceinfo.platform || '',
    serialNumber: deviceinfo.serialNumber || '',
    version: deviceinfo.version || '',
    timestamp: firebase.database.ServerValue.TIMESTAMP || Date.now()
  };
  var newPostKey = db.ref().child(fbRoom).push().key;
  data.msgid = newPostKey;

  var updates = {};
  updates[fbRoom + '/' + newPostKey] = data;

  db.ref().update(updates);
}
