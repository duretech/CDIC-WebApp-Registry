import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import RoomIcon from '@material-ui/icons/Room';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },

  avatar:{
    backgroundColor: '#333',
  }
}));

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

export default function InteractiveList() {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  return (
    <div className={classes.root}>
     
      
         
          <div className={classes.demo}>
            <List dense={dense}>
              
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Fernandes,Alvaro"
                    secondary="Name"
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <RoomIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Apt 110,NRC,Philipines"
                    secondary="Address"
                  />
                </ListItem>

                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <AssignmentIndIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Positive"
                    secondary="Test Status"
                  />
                </ListItem>
           
            </List>
          </div>
      
    </div>
  );
}