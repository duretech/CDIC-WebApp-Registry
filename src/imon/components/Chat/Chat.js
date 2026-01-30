import React, { Component } from "react";
import { connect } from 'react-redux';
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router-dom";
import { auth } from "../../service/firebase";
import { db } from "../../service/firebase";
import { signup, signin, signInWithGoogle, logError } from "../../helpers/auth";

import { setPeerToPeerChatRoom } from "../../api/helper";


import "./chat.css";

import imgUrl from "../../assets/images/imageUrl.js";
import InnerHeader from "../Layout/InnerHeader";
import Loader from '../loaders/loader';
import swal from "sweetalert";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      content: "",
      readError: null,
      writeError: null,
      loadingChats: false,
      authenticated: false,
      isLoading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.googleSignIn = this.googleSignIn.bind(this);
    this.myRef = React.createRef();
  }

  componentWillUnmount() {
    auth().signOut();
  }

  async componentDidMount() {
    console.log("chatMenuObj>>>", this.props, this.state.user);
    if(this.props.location.state && this.props.location.state.id) {
      this.setChatArea(this.props.userObj.userId, this.props.location.state.id);
    } else {
      this.props.history.goBack();
    }
    // this.createUser(this.props.location.state.userName);
    // auth().onAuthStateChanged(user => {
    //   console.log('onAuthStateChanged>>', user)
    //   if (user) {
    //     this.setState({
    //       authenticated: true,
    //       loading: false,
    //       user: auth().currentUser,
    //     }, () => {
    //       this.setChatArea()
    //     });
    //   } else {
    //     this.setState({
    //       authenticated: false,
    //       loading: false
    //     });
    //   }
    // });
  }

  setChatRoom(senderId, receiptId) {
    let {communityuid, chatConfig } = {...this.props}
    let chatroom = `${communityuid}`;
    console.log("setChatRoom>>", setPeerToPeerChatRoom(senderId, receiptId));
    if(chatConfig.chatType == 'peer') {
      return chatroom = `${chatroom}/${chatConfig.chatType}/${setPeerToPeerChatRoom(senderId, receiptId)}`;
    } else {
      console.log('group chat', this.props)
      return chatroom = `${chatroom}/${chatConfig.chatType}/${receiptId}`;
    }
  }

  setChatArea(senderId, receiptId) {
    console.log('setChatArea>>', senderId, receiptId)
    
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;
    try {
      
      let chatroom = this.setChatRoom(senderId, receiptId);
      
      db.ref(chatroom).on("value", (snapshot) => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        });
        this.setState({ 
          chats,
          user: auth().currentUser,
        });
        chatArea.scrollBy(0, chatArea.scrollHeight);
        this.setState({ loadingChats: false });
      });
    } catch (err) {
      console.error(err);
      var errorObj = {
        component: 'Chat',
        method: 'setChatArea',
        error: err
      }
      logError(errorObj);
      this.setState({ readError: err.message, loadingChats: false });
    }
  }

  handleChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

  async handleSubmit(event) {
    let { userObj, location } = {...this.props}
    
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;
    try {
      let chatroom = this.setChatRoom(userObj.userId, location.state.id);
      let data = {
        content: this.state.content,
        timestamp: Date.now(),
        fbuid: auth().currentUser.uid,
        systemuid: userObj.userId
      }

      console.log('chatroom>>', chatroom, data)


      await db.ref(chatroom).push(data);
      this.setState({ content: "" });
      chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (err) {
      console.error(err);
      var errorObj = {
        component: 'Chat',
        method: 'handleSubmit',
        error: err
      }
      logError(errorObj);
      this.setState({ writeError: err.message });
    }
  }

  handleLogout() {
    this.setState(
      {
        authenticated: false,
      },
      () => {
        auth().signOut();
      }
    );
  }

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      <div className="chat-page">
        {this.state.loading ? (
          <Loader isLoading={this.state.isLoading}/>
        ) : (
          <>
            <div className="chat-area" ref={this.myRef}>
              {/* loading indicator */}
              {this.state.loadingChats ? (
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                ""
              )}
              {/* chat area */}
              {this.state.chats.map((chat) => {
                return (
                  <p
                    key={chat.timestamp}
                    className={
                      "chat-bubble " +
                      (this.state.user.uid === chat.fbuid ? "current-user" : "")
                    }
                  >
                    {chat.content}
                    <br />
                    <span className="chat-time float-right">
                      {this.formatTime(chat.timestamp)}
                    </span>
                  </p>
                );
              })}
            </div>
            <form onSubmit={this.handleSubmit} className="mx-3">
              <textarea
                className="form-control"
                name="content"
                onChange={this.handleChange}
                value={this.state.content}
              ></textarea>
              {this.state.error ? (
                <p className="text-danger">{this.state.error}</p>
              ) : null}
              <button type="submit" className="btn btn-submit px-5 mt-4">
                Send
              </button>
            </form>
            
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
    userObj: storeState.userDetail,
    chatConfig: storeState.chatConfig
  };
}

let routeChat = withRouter(Chat);
export default connect(mapStateToProps, {})(routeChat)
