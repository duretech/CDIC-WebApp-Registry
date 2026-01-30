import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

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
  const classes = useStyles();

  let [checked] = React.useState(true);

  setTimeout(function(){ checked = false; }, 0);

  return (
    <List className={classes.root}>

     
      <ListItem alignItems="flex-start">
        
        <ListItemText
          primary="Eligible For Testing"
          className="infotitle"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Nickname: John Doe
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Referred On: 20-02-2020
              </Typography>
               <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Referred To: NAP-Latha
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Days Since Referral: 14
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
                  Client Profile
                </Button>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>

      <ListItem alignItems="flex-start">
        
        <ListItemText
          primary="Eligible For Testing"
          className="infotitle"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Nickname: Jane Williams
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Referred On: 18-02-2020
              </Typography>
               <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Referred To: NAP-Latha
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Days Since Referral: 12
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
                  Client Profile
                </Button>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>

      <ListItem alignItems="flex-start">
        
        <ListItemText
          primary="Eligible For Testing"
          className="infotitle"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Nickname: Jackson Lee
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Referred On: 16-02-2020
              </Typography>
               <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Referred To: NAP-Latha
              </Typography>
              <Typography
                component="span"
                variant="body2"
                className="infodesc"
                color="textPrimary"
              >
                Days Since Referral: 10
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
                  Client Profile
                </Button>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
     

     

     
      
    

    

    
     
     

    </List>
  );
}
