import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { useHistory, withRouter, Route, Redirect, Switch, Link } from "react-router-dom";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import { store, auth } from '../../service/firebase'
import AgoraRTC from "agora-rtc-sdk"
import Loader from '../loaders/loader';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";

let client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

let appId = "7105270ce2c24a8a8757dc2bdc8e222f";

let handleError = function (err) {
  console.log("Error: ", err);
};

const Grpcall = (props) => {
  const [t] = useTranslation();
  let history = useHistory();
  const [connstate, setConnstate] = useState("");
  const [active, setActive] = useState([]);
  const [hostId, setHostId] = useState("");
  const [mute, setMute] = useState(false);
  const [stream, setstream] = useState("");
  const [streamid, setStreamId] = useState(0);
  const [load, setLoad] = useState(false)

  let currentUser;
  console.log(props)
  let room = props.location.state.roomname

  async function addVideoStream(elementId) {
    console.log(elementId);
    let remoteContainer = document.getElementById("remote");

    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);
  }

  async function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) {
      remoteDiv.parentNode.removeChild(remoteDiv);
    }
  }
  
  useEffect(() => {
    console.log("123")
    currentUser = auth().currentUser
    console.log(currentUser)
    
    
    initClient()
    setLoad(true)

    
    client.on("stream-added", function (evt) {
      client.subscribe(evt.stream, handleError);
    });

    client.on("stream-subscribed", function (evt) {
      console.log("peer added")
      let stream = evt.stream;
      let streamId = String(stream.getId());
      addVideoStream(streamId);
      stream.play(streamId);
      store.collection("Rooms").doc(room).get().then((querySnapshot) => {
        const data = querySnapshot.data();
        console.log("newlist",data)
        setActive(data.members)
      })
    });

    client.on("connection-state-change", (evt) => {
      console.log("status",evt.curState)
      setConnstate(evt.curState);
    });

    client.on("stream-removed", async function (evt) {
      let stream = evt.stream;
      let streamId = stream.getId();
      stream.close();
      store.collection("Rooms").doc(room).get().then((querySnapshot) => {
        const data = querySnapshot.data();
        store.collection("Rooms").doc(room).update({
        members: data.members.filter((member)=>member.userId !== streamId)
    })
    })
        .then(() => removeVideoStream(streamId))
        .catch((e) => console.log(e));
      
    });

    client.on("peer-leave", async function (evt) {
      console.log("peer left",evt,evt.stream)
      let stream = evt.stream;
      let streamId = stream.getId();
      stream.close();
      store.collection("Rooms").doc(room).get().then((querySnapshot) => {
        const data = querySnapshot.data();
        console.log("updated",data,streamId)
        let users = data.members.filter((member)=>member.userId !== streamId)
        store.collection("Rooms").doc(room).update({
        members: users
        })
        console.log("updated1",users)

        setActive(users)
      })
        .then(() => removeVideoStream(streamId))
        .catch((e) => console.log(e));
    });
    
    return () =>
      client.leave(async () => {
        if (streamid) {
          store.collection("Rooms").doc(room).get().then((querySnapshot) => {
            const data = querySnapshot.data();
            store.collection("Rooms").doc(room).update({
            members: data.members.filter((member)=>member.userId !== streamid)
        })
        })
            .catch((e) => console.log(e));
        }
      });

  }, [])

  function initClient(){
    client.init(
      appId,
      function () {
        console.log("AgoraRTC client initialized");
        joinStream()
        
      },
      function (err) {
        console.log("AgoraRTC client init failed", err);
      }
      )      
    
  }

  const joinStream = async () => {
    const { token, uid } = await (
      await fetch(
        `https://agora-token.azurewebsites.net/api/trigger?name=${room}`
      )
    ).json();
    client.join(token, room, uid, async (userId) => {
      setStreamId(userId);
      // let users=[]

      store.collection("Rooms").doc(room)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.data();
        let users=[]

        if(data.members.length==0){
          console.log("1")
          users.push({
            uid: currentUser.uid,
            pic: currentUser.photoURL,
            name: currentUser.displayName,
            userId: userId,
          })
        }else{
          console.log("2")
          users=data.members.filter((user) => user.uid != currentUser.uid);
          users.push({
            uid: currentUser.uid,
            pic: currentUser.photoURL,
            name: currentUser.displayName,
            userId: userId,
          })
        }

        console.log("users",users)
        store.collection("Rooms").doc(room).update({
          members: users
        })   
        .then(() => {
          let localStream = AgoraRTC.createStream({
            audio: true,
            video: false,
          });
          setstream(localStream);
          localStream.init(() => {
            localStream.play("me");
            client.publish(localStream, handleError);
          }, handleError);
          setActive(users)
          setLoad(false);
          setConnstate(client.getConnectionState());
          setStreamId(userId);
        })
        .catch((e) => setLoad(false));
        setHostId(data.owner.uid);

      })

    })

  }

  return (
    <>
      {
        load ? (
          <Loader isLoading={load} />
        ) : (
          <>
            <div>
              < h4 style={{ textTransform: "capitalize", textAlign: "center" }}>
                participants
              </h4>
              <div id="me"></div>
              <div id="remote"></div>
              <Grid container gap={0} style={{ maxHeight: "50vh" }}>
                {active.map((person, i) => (
                  <Grid xs={8} key={person.uid}>
                    <div style={{ margin: "0 auto" }}>
                      <Avatar src={person.pic} alt="pic" size="medium" />
                      <p style={{ textAlign: "center" }}>
                        {person?.name?.split(" ")[0]}
                      </p>
                    </div>
                  </Grid>
                ))}
              </Grid>
              {/* <Dot style={{ margin: "20px 0" }}>{conn_state}</Dot> */}
            </div>

            {stream &&(
              <div>
                <div
                  // style={{
                  //   position: "absolute",
                  //   bottom: 10,
                  //   padding: 10,
                  //   width: "90%",
                  //   display: "flex",
                  //   alignItems: "center",
                  //   justifyContent: "space-between",
                  // }}
                >
                  <div>
                    {mute ? (

              <IconButton
                onClick={() => {
                  stream.unmuteAudio();
                  setMute(false);
                }}
              >   
                  <MicOffIcon/>
              </IconButton>

                  
                    ) : (

                <IconButton
                  onClick={() => {
                    stream.muteAudio();
                    setMute(true);
                  }}
                >   
                  <MicIcon/>
                </IconButton>

                      
                    )}
                  </div>


                  <IconButton
                    onClick={() => {
                      store.collection("Rooms").doc(room).get().then((querySnapshot) => {
                        const data = querySnapshot.data();
                        store.collection("Rooms").doc(room).update({
                        members: data.members.filter((member)=>member.userId !== streamid)
                    })
                    }).then(() => history.push({
                        pathname:"/layout/audioroom"
                      }))
                      .catch((e) => console.log(e));
                    }}
                  >
                    <ExitToAppIcon/>
                  </IconButton>

                </div>
              </div>
            )}
          </>
        )
      }
    </>

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

const transGrpcall = withTranslation()(Grpcall);
const routeGrpcall = withRouter(transGrpcall);
export default connect(mapStateToProps, {})(routeGrpcall);