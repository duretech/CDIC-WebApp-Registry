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
import DescriptionIcon from '@material-ui/icons/Description';
import Typography from '@material-ui/core/Typography';
import '../../assets/css/customstyles.css'

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
            <DescriptionIcon />
          </Avatar>
        </ListItemAvatar>
        <Typography>
        <p className="zero servicequestiontitle">rRpAT Assay</p>
        <p className="zero servicequestionanswer">Yes</p>
        </Typography>
      </ListItem>
     <ListItem>
        <ListItemAvatar>
          <Avatar>
            <DescriptionIcon />
          </Avatar>
        </ListItemAvatar>
        <Typography>
        <p className="zero servicequestiontitle">Rapid Antibody</p>
        <p className="zero servicequestionanswer">Yes</p>
        </Typography>
      </ListItem>
     <ListItem>
        <ListItemAvatar>
          <Avatar>
            <DescriptionIcon />
          </Avatar>
        </ListItemAvatar>
        <Typography>
        <p className="zero servicequestiontitle">Date of Release of Result</p>
        <p className="zero servicequestionanswer">20-09-2020</p>
        </Typography>
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <DescriptionIcon />
          </Avatar>
        </ListItemAvatar>
        <Typography>
        <p className="zero servicequestiontitle">Test Result</p>
        <p className="zero servicequestionanswer">Negative</p>
        </Typography>
      </ListItem>
    </List>
  );
}
