import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { useHistory, withRouter, Route, Redirect, Switch, Link } from "react-router-dom";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import swal from "sweetalert";
import {store,auth }  from '../../service/firebase'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const Audioroom = (props) =>{
  const [t] = useTranslation();
  let history = useHistory();
  const [rooms, setRooms] = useState([]);
  let currentUser;

  useEffect(() => {
    currentUser= auth().currentUser
    console.log("entered",currentUser)
    let l = [];
    store.collection("Rooms")
.get()
.then((querySnapshot) => {
  const data = querySnapshot.docs.map(doc => doc.data());
  console.log(data);

setRooms(data);
    });
  }, [store]);

  function joinRoom(name){
    history.push({
      pathname:"/layout/grpcall",
      state:{
        roomname:name
      }
    })
  }

  return(
    <div className="text-center" style={{display:"flex",flexDirection:"column"}}>
    {

    rooms.map((room) => (
<Card  variant="outlined">
      <CardContent>
        <Typography  color="textSecondary" gutterBottom>
      {room.name}
        </Typography>  
      </CardContent>
      <CardActions>
        <IconButton size="small"
        onClick={()=>{
          joinRoom(room.name)
        }}
        >Join room <InputIcon/></IconButton>
      </CardActions>
      {currentUser && room.owner.uid == currentUser.uid ? (
        <CardActions>
        <IconButton size="small">Delete room</IconButton>
      </CardActions>
      ):("")
      
    }
    </Card>
      )   
     ) }  
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

const transAudioroom = withTranslation()(Audioroom);
const routeAudioroom = withRouter(transAudioroom);
export default connect(mapStateToProps, {})(routeAudioroom);