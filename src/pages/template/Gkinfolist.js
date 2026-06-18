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
          primary="Why should I get tested?"
          className="infotitle"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Knowing your HIV status is the best way to protect your health and the health of your partner. If you have an HIV-positive status, early initiation of treatment gives you the best chance to live a healthy and long life. Many people who are HIV-positive do not know their status, and could unknowingly infect others. If you are a sexually active person, you should get tested. 
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
          primary="How long will the test take?"
          className="infotitle"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                The actual test time will take from 15 to 30 minutes depending on the test result. For rapid tests used at our sites only a small drop of blood is needed. An algorithm of testing with the primary (so-called screening) test is used and, in the case of a positive result, a confirmatory test is carried out immediately also with a rapid test. If you will be tested in our clinic, we guarantee that testing will be carried out quickly and qualitatively.
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
