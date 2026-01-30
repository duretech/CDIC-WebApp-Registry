import service from "./service";
import * as URL from "./url";
import AesUtil from "../encryption/AESUtil";
import swal from "sweetalert";
import { db, storageRef, firebaseConfig } from "../service/firebase";
import { logError } from "../helpers/auth";

var aesUtil = new AesUtil(256, 1000);

class DataServices {
  getLangList(params) {
    console.log("check online", navigator.onLine)
    let url = `${URL.getCommunityWiseLanguages}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getLangList err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getLangList',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  getCommunityList(params) {
    let url = `${URL.getCommunityList}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCommunityList err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCommunityList',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCommunitySectionLinking(params) {
    let url = `${URL.getCommunitySectionLinking}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCommunitySectionLinking err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCommunitySectionLinking',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCommunityBrandingByCommunityId(params) {
    let url = `${URL.getCommunityBrandingByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCommunityBrandingByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCommunityBrandingByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCommunitywiseLabels(params) {
    let url = `${URL.communitywiseLabels}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCommunitywiseLabels err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCommunitywiseLabels',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getsetupDetails(params) {
    let url = `${URL.setupDetails}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getsetupDetails err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getsetupDetails',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getRegistrationQuestions(params) {
    let url = `${URL.getRegistrationQuestions}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getRegistrationQuestions err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getRegistrationQuestions',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getComponentList(params) {
    let url = `${URL.getRoleDetails}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getComponentList err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getComponentList',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getApplicantList(params) {
    let url = `${URL.getApplicantByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getApplicantList err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getApplicantList',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  searchUserByName(params) {
    let url = `${URL.searchUserByName}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("searchUserByName err>>", err);
        var errorObj = {
          component: 'API',
          method: 'searchUserByName',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  setUserAppVersion(params) {
    let url = `${URL.setUserAppVersion}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("setUserAppVersion err>>", err);
        var errorObj = {
          component: 'API',
          method: 'setUserAppVersion',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  getUserAppVersion(params) {
    let url = `${URL.getUserAppVersion}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getUserAppVersion err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getUserAppVersion',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  addChatHistoryUsingUserId(params) {
    let url = `${URL.addChatHistoryUsingUserId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("addChatHistoryUsingUserId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'addChatHistoryUsingUserId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  addChatHistoryOnGroupUsingUserId(params) {
    let url = `${URL.addChatHistoryOnGroupUsingUserId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("addChatHistoryOnGroupUsingUserId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'addChatHistoryOnGroupUsingUserId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  updateChatHistoryOnGroupUsingUserId(params) {
    let url = `${URL.updateChatHistoryOnGroupUsingUserId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("updateChatHistoryOnGroupUsingUserId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'updateChatHistoryOnGroupUsingUserId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getForumGroupMsgCountForUserByCommunityId(params) {
    let url = `${URL.getForumGroupMsgCountForUserByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getForumGroupMsgCountForUserByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getForumGroupMsgCountForUserByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getForumChatGroupByCommunityId(params) {
    console.log("getForumChatGroupByCommunityId", params);
    let url = `${URL.getForumChatGroupByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getForumChatGroupByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getForumChatGroupByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  externalLogin(params) {
    console.log("externalLogin", params);
    let url = `${URL.externalLogin}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("externalLogin err>>", err);
        var errorObj = {
          component: 'API',
          method: 'externalLogin',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  checkIfForumchatIsApproved(params) {
    let url = `${URL.checkIfForumchatIsApproved}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("checkIfForumchatIsApproved err>>", err);
        var errorObj = {
          component: 'API',
          method: 'checkIfForumchatIsApproved',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getListApplicantForChatApproval(params) {
    let url = `${URL.getListApplicantForChatApproval}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getListApplicantForChatApproval err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getListApplicantForChatApproval',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  approveApplicantForForumChat(params) {
    let url = `${URL.approveApplicantForForumChat}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("approveApplicantForForumChat err>>", err);
        var errorObj = {
          component: 'API',
          method: 'approveApplicantForForumChat',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getallnearme(params) {
    let url = `${URL.getallnearme}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getallnearme err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getallnearme',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  saveupdatenearmerating(params) {
    let url = `${URL.saveupdatenearmerating}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("saveupdatenearmerating err>>", err);
        var errorObj = {
          component: 'API',
          method: 'saveupdatenearmerating',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getNearMeTypes(params) {
    let url = `${URL.getNearMeTypes}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getNearMeTypes err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getNearMeTypes',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getStateListForNearmeByCommunityId(params) {
    let url = `${URL.getStateListForNearmeByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getStateListForNearmeByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getStateListForNearmeByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  addApplicant(params) {
    console.log("addApplicant", params)
    let url = `${URL.addApplicant}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("masterLanguageList err>>", err);
        var errorObj = {
          component: 'API',
          method: 'addApplicant',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  checkIfApplicantExists(params) {
    let url = `${URL.checkIfApplicantExists}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        var errorObj = {
          component: 'API',
          method: 'checkIfApplicantExists',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  updateApplicant(params) {
    console.log("updateApplicant", params)
    let url = `${URL.updateUserProfile}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("updateApplicant err>>", err);
        var errorObj = {
          component: 'API',
          method: 'updateApplicant',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  updateFcmId(params) {
    console.log("params", params);
    let url = `${URL.updatefcmIdForUserUsingPOST}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("updateFcmId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'updateFcmId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getVoicBotStatus(params) {
    let url = `${URL.getVoicBotStatus}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getVoicBotStatus err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getVoicBotStatus',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getPhrasesForVoiceBot(params) {
    let url = `${URL.getPhrasesForVoiceBot}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getPhrasesForVoiceBot err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getPhrasesForVoiceBot',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getEmergencyContacts(params) {
    let url = `${URL.getEmergencyContacts}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getEmergencyContacts err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getEmergencyContacts',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  saveEmergencyContacts(params) {
    let url = `${URL.saveEmergencyContacts}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("saveEmergencyContacts err>>", err);
        var errorObj = {
          component: 'API',
          method: 'saveEmergencyContacts',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getTriggerWordsForVoiceBot(params) {
    let url = `${URL.getTriggerWordsForVoiceBot}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getTriggerWordsForVoiceBot err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getTriggerWordsForVoiceBot',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getUserProfile(params) {
    let url = `${URL.getUserProfile}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getUserProfile err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getUserProfile',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  searchnearme(params) {
    let url = `${URL.searchnearme}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
      url,
      encryptParamWIthHeader.encryptParam,
      encryptParamWIthHeader.headers
    )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        var errorObj = {
          component: 'API',
          method: 'searchnearme',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }
  getNearmeByName(params) {
    let url = `${URL.getNearmeByName}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        var errorObj = {
          component: 'API',
          method: 'getNearmeByName',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  getContentLikeDataByUserId(params) {
    let url = `${URL.getContentLikeDataByUserId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        return Promise.resolve(err);
      });
  }

  getRegionListForNearmeByCommunityId(params) {
    let url = `${URL.getRegionListForNearmeByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        var errorObj = {
          component: 'API',
          method: 'getRegionListForNearmeByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  getNearmeByCommunityId(params) {
    let url = `${URL.getNearmeByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        var errorObj = {
          component: 'API',
          method: 'getNearmeByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  getStaticContent(params) {
    let url = `${URL.getStaticContent}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getStaticContent err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getStaticContent',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getComponentWiseRoleDetails(params) {
    let url = `${URL.getComponentWiseRoleDetails}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getComponentWiseRoleDetails err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getComponentWiseRoleDetails',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  ChangeCaseStatusForService(params) {
    let url = `${URL.ChangeCaseStatusForService}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .putRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("ChangeCaseStatusForService err>>", err);
        var errorObj = {
          component: 'API',
          method: 'ChangeCaseStatusForService',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCaseDetailsForService(params) {
    let url = `${URL.getCaseDetailsForService}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCaseDetailsForService err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCaseDetailsForService',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getRoleWiseContent(params) {
    let url = `${URL.getRoleWiseContent}`;
    console.log("getRoleWiseContent", params);
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getRoleWiseContent err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getRoleWiseContent',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  likeContent(params) {
    let url = `${URL.likeContent}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("likeContent err>>", err);
        var errorObj = {
          component: 'API',
          method: 'likeContent',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  unlikeContent(params) {
    let url = `${URL.unlikeContent}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("unlikeContent err>>", err);
        var errorObj = {
          component: 'API',
          method: 'unlikeContent',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  addCommentToContent(params) {
    let url = `${URL.addCommentToContent}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("addCommentToContent err>>", err);
        var errorObj = {
          component: 'API',
          method: 'addCommentToContent',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getContentWiseComments(params) {
    let url = `${URL.getContentWiseComments}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getContentWiseComments err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getContentWiseComments',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getContentHierearchy(params) {
    let url = `${URL.getContentHierearchy}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getContentHierearchy err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getContentHierearchy',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getServiceByCommunityId(params) {
    let url = `${URL.getServiceByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getServiceByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getServiceByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getQuestionsByServiceId(params) {
    let url = `${URL.getQuestionsByServiceId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getQuestionsByServiceId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getQuestionsByServiceId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getGoogleNearme(params) {
    let url = "&key=" + params.apiKey + "&location=" + params.lat + "," + params.lng + "&radius=" + params.radius +  "&pagetoken=" + params.pagetoken + "&type=" + params.keywords;
    return service.getGoogleNearme(url, params).then(res => {
      return Promise.resolve(res);
    }).catch(err => {
      console.log('getGoogleNearme err>>', err)
      var errorObj = {
        component: 'API',
        method: 'getGoogleNearme',
        error: err
      }
      logError(errorObj);
      return Promise.reject(err);
    })
  }

  addCaseForService(params) {
    let url = `${URL.addCaseForService}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("addCaseForService err>>", err);
        var errorObj = {
          component: 'API',
          method: 'addCaseForService',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCaseListForService(params) {
    let url = `${URL.getCaseListForService}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCaseListForService err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCaseListForService',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getMasterCaseStatusList(params) {
    let url = `${URL.getMasterCaseStatusList}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getMasterCaseStatusList err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getMasterCaseStatusList',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getSurveyByCommunityId(params) {
    let url = `${URL.getSurveyByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getSurveyByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getSurveyByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getSectionBySurveyId(params) {
    let url = `${URL.getSectionBySurveyId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getSectionBySurveyId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getSectionBySurveyId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  getMultipleSectionsBySurveyId(params) {
    let url = `${URL.getMultipleSectionsWithQueResponseBySurveyId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getMultipleSectionsBySurveyId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getMultipleSectionsBySurveyId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getSurveySectionQuestionsBySectionId(params) {
    let url = `${URL.getSurveySectionQuestionsBySectionId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getSurveySectionQuestionsBySectionId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getSurveySectionQuestionsBySectionId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getQuestionsBySurveyId(params) {
    let url = `${URL.getQuestionsBySurveyId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getQuestionsBySurveyId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getQuestionsBySurveyId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  addCaseSetForSurveyUsingPOST(params) {
    let url = `${URL.addCaseSetForSurveyUsingPOST}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("masterLanguageList err>>", err);
        var errorObj = {
          component: 'API',
          method: 'addCaseSetForSurveyUsingPOST',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  addCaseSetForSurveyWithMultipleSections(params) {
    let url = `${URL.addCaseSetForSurveyWithMultipleSections}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("addCaseSetForSurveyWithMultipleSections err>>", err);
        var errorObj = {
          component: 'API',
          method: 'addCaseSetForSurveyWithMultipleSections',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCaseSetForSurveyByUserId(params) {
    let url = `${URL.getCaseSetForSurveyByUserId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCaseSetForSurveyByUserId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCaseSetForSurveyByUserId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCaseSetSurveyDetails(params) {
    let url = `${URL.getCaseSetSurveyDetails}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCaseSetSurveyDetails err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCaseSetSurveyDetails',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  dashboardLogin(params) {
    let url = `${URL.dashboardLogin}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        swal({
          title: "Username or password is incorrect",
          icon: "warning",
          button: "Ok",
        })
        console.log("dashboardLogin err>>", err);
        var errorObj = {
          component: 'API',
          method: 'dashboardLogin',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  getAppVersion(params) {
    let url = `${URL.getAppVersion}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getAppVersion err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getAppVersion',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getUserListByHealthWorkerUserId(params){
    let url = `${URL.getUserListByHealthWorkerId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getUserListByHealthWorkerUserId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getUserListByHealthWorkerUserId',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  getPatientByUserId(params){
    let url = `${URL.getPatientByUserId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getPatientByUserId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getPatientByUserId',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  getAvatarByCommunityId(params) {
    let url = `${URL.getAvatarByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getAvatarByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getAvatarByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  getCaseDetailsForService(params) {
    let url = `${URL.getCaseDetailsForService}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCaseDetailsForService err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCaseDetailsForService',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }
  inactiveUser(params) {
    let url = `${URL.inactiveUser}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
      url,
      encryptParamWIthHeader.encryptParam,
      encryptParamWIthHeader.headers
    )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("inactiveUser err>>", err);
        var errorObj = {
          component: 'API',
          method: 'inactiveUser',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }
  getTemplatesByCommunityId(params) {
    let url = `${URL.getTemplatesByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
      url,
      encryptParamWIthHeader.encryptParam,
      encryptParamWIthHeader.headers
    )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getTemplatesByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getTemplatesByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  contentListByCommunityId(params) {
    let url = `${URL.contentListByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service.newpostRequest(
      url,
      encryptParamWIthHeader.encryptParam,
      encryptParamWIthHeader.headers
    )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("contentListByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'contentListByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.resolve(err);
      });
  }

  getWhatsappReminder(params) {
    let url = `${URL.remainderNotificationUsingWhatsapp}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getWhatsappReminder err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getWhatsappReminder',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getCalenderRemaindersForUser(params) {
    let url = `${URL.getCalenderRemaindersForUser}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getCalenderRemaindersForUser err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getCalenderRemaindersForUser',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  forgotPassword(params) {
    let url = `${URL.forgotPassword}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("forgotPassword err>>", err);
        var errorObj = {
          component: 'API',
          method: 'forgotPassword',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  resetPassword(params) {
    let url = `${URL.resetPassword}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .newpostRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("resetPassword err>>", err);
        var errorObj = {
          component: 'API',
          method: 'resetPassword',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  IdentifyUserType(params) {
    let url = `${URL.IdentifyUserType}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        // swal({
        //   title: "invalid user",
        //   icon: "warning",
        //   button: "Ok",
        // })
        console.log("IdentifyUserType err>>", err);
        var errorObj = {
          component: 'API',
          method: 'IdentifyUserType',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  ResetPin(params) {
    let url = `${URL.ResetPin}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        swal({
          title: "invalid user",
          icon: "warning",
          button: "Ok",
        })
        console.log("ResetPin err>>", err);
        var errorObj = {
          component: 'API',
          method: 'ResetPin',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getEvidenceCaptureFlags(params) {
    let url = `${URL.getCommunityEvidenceCaptureFlags}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getEvidenceCaptureFlags err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getEvidenceCaptureFlags',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getServiceEvidenceCaptureFlags(params) {
    let url = `${URL.getServiceEvidenceCaptureFlags}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getServiceEvidenceCaptureFlags err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getServiceEvidenceCaptureFlags',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getSurveyEvidenceCaptureFlags(params) {
    let url = `${URL.getSurveyEvidenceCaptureFlags}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getSurveyEvidenceCaptureFlags err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getSurveyEvidenceCaptureFlags',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getAssistedModelFlag(params) {
    let url = `${URL.getAssistedModelFlag}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getAssistedModelFlag err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getAssistedModelFlag',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getDashboardConfigurationByCommunityId(params) {
    let url = `${URL.getDashboardConfigurationByCommunityId}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("getDashboardConfigurationByCommunityId err>>", err);
        var errorObj = {
          component: 'API',
          method: 'getDashboardConfigurationByCommunityId',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  raiseJiraIssueForCommunity(params) {
    let url = `${URL.raiseJiraIssueForCommunity}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("raiseJiraIssueForCommunity err>>", err);
        var errorObj = {
          component: 'API',
          method: 'raiseJiraIssueForCommunity',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  setJiraFeeedbackAttachmnetForCommunity(params) {
    let url = `${URL.setJiraFeeedbackAttachmnetForCommunity}`;
    let encryptParamWIthHeader = this.handleEncryptParams(params);
    return service
      .postRequest(
        url,
        encryptParamWIthHeader.encryptParam,
        encryptParamWIthHeader.headers
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("setJiraFeeedbackAttachmnetForCommunity err>>", err);
        var errorObj = {
          component: 'API',
          method: 'setJiraFeeedbackAttachmnetForCommunity',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  sendPushNotification(params) {
    var payload = {
      "to": params.to,
      "priority": "high",
      "notification": {
        "title": params.title,
        "body": params.message,
        "sound": "default",
        "notiKey": 'notiKey',
        // "click_action": "FCM_PLUGIN_ACTIVITY",
        "page": params.page,
        "notification_foreground": "true"
      },
      "data": {
        "title": params.title,
        "body": params.message,
        "page": params.page,
        "applicant": params.applicant,
        "chatType": params.chatType,
        "senderObj": params.senderObj,
        "msgid":params.msgid,
        "notification_foreground": "true"
      }
    };
    if(params.multipleids){
      payload = {
        "registration_ids": params.multipleids,
        "priority": "high",
        "notification": {
          "title": params.title,
          "body": params.message,
          "sound": "default",
          "notiKey": 'notiKey',
          // "click_action": "FCM_PLUGIN_ACTIVITY",
          "page": params.page,
          "notification_foreground": "true"
        },
        "data": {
          "title": params.title,
          "body": params.message,
          "page": params.page,
          "applicant": params.applicant,
          "chatType": params.chatType,
          "senderObj": params.senderObj,
          "msgid":params.msgid,
          "notification_foreground": "true"
        }
      }
    }
    let url = `${URL.sendPushNotification}`;
    let headers = {};
    console.log("noti payload::", payload)
    return service
      .notiRequest(
        url,
        payload,
        headers = {
          "Authorization": 'key=' + firebaseConfig.serverKey,
          "Content-Type": 'application/json'
        }
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("sendPushNotification err>>", err);
        var errorObj = {
          component: 'API',
          method: 'sendPushNotification',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  }

  getRasaResponse(params) {
    console.log("getRasaResponse", params);
    return service.getBotResponse({
      url: params.url,
      text: params.text
    }
    )
      .then(response => {
        //this.hideLoader();
        console.log('getRequest res>>', response.status)
        return Promise.resolve(response);
      })
      .catch(err => {
        //this.hideLoader();
        console.log('getRasaResponse err>>', err)
        var errorObj = {
          component: 'API',
          method: 'getRasaResponse',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err.message);
      })
  }

  getDataFromUrl(params) {
    console.log("getDataFromUrl", params);
    return service.getDataFromUrl({
      url: params.url
    }
    )
      .then(response => {
        //this.hideLoader();
        console.log('getRequest res>>', response.status)
        return Promise.resolve(response);
      })
      .catch(err => {
        //this.hideLoader();
        console.log('getRequest err>>', err)
        var errorObj = {
          component: 'API',
          method: 'getDataFromUrl',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err.message);
      })
  }

  sendFeedback(params) {
    let url = `${URL.sendFeedback}`;
    return service.crossApipostRequest(url, params).then((res) => {
      return Promise.resolve(res);
    }).catch((err) => {
      console.log("sendFeedback err>>", err);
      var errorObj = {
        component: 'API',
        method: 'sendFeedback',
        error: err
      }
      logError(errorObj);
      return Promise.resolve(err);
    });
  }

  sendOtp(params){
    let url= `${URL.twilioUrl}`
    return service.twilioOtpRequest(url, params).then((res) => {
      return Promise.resolve(res);
    }).catch((err) => {
      console.log("Twilio otp err>>", err);
      var errorObj = {
        component: 'API',
        method: 'Twilio otp',
        error: err
      }
      logError(errorObj);
      return Promise.resolve(err);
    });
  }

  handleEncryptParams(params) {
    let paramString = JSON.stringify(params);
    let salt = aesUtil.generateSalt();
    let iv = aesUtil.generateiv();
    let encryptParam = { _r: aesUtil.encrypt(salt, iv, paramString) };
    return { encryptParam, headers: { _1: salt, _2: iv } };
  }

  saveUsageData(usageData) {
    return service
      .notiRequest(
        firebaseConfig.databaseURL + '/' + usageData.communityId + '/user_usage/' + usageData.userId +'.json',
        {'userId': usageData.userId,
        'module': usageData.module,
        'submodule': usageData.submodule || 0,
        'timestamp': Date.now()}
      )
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log("saveUsageData err>>", err);
        var errorObj = {
          component: 'API',
          method: 'saveUsageData',
          error: err
        }
        logError(errorObj);
        return Promise.reject(err);
      });
  } 
}

export default new DataServices();
