import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth } from "../../service/firebase";
import { logError, signInAnonymously } from "../../helpers/auth";
import {
  makeStyles,
  useTheme,
} from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import Grid from "@material-ui/core/Grid";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import imgUrl from "../../assets/images/imageUrl.js";
import Loader from "../loaders/loader";
import Services from "../../api/api";
import swal from "sweetalert";
import EvidenceCapture from "./EvidenceCapture";
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

function ChatProfileFunc(props) {
  const store = useSelector((state) => state.imonStoreState);
  let nickNameInput = useRef();
  const { t, i18n } = useTranslation();
  const compcolor = localStorage.getItem("componentbgcolor");
  const history = useHistory();
  const [refreshcounter, setrefreshcounter] = useState(0);
  const { classes } = props;
  const { templateID } = store ? store.templateID : 1;
  const theme = useTheme();
  let bgStyles = templateID == 2 ? { background: compcolor } : {};
  const [img, setimg] = useState([]);
  const [avatarList, setavatarList] = useState([]);
  const [userProfile, setuserProfile] = useState({});
  const [name, setname] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [value, setvalue] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [userid, setuserid] = useState("");

  useEffect(() => {
    try{
        gaLogEvent("Chat User", '', '');
        gaLogScreen("ChatProfile")
      }catch(err){
        console.log("err::", err);
      }
      let avatar = [];
      Object.keys(imgUrl).map((imgKey) => {
        if (imgKey.includes("avatar")) {
          avatar.push({
            name: imgKey,
            url: imgUrl[imgKey],
          });
        }
      });
        setimg(avatar);
        setisLoading(false);
        getUserDetail();
  },[refreshcounter])

  function getUserDetail() {
    if (navigator.onLine) {
      let userId = JSON.parse(localStorage.getItem("obj")).userId;
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        userId: userId,
      };
      setisLoading(false);
      console.log("userId>>", params);
      Services.getUserProfile(params).then((res) => {
        try {
          console.log("getUserProfile>>", res);
          if (res?.data?.status == 200 && res.data?.data) {
            setuserProfile(res.data.data.profile);
            setname(res.data.data.profile && res.data.data.profile.nickName);
            setvalue(res.data.data.profile && res.data.data.profile.avtaar);
            setprofilePic(res.data.data.profile && res.data.data.profile.avtaar);
            if (
              res.data.data.profile &&
              nickNameInput &&
              nickNameInput.current
            ) {
              nickNameInput.current = res.data.data.profile
                ? res.data.data.profile.nickName
                : "";
              if (nickNameInput.current) {
                nickNameInput.current.focus();
              }
            }
          }
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: "ChatProfile",
            method: "getUserDetail",
            error: err,
          };
          logError(errorObj);
        }
      });
      setuserid(userId)
      getAvatarList();
    }
  }

  function getAvatarList() {
    if (navigator.onLine) {
      let params = {
        communityId: localStorage.getItem("CommunityId"),
        isactive: true,
      };
      Services.getAvatarByCommunityId(params).then((res) => {
        try {
          setisLoading(false);
          console.log("getAvatarList getUserProfile>>", res);
          var tempAvtar = res.data.data;
          tempAvtar.push({
            communityId: localStorage.getItem("CommunityId"),
            id: 289,
            nameOfAvatar: "image",
            urlOfImage:
              profilePic ||
              "https://res.cloudinary.com/nathnarale/image/upload/v1624954050/survey/zhabopkezctrkxqu1guw.jpg",
          });
          console.log("tempAvtar", tempAvtar);
          setavatarList(tempAvtar);
        } catch (err) {
          console.log("err::", err);
          var errorObj = {
            component: "ChatProfile",
            method: "getAvatarList",
            error: err,
          };
          logError(errorObj);
        }
      });
    }
  }

  function handleChange(event) {
    setvalue( event.target.value)
  }

  function handleChangeName(event) {
    setname( event.target.value)
  }

  function handleSubmit(event) {
    try {
      const { t } = props;
      event.preventDefault();
      setisLoading(true);
      let deviceuuid = localStorage.getItem("deviceuuid");

      var param = {
        communityId: localStorage.getItem("CommunityId"),
        deviceDetails: {
          serialNumber: deviceuuid,
        },
        profile: {
          avtaar: value,
          nickName: name,
        },
        userId: userid,
        geoLocation: false,
      };
      console.log("handleSubmit>>", param, JSON.stringify(param));
      if (param.profile.nickName == null || param.profile.nickName == "") {
        swal({
          title: t("Please enter nick name"),
          icon: "warning",
          button: "Ok",
        }).then((val) => {
          setisLoading(false);
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
                  user
                    .updateProfile({
                      photoURL: value,
                      displayName: name,
                    })
                    .then(function (res) {
                      console.log("updateProfile res>>", res);
                      localStorage.setItem(
                        "FBuser",
                        JSON.stringify({
                          photoURL: value,
                          displayName: name,
                          uid: user.uid,
                        })
                      );
                      props.changeTab(0);
                    })
                    .catch(function (error) {
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
          setisLoading(false);
        });
      }
    } catch (err) {
      console.log(err);
      var errorObj = {
        component: "ChatProfile",
        method: "handleSubmit",
        error: err,
      };
      logError(errorObj);
    }
  }

  const syncOnlineData = () => {
    setrefreshcounter(refreshcounter + 1);
  };

  function updateUrl(url, type) {
    console.log("url, type", url, type);
    console.log("avatarList", avatarList);
    avatarList.filter(function (avatar) {
      if (avatar.nameOfAvatar == "image") {
        avatar.urlOfImage = url;
      }
    });
    setvalue(url);
    setprofilePic(url);
  }

  return (
    <form
      id="chat-profile"
    //   className={classes.container}
      onSubmit={handleSubmit}
    >
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          {(avatarList && avatarList.length == 0) ? navigator.onLine == false ? 
            (
              <div className="no-internet" onClick={syncOnlineData}>
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
                        value={name}
                        // inputRef={(input) => nickNameInput.current = input}
                        ref={nickNameInput}
                        onChange={handleChangeName}
                      />
                    </Grid>
                    <Grid item xs={12} className="profileformholder">

                      <FormControl component="fieldset">
                        <FormLabel component="legend">{t('Select Avatar')}</FormLabel>
                        <RadioGroup
                          aria-label="gender"
                          name="gender1"
                          value={value}
                          onChange={handleChange}
                          className="avatarmainholder"
                        >
                          {avatarList.map((imgObj) => {
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
                                  {imgObj.nameOfAvatar == 'image' ? <EvidenceCapture updateUrl={updateUrl} /> : ''}
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

export default ChatProfileFunc;
