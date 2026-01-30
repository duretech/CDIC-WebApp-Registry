import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EventNoteIcon from '@material-ui/icons/EventNote';

import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Customcaseslist from './Customcaseslist.js';

import '../../assets/css/customstyles.css'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin:'0 auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className="casescardheader"
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            <EventNoteIcon />
          </Avatar>
        }
        action={
          <div>
      <IconButton  aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton >
      <Menu
        id="simple-menu"
        className="casesactionmenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}><VisibilityIcon /> See Individual Record</MenuItem>
        <MenuItem onClick={handleClose}><EditIcon /> New/Update Individual Record</MenuItem>
      </Menu>
    </div>
        }
        title="U09628"
        subheader="UIC"
      />
     
      <CardContent className="zero caselistholder">
        <Customcaseslist></Customcaseslist>
      </CardContent>
      <CardActions disableSpacing className="cardactionfooter">
        <IconButton aria-label="add to favorites">
          <VisibilityIcon />
        </IconButton>
        <IconButton aria-label="share">
          <EditIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className="zero caselistholder">
         <Customcaseslist></Customcaseslist>
          
         
        </CardContent>
      </Collapse>
    </Card>
  );
}
