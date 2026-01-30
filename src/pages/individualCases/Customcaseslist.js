import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import PersonIcon from '@material-ui/icons/Person';
import StayCurrentPortraitIcon from '@material-ui/icons/StayCurrentPortrait';
import OfflineDb from '../../db';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CustomCaseList(row) {

  const classes = useStyles();
  const [rows] = useState(row.row.row)
  const [listOfFields,setListOfFields] = useState(null)
  const [fieldsToDisplay,setFieldsToDisplay] = useState([])
  
  useEffect(()=>{
      OfflineDb.getDataFromPouchDB('metaData')
      .then(metaData => {
          if(metaData.data != undefined) {
            setListOfFields(metaData.data.programs[0].programTrackedEntityAttributes)
          }
      })
  },[])

  useEffect(()=>{
    if(listOfFields != null){
      let filtteredFields= listOfFields.filter(obj => obj.displayInList == true);
      setFieldsToDisplay(filtteredFields)
    }    
  },[listOfFields])
  
  const getAttributeValue = (eachFields)=>{
    let arrTemp = rows.attributes.filter(attr => attr.attribute == eachFields.trackedEntityAttribute.id);
    if(arrTemp.length > 0){
      return arrTemp[0].value;
    }else{
      return "N/A";
    } 
  } 

  const lsitView = ()=>{
    return(
      <>
      {(fieldsToDisplay.length > 0) ? fieldsToDisplay.map((eachFields,i) => {
          return (
            <p className="alerts_description_fields" key={i}>
              {eachFields.trackedEntityAttribute.displayName} : 
              {getAttributeValue(eachFields)}
            </p>
              
            
          )
        }): null}
      {/* <p className="alerts_title">HIV Testing and Counseling</p>
      <p className="alerts_description_fields">Father's Last Name: Doe</p>
      <p className="alerts_description_fields">Mother's Last Name: Doe</p>
      <p className="alerts_description_fields">Gender: Male</p>
      <p className="alerts_description_fields">Year of Birth: 1984</p>
      <p className="alerts_description_fields">Nickname: John</p> */}
      </>
    )
  }

  const cardView = ()=>{
    return(
      <List className={classes.root}>

        {(fieldsToDisplay.length > 0) ? fieldsToDisplay.map((eachFields,i) => {
          return (
            
              <ListItem key={i}> 
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                primary={getAttributeValue(eachFields)} 
                secondary={eachFields.trackedEntityAttribute.displayName}
               />
              </ListItem>
            
          )
        }): null}
      </List>
    )
  }
  return ((row.viewType == 'card') ? cardView() : lsitView());
}
