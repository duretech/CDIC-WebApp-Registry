import React, { useState, useEffect } from "react";
import { withTranslation, Trans } from "react-i18next";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 function DialogBox(props) {
  const [open, setOpen] = useState(props.open);
  const { t } = props;

  console.log('DialogBox>>', props.open)

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleButtonClick = () => {
    // setOpen(false);
    props.buttonClick(false)
  };

  const handleClose = () => {
    // setOpen(false);
    props.closeDialog(false)
  };

  useEffect(() => {
    console.log('props.open??', props.open)
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText className=" text-center" style={{ color: props.componentbgcolor }}>
            {t('For joining the chat you must register yourself Click below to register')}
          </DialogContentText>
          <DialogContentText className="text-center">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={handleButtonClick}
              style={{ background: props.componentbgcolor }}
            >
               {t('Register')}
              
            </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}



const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};



const transKnowYourRightsDetail = withTranslation()(DialogBox);
export default connect(mapStateToProps, {})(transKnowYourRightsDetail);