import React, { useState, useEffect } from "react";
import { withTranslation, Trans } from "react-i18next";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogBoxShareOnSocialMedia(props) {
  let [open, setOpen] = useState(props.open);
  const { t } = props;
  
  const url = String(window.location);
  const title = props.contentObj.contentList[0].title;
  // const url = String('https://material-ui.com/components/dialogs/');
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    // setOpen(false);
    props.closeDialog(false);
  };

  useEffect(() => {
    console.log("props.open??", props.open);
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
          <DialogContentText className="color-green text-left">
            {t('Share')}
          </DialogContentText>

          <DialogContentText className="text-center">
            <div className="infolinkcontainer text-left d-flex">
              <TwitterShareButton 
                title={title}
                url={url}
              >
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
              <FacebookShareButton 
                title={title}
                url={url}
              >
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <WhatsappShareButton 
                title={title}
                url={url}
              >
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default (withTranslation()(DialogBoxShareOnSocialMedia));