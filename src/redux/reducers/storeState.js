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
} from "../actions/actionTypes";

import _ from 'lodash'; 

import {OUMapping} from '../../assets/data/registerOU'

const initialState = {
  userBO: {},
  childOptions: [],
  childId: null,
  isSidebarOpen: false,
  reloadRegisterPage: false,
  registerInitialValue: {},
  hideAlert: false,
  basicAuth: '',
  formValues: {},
  tabHideValues: {},
  selectedTab: 0,
  workFlowFlag: false,
  postResgistrationResponse: {
    //trackedEntityInstance: "EafuaV45SI9", enrollmentId: "", showStage: true
  // 'enrollmentId': "",
  // 'showStage': true,
  // 'trackedEntityInstance': "n3quXfP4FyR"
}, //trackedEntityInstance: "lFGk9pXJgVR", enrollmentId: ""
  relationTypeId: '',
  isLoggedIn:false,
  selectTrackedEnityInstanceId:null,
  selectLocation:null,
  languagelist: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DETAIL: {
      return {
        ...state,
        userBO: action.payload
      };
    }
    case GET_CHILD_DROPDOWN_OPTION: {

      

      let returnData = state.childOptions    //.concat({'id': action.payload})
      
      const filterOptionList = state.childOptions.filter(obj => obj.parentId == action.currentFieldVal.id)
      

      if(filterOptionList.length > 0) {
        returnData = state.childOptions.filter(obj => obj.parentId != action.currentFieldVal.id)
        returnData.push(action.payload)
      } else {
        returnData.push(action.payload)
      }

      
      
      
      return {
        ...state,
        childOptions: returnData
        
        };
    }
    case TOGGEL_SIDEBAR: {
      return{
        ...state,
        isSidebarOpen: action.payload
      }
    }
    case GET_PAGE_RELOAD_FLAG: {
      
      return{
        ...state,
        reloadRegisterPage: action.payload
      }
    }

    case ASSIGN_VALUE : {
      
      return {
        ...state,
        registerInitialValue: action.payload
      }
    }

    case ALERT_COMPONENT : {
      
      return {
        ...state,
        hideAlert: action.payload
      }
    }

    case BASIC_AUTH : {
      
      return {
        ...state,
        basicAuth: action.payload
      }
    }

    case FORM_VALUES : {
      
      let returnData =  Object.assign({}, state.formValues)

      let generateKeysArray = action.payload != null || action.payload != undefined ? Object.keys(action.payload) : []

      generateKeysArray.map(key => {
        returnData[key] = action.payload[key]
      })

      // const newVal = Object.assign({}, state.formValues, state.tabHideValues)
     

      

      if(action.payload['status'] !=undefined && action.payload['status'] == "emptyValues") {
        returnData = {}
      } 
      
      return {
        ...state,
        formValues: returnData
      }
    }

    case TAB_HIDE_VALUES : {
      
      let returnData =  Object.assign({}, state.tabHideValues)

      let generateKeysArray = action.payload != null || action.payload != undefined ? Object.keys(action.payload) : []

      generateKeysArray.map(key => {
        returnData[key] = action.payload[key]
      })

      if(action.payload['status'] !=undefined && action.payload['status'] == "emptyValues") {
        returnData = {}
      } 
      return {
        ...state,
        tabHideValues: returnData,
        // formValues: returnData
      }
    }
    
    case REGISTRATION_RESPONSE_SAVE : {
      
      return {
        ...state,
        // postResgistrationResponse: {
        //   'trackedEntityInstance': 'BftushHMP1M',
        //   'enrollmentId': 'MYwsuHJdzuk'
        // }
        postResgistrationResponse: action.payload
      }
    }

    case SELECTED_TAB : {
      
      return {
        ...state,
        
        selectedTab: action.payload
      }
    }

    case WORKFLOW_FLAG : {      
      return {
        ...state,        
        workFlowFlag: action.payload
      }
    }

    case RELATIONTYPE : {      
      return {
        ...state,        
        relationTypeId: action.payload
      }
    }
    case SET_LOGIN : {      
      return {
        ...state,        
        isLoggedIn: action.payload
      }
    }
    case SET_TRACKEDENTITYINSTANCE : {      
      return {
        ...state,        
        selectTrackedEnityInstanceId: action.payload
      }
    }
    //selectLocation
    case SET_LOCATION : {      
      return {
        ...state,        
        selectLocation: action.payload
      }
    }
    case SET_LANGUAGE_LIST: {
      return {
        ...state,
        languagelist: action.payload,
      };
    }
    default:
      return state;
  }
}
