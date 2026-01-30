import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import PersonIcon from "@material-ui/icons/Person";
import StayCurrentPortraitIcon from "@material-ui/icons/StayCurrentPortrait";
import OfflineDb from "../../db";
import moment from 'moment'
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function CardContent (props) {
    const classes = useStyles();
    const [listOfFields, setListOfFields] = useState(null);
    const [fieldsToDisplay, setFieldsToDisplay] = useState([]);
    const [fromComponent, setComponent] = useState(props.FromComponent ? props.FromComponent : undefined)
    const [returnStructure, setReturn] = useState(<> </>)

    useEffect(() => {
        OfflineDb.getDataFromPouchDB("metaData").then((metaData) => {
          if (metaData.data != undefined) {
            setListOfFields(
              metaData.data.programs[0].programTrackedEntityAttributes
            );
          }
        });
      }, []);
    
      useEffect(() => {
        if (listOfFields != null) {
          let filtteredFields = listOfFields.filter(
            (obj) => obj.displayInList == true
          );
          setFieldsToDisplay(filtteredFields);
        }
      }, [listOfFields]);

    function createAlertStrucure () {
    }
    // if(fieldsToDisplay.length > 0 ) {
    //     console.log('props.data', props.DataArray, fieldsToDisplay)
    // }
    const getTranslatedLabels = (dataElement) => {
      if (localStorage.getItem("locale") == "en") {
          return dataElement.formName ? dataElement.formName : dataElement.displayName;
      } else if (dataElement.translations && dataElement.translations.length > 0) {
          let label = dataElement.translations.filter(
              (tanslation) =>
                  tanslation.property == "NAME" &&
                  tanslation.locale == localStorage.getItem("locale")
          );
          if (label.length > 0) {
              return label[0].value;
          } else {
              return dataElement.formName ? dataElement.formName : dataElement.displayName;
          }
      }
      return dataElement.formName ? dataElement.formName : dataElement.displayName;
    };
    return (
        <List className={classes.root}>
        {fieldsToDisplay.length > 0
          ? fieldsToDisplay.map((eachFields, i) => {
            let fieldName = eachFields.trackedEntityAttribute.description ? eachFields.trackedEntityAttribute.description : eachFields.trackedEntityAttribute.formName ? eachFields.trackedEntityAttribute.formName : eachFields.trackedEntityAttribute.displayName
            let fieldValue = props.DataArray.find(x => x[fieldName]) ? props.DataArray.find(x => x[fieldName])[fieldName] : ''
            if(eachFields && eachFields.trackedEntityAttribute && eachFields.trackedEntityAttribute.valueType == "DATE"){
              fieldValue = moment(fieldValue).format('MM-DD-YYYY')
            }
            if(eachFields && eachFields.trackedEntityAttribute && eachFields.trackedEntityAttribute.optionSet){
              eachFields.trackedEntityAttribute.optionSet.options.map(option => {
                if(props.DataArray.find(x => x[fieldName])){
                  if(props.DataArray.find(x => x[fieldName])[fieldName] == option.code){
                    fieldValue = getTranslatedLabels(option)//option.displayName
                  }
                }
              })
            }
              return (
                <ListItem key={i}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={fieldValue ? fieldValue : 'N/A'}
                    secondary={getTranslatedLabels(eachFields.trackedEntityAttribute)}
                  />
                </ListItem>
              );
            })
          : null}
      </List>
    )
}

export default CardContent