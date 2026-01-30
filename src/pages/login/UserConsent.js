import React from "react";
import { useHistory } from "react-router-dom";
import ArrowBack from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/css/formStyle.css'

const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'block',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    appBarSpacer: {
      ...theme.mixins.toolbar, // Ensures there is enough space for AppBar
    },
    content: {
      padding: theme.spacing(3),
      marginTop: theme.mixins.toolbar.minHeight + 10, // Adds margin for AppBar
      flexGrow: 1,
    },
    iframeContainer: {
      flexGrow: 1,
      padding: "20px",
      height: "calc(100vh - 180px)", 
    },
    footer: {
      display: "flex",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "#f1f1f1",
    },
    backButton: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }
}));

const UserConsent = () => {
  const history = useHistory();
  const classes = useStyles();

  // Function to navigate back
  const handleBack = () => {
    history.goBack();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* AppBar and Toolbar for the header */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="go back"
            onClick={handleBack}
          >
            <ArrowBack />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            Consent
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Add some spacing after the AppBar */}
      <div className={classes.appBarSpacer}></div>

      {/* Main content area */}
      <div className={classes.iframeContainer}>
        <iframe
           src="https://eworldfulfillment.com/wp-content/uploads/2021/01/Privacy-Policy-Example-Template.pdf" 
          title="Privacy Policy"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        ></iframe>
      </div>

      {/* Footer with Back button */}
      {/* <footer className={classes.footer}>
        <button className="regformsubmitbtn" onClick={handleBack}>
          Back
        </button>
      </footer> */}
    </div>
  );
};

export default UserConsent;
