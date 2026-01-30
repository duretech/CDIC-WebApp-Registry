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
import { useTranslation } from "react-i18next";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CustomCaseList(row) {
  const classes = useStyles();
  const [rows] = useState(row.row.row);
  const [header] = useState(row.row.searchHeader);
  const [listOfFields, setListOfFields] = useState(null);
  const [fieldsToDisplay, setFieldsToDisplay] = useState([]);
  const { t } = useTranslation()

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

  const getTranslatedLabels = (attribute) => {
    
    if (localStorage.getItem("locale") == "en") {
        return attribute.formName ? attribute.formName : attribute.displayName ;
    } else if (attribute.translations && attribute.translations.length > 0) {
        //debugger;
        let label = attribute.translations.filter(tanslation => tanslation.property == "NAME" && tanslation.locale == localStorage.getItem("locale"))
        if (label.length > 0) {            
            return label[0].value;
        } else {
            return attribute.formName ? attribute.formName : attribute.displayName ;
        }
    }
    return attribute.formName ? attribute.formName : attribute.displayName ;
};

  const lsitView = () => {
    return (
      <>
        {fieldsToDisplay.length > 0
          ? fieldsToDisplay.map((eachFields, i) => {
              let field = eachFields;
                let fieldName = eachFields.trackedEntityAttribute.description ? eachFields.trackedEntityAttribute.description : eachFields.trackedEntityAttribute.formName ? eachFields.trackedEntityAttribute.formName : eachFields.trackedEntityAttribute.displayName
                let fieldValue = rows[header.findIndex(x => x.column.toLowerCase() == fieldName.toLowerCase())] ? rows[header.findIndex(x =>  x.column.toLowerCase() == fieldName.toLowerCase())] : ''
                if(!fieldValue){
                  let fieldId = eachFields.trackedEntityAttribute.id
                  fieldValue = rows[header.findIndex(x => x.name == fieldId)] ? rows[header.findIndex(x =>  x.name == fieldId)] : t('N/A')
                }
                if(eachFields && eachFields.trackedEntityAttribute && eachFields.trackedEntityAttribute.valueType == "DATE"){
                  fieldValue = moment(fieldValue).format('MM-DD-YYYY')
                }
                if(field && field.trackedEntityAttribute && field.trackedEntityAttribute.optionSet){
                  field.trackedEntityAttribute.optionSet.options.map(option => {
                    if(option.code == fieldValue){
                      fieldValue = getTranslatedLabels(option)
                    }
                  })
                }
              return (
                <p className="alerts_description_fields row-block" key={i}>
                  <div className="fl-left">{getTranslatedLabels(eachFields.trackedEntityAttribute)} : </div>
                  <div className="fl-left">&nbsp;{fieldValue
                    ?
                    fieldValue
                    : t('N/A')}</div>
                </p>
              );
            })
          : null}
      </>
    );
  };

  const cardView = () => {
    return (
      <List className={classes.root}>
        {fieldsToDisplay.length > 0
          ? fieldsToDisplay.map((eachFields, i) => {
              let field = eachFields;
              let fieldName = eachFields.trackedEntityAttribute.description ? eachFields.trackedEntityAttribute.description : eachFields.trackedEntityAttribute.formName ? eachFields.trackedEntityAttribute.formName : eachFields.trackedEntityAttribute.displayName
              let fieldValue = rows[header.findIndex(x => x.column.toLowerCase() == fieldName.toLowerCase())] ? rows[header.findIndex(x =>  x.column.toLowerCase() == fieldName.toLowerCase())] : ''
              if(!fieldValue){
                let fieldId = eachFields.trackedEntityAttribute.id
                fieldValue = rows[header.findIndex(x => x.name == fieldId)] ? rows[header.findIndex(x =>  x.name == fieldId)] : t('N/A')
              }
              if(field && field.trackedEntityAttribute && field.trackedEntityAttribute.optionSet){
                field.trackedEntityAttribute.optionSet.options.map(option => {
                  if(option.code == fieldValue){
                    fieldValue = getTranslatedLabels(option)
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
                    primary={
                      fieldValue
                        ? fieldValue
                        : t('N/A')
                        }
                    secondary={getTranslatedLabels(eachFields.trackedEntityAttribute)}
                  />
                </ListItem>
              );
            })
          : null}
      </List>
    );
  };
  return row.viewType == "card" ? cardView() : lsitView();
}
