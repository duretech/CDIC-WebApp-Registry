import React, { useState, useEffect } from "react";
import { withTranslation, Trans } from "react-i18next";
import { connect } from "react-redux";
import serialize from "form-serialize";
import FormControl from '@material-ui/core/FormControl';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import swal from "sweetalert";

//import "../../assets/css/customstyles.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogBoxTextArea(props) {
  let [open, setOpen] = useState(props.open);
  let [content, setContent] = useState('');
  const { t } = props;

  useEffect(() => {
    setContent('')
  }, []);

  console.log("DialogBox>>", props.open);
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  const handleButtonClick = () => {
    console.log('handleButtonClick>>', content)
    if (content != '') {
      swal({
        text: t("Comment added successfully."),
        icon: "success",
        button: t("Ok"),
      })
      props.onSubmit(content);
      setContent('')
    }else{
      // props.closeDialog(true);
      swal({
      text: t("Comment cannot be empty!"),
      icon: "warning",
      button: t("Ok"),
    })
  };
  };

  const handleClose = () => {
    // setOpen(false);
    props.closeDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    var obj = serialize(form, { hash: true });
    console.log("handle submit>>", event, form, obj);
  };

  const handleTextAreaChange = (event) => {
    console.log('handleTextAreaChange>>', event.target.value)
    setContent(event.target.value)
  }

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
          <DialogContentText className="text-left" style={{ color: props.componentbgcolor }}>
            {t('Please enter your comments below')}
          </DialogContentText>

          <div className="commentinputholder">
            <TextField
              id="standard-multiline-static"
              label=""
              multiline
              rowsMax={4}
              value={content}
              onChange={handleTextAreaChange}
            />
          </div>

          <DialogContentText className="text-center">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={handleButtonClick}
              style={{ background: props.componentbgcolor }}
            >
              {t('Submit')}
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

const transKnowYourRightsDetail = withTranslation()(DialogBoxTextArea);
export default connect(mapStateToProps, {})(transKnowYourRightsDetail);