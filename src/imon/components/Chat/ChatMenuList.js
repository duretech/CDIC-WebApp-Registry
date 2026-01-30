import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import GavelIcon from "@material-ui/icons/Gavel";
import PeopleIcon from "@material-ui/icons/People";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PieChartIcon from "@material-ui/icons/PieChart";
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import ChatIcon from "@material-ui/icons/Chat";
import SearchBar from "material-ui-search-bar";
import * as _ from "lodash";
import { removeSpacetoLowerCase } from "../../api/helper";
import Services from "../../api/api";
import swal from "sweetalert";


import imgUrl from "../../assets/images/imageUrl.js";

//import "../../assets/css/customstyles.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

function ChatMenuList(props) {
  // console.log("history>>", props);
  const classes = useStyles();
  let history = useHistory();
  const { t } = props;
  const { templateID } = props;
  var compcolor  =  localStorage.getItem('componentbgcolor')
  let bgStyles = templateID == 2 ? { background: compcolor } : {};
  let colorStyles = templateID == 2 ?  { color: compcolor } : {};
  const [state, setState] = useState({
    title: "",
    subtitle: "",
    countOfMsgs: ""
  });

  useEffect(() => {
    // console.log("props.rowObj.countOfMsgs",props.rowObj.countOfMsgs)
    // console.log("rowObj::",props.rowObj)
    if (props.chatType == "peer") {
      let title = '';   
      // if(props.rowObj.id) {
      //   title = props.rowObj.id;
      //   props.rowObj.title = title;
      // } 
      if(props.rowObj.nickName != null) {
         title = props.rowObj.nickName;
      }if(props.rowObj.nickName == "" || props.rowObj.nickName == null){
        title = props.rowObj.id;
     } 
      setState({
        title: title,
        subtitle: props.rowObj.userName,
        countOfMsgs: props.rowObj.countOfMsgs,
      });
     
    } else  if (props.chatType == "admin") {
      setState({
        title: t("Admin"),
        // subtitle: props.rowObj.userName,
      });
    }
    else  if (props.chatType == "provider") {
      setState({
        title: props.rowObj=="User read"?t("Provider"):t(props.rowObj),
        // subtitle: props.rowObj.userName,
      });
    }  else {
      setState({
        title: props.rowObj.title,
        subtitle: "",
        countOfMsgs: props.rowObj.countOfMsgs
      });
    }
  }, [state.title, state.subtitle, state.countOfMsgs]);
  // console.log("state",state)

  function handleClick(rowObj) {
    if(props.rowObj=="User read"){
      swal({
        text: t("Functionality available  only for client registered through provider"),
        icon: "error",
        buttons: "Close",
      })
    }else{

      props.openChat(rowObj);
      // reset message counter to 0 on click
      if(props.chatType == 'group'){
        var counterParams = {
          communityId: localStorage.getItem("CommunityId"),
          msgRecieverUserId: JSON.parse(localStorage.getItem("obj")).userId,
          type: 'group',
          groupId: rowObj.id
        }
        console.log("group chat rest counter::", counterParams);
        Services.updateChatHistoryOnGroupUsingUserId(counterParams);
  
      }else{
        var counterParams = {
          communityId: rowObj.communityId,
          msgSenderUserId: rowObj.id,
          msgRecieverUserId: JSON.parse(localStorage.getItem("obj")).userId,
          noOfMsgsSend: 0,
          type: 'peer'
        }
        console.log("counterParams", counterParams)
        Services.addChatHistoryUsingUserId(counterParams);
      }
    }

  }

  function handleOnSearch (e) {
    let topicList = _.cloneDeep(this.state.title);
    let filtered = [];
    filtered = topicList.filter(function (str) {
      return (
        removeSpacetoLowerCase(str.contentName).indexOf(
          removeSpacetoLowerCase(e)
        ) !== -1
      );
    })
  };

  let icon = <Avatar alt={state.title} src="/static/images/avatar/1.jpg" />;
  if (props.rowObj.urlOfIcon && props.chatType != "peer") {
    icon = <Avatar alt={state.title} src={props.rowObj.urlOfIcon} />;
  } else {
    icon = <Avatar alt={state.title} src={props.rowObj.avtaar} style={bgStyles} />;
  }
  return (
    <>
      <Grid
        container
        spacing={3}
        className="gridcontainer chatuserlistdiv borderbottomgrey"
        onClick={() => handleClick(props.rowObj)}
      >
        <Grid item xs={2} className="zero">
          <p className="zero  text-center forumicon" style={colorStyles}>{icon}</p>
        </Grid>
        <Grid item xs={7} className="zero">
          <p className="zero  chatusername" style={colorStyles}>{t(state.title)}</p>
          <p className="zero chatlastactive">{/*Chat Participent*/}</p>
        </Grid>
        <Grid item xs={3} className="zero">
          <p className="text-center unreadmsgicon">
            <Badge badgeContent={state.countOfMsgs} color="primary">
              <ChatIcon />
            </Badge>
          </p>
          <p className="zero color-yellow chatdistance text-center">
            {/*DateTime*/}
          </p>
        </Grid>
      </Grid>
    </>
  );
}


const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};

let newChatMenuList = withTranslation()(ChatMenuList);
export default connect(mapStateToProps, {})(newChatMenuList);