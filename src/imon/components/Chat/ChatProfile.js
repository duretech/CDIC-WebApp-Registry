import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import { Link, useHistory, withRouter } from "react-router-dom";
import { auth } from "../../service/firebase";
import { logError, signInAnonymously } from "../../helpers/auth";
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
import WifiOffIcon from '@material-ui/icons/WifiOff';
import Grid from "@material-ui/core/Grid";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";

//import "../../assets/css/customstyles.css";

import imgUrl from "../../assets/images/imageUrl.js";

import Loader from "../loaders/loader";

import Services from "../../api/api";
import service from "../../api/service";
import swal from "sweetalert";
import EvidenceCapture from "./EvidenceCapture";
import EditIcon from '@material-ui/icons/Edit';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import OfflineDb from '../../../db'


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

class ChatProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: [],
      name: "",
      value: "",
      isLoading: true,
      userid: "",
      userProfile: {},
      avatarList: [],
      profilePic: ""
    };
    this.nickNameInput = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.updateUrl = this.updateUrl.bind(this);
    this.syncOnlineData = this.syncOnlineData.bind(this);
  }

  componentDidMount() {
    try{
      gaLogEvent("Chat User", '', '');
      gaLogScreen("ChatProfile")
    }catch(err){
      console.log("err::", err);
    }
    console.log("componentDidMount>>", this.state);
    let avatar = [];
    Object.keys(imgUrl).map((imgKey) => {
      if (imgKey.includes("avatar")) {
        avatar.push({
          name: imgKey,
          url: imgUrl[imgKey],
        });
      }
    });
    OfflineDb.getDataFromPouchDB('loginDetails').then(res=>{
      console.log(res)
      this.setState(
        {
          name: res.data.name,
        })
    })
    this.setState(
      {
        img: avatar,
        isLoading: false,
      },
      () => {
        this.getUserDetail();
      }
    );
  }

  getAvatarList() {
    if(navigator.onLine){
    let params = {
      communityId:  localStorage.getItem('CommunityId'),
      isactive: true,
    };
    Services.getAvatarByCommunityId(params).then((res) => {
      try{
        this.setState({ isLoading: false });
        console.log("getAvatarList getUserProfile>>", res);
        var tempAvtar = res.data.data;
        tempAvtar.push({
          communityId:  localStorage.getItem('CommunityId'),
          id: 289,
          nameOfAvatar: "image",
          urlOfImage: this.state.profilePic || 'https://res.cloudinary.com/nathnarale/image/upload/v1624954050/survey/zhabopkezctrkxqu1guw.jpg',
        })
        this.setState({
          avatarList: tempAvtar
        })
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'ChatProfile',
          method: 'getAvatarList',
          error: err
        }
        logError(errorObj);
      }
    });
  }
}

