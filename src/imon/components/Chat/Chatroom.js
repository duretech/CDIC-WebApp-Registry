import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { useHistory, withRouter, Route, Redirect, Switch, Link } from "react-router-dom";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import swal from "sweetalert";
import {store,auth }  from '../../service/firebase'

const Chatroom = (props) =>{
  const [t] = useTranslation();
  let history = useHistory();
  let currentUser;

  useEffect(()=>{
    currentUser= auth().currentUser
    console.log(currentUser)
  },[])

  function createRoom(){
    swal({
      text: t('Enter Room name'),
      content: "input",
      button: {
        text: t("Create"),
        closeModal: true,
      },
      closeOnClickOutside: true,
    }).then(name => {
      console.log(name)
      if (name == "") {
        swal({
          title: t("Please Enter Username"),
          icon: "info",
          button: t("Ok"),
        })
      } else {
        toChat(name)
      }
    })
    .catch(err => {
      console.log("error", err)
    });
  }

  const toChat = async(name) => {
    store.collection("Rooms").doc(name).set({
      name: name,
      owner: {
        uid: currentUser.uid,
        pic: currentUser.photoURL,
        name: currentUser.displayName,
      },
      members: []
    })
    .then(function() {
      console.log("Document successfully written!");
      history.push({
        pathname:"/layout/grpcall",
        state:{
          roomname:name
        }
      })
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
  }

  return(
    <div className="text-center" style={{display:"flex",flexDirection:"column"}}>

    <IconButton
        className='roombtn'
        onClick={() => {
          createRoom()
        }}
        >
        Create room 
        <AddIcon />
      </IconButton>

      <IconButton
        className='roombtn'
        onClick={() => {
          history.push({
            pathname:"/layout/audioroom"
          })
        }}        
      >
        Load rooms 
        <InputIcon />
      </IconButton>
      </div>
  )

}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    selectedComponentObj: storeState.componentObj,
  };
};

const transChatroom = withTranslation()(Chatroom);
const routeChatroom = withRouter(transChatroom);
export default connect(mapStateToProps, {})(routeChatroom);

