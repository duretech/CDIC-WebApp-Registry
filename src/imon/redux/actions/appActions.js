import * as actionType from "./actionTypes";

export const setCommunityId = (data) => ({
  type: actionType.SET_COMMUNITY_ID,
  payload: data,
});


export const settemplateID = (data) => ({
  type: actionType.SET_TEMPLATE_ID,
  payload: data,
});

export const setUserDetail = (data) => ({
  type: actionType.SET_USER_DETAIL,
  payload: data,
});

export const setFirebaseUserDetail = (data) => ({
  type: actionType.SET_FIREBASE_USER_DETAIL,
  payload: data,
});

export const getCommunityID = (data) => ({
  type: actionType.GET_COMMUNITY_ID,
  payload: data,
});


export const setcomponentbgcolor = (data) => ({
  type: actionType.SET_COMPBG_COLOR,
  payload: data,
});

export const setLangID = (data) => ({
  type: actionType.SET_LANG_ID,
  payload: data,
});

export const setNotiCounter = (data) => ({
  type: actionType.SET_NOTI_COUNTER,
  payload: data,
});

export const setappVersion = (data) => ({
  type: actionType.SET_APP_VERSION,
  payload: data,
});

export const setnotiObj = (data) => ({
  type: actionType.SET_NOTI_OBJ,
  payload: data,
});
export const setForeGroundNoti = (data) => ({
  type: actionType.SET_FORE_GROUND_NOTI,
  payload: data,
});

export const setRegionStateValue = (data) => ({
  type: actionType.SET_REGION_STATE_VALUE,
  payload: data,
});

export const setFacilityStateValue = (data) => ({
  type: actionType.SET_FACILITY_STATE_VALUE,
  payload: data,
});


export const setOnboardPernt = (data) => ({
  type: actionType.SET_ONBOARD_PERNT,
  payload: data,
});

export const setChatType = (data) => ({
  type: actionType.SET_CHAT_TYPE,
  payload: data,
});

export const setSelectedComponentObject = (data) => ({
  type: actionType.SET_SELECTED_COMPONENT_OBJECT,
  payload: data,
});

export const setBottomNavComponentObject = (data) => ({
  type: actionType.SET_BOTTOM_NAV_COMPONENT_OBJECT,
  payload: data,
});

export const partialSetSelectedComponentObject = (data) => ({
  type: actionType.PARTIAL_SET_SELECTED_COMPONENT_OBJECT,
  payload: data,
});

export const resetSelectedCompnentObject = (data) => ({
  type: actionType.RESET_SELECTED_COMPONENT_OBJECT,
});

export const setactiveTabObj = (data) => ({
  type: actionType.SET_ACTIVE_TAB,
  payload: data,
});

export const setorgUnitID = (data) => ({
  type: actionType.SET_ORG_ID,
  payload: data,
});