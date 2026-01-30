import React from 'react';
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function FolderList() {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Jackson" secondary="Father's Last Name" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Jackson" secondary="Mother's Last Name" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Mike" secondary="Nick Name" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <StayCurrentPortraitIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="9191919191" secondary="Mobile Number" />
      </ListItem>
    </List>
  );
}
