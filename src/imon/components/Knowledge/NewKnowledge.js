import React, { Component } from "react";
import * as _ from "lodash";
import { withTranslation, Trans } from "react-i18next";
import PropTypes from "prop-types";
// import SwipeableViews from "react-swipeable-views";
import { connect } from "react-redux";
import {
  useHistory,
  withRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
// import AppBar from "@material-ui/core/AppBar";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import SearchBar from "material-ui-search-bar";
// import List from "@material-ui/core/List";
import Services from "../../api/api";
import imgUrl from "../../assets/images/imageUrl";
// import KnowledgeList from "../Knowledge/KnowledgeList";
// import KnowledgeCard from "../Knowledge/KnowledgeCard";
// import Champion from "./Champion";
// import ChampionDetail from "./ChampionDetail";
import Loader from "../loaders/loader";
import { removeSpacetoLowerCase } from "../../api/helper";
import {
  setSelectedComponentObject,
  resetSelectedCompnentObject,
} from "../../redux/actions/appActions";
import OffileDb from '../../config/pouchDB';
// const Jarvis = new Artyom();
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
// import BottomSheet from "./BottomSheet";
// import WifiOffIcon from '@material-ui/icons/WifiOff';
import { logError } from "../../helpers/auth";
import { db } from "../../service/firebase";
import Slider from "react-slick";
// import ReactPlayer from "react-player";
import Iframe from 'react-iframe'
import Button from '@material-ui/core/Button';
import Feedback from "../Feedback";
import FooterMenu from "../../../component/layout/FooterMenu";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

var activeTabIndex = 0
var myArray = []
class NewKnowledge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      tabList: [],
      list: [],
      // islikedflag: false,
      knowledgeObj: {},
      orignalList: [],
      isLoading: true,
      bottomSheet: false,
      parentKnowledgeObj: { contentId: 2127 },
      parentID: 51,
      videoFlag: [],
      linkArray: [],
      orgList: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.getKnowledgeableDetail = this.getKnowledgeableDetail.bind(this);
    this.speakText = this.speakText.bind(this);
    this.openBottomshett = this.openBottomshett.bind(this);
    // this.callannyang = this.callannyang.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.syncOnlineData = this.syncOnlineData.bind(this);
    this.getHttpsUrl = this.getHttpsUrl.bind(this)
    this.openPdf = this.openPdf.bind(this)
    this.getLinklist = this.getLinklist.bind(this)
  }

  componentDidMount() {
    try {
      gaLogEvent("Disease Prevention and Control Guide", '', '');
      gaLogScreen("Disease Prevention and Control Guide");
      OffileDb.setDatabase()
      this.checkActiveTab()
      console.log(this.props)
      if (this.props.location.state) {
        this.setState({ isLoading: true, }, () => {
          this.getKnowledgeableDetail(this.props.location.state.id);
        }
        );
      } else if (this.props.selectedComponentObj && Object.keys(this.props.selectedComponentObj).length != 0) {
        if (this.props.location.pathname == "/layout/getknowledgeable") {
          if (this.props.selectedComponentObj.new && Object.keys(this.props.selectedComponentObj.new).length != 0) {
            this.getKnowledgeableDetail(this.props.selectedComponentObj.new.id);
          } else {
            //this.getKnowledgeableDetail(this.props.selectedComponentObj.prev.id);
            this.props.history.push("/layout");
          }
        } else {
          if (this.props.selectedComponentObj.new && Object.keys(this.props.selectedComponentObj.new).length != 0) {
            this.getKnowledgeableDetail(this.props.selectedComponentObj.new.id);
          }
        }
      } else {
        this.getKnowledgeableApiDetail(this.state.parentKnowledgeObj.contentId)
      }
      // this.callannyang()

      let usageData = {
        'userId': JSON.parse(localStorage.getItem("obj")).userId,
        'module': 'Information',
        'communityId': this.props.communityuid
      }
      if (navigator.onLine) {
        Services.saveUsageData(usageData).then((data) => {
          try {
            console.log("UsageData", data);
          } catch (err) {
            console.log("err::", err)
            var errorObj = {
              component: 'NewKnowledge',
              method: 'componentDidMount',
              error: err
            }
            logError(errorObj);
          }
        });
      }
      gaLogScreen("NewKnowledge");
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'NewKnowledge',
        method: 'componentDidMount',
        error: err
      }
      logError(errorObj);
    }

  }

  checkActiveTab() {
    var activetab = JSON.parse(sessionStorage.getItem('activeTab'))
    if (activetab != null && activetab['getknowledgeable'] != undefined) {
      this.setState({
        value: activetab['getknowledgeable'],
      });
    }
  }

  syncOnlineData() {
    this.componentDidMount();
  }

  speakText(text) {
    try {
      console.log("text", text);
      // annyang.abort();
      // let self = this;
      if (window.cordova) {
        document.addEventListener('deviceready', function () {
          window.TTS.speak(text, function () {
            console.log("text::", text);
            // annyang.abort();
          }, function (reason) {
            alert(reason);
          });
        })
      } else {
        // Jarvis.say(text, {onEnd(){
        //   // annyang.abort();
        // }});
      }
      // this.toggleAnnyang();
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'NewKnowledge',
        method: 'speakText',
        error: err
      }
      logError(errorObj);
    }
  }

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   console.log('UNSAFE_componentWillReceiveProps>', nextProps)
  //   if(nextProps.location.state && nextProps.location.state.id) {
  //     this.getKnowledgeableDetail(nextProps.location.state.id);
  //   } else if (Object.keys(nextProps.selectedComponentObj.new).length != 0) {
  //     this.getKnowledgeableDetail(nextProps.selectedComponentObj.new.id);
  //   }
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.state && nextProps.location.state.id) {
      this.getKnowledgeableDetail(nextProps.location.state.id);
    } else if (nextProps.selectedComponentObj && Object.keys(nextProps.selectedComponentObj).length != 0) {
      if (nextProps.location.pathname == "/layout/getknowledgeable") {
        if (
          this.props.selectedComponentObj.prev &&
          this.props.selectedComponentObj.prev.id
        ) {
          this.getKnowledgeableDetail(nextProps.selectedComponentObj.prev.id);
        } else {
          this.getKnowledgeableDetail(nextProps.selectedComponentObj.new.id);
        }
      } else {
        if (Object.keys(nextProps.selectedComponentObj.new).length != 0) {
          this.getKnowledgeableDetail(nextProps.selectedComponentObj.new.id);
        }
      }
    }
  }

  componentWillUnmount() {
    // this.props.resetSelectedCompnentObject();
  }

  getKnowledgeableDetail(contentid) {
    console.log(contentid)
    this.loadOfflineTabData(contentid)
    // decrease belliocn count for get to know your rights notification
    let userId = JSON.parse(localStorage.getItem('obj')).userId;
    let alertroom = `${this.props.communityuid}/mobilealert/${userId}/`;
    setTimeout(function () {
      try {
        db.ref(alertroom).once("value", (snapshot) => {
          snapshot.forEach((snap) => {
            try {
              let tempObj = snap.val();
              console.log("snap::", tempObj);
              if (tempObj.read == 0) {
                if (tempObj && tempObj.chatType == "Information") {
                  if (tempObj.additionalInfo && tempObj.additionalInfo.contentId == contentid) {
                    tempObj.read = 1;
                    db.ref(alertroom + tempObj.msgid).update(tempObj);
                  }
                }
              }
            } catch (err) {
              console.log("error", err);
            }
          });
        })
      } catch (err) {
        console.log("err::", err);
        var errorObj = {
          component: 'NewKnowledge',
          method: 'getKnowledgeableDetail',
          error: err
        }
        logError(errorObj);
      }
    }, 500)
  }

  getKnowledgeableApiDetail(contentid) {
    console.log("entered")
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: contentid,
        languageId: localStorage.getItem("langId"),
        roleId: JSON.parse(localStorage.getItem("obj")).roleId,
        userId: JSON.parse(localStorage.getItem("obj")).userId,
      };
      console.log("params ",params)
      // let param = {
      //   communityId: this.props.communityuid,
      //   contentIds: [1,contentid],
      //   userId: JSON.parse(localStorage.getItem("obj")).userId,
      // }
      // console.log("getContentLikeDataByUserId",param)
      // Services.getContentLikeDataByUserId(param).then((res) => {
      //   try {
      //     if (res.data && res.data.status == 200) {
      //       var values = [];
      //       values.push(Object(res.data.data.contentLikeData))
      //       OffileDb.setData('getcontentlikedatabyuserid-' + contentid, res.data.data.contentLikeData)
      //       let final = [];
      //       values.map((obj) => {
      //         let keysss = Object.keys(obj);
      //         keysss.map((o) => {
      //           if(o == this.props.langId){
      //            final.push(obj[o])
      //           }
      //         } )
      //       })
      //       console.log("finalarr>>",final)
      //       final.map((object) => {
      //         let objjj = Object.keys(object);
      //         objjj.map((x) =>{
      //           if(x == contentid){
      //             console.log(x,contentid,final[0][x])
      //             this.setState({
      //               islikedflag: final[0][x],
      //               isLiked: this.state.islikedflag
      //             })
      //            }
      //         })
      //       }) 
      //       console.log('islikedflag::',this.state.islikedflag)        
      //     }
      //   } catch (err) {
      //     console.log("err::", err)
      //     var errorObj = {
      //       component: 'NewKnowledge',
      //       method: 'getKnowledgeableApiDetail',
      //       error: err
      //     }
      //     logError(errorObj);
      //   }
      // });
      this.setState({ isLoading: true })
      Services.getRoleWiseContent(params).then((res) => {
        try {
          if (res.data.status == 200) {
            if (res.data.data.childs) {
              this.setState({ knowledgeObj: res.data.data })
              // this.setState({ tabList: res.data.data.childs })
              // this.getKnowledgeablSectionData(res.data.data.childs[activeTabIndex].contentId)
              // OffileDb.setData('KnowledgeableTabDetail', res.data.data)
              this.getLinklist()
            }
          }
        } catch (err) {
          console.log("err::", err)
          this.setState({ isLoading: false })

          var errorObj = {
            component: 'NewKnowledge',
            method: 'getKnowledgeableApiDetail',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  getLinklist() {
    var knowledgeObj = this.state.knowledgeObj
    var htmlDoc = "";
    if (knowledgeObj.contentList && knowledgeObj.contentList.length !== 0) {
      if (knowledgeObj.contentList[0].description) {
        htmlDoc = knowledgeObj.contentList[0].description;
      } else if (knowledgeObj.contentList[0].shortDesc) {
        htmlDoc = knowledgeObj.contentList[0].shortDesc;
      }
    }
    console.log("links", htmlDoc, typeof htmlDoc)
    // var strippedHtml = htmlDoc.replace(/<[^>]+>/g, '');
    // this.state.linkArray = strippedHtml.split("https://");
    // this.state.orgList = strippedHtml.split("https://");

    var strippedHtml = htmlDoc
    // this.state.linkArray = strippedHtml
    // this.state.orgList = strippedHtml

    let splitarr = strippedHtml.replaceAll('</p>', '</p>###');

    // Split on the newly added sign
    let split = splitarr.split('###');

    // Filter out empty lines
    let newArr = split.filter((a) => a);

    // Show result
    // console.log(newArr)

    this.state.linkArray = newArr
    this.state.orgList = newArr

    this.setState({ isLoading: false })

    console.log(newArr,this.state.linkArray);
  }

  getKnowledgeablSectionData(id) {
    this.loadOfflineSectionData(id)
  }

  getKnowledgeablSectionApiData(id) {
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        contentId: id,
        languageId: localStorage.getItem("langId"),
        roleId: JSON.parse(localStorage.getItem("obj")).roleId,
        userId: JSON.parse(localStorage.getItem("obj")).userId,
      };
      // let param = {
      //   communityId: this.props.communityuid,
      //   contentIds: [1,id],
      //   userId: JSON.parse(localStorage.getItem("obj")).userId,
      // }
      // console.log("getContentLikeDataByUserId",param)
      // Services.getContentLikeDataByUserId(param).then((res) => {
      //   try {
      //     if (res.data && res.data.status == 200) {
      //       var values = [];
      //       values.push(Object(res.data.data.contentLikeData))
      //       OffileDb.setData('getcontentlikedatabyuserid-' + id, res.data.data.contentLikeData)
      //       let final = [];
      //       values.map((obj) => {
      //         let keysss = Object.keys(obj);
      //         keysss.map((o) => {
      //           if(o == this.props.langId){
      //            final.push(obj[o])
      //           }
      //         } )
      //       })
      //       console.log("finalarr>>",final)
      //       final.map((object) => {
      //         let objjj = Object.keys(object);
      //         objjj.map((x) =>{
      //           if(x == id){
      //             console.log(x,id,final[0][x])
      //             this.setState({
      //               islikedflag: final[0][x],
      //               isLiked: this.state.islikedflag
      //             })
      //            }
      //         })
      //       }) 
      //       console.log('islikedflag::',this.state.islikedflag)        
      //     }
      //   } catch (err) {
      //     console.log("err::", err)
      //     var errorObj = {
      //       component: 'NewKnowledge',
      //       method: 'getKnowledgeablSectionApiData',
      //       error: err
      //     }
      //     logError(errorObj);
      //   }
      // });
      Services.getRoleWiseContent(params).then((res) => {
        try {
          if (res.data.status == 200) {
            if (res.data.data.childs) {
              this.setState(
                {
                  list: res.data.data.childs,
                  orignalList: res.data.data.childs,
                  isLoading: false,
                  parentID: id
                },
                () => { }
              );
              // OffileDb.setData('KnowledgeableSectionDetail-' + id, res.data.data)
            }
          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'NewKnowledge',
            method: 'getKnowledgeablSectionApiData',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  loadOfflineTabData(contentid) {
    try {
      var that = this;
      var contentId = this.state.parentKnowledgeObj.contentId;
      console.log(contentId)
      OffileDb.getData('KnowledgeableTabDetail').then(function (result) {
        console.log(result)
        if (!result.status && result.status != 404) {
          that.setState({
            tabList: result.data.childs,
            isLoading: false,
          });
          that.loadOfflineSectionData(result.data.childs[that.state.value].contentId)
        } else {
          that.getKnowledgeableApiDetail(contentid)
        }
      });
      // OffileDb.getData('getcontentlikedatabyuserid-' + contentId).then(function (result) {
      //   console.log("getcontentlikedatabyuseriddata::", result);
      //   if (!result.status && result.status != 404) {
      //     try {
      //         var values = [];
      //         values.push(Object(result.data))
      //         console.log(values)
      //         let final = [];
      //         values.map((obj) => {
      //           let keysss = Object.keys(obj);
      //           keysss.map((o) => {
      //             if(o == that.props.langId){
      //              final.push(obj[o])
      //             }
      //           } )
      //         })
      //         console.log("finalarr>>",final)
      //         final.map((object) => {
      //           let objjj = Object.keys(object);
      //           objjj.map((x) =>{
      //             if(x == contentId){
      //               console.log(x,contentId,final[0][x])
      //               that.setState({
      //                 islikedflag: final[0][x],
      //                 isLiked: that.state.islikedflag
      //               })
      //              }
      //           })
      //         }) 
      //         console.log('islikedflag::',that.state.islikedflag)        

      //     } catch (err) {
      //       console.log("err::", err)
      //       var errorObj = {
      //         component: 'NewKnowledge',
      //         method: 'loadOfflineTabData',
      //         error: err
      //       }
      //       logError(errorObj);
      //     }
      //   }
      // });
    } catch (err) {
      console.log(err)
      var errorObj = {
        component: 'NewKnowledge',
        method: 'loadOfflineTabData',
        error: err
      }
      logError(errorObj);
    }

  }

  loadOfflineSectionData(id) {
    var that = this;
    var contentId = this.state.parentKnowledgeObj.contentId;
    console.log(contentId)
    OffileDb.getData('KnowledgeableSectionDetail-' + id).then(function (result) {
      console.log(result)
      try {
        gaLogEvent(result.data.contentName, '', '');
        let usageData = {
          'userId': JSON.parse(localStorage.getItem("obj")).userId,
          'module': 'Information',
          'submodule': result.data.contentName,
          'communityId': that.props.communityuid
        }
        if (navigator.onLine) {
          Services.saveUsageData(usageData).then((data) => {
            try {
              console.log("UsageData", data);
            } catch (err) {
              console.log("err::", err)
              var errorObj = {
                component: 'NewKnowledge',
                method: 'loadOfflineSectionData',
                error: err
              }
              logError(errorObj);
            }
          });
        }
      } catch (err) {
        console.log("err::", err);
        var errorObj = {
          component: 'NewKnowledge',
          method: 'loadOfflineSectionData',
          error: err
        }
        logError(errorObj);
      }
      if (!result.status && result.status != 404) {
        that.setState({
          list: result.data.childs,
          orignalList: result.data.childs,
          isLoading: false,
          parentID: id
        });
      } else {
        that.getKnowledgeablSectionApiData(id)
      }
    });
    // OffileDb.getData('getcontentlikedatabyuserid-' + id).then(function (result) {
    //   console.log("getcontentlikedatabyuseriddata::", result);
    //   if (!result.status && result.status != 404) {
    //     try {
    //         var values = [];
    //         values.push(Object(result.data))
    //         console.log(values)
    //         let final = [];
    //         values.map((obj) => {
    //           let keysss = Object.keys(obj);
    //           keysss.map((o) => {
    //             if(o == that.props.langId){
    //              final.push(obj[o])
    //             }
    //           } )
    //         })
    //         console.log("finalarr>>",final)
    //         final.map((object) => {
    //           let objjj = Object.keys(object);
    //           objjj.map((x) =>{
    //             if(x == contentId){
    //               console.log(x,contentId,final[0][x])
    //               that.setState({
    //                 islikedflag: final[0][x],
    //                 isLiked: that.state.islikedflag
    //               })
    //              }
    //           })
    //         }) 
    //         console.log('islikedflag::',that.state.islikedflag)        

    //     } catch (err) {
    //       console.log("err::", err)
    //       var errorObj = {
    //         component: 'NewKnowledge',
    //         method: 'loadOfflineSectionData',
    //         error: err
    //       }
    //       logError(errorObj);
    //     }
    //   }
    // });
  }

  handleChange = (event, newValue) => {
    activeTabIndex = newValue
    this.setState({
      value: newValue,
    });
    this.getKnowledgeablSectionData(this.state.tabList[newValue].contentId)
    sessionStorage.setItem('activeTab', JSON.stringify({ 'getknowledgeable': newValue }))
  };

  handleChangeIndex = (index) => {
    activeTabIndex = index
    this.setState({
      value: index,
    });
    this.getKnowledgeablSectionData(this.state.tabList[index].contentId)
    sessionStorage.setItem('activeTab', JSON.stringify({ 'getknowledgeable': index }))
  };

  handleOnSearch = (e) => {
    this.setState({
      isLoading: true,
    });
    try {
      // let topicList = _.cloneDeep(this.state.orignalList);
      let topicList = _.cloneDeep(this.state.linkArray);
      let filtered = [];
      // filtered = topicList.filter(function (str) {
      //   let finalstring = str.contentList[0].shortDesc + str.contentName; 
      //   return (
      //     (removeSpacetoLowerCase(finalstring)).indexOf(
      //       removeSpacetoLowerCase(e)
      //     ) !== -1
      //   );
      // });
      if (e.length == 0) {
        this.state.linkArray = this.state.orgList;
      }
      else {
        filtered = topicList.filter((f) => {
          var lf=f.toLowerCase()
          if (lf.includes(e.toLowerCase())) {
            return f
          }
        })
        this.state.linkArray = filtered
      }
      console.log("changeDate3>>", filtered, this.state.linkArray);
      this.setState({
        isLoading: false,
      });
    } catch (err) {
      console.log(err)
      this.setState({
        isLoading: true,
      });
      var errorObj = {
        component: 'NewKnowledge',
        method: 'handleOnSearch',
        error: err
      }
      logError(errorObj);
    }
  };

  cancelSearch(e) {
    this.setState({
      list: this.state.orignalList,
    });
  }

  onDismiss() {
    // var contentid = this.state.parentKnowledgeObj.contentId;
    this.setState({
      bottomSheet: false,
    })
    // let param = {
    //   communityId: this.props.communityuid,
    //   contentIds: [1,contentid],
    //   userId: JSON.parse(localStorage.getItem("obj")).userId,
    // }
    // console.log("getContentLikeDataByUserId",param)
    // Services.getContentLikeDataByUserId(param).then((res) => {
    //   try {
    //     if (res.data && res.data.status == 200) {
    //       var values = [];
    //       values.push(Object(res.data.data.contentLikeData))
    //       OffileDb.setData('getcontentlikedatabyuserid-' + contentid, res.data.data.contentLikeData)
    //       let final = [];
    //       values.map((obj) => {
    //         let keysss = Object.keys(obj);
    //         keysss.map((o) => {
    //           if(o == this.props.langId){
    //            final.push(obj[o])
    //           }
    //         } )
    //       })
    //       console.log("finalarr>>",final)
    //       final.map((object) => {
    //         let objjj = Object.keys(object);
    //         objjj.map((x) =>{
    //           if(x == contentid){
    //             console.log(x,contentid,final[0][x])
    //             this.setState({
    //               islikedflag: final[0][x],
    //               isLiked: this.state.islikedflag
    //             })
    //            }
    //         })
    //       }) 
    //       console.log('islikedflag::',this.state.islikedflag)        
    //     }
    //   } catch (err) {
    //     console.log("err::", err)
    //     var errorObj = {
    //       component: 'NewKnowledge',
    //       method: 'NewKnowledge-onDismiss',
    //       error: err
    //     }
    //     logError(errorObj);
    //   }
    // });
  }

  openBottomshett(obj) {
    //this.props.setSelectedComponentObject({ id: obj.contentId, name: obj.contentName});
    // OffileDb.getData('getcontentlikedatabyuserid-' + this.state.parentID).then(function (result) {
    //   console.log("getcontentlikedatabyuseriddata::", result);
    //   if (!result.status && result.status != 404) {
    //     try {
    //         var values = [];
    //         values.push(Object(result.data))
    //         console.log(values)
    //         let final = [];
    //         values.map((obj) => {
    //           let keysss = Object.keys(obj);
    //           keysss.map((o) => {
    //             if(o == that.props.langId){
    //              final.push(obj[o])
    //             }
    //           } )
    //         })
    //         console.log("finalarr>>",final)
    //         final.map((object) => {
    //           let objjj = Object.keys(object);
    //           objjj.map((x) =>{
    //             if(x == obj.contentId){
    //               console.log(x,contentId,obj.contentId,final[0][x])
    //               that.setState({
    //                 islikedflag: final[0][x],        
    //               })
    //               that.setState({
    //                 isLiked: that.state.islikedflag,
    //                 bottomSheet: true,
    //                 knowledgeObj: obj,
    //                 parentKnowledgeObj: { contentId: that.state.tabList[that.state.value].contentId }
    //               })
    //              }
    //           })
    //         }) 
    //         console.log('islikedflag::',that.state.islikedflag)        

    //     } catch (err) {
    //       console.log("err::", err)
    //       var errorObj = {
    //         component: 'NewKnowledge',
    //         method: 'openBottomshett',
    //         error: err
    //       }
    //       logError(errorObj);
    //     }
    //   }
    // });
    this.setState({
      bottomSheet: true,
      knowledgeObj: obj,
      parentKnowledgeObj: { contentId: this.state.tabList[this.state.value].contentId }
    })
  }

  loadParentData(result, id) {
    var that = this;
    console.log('info', result, id)
    // OffileDb.setData('KnowledgeableTabDetail', result)
    // this.setState({
    //   tabList: result.childs,
    //   orignalList: result.childs,
    // });
    OffileDb.setData('KnowledgeableSectionDetail-' + id, result)
    // OffileDb.getData('getcontentlikedatabyuserid-' + id).then(function (result) {
    //   console.log("getcontentlikedatabyuseriddata::", result);
    //   if (!result.status && result.status != 404) {
    //     try {
    //         var values = [];
    //         values.push(Object(result.data))
    //         console.log(values)
    //         let final = [];
    //         values.map((obj) => {
    //           let keysss = Object.keys(obj);
    //           keysss.map((o) => {
    //             if(o == that.props.langId){
    //              final.push(obj[o])
    //             }
    //           } )
    //         })
    //         console.log("finalarr>>",final)
    //         final.map((object) => {
    //           let objjj = Object.keys(object);
    //           objjj.map((x) =>{
    //             if(x == id){
    //               console.log(x,id,final[0][x])
    //               that.setState({
    //                 islikedflag: final[0][x],
    //                 isLiked: that.state.islikedflag
    //               })
    //              }
    //           })
    //         }) 
    //         console.log('islikedflag::',that.state.islikedflag)        

    //     } catch (err) {
    //       console.log("err::", err)
    //       var errorObj = {
    //         component: 'NewKnowledge',
    //         method: 'loadParentData',
    //         error: err
    //       }
    //       logError(errorObj);
    //     }
    //   }
    // });
    that.setState({
      list: result.childs,
      orignalList: result.childs,
    });
  }

  openPdf(url) {
    console.log(url)
    window.open(url, '_system', 'location=no');
  }

  handleBack() {
    window.history.back();
  }

  getHttpsUrl(iconurl) {
    var spliurtl = iconurl.split("://")
    let myUrl = spliurtl.length > 1 ? "https://" + spliurtl[1] : "https://" + spliurtl[0];
    return myUrl;
  }

  render() {
    const { t } = this.props;
    const { classes, theme } = this.props;
    const { templateID } = this.props;
    var compcolor = localStorage.getItem('componentbgcolor')
    let colorStyles = templateID == 2 ? { background: compcolor } : {};
    let bgStyles = templateID == 2 ? { background: `url(${this.state.background})` } : {};
    var knowledgeObj = this.state.knowledgeObj
    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      swipeToSlide: true,
      adaptiveHeight: true,
      slidesToScroll: 1,
      fade: false,
      arrows: true,

    };
    // const theme = useTheme();
    return (
      <section className="searchcustombg"
      style={{
          backgroundColor: '#fff',
          flexGrow: 1,
          padding: 20,
          
      }}
>
  <FooterMenu></FooterMenu>
      <div className={window.cordova ? "gk-page getknowledgeable_page getinfopage" : 'gk-page getknowledgeable_page getinfopage  windowdesktop'}>

        <Grid container spacing={0} className="gk-pageinner">
          <Grid container xs={12} className="certinav">
            {/* <Grid xs={1} className="backimg">
              <img src={imgUrl.whiteback} className="backsvg" onClick={() => this.handleBack()} />
            </Grid> */}
            <Grid xs={8}>
              <Typography variant="subtitle1" className="regname oneuhcfont disname">
                Disease Prevention and Control Guide
              </Typography>
            </Grid>
            <Grid xs={3}>
            {/* <Typography variant='body2' className='stepname parafont'><Feedback></Feedback></Typography> */}
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6} className='knowdetails'>
            <div className='knowdetailsdiv'>
              <div className="girl-avtar">
                <img src={imgUrl.knowavatar1} className="knowavatar" />
              </div>
              <div>
                <Typography variant="h5" className="oneuhcfont">Get guidance here</Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} lg={6} className="gksearchdetails">
            <SearchBar
              placeholder={t('Search')}
              className="getknow-searchbar"
              onChange={this.handleOnSearch}
              onCancelSearch={this.cancelSearch}
            />
            {this.state.isLoading ? (
              <Loader isLoading={this.state.isLoading} />
            ) : (
              <div className="gklistdetails-root gk_bottomsheet_desc_text">

              <div className="guideDiv">
                <div className="guideInner"> 
                    {knowledgeObj.contentList &&
                        knowledgeObj.contentList.length > 0 &&
                        knowledgeObj.contentList[0].infographics &&
                        knowledgeObj.contentList[0].infographics.image &&
                        knowledgeObj.contentList[0].infographics.image.length > 0 && (
                          <div className="text-center championvideobig championimge">
                            <Slider {...settings} className="slider">
                              {
                                knowledgeObj.contentList[0].infographics.image.map(
                                  (url, key) => {
                                    let iurl = this.getHttpsUrl(knowledgeObj.contentList[0].infographics.image[key])
                                    return (<img src={iurl} className="" />)
                                  }
                                )}
                            </Slider>
                          </div>
                        )
                      }
                      {/* <div dangerouslySetInnerHTML={{ __html: this.state.linkArray }} /> */}
                      {
                        this.state.linkArray.map((p) => {
                          if (p != '') {
                            // var url = "https://" + p
                            // return (<p><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>)
                            return <div className="guidetext"><div dangerouslySetInnerHTML={{ __html: p }} /></div>
                          }
                        })
                      }
                 </div>
              </div>
              
                {knowledgeObj.contentList &&
                  knowledgeObj.contentList.length > 0 &&
                  knowledgeObj.contentList[0].infographics &&
                  Object.keys(knowledgeObj.contentList[0].infographics).length >
                  0 &&
                  knowledgeObj.contentList[0].infographics.pdf &&
                  knowledgeObj.contentList[0].infographics.pdf.length > 0 &&
                  knowledgeObj.contentList[0].infographics.pdf.map((pdf) => {
                    return (
                      window.cordova ?
                        <Button variant="contained" onClick={() => this.openPdf(pdf)}>{t('Download')}</Button> :
                        <Iframe url={pdf}
                          width={"100%"}
                          height="450px"
                          id={removeSpacetoLowerCase(knowledgeObj.contentName)}
                          className="myClassname"
                          display="initial"
                          position="relative" />
                    );
                  })}
              </div>
            )}
          </Grid>
          {/* <Grid container xs={12} className="homebottomnav">
          {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="home-svg"  onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>:<Grid xs={4} className="home-svg" onClick={()=>(!window.location.pathname.includes('imonhome')?this.props.history.push('/layout/imonhome'):'')}>
              <img src={imgUrl.homesvg} />
              <Typography variant="caption" display="block">
                Home
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('myjourney')?this.props.history.push('/myjourney'):'')}>
              <img src={imgUrl.journeysvg} />
              <Typography variant="caption" display="block">
                My Journey
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>:<Grid xs={4} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?this.props.history.push('/layout/nearme'):'')}>
              <img src={imgUrl.nearsvg} />
              <Typography variant="caption" display="block">
                Near Me
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>:<Grid xs={4} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?this.props.history.push('/layout/getknowledgeable'):'')}>
              <img src={imgUrl.guidesvg} />
              <Typography variant="caption" display="block">
                Guide
              </Typography>
            </Grid>}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="connect-svg" onClick={()=>(!window.location.pathname.includes('peerchat')?this.props.history.push('/layout/peerchat'):'')}>
              <img src={imgUrl.connectsvg} />
              <Typography variant="caption" display="block">
                Connect
              </Typography>
            </Grid>:''}
            {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="screen-svg" onClick={()=>(!window.location.pathname.includes('aisurvey')?this.props.history.push('/layout/AiSurvey'):'')}>
              <img src={imgUrl.screensvg} />
              <Typography variant="caption" display="block">
                Survey
              </Typography>
            </Grid>:""}
          </Grid> */}

        </Grid>

        {/* <AiBot /> */}
      </div>
      </section>
    );
  }
}

NewKnowledge.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    selectedComponentObj: storeState.componentObj,
    selectedBottomComponentObj: storeState.bottomComponentObj,
    componentbgcolor: storeState.componentbgcolor
  };
};

const transNewKnowledge = withTranslation()(NewKnowledge);
const ThemeNewKnowledge = withTheme(transNewKnowledge);
const FinalNewKnowledge = withStyles(useStyles)(ThemeNewKnowledge);
const routeNewKnowledge = withRouter(FinalNewKnowledge);
export default connect(mapStateToProps, {
  setSelectedComponentObject,
  resetSelectedCompnentObject,
})(routeNewKnowledge);
