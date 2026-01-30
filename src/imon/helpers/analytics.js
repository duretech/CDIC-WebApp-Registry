export function gaLogEvent(eventName, key, value) {
  try{
    eventName = eventName.split(' ').join('_');
    console.log("inside gaLogEvent ga::", eventName, key, value);
    if(window.FirebasePlugin){
      // window.FCMPlugin.logEvent(eventName, {key: value});
      window.FirebasePlugin.logEvent(eventName, {key: value});
    }
  }catch(e){
    console.log("err", e);
  }
}

export function gaLogScreen(key, value) {
  console.log("inside gaLogScreen ga::", key, value);
  if(window.FirebasePlugin){
    // window.FCMPlugin.setUserProperty(key, value)
    window.FirebasePlugin.setScreenName(key);
  }
}

