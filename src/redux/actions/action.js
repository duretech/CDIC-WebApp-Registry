import { 
    SET_USER_DETAIL,
    GET_CHILD_DROPDOWN_OPTION,
    TOGGEL_SIDEBAR,
    GET_PAGE_RELOAD_FLAG,
    ASSIGN_VALUE,
    ALERT_COMPONENT,
    BASIC_AUTH,
    FORM_VALUES,
    REGISTRATION_RESPONSE_SAVE,
    TAB_HIDE_VALUES,
    SELECTED_TAB,
    WORKFLOW_FLAG,
    RELATIONTYPE,
    SET_LOGIN,
    SET_TRACKEDENTITYINSTANCE,
    SET_LOCATION,
    SET_LANGUAGE_LIST
} from "./actionTypes";

export const setUserDetail = data => ({
  type: SET_USER_DETAIL,
  payload: data
});

export const getChildDropdownOption = (data, currentFieldVal, locationList) => ({
  type: GET_CHILD_DROPDOWN_OPTION,
  payload: locationList, currentFieldVal, data
});

export const getPageRelaodFlag = data => ({
  type: GET_PAGE_RELOAD_FLAG,
  payload: data
});

export const setSidebarToggel = data => ({
  type: TOGGEL_SIDEBAR,
  payload: data
});

export const AssignValueValidation = data => ({
  type: ASSIGN_VALUE,
  payload: data
});

export const setBasicAuth = data => ({
  type: BASIC_AUTH,
  payload: data
});

export const AlertComponent = data => ({
  type: ALERT_COMPONENT,
  payload: data
});

export const formValues = data => ({
  type: FORM_VALUES,
  payload: data
});

export const setPostResgistrationResponse = data => ({
  type: REGISTRATION_RESPONSE_SAVE,
  payload: data
})

export const setTabHideValues = data => ({
  type: TAB_HIDE_VALUES,
  payload: data
})

export const setSelectedTabs = data => ({
  type: SELECTED_TAB,
  payload: data
})

export const WorkFlowFlag = data => ({
  type: WORKFLOW_FLAG,
  payload: data
})

export const setRelationType= data => ({
  type: RELATIONTYPE,
  payload: data
})
export const setLoginUser= data => ({
  type: SET_LOGIN,
  payload: data
})
export const setTrackedEntityInstanceAction= data => ({
  type: SET_TRACKEDENTITYINSTANCE,
  payload: data
})
export const setLocationAction= data => ({
  type: SET_LOCATION,
  payload: data
})

export const setLanguageList= data => ({
  type: SET_LANGUAGE_LIST,
  payload: data
})


