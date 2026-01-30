import React, { useEffect, useRef, useState } from 'react';
import { withTranslation, Trans } from "react-i18next";
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import FeedbackIcon from '@material-ui/icons/Feedback';
import TextField from '@material-ui/core/TextField';
import html2canvas from 'html2canvas';
import swal from "sweetalert";
import ApiServices from "../api/api";
import { logError } from '../helpers/auth';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function Feedback(props) {
  const { t } = props;
  const { templateID } = props;
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [iscreenshotAttachment, setiscreenshotAttachment] = useState(null);
  const [iscreenshotContinue, setiscreenshotContinue] = useState(null);
  const [addQuestionModal1, setaddQuestionModal1] = useState(false);
  const [isDrawing, setisDrawing] = useState(false);
  const [screenshotFlag, setscreenshotFlag] = useState(false);
  const [scrollHW, setscrollHW] = useState({});
  const [loading, setLoading] = useState(false);
  const canvas = useRef(null);
  const contextRef = useRef(null);

  let colorStyles = templateID == 2 ? { color: localStorage.getItem('componentbgcolor') } : {};
  var ongoingTouches = [];

  const handleClickOpen = () => {
    if(!navigator.onLine){
      swal({
        text: t("Functionality not available in offline mode"),
        icon: "error",
        button: t("Ok"),
      })
    }else{
    setOpen(true);
    html2canvas(document.querySelector('#root'), {
      allowTaint: true,
      useCORS: true,
    }).then(canvas => {
      const imageScreen = new Image();
      imageScreen.src = canvas.toDataURL();
      imageScreen.onload = () => setiscreenshotContinue(imageScreen)
    });
    var elmnt = document.getElementById("root");
    var y = elmnt.scrollHeight;
    var x = elmnt.scrollWidth;
    let oData = {};
    oData['height'] = y;
    oData['width'] = x;
    setscrollHW(oData);
  }
  };

  useEffect(() => {
    if (addQuestionModal1) {
      setTimeout(() => {
        if (iscreenshotContinue && canvas) {
          var scrcontiner = document.getElementById("attachedscrssnhot");
          let oData = {};
          oData['height'] = scrcontiner.offsetHeight;
          oData['width'] = scrollHW.width;
          setscrollHW(oData);
          const ctx = canvas.current.getContext('2d');
          ctx.drawImage(iscreenshotContinue, 0, 0, scrcontiner.offsetWidth, canvas.current.height);
          const canvas1 = canvas.current;
          const ctx1 = canvas1.getContext('2d');
          ctx1.scale(1, 1)
          ctx1.lineCap = "round";
          ctx1.strokeStyle = "red"
          ctx1.lineWidth = 5;
          contextRef.current = ctx1;
          var el = document.getElementById("screeCanvas");
          console.log(el)
          el.addEventListener('touchstart', touchstart, false);
          el.addEventListener('touchmove', touchmove, false);
          el.addEventListener('touchend', touchend, false);

        }
      }, 1000);
    }
  }, [addQuestionModal1])

  function touchstart(event) { drawstart(event.touches[0]) }
  function touchmove(event) { drawmove(event.touches[0]); event.preventDefault(); }
  function touchend(event) { drawend(event.changedTouches[0]) }

  var isIdle = true;
  function drawstart(event) {
    var el = document.getElementById("screeCanvas");
    var context = el.getContext('2d');
    context.beginPath();
    context.moveTo(event.pageX - el.offsetLeft - 15, event.pageY - el.offsetTop - 15);
    isIdle = false;
  }

  function drawmove(event) {
    if (isIdle) return;
    var el = document.getElementById("screeCanvas");
    var context = el.getContext('2d');
    context.lineTo(event.pageX - el.offsetLeft - 15, event.pageY - el.offsetTop - 15);
    context.stroke();
  }

  function drawend(event) {
    if (isIdle) return;
    drawmove(event);
    isIdle = true;
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleScreenClose = () => {
    setOpen(false);
    setaddQuestionModal1(prev => !prev)
  };

  const callAPi = () => {
    console.log('call')
    // let imgContent = iscreenshotAttachment ? iscreenshotAttachment.split("data:image/png;base64,") : null;
    let imgContent = iscreenshotAttachment ? iscreenshotAttachment : null;

    console.log(imgContent, title, desc)
    if (title && desc) {
      if (navigator.onLine) {
              let imgurl;
        
              let oRequest = {
                summary: title,
                description: desc,
                communityId: localStorage.getItem("CommunityId"),
              };
              
              ApiServices.raiseJiraIssueForCommunity(oRequest).then((res) => {
                try{
                  if (res.data.status == 200 && imgContent) {

                    var url = "https://api.cloudinary.com/v1_1/" + 'nathnarale' + "/image/upload";
                    const formData = new FormData();
                    formData.append("file", imgContent);
                    formData.append("upload_preset",'ythzf284');
                    fetch(url, { method: "POST", body: formData }).then((response) => {
                      return response.json();
                    }).then((data) => {
                      console.log(data.secure_url)
                      imgurl= data.secure_url

                      let request = {
                        communityId: localStorage.getItem("CommunityId"),
                        filePath: imgurl,
                        issueId: res.data.data
                      }
                      console.log("req",request)
                      ApiServices.setJiraFeeedbackAttachmnetForCommunity(request).then((res) => {
                        try {
                              if (res.status == 200) {
                                swal({
                                  text: t("Issue reported successfully"),
                                  icon: "success",
                                  button: t("Ok"),
                                })
                                setTitle(null);
                                setDesc(null);
                                setiscreenshotAttachment(null);
                                setscreenshotFlag(false);
                                setOpen(false);
                              }
                              console.log(res)
                            } catch (err) {
                              console.log("err::", err);
                            }
                      })


                    });
                }
                else if(res.data.status == 200){
                  swal({
                    text: t("Issue reported successfully"),
                    icon: "success",
                    button: t("Ok"),
                  })
                  setTitle(null);
                  setDesc(null);
                  setiscreenshotAttachment(null);
                  setscreenshotFlag(false);
                  setOpen(false);
                }
                }catch (err) {
                  console.log("err::", err)
                }
              })
              
            

        // let oRequest = {
        //   "summary": title,
        //   "desc": desc,
        //   "name": iscreenshotAttachment ? "Screenshot.png" : null,
        //   "content": iscreenshotAttachment ? imgContent[1] : imgContent
        // }
        // console.log(oRequest)
        // ApiServices.sendFeedback(oRequest).then((res) => {
        //   setOpen(false);
        //   try {
        //     if (res.status == 200) {
        //       swal({
        //         text: t("Screenshot captured successfully"),
        //         icon: "success",
        //         button: t("Ok"),
        //       })
        //       setTitle(null);
        //       setDesc(null);
        //       setiscreenshotAttachment(null);
        //       setscreenshotFlag(false);
        //       setOpen(false);
        //     }
        //     console.log(res)
        //   } catch (err) {
        //     console.log("err::", err);
        //     var errorObj = {
        //       component: 'Feedback',
        //       method: 'callApi',
        //       error: err
        //     }
        //     logError(errorObj);
        //   }
        // });

      } else {
        swal({
          title: t(""),
          text: t("No internet connection found"),
          icon: "warning",
          button: t("Ok"),
        })
      }
    } else {
      swal({
        title: t("All fields are mandatory"),
        text: t("Please check all fields before submitting"),
        icon: "warning",
        button: t("Ok"),
      })
    }
  }

  const takeSreenshot = () => {
    console.log('Sreenshot')
    setOpen(false);
    setaddQuestionModal1(prev => !prev)
  }

  const continueScreen = (e) => {
    setaddQuestionModal1(prev => !prev)
    var image = new Image();
    image.src = canvas.current.toDataURL();
    setiscreenshotAttachment(canvas.current.toDataURL())
    setscreenshotFlag(true)
    setOpen(true);
  }

  const startDrawing = ({ nativeEvent }) => {
    if (nativeEvent) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY)
      setisDrawing(true)
    }
  }

  const finishDrawing = () => {
    contextRef.current.closePath();
    setisDrawing(false);
    var image = new Image();
    image.src = canvas.current.toDataURL();
    setiscreenshotAttachment(canvas.current.toDataURL())
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  return (
    <div>
      <FeedbackIcon style={colorStyles} className="feedbackIcon" onClick={handleClickOpen}></FeedbackIcon>
      <Dialog className = "feedback-dialog" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle className= 'feedbacktitle' id="customized-dialog-title" onClose={handleClose}>{t("Feedback")}</DialogTitle>
        <DialogContent dividers>
          <TextField
            id="standard-multiline-static"
            label={t("Summary")}
            value={t(title)}
            placeholder={t("Enter your summary")}
            style={{ 'margin-top': '-5px' }}
            fullWidth
            onChange={({ target }) => setTitle(target.value)}
            // InputLabelProps={{
            //   shrink: true,
            // }}
          />
          <TextField
            id="standard-multiline-static"
            label={t("Description")}
            value={t(desc)}
            placeholder={t("Enter your description")}
            style={{ 'margin-top': '5px' , 'margin-bottom': '10px' }}
            fullWidth
            onChange={({ target }) => setDesc(target.value)}
            // InputLabelProps={{
            //   shrink: true,
            // }}
          />
          {
            screenshotFlag && (
              <div id="attachedscrssnhot">
                <img src={iscreenshotAttachment} id="canvas" width={scrollHW.width} height={scrollHW.height} />
              </div>
            )
          }
        </DialogContent>
        <DialogActions>
          <Button 
            color="primary"
            disableElevation
            className="feedback-btn feedback-screenshot-btn"
            onClick={takeSreenshot} 
          >
            {t('Screenshot')}
          </Button>
          <Button  
            color="primary"
            disableElevation
            className="feedback-btn" 
            onClick={callAPi} 
          >
            {t('Send')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog className = "feedback-dialog" onClose={handleScreenClose} aria-labelledby="customized-dialog-title" open={addQuestionModal1}>
        <DialogTitle id="customized-dialog-title" onClose={handleScreenClose}>  {t('Please highlight the area on the captured screenshot')}</DialogTitle>
        <DialogContent dividers>
          <div id="attachedscrssnhot">
            <canvas
              id="screeCanvas"
              ref={canvas}
              width={scrollHW.width}
              height={scrollHW.height}
              touchstart={startDrawing}
              touchmove={finishDrawing}
              touchend={draw}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
            ></canvas>
          </div>
        </DialogContent>
        <DialogActions>
          <Button 
            color="primary"
            disableElevation
            className="feedback-btn" 
            onClick={e => continueScreen(e)}
          >
              {t('Continue')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};



const transFeedback = withTranslation()(Feedback);
export default connect(mapStateToProps, {})(transFeedback);