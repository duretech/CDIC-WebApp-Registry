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

import OfflineDb from '../../db'
import { apiServices } from '../../services/apiServices';
import swal from 'sweetalert';
import CheckIcon from '@material-ui/icons/Check';
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'

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

export default function Disclaimer(props) {
    const [sessionUserBoValue, setSessionUserBoValue] = React.useState(props.sessionUserBoValue);
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    function updateUserConsent() {
        
        sessionUserBoValue.attributeValues[props.userConsentAttributeIndex].value = "true";
        OfflineDb.setDataIntoPouchDB('loginDetails', sessionUserBoValue)
        setGlobalSpinner(true)
        apiServices.putAPI(`users/${sessionUserBoValue.id}`,sessionUserBoValue).then(res=>{
            setGlobalSpinner(false)
            
            swal({
                title: "Done",
                text: res.data.message,
                icon: "success",
                button: "Close",
            }).then(res=>{
                setOpen(false);
                props.userConsent() 
            });
            
        })
    }
    function disagree(){
        OfflineDb.deleteDatabse().then(res=>{
            window.location.reload();
        }).catch(err=>{
            window.location.reload();
        })
    }

    return (
        <div>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>

                        <Typography variant="h6" className={classes.title}>
                            Disclaimer
            </Typography>

                        {/* <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton> */}
                    </Toolbar>
                </AppBar>
                <div className="mt-60px disclaimercontainer">
                    <p>{props.disclaimerContents}</p>
                    <p className="disclaimerbuttonlist">

                        <Button
                            variant="contained"
                            color=""
                            className={classes.button}
                            startIcon={<CheckIcon />}
                            onClick={() => updateUserConsent()}
                        >
                            Agree
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<CloseIcon />}
                            onClick={()=>disagree()}
                        >
                            Disagree
                        </Button>
                    </p>
                </div>
            </Dialog>
        </div>
    );
}