syncOnlineData(){
  this.componentDidMount();
}

  getUserDetail() {
    if(navigator.onLine){
    let userId = JSON.parse(localStorage.getItem("obj")).userId;
    let params = {
      communityId:  localStorage.getItem('CommunityId'),
      userId: userId,
    };
    this.setState({ isLoading: true });
    console.log('userId>>', params)
    Services.getUserProfile(params).then((res) => {
      try{
        console.log("getUserProfile>>", res);
        if ((res?.data?.status == 200) && res.data?.data) {
          this.setState({
            userProfile: res.data.data.profile,
            // name: res.data.data.profile && res.data.data.profile.nickName,
            value: res.data.data.profile && res.data.data.profile.avtaar,
            profilePic: res.data.data.profile && res.data.data.profile.avtaar,
          });

          // if (
          //   res.data.data.profile &&
          //   this.nickNameInput &&
          //   this.nickNameInput.current != null
          // ) {
          //   this.nickNameInput.value = res.data.data.profile
          //     ? res.data.data.profile.nickName
          //     : "";
          //   if (this.nickNameInput.value) {
          //     this.nickNameInput.focus();
          //   }
          // }
        }
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'ChatProfile',
          method: 'getUserDetail',
          error: err
        }
        logError(errorObj);
      }
    });
    this.setState({
      userid: userId,
    });
    this.getAvatarList();
  }
}

  getAvatarList() {
    if(navigator.onLine){
    let params = {
      communityId:  localStorage.getItem('CommunityId'),
      isactive: true,
    };
    Services.getAvatarByCommunityId(params).then((res) => {
      try{
        this.setState({ isLoading: false });
        console.log("getAvatarList getUserProfile>>", res);
        var tempAvtar = res.data.data;
        tempAvtar.push({
          communityId:  localStorage.getItem('CommunityId'),
          id: 289,
          nameOfAvatar: "image",
          urlOfImage: this.state.profilePic || 'https://res.cloudinary.com/nathnarale/image/upload/v1624954050/survey/zhabopkezctrkxqu1guw.jpg',
        })
        console.log("tempAvtar", tempAvtar);
        this.setState({
          avatarList: tempAvtar
        })
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'ChatProfile',
          method: 'getAvatarList',
          error: err
        }
        logError(errorObj);
      }
    });
  }
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleChangeImage = (event) => {
    console.log("handleChangeImage", event);
    this.setState({
      value: event.target.value,
    });
  };

  handleChangeName(event) {
    // console.log(event)
    this.setState({
      name: event.target.value,
    });
  }

  handleSubmit = (event) => {
    try{
      var self = this;
      const { t } = this.props;
      event.preventDefault();
      this.setState({ isLoading: true });
      // console.log("handleSubmit>>", event);
      console.log("handleSubmit11>>", this.state);
      let deviceuuid = localStorage.getItem("deviceuuid");
  
      var param = {
        communityId:  localStorage.getItem('CommunityId'),
        deviceDetails: {
          serialNumber: deviceuuid,
        },
        profile: {
          avtaar: this.state.value,
          nickName: this.state.name,
        },
        userId: this.state.userid,
        geoLocation: false,
      };
      console.log("handleSubmit>>", param, JSON.stringify(param));
      if(param.profile.nickName == null || param.profile.nickName == ""){
        swal({
          title: t("Please enter nick name"),
          icon: "warning",
          button: "Ok",
        }).then((val) => {
          self.setState({ isLoading: false })
          //self.props.changeTab(1);
          //self.setState({value: 2})
        });
        return false;
  
      }
  
      if (param.profile.avtaar != "" && param.profile.avtaar != null) {
        Services.updateApplicant(param).then((data) => {
          console.log("addApplicant>>", data);
  
          signInAnonymously()
            .then((res) => {
              auth().onAuthStateChanged((user) => {
                console.log("onAuthStateChanged>>", user);
  
                if (user) {
                  // this.props.setFirebaseUserDetail(user);
                  user.updateProfile({
                    photoURL: this.state.value,
                    displayName: this.state.name,
                  })
                    .then(function (res) {
                      console.log("updateProfile res>>", res);
                      localStorage.setItem('FBuser', JSON.stringify({
                        photoURL: self.state.value,
                        displayName: self.state.name,
                        uid: user.uid
                      }))
  
                      // Update successful.
                      self.props.changeTab(0);
                    })
                    .catch(function (error) {
                      // An error happened.
                      console.log("updateProfile error>>", error);
                    });
                } else {
                  console.log("error>>", user);
                }
              });
            })
            .catch((err) => console.log("err>>>", err));
        });
      } else {
        swal({
          title: t("Please select avatar"),
          icon: "warning",
          button: t("Ok"),
        }).then((val) => {
          self.setState({ isLoading: false })
          //self.props.changeTab(1);
          //self.setState({value: 2})
        });
      }
    }catch(err){
      console.log(err);
      var errorObj = {
        component: 'ChatProfile',
        method: 'handleSubmit',
        error: err
      }
      logError(errorObj);
    }

  };

  updateUrl(url, type) {
    console.log("url, type", url, type);
    console.log("this.state.avatarList", this.state.avatarList);
    this.state.avatarList.filter(function (avatar) {
      if (avatar.nameOfAvatar == 'image') {
        avatar.urlOfImage = url;
      }
    })
    this.setState({
      value: url,
      profilePic: url
    })
  }

  render() {
    const { t } = this.props;
    const { classes, theme } = this.props;
    const { templateID } = this.props;
    var compcolor  =  localStorage.getItem('componentbgcolor')
    let bgStyles = templateID == 2 ? { background: compcolor } : {};
    return (
      <form
        id="chat-profile"
        className={classes.container}
        onSubmit={this.handleSubmit}
      >
        {this.state.isLoading ? (
          <Loader isLoading={this.state.isLoading} />
        ) : (
          <>
            {this.state?.avatarList?.length == 0 ? navigator.onLine == false ? 
              (
                <div className="no-internet" onClick={this.syncOnlineData}>
                  <div className="offline-icon"><WifiOffIcon /></div>
                  <div className="offline-desc">{t("You are in offline mode")}</div>
                </div>
              ) : (
                    // <strong><p>{t('No Data Found')}</p></strong>
                    <></>
                    // <Loader isLoading={true} />
              ) : (
                    <Grid container spacing={3} className="gridcontainer">
                      <Grid item xs={12} className="profileformholder">
                        <TextField
                          id="standard-helperText"
                          label={t('Enter Nick Name')}
                          value={this.state.name}
                          disabled={true}
                          // inputRef={(input) => this.nickNameInput = input}
                          // onChange={this.handleChangeName}
                        />
                      </Grid>
                      <Grid item xs={12} className="profileformholder">

                        <FormControl component="fieldset">
                          <FormLabel component="legend">{t('Select Avatar')}</FormLabel>
                          <RadioGroup
                            aria-label="gender"
                            name="gender1"
                            value={this.state.value}
                            onChange={this.handleChange}
                            className="avatarmainholder"
                          >
                            {/* <p className="d-flex">
                              <FormControlLabel
                                value={this.state.value}
                                control={<Radio />}
                                label=""
                              />
                              <div className="avatar-img avatar-img-wrap">
                                {this.state.profilePic ? <img className="avatar-img" src={this.state.profilePic} /> : <span className="evidancbtn" ><PhotoLibraryIcon /></span>}
                                <EvidenceCapture updateUrl={this.updateUrl} />
                              </div>
                            </p> */}
                            {this.state.avatarList.map((imgObj) => {
                              return (
                                <p className="d-flex">
                                  { imgObj.nameOfAvatar != 'image' ? 
                                    (<FormControlLabel
                                      value={imgObj.urlOfImage}
                                      control={<Radio />}
                                      label=""
                                    />) : ''
                                  }
                                  <div className="avatar-img avatar-img-wrap">
                                    <img className="avatar-img" src={imgObj.urlOfImage} />
                                    {imgObj.nameOfAvatar == 'image' ? <EvidenceCapture updateUrl={this.updateUrl} /> : ''}
                                  </div>

                                </p>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} className="profileformholder bgtransparent boxshadownone">
                        <div className="text-center">
                          <Button
                            style={bgStyles}
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableElevation
                          >
                            {t('Submit')}
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
              )
            }
          </>
        )}
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    userObj: storeState.userDetail,
    chatConfig: storeState.chatConfig,
    componentbgcolor: storeState.componentbgcolor
  };
};

const TransChatProfile = withTranslation()(ChatProfile);
const ThemeChatProfile = withTheme(TransChatProfile);
const FinalChatProfile = withStyles(useStyles)(ThemeChatProfile);
const routeChatContainer = withRouter(FinalChatProfile);
export default connect(mapStateToProps, {})(routeChatContainer);
