import * as actionType from "../actions/actionTypes";


function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var mypram = getParameterByName('comunityId')

const DEFAULT_CHAT_TYPE = 'group';//group

//f4399405dc48e9bf94bd06b3f06bbe2f
//fd866ce811211f72cc6fdaf074c5ca01
//88d06ddd6bd6728cc4a8cef0ef69b028
//85f1e7f4a11d62d1dc8179d40efa73e0
// const communityid = mypram ? mypram :'04f3a1d75961dc94d6cf2a32744aacc9'; //voice plus

//const communityid = '3a3c69c8c7006b8c670e6fcd06df2d57';
//const communityid = mypram ? mypram : '' //test community
// const communityid = mypram ? mypram : '6664290824508fa495cb0d962e625546' //test community
const communityid = mypram ? mypram : '38ac8718edc2806928aa643b7a59903f'//'1602eb0d0662c0297ed5f156ec349953' //generic
if(!localStorage.getItem('CommunityId')){
localStorage.setItem('CommunityId', communityid);
}else if(localStorage.getItem('CommunityId') && localStorage.getItem('CommunityId') != communityid){
  console.log("community id changed!")
  localStorage.setItem('CommunityId', communityid);
  localStorage.setItem('NewCommunityId', true);
}

//const communityid = mypram ? mypram : 'd4904bc7a56e0dfc285d8fd19b31d062' //tes product
// const communityid = mypram ? mypram : 'a18be8e1cb3c2db51998a1fecee96dc1' //product


const initialState = {
  templateID: 1,
  appVersion: '0.0.0',
  notiObj: '',
  userDetail: {
    userId: "",
    userName: "",
  },
  fbuserObj: {},
  communityId: localStorage.getItem('CommunityId') || communityid,
  langId: localStorage.getItem('langId') || 1,
  onBoardPer: 0,
  chatConfig: {
    chatType: DEFAULT_CHAT_TYPE,
    chatGroup: [
      { id: "group_1", title: "Peer Support Network", icon: 1 },
      { id: "group_2", title: "National TB Community Network", icon: 2 },
      { id: "group_3", title: "Human Rights discussion group", icon: 3 },
    ],
  },
  activeTabObj: {},
  componentObj: {},
  bottomComponentObj: {},
  componentbgcolor: localStorage.getItem('componentbgcolor')|| "#009596",
  notiCounter: localStorage.getItem('notiCounter')|| 0,
  RegionStateValue: null,
  FacilityStateValue: [],
  orgUnitId:""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_COMMUNITY_ID:
      return {
        ...state,
        communityId: action.payload,
      };
      case actionType.SET_TEMPLATE_ID: 
        return {
          ...state,
          templateID: action.payload,
        };
    case actionType.SET_USER_DETAIL:
      return {
        ...state,
        userBO: action.payload,
      };
    case actionType.SET_FIREBASE_USER_DETAIL:
      return {
        ...state,
        fbuserObj: action.payload,
      }
    case actionType.SET_COMPBG_COLOR:
      return {
        ...state,
        componentbgcolor: action.payload,
      };
    case actionType.GET_COMMUNITY_ID:
      return {
        ...state,
      };
    case actionType.SET_APP_VERSION:
      return {
        ...state,
        appVersion: action.payload,
      };
      case actionType.SET_NOTI_OBJ:
        return {
          ...state,
          notiObj: action.payload,
        };
    case actionType.SET_FORE_GROUND_NOTI:
      return {
        ...state,
        foreGroundNotification: action.payload,
      };
    case actionType.SET_REGION_STATE_VALUE:
      return {
        ...state,
        RegionStateValue: action.payload,
      };
    case actionType.SET_FACILITY_STATE_VALUE:
      return {
        ...state,
        FacilityStateValue: action.payload,
      };
    case actionType.SET_LANG_ID:
      return {
        ...state,
        langId: action.payload,
      };
    case actionType.SET_ONBOARD_PERNT:
      return {
        ...state,
        onBoardPer: action.payload,
      };
    case actionType.SET_CHAT_TYPE:
      return {
        ...state,
        chatConfig: {
          ...state.chatConfig,
          chatType: action.payload
        }
      };
    case actionType.SET_SELECTED_COMPONENT_OBJECT:
      let prev = state.componentObj.new;
      return {
        ...state,
        componentObj: {
          new: action.payload,
          prev: prev
        },
      };
    case actionType.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTabObj: action.payload
      };
    case actionType.SET_BOTTOM_NAV_COMPONENT_OBJECT:
      return {
        ...state,
        bottomComponentObj: action.payload,
      };
    case actionType.PARTIAL_SET_SELECTED_COMPONENT_OBJECT:
      return {
        ...state,
        componentObj: {
          new: action.payload,
          prev: {}
        },
      };
    case actionType.RESET_SELECTED_COMPONENT_OBJECT:
      return {
        ...state,
        componentObj: {},
      };
      case actionType.SET_NOTI_COUNTER:
        return {
          ...state,
          notiCounter: action.payload,
        };
        case actionType.SET_ORG_ID: 
        return {
          ...state,
          orgUnitId: action.payload,
        };
    default:
      return state;
  }
};
