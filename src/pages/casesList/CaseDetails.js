import React from 'react';
import {
    makeStyles
} from '@material-ui/core/styles';
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
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import EventIcon from '@material-ui/icons/Event';
import PhoneIcon from '@material-ui/icons/Phone';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import EmailIcon from '@material-ui/icons/Email';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LanguageIcon from '@material-ui/icons/Language';
import EventNoteIcon from '@material-ui/icons/EventNote';

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

    avatar: {
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

export default function CaseDetails(res) {
    const classes = useStyles();
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);

    //
    
    const header = res.searchHeader
    const result = res.searchResult
  
    return (
        <div className={classes.root}>
            <div className={classes.demo}>
                <List dense={dense}>
                <ListItem key="002">
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <PersonOutlineIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary = {`${result[7]}`}
                            secondary = {`${header[7].column}`}
                        />
                    </ListItem> 
                    <ListItem key="003">
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                            <PersonOutlineIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary = {`${result[8]}`}
                            secondary = {`${header[8].column}`}
                        />
                    </ListItem>
                    <ListItem key="004">
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                            <PersonOutlineIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary = {`${result[13]}`}
                            secondary = {`${header[13].column}`}
                        />
                    </ListItem>
                    <ListItem key="005">
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <SmartphoneIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary = {`${result[14]}`}
                            secondary = {`${header[14].column}`}
                        />
                    </ListItem>
                    <ListItem key="006">
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <EventNoteIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary = {`${result[23]}`}
                            secondary = {`${header[23].column}`}
                        />
                    </ListItem>
                </List>
            </div>
        </div>
    );
}