import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';



import CheckIcon from '@material-ui/icons/Check';


import '../../assets/css/customstyles.css'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            
            <Typography variant="h6" className={classes.title}>
              Disclaimer
            </Typography>
            
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="mt-60px disclaimercontainer">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque metus turpis, vitae ornare ante suscipit ut. Integer risus mauris, volutpat et hendrerit eget, facilisis eget lacus. Aliquam sed lacus at tellus maximus dictum at a tellus. Suspendisse potenti. Pellentesque leo nunc, tristique et vehicula quis, fermentum eu magna. Quisque auctor risus ante, vitae lobortis odio mattis ut. Cras nec pulvinar orci. Sed lobortis nisi sit amet diam malesuada fermentum. Aliquam consequat, sem ac gravida luctus, justo risus placerat mi, quis pharetra sem leo at magna. Pellentesque pretium venenatis nisi ullamcorper imperdiet. Quisque auctor massa nec justo dapibus, nec ornare urna consectetur. Duis placerat aliquet mauris, eu iaculis nisl ultricies at. Praesent pretium, leo et elementum posuere, felis justo congue est, eu hendrerit mi eros eu lacus.</p>
        <p className="disclaimerbuttonlist">

         <Button
        variant="contained"
        color=""
        className={classes.button}
        startIcon={<CheckIcon />}
      >
        Agree
      </Button>
            <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={<CloseIcon />}
      >
        Disagree
      </Button>
     
     
        </p>
        </div>
      </Dialog>
    </div>
  );
}
