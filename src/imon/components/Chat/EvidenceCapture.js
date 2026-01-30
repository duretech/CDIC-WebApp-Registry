import React, { Component } from "react";
import swal from "sweetalert";
import { withTranslation, Trans } from "react-i18next";
import classnames from "classnames";
import { connect } from "react-redux";
import {
  useHistory,
  withRouter,
  Route,
  Redirect,
  Switch,
  Link,
} from "react-router-dom";
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import AttachmentIcon from '@material-ui/icons/Attachment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import MicIcon from "@material-ui/icons/Mic";
import Loader from "../loaders/loader";
import imgUrl from '../../assets/images/imageUrl.js';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

class EvidenceCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      anchorEl: null
    };
    this.captrureImg = this.captrureImg.bind(this);
    this.galleryImg = this.galleryImg.bind(this);
    this.captureAudio = this.captureAudio.bind(this);
    this.captureVideo = this.captureVideo.bind(this);
    this.captureSuccess = this.captureSuccess.bind(this);
    this.audioCapture_Ended = this.audioCapture_Ended.bind(this);
    this.audioCapture_Failed = this.audioCapture_Failed.bind(this);
    this.uploadMediaFiles = this.uploadMediaFiles.bind(this);
    this.uploadImageServer = this.uploadImageServer.bind(this);
    this.CheckAppError = this.CheckAppError.bind(this);
    this.successCallback = this.successCallback.bind(this);
    this.getDataUri =  this.getDataUri.bind(this);
    this.uploadGalleryServer = this.uploadGalleryServer.bind(this);
  }

  componentDidMount() {
    console.log(navigator.camera);
    document.addEventListener("deviceready", this.onDeviceReady, false);
  }


  onDeviceReady() {
    console.log('cordova', window.cordova)
    console.log('camera', navigator.camera);
  }

  captrureImg() {
    console.log('camera')
    if (!navigator.camera) {
      var Camera
    } else {
      var Camera = navigator.camera
    }

    // if (window.cordova) {
    //   navigator.camera.getPicture(this.uploadImageServer, function (message) {
    //     console.log(message)
    //   }, {
    //     saveToPhotoAlbum: true,
    //     sourceType: Camera.PictureSourceType.CAMERA,
    //     destinationType: Camera.DestinationType.DATA_URL,
    //     encodingType: Camera.EncodingType.JPEG,
    //     correctOrientation: true,
    //     quality: 100,
    //     targetWidth: 100,
    //     targetHeight: 100
    //   });
    // } 
    var that = this;
    if (window.cordova) {
      navigator.device.capture.captureImage(function(imageURI){
        console.log("imageURI", imageURI);
        that.uploadImageServer(imageURI);
      }, function (message) {
        console.log(message)
      },
      //  {
      //   saveToPhotoAlbum: true,
      //   sourceType: Camera.PictureSourceType.CAMERA,
      //   destinationType: Camera.DestinationType.FILE_URI,
      //   encodingType: Camera.EncodingType.JPEG,
      //   quality: 90,
      //   correctOrientation: true,
      //   targetWidth: 500,
      //   targetHeight: 500
      // }
      { limit: 1 }
      );
    }
    else {
      this.CheckAppError()
    }
  }

  galleryImg() {
    console.log('gallery')
    console.log(window.cordova)
    console.log('camera', navigator.camera);
    if (!navigator.camera) {
      var Camera
    } else {
      var Camera = navigator.camera
    }
    if (window.cordova) {
      navigator.camera.getPicture(this.uploadGalleryServer, function (message) {
        console.log(message)
      }, {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        quality: 100,
        targetWidth: 100,
        targetHeight: 100
      });
    } else {
      this.CheckAppError()
    }
  }

  captureAudio() {
    console.log('audio')
    const { t } = this.props;
   
    if (window.cordova) {
      var self = this;
      // navigator.device.capture.captureAudio(this.captureSuccess, function (message) {
      //   console.log(message)
      // }, {
      //   limit: 1,
      //   duration: 5
      // });
      swal({
        title: '',
        // imageUrl: imgUrl.micicon,
        icon: 'warning',
        button: t("Stop recording"),
        closeOnClickOutside: false,
        className: "swal-record"
      }).then(function() {
        window.cordova.plugins.audioRecorder.audioCapture_Stop(
          self.audioCapture_Ended ,
          self.audioCapture_Failed
        ); 
      });

      window.cordova.plugins.audioRecorder.audioCapture_Start(
        self.audioCapture_Ended ,
        self.audioCapture_Failed
        , 60 ); 
    } else {
      this.CheckAppError()
    }
  }

  audioCapture_Ended(filepath ){
    var mediaSrc = {};
    mediaSrc.fullPath = filepath;
    mediaSrc.type = 'audio';
    console.log("mediaSrc", mediaSrc);
    this.uploadMediaFiles(mediaSrc)
  }

  audioCapture_Failed(audioRecording_error ){
    console.log("audioRecording_path", audioRecording_error); 
  }

  captureVideo() {
    console.log('video')
    if (window.cordova) {
      navigator.device.capture.captureVideo(this.captureSuccess, function (message) {
        console.log(message)
      }, {
        limit: 1,
        duration: 10
      });
    } else {
      this.CheckAppError()
    }
  }

  captureSuccess(mediaSrc) {
    console.log("mediaSrc", mediaSrc);
    for (var i = 0, len = mediaSrc.length; i < len; i += 1) {
      this.uploadMediaFiles(mediaSrc[i])
    }
  }

  uploadMediaFiles = function (mediaFile) {
    console.log(mediaFile)
    var that = this;
    var options = new window.FileUploadOptions();
    var ft = new window.FileTransfer();
    console.log(ft)
    options.fileKey = "file";
    options.resource_type = 'video';
    options.fileName = mediaFile.fullPath;
    options.mimeType = mediaFile.type;
    options.chunkedMode = false;
    options.headers = { Connection: "close" };
    var params = new Object();
    params.cloud_name = "dssgzwkfu";
    params.upload_preset = "aj7vrrp3";
    params.resource_type = 'video';
    options.params = params;
    console.log(options)
    var url = "https://api.cloudinary.com/v1_1/" + params.cloud_name + "/upload";
    ft.upload(mediaFile.fullPath, encodeURI(url), function (data) {
      console.log(data)
      var res = JSON.parse(data.response)
      console.log(res)
      that.props.updateUrl(res.secure_url, 'video')
      that.successCallback()
    }, this.failureCallback, options);
  }

  getDataUri(fileUrl){
         
    var that = this;
    // fileUrl = 'filesystem:'+fileUrl; 
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(fileUrl,(FileEntry) => {
        console.log(FileEntry);
        FileEntry.file((File) => {
          console.log(File);
          setTimeout(() => {
          let reader = new FileReader();
          let data;
          reader.onloadend = function() {
            data=reader.result
            console.log('RESULT', data)
            const img = new Image();
            img.src = data;
            img.onerror = function () {
              // Handle the failure properly
              console.log("Cannot load image");
            };
            img.onload = function () {
              const canvas = document.createElement("canvas");
              canvas.width = 400;
              canvas.height = 400;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, 400, 400);
              const newdata = ctx.canvas.toDataURL(img, 'image/jpeg', 1);
              console.log("newdata",newdata)
              resolve(newdata)
            }          
          }
        
          if (File) {
            reader.readAsDataURL(File);
          }
          
          reader.onerror = (e) =>{
            console.log('Failed file read:'+e.toString());
            
          };
        }, 500)
        });
      });  
    })
  }

  async uploadImageServer(imageURI) {

    console.log(imageURI)
    var that = this;
    //var file = "data:image/jpeg;base64," + imageURI;
    var file= await this.getDataUri(imageURI[0].localURL);
    var cloud_name = 'nathnarale';
    var upload_preset = 'ythzf284';
    var url = "https://api.cloudinary.com/v1_1/" + cloud_name + "/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);
    fetch(url, { method: "POST", body: formData }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data)
      that.props.updateUrl(data.secure_url, 'image')
      that.successCallback()
    });
  }

  uploadGalleryServer(imageURI) {

    console.log(imageURI)
    var that = this;
    var file = "data:image/jpeg;base64," + imageURI;
    var cloud_name = 'nathnarale';
    var upload_preset = 'ythzf284';
    var url = "https://api.cloudinary.com/v1_1/" + cloud_name + "/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);
    fetch(url, { method: "POST", body: formData }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data)
      that.props.updateUrl(data.secure_url, 'image')
      that.successCallback()
    });
  }

  successCallback(r) {
    console.log(r)
    const { t } = this.props;
    swal({
      title: t("Successfully uploaded"),
      icon: "success",
      button: t("Ok"),
    })
    this.handlepopupClose();
  }

  failureCallback(r) {
    const { t } = this.props;
    swal({
      title: t("something went wrong"),
      icon: "info",
      button: t("Ok"),
    })
    this.handlepopupClose();
  }

  CheckAppError() {
    const { t } = this.props;
    swal({
      title: t("App Installation"),
      text: t("This Feature Available only on app!"),
      icon: "info",
      button: t("Ok"),
    })
    this.handlepopupClose();
  }

  handlepopupClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handlepopupClose = () => {
    this.setState({ anchorEl: null })
  };


  render() {
    const { t } = this.props;
    const { templateID } = this.props;
    const open = Boolean(this.state.anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
      <>
        <a aria-describedby={id} className="text-capitalize evidancbtn" variant="contained" onClick={this.handlepopupClick} startIcon=''><span className="evidancbtn" ><PhotoLibraryIcon /></span>
        </a>
        <Popover
          id={id}
          open={open}
          anchorEl={this.state.anchorEl}
          onClose={this.handlepopupClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button onClick={this.captrureImg}>
                <ListItemIcon>
                  <CameraAltIcon />
                </ListItemIcon>
                <ListItemText primary={t('Camera')} />
              </ListItem>
              <ListItem button onClick={this.galleryImg}>
                <ListItemIcon>
                  <WallpaperIcon />
                </ListItemIcon>
                <ListItemText primary={t('Image')} />
              </ListItem>
            </List>
          </Typography>
        </Popover>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    selectedComponentObj: storeState.componentObj,
  };
};

const TransEvidenceCapture = withTranslation()(EvidenceCapture);
const ThemeServiceForm = withTheme(TransEvidenceCapture);
const routeServiceForm = withRouter(ThemeServiceForm);
export default connect(mapStateToProps, {})(routeServiceForm);
