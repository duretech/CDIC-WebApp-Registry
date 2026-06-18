import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

import Button from "@material-ui/core/Button";

import Zoom from '@material-ui/core/Zoom';

import "../../assets/css/customstyles.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

export default function AlignItemsList() {
  const { t } = useTranslation();
  const classes = useStyles();

  let [checked] = React.useState(true);

  setTimeout(function(){ checked = false; }, 0);

  return (
    <List className={classes.root}>

     
      <ListItem alignItems="flex-start">
       
        <ListItemText
          primary="What is HIV?"
          className="infotitle"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
               HIV is the Human Immunodeficiency Virus. HIV affects the immune system, specifically the T-Cells or CD4 cells which fight infection. Simply put, the virus destroys the T-cells so that the immune system of a person with untreated HIV infection is not able to fight off diseases and infections.
              </Typography>
             
             
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  className="infoviewmorebtn"
                >
                  {t("View More")}
                </Button>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
     

     

     
      <ListItem alignItems="flex-start">
       
        <ListItemText
          primary="What is AIDS?"
          className="infotitle"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                AIDS stands for Acquired Immune Deficiency Syndrome. AIDS is caused by HIV and is a late stage of infection. A person can live many years with the Human Immunodeficiency Virus in his or her system without experiencing any symptoms. When because of the HIV influence a large amount of T-cells have been destroyed, the human body loses the ability to fight infection and disease, a person can be diagnosed with AIDS.
              </Typography>
              
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  className="infoviewmorebtn"
                >
                  {t("View More")}
                </Button>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    

    

    
     
     

    </List>
  );
}
