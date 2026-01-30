import React, { useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import { useTranslation, Trans } from 'react-i18next';
import { Link, Redirect, } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import imgUrl from '../../assets/images/imageUrl';
import {
  Button,
  InputFieldFF,
  ReactFinalForm,
  hasValue,
  CircularLoader,
  CenteredContent
} from '@dhis2/ui';
//Desktop screen css
//import '../../assets/css/customdesktop.css';
import { useHistory } from "react-router-dom";
import classes from '../../App.module.css'
import { apiServices } from '../../services/apiServices';
import Services from "../../imon/api/api";
import { setLangID, setOnboardPernt, setCommunityId } from "../../imon/redux/actions/appActions";
import swal from '@sweetalert/with-react';
import OfflineDb from '../../db'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { set } from 'lodash';
import Feedback from '../../imon/components/Feedback';
import { gaLogEvent, gaLogScreen } from "../../imon/helpers/analytics";
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import ArrowBack from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";


function PhoneNumberLogin(props) {
  const runtime = window.RUNTIME_CONFIG || {};
  const [phonecode, setPhonecode] = React.useState('11');
  const [phoneno, setPhoneno] = React.useState('1234567890');
  const [open, setOpen] = React.useState(false);
  const [keyboardonclick, setKeyboardOnclick] = React.useState(false);
  const [userotp, setuserotp] = React.useState('1234')
  const [otp, setotp] = React.useState('')
  const [modalopen, setmodalopen] = React.useState(false)
  const [userlist, setuserlist] = React.useState('')
  const [tas, opentas] = React.useState(false)
  const [defaultChecked, setDefaultChecked] = React.useState(true);
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    gaLogEvent("Login Page", '', '');
    gaLogScreen("Login Page");
    // const Authorization = runtime.basicAuth
    // apiServices.loginApi(Authorization).then(res => {
    // })
  },[])

  const handleDefaultLogin = (e) => {
      if (e.target.checked) {
      setDefaultChecked(true);
      setPhonecode('11');
      setPhoneno('1234567890')
    } else {
      setPhonecode('');
      setPhoneno('')
      setDefaultChecked(false);
    }
  };

  const handleClick = () => {
    console.log(phonecode + phoneno)
  
    setGlobalSpinner(true)

      apiServices.getAPI('users?fields=[id,displayName,attributeValues]&phoneNumber=' + phoneno)
        .then(response => {
          setGlobalSpinner(false)
          if(response.data.users.length>0){
            setuserlist(response.data.users)
            if(phoneno == "1234567890"){
              setotp("1234")
              setmodalopen(true)
            }else{
              var Otp = Math.floor(100000 + Math.random() * 900000)
              setotp(Otp)
              // var param = 'Body=Your access code for OneHUC App' + String(Otp) + '&From=+18575759918&To=' + phonecode + phoneno
              var param = 'Body=Your access code for CDIC App  ' + String(Otp) + '&From=+41798073277&To=' + phonecode + phoneno
              Services.sendOtp(param).then((res) => {
                console.log("twilio", res);
                if (res.status == 201) {
                  setmodalopen(true)
                } else {
                  swal({
                    title: "Error",
                    text: "Error sending OTP",
                    icon: "error",
                    button: "Close",
                  });
                }
              }).catch((err) => {
                console.log("error::", err)
              });
            }
          }
          else{
            swal({
              title: "Login failed Phone number not registered",
              text: "",
              icon: "error",
              button: "Close",
            });
  
          }
          

        }).catch(err => {
          setGlobalSpinner(false)
          console.log(err)
          swal({
            title: "Login failed Phone number not registered",
            text: "",
            icon: "error",
            button: "Close",
          });

        })
  
  }

  function handleNavigateQRscan() {
    history.push('/qrcode')
  }


  function handleonchange(target) {
    setPhonecode(target);
  }
  function handleonfocus() {
    if (window.cordova) {
      setKeyboardOnclick(true);
    }
  }
  function handleonblur() {
    if (window.cordova) {
      setKeyboardOnclick(false);
    }
  }
  function handleonPhonechange(target) {
    setPhoneno(target);
  }

  function handleBack() {
    history.push("/onboarding")
  }
  

  function inputChangevent(value) {
    setuserotp(value)
  }

  function tosclick() {
    opentas(false)
    history.push('/termspatient', { "userlist": userlist })
  }

  function verifyOtp() {
    var that = this
    if (otp == userotp) {
      setmodalopen(false)
      opentas(true)
      // apiServices.getAPI('users/' + loginid)
      //       .then(response => {
      //         OfflineDb.setDataIntoPouchDB('providerobj',response.data.userCredentials.createdBy)
      //         let communityId = "1602eb0d0662c0297ed5f156ec349953";
      //         var imonparams = {
      //           communityId: communityId,
      //           externalUser: {
      //             userUUID: response.data.id,
      //           },
      //           externalUserFlag: true,
      //         };
      //         Services.externalLogin(imonparams).then((res) => {
      //           console.log("externalLogin", res);
      //           localStorage.setItem('CommunityId', communityId);
      //           localStorage.setItem('langId', 1);
      //           setCommunityId(communityId);
      //           localStorage.setItem("menuList", JSON.stringify(res.data.data.component.mobileSections));
      //           localStorage.setItem('userrole', "Patient")
      //           localStorage.setItem(
      //             "obj",
      //             JSON.stringify({
      //               roleId: res.data.data.roleId,
      //               roleType: "Patient",
      //               userId: res.data.data.userId,
      //               userType: res.data.data.userType,
      //             })
      //           );

      //           history.push('/layout/Userprofile')

      //         }).catch((err) => {
      //           console.log("error::", err)
      //         });

      //       }).catch(err => {
      //         console.log(err)

      //       })

    }
    else {
      swal({
        title: "Error",
        text: "Please enter the correct otp",
        icon: "error",
        button: "Close",
      });
      setmodalopen(false)
    }
  }

  function openModal() {
    setOpen(true);
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      ></Modal>
    );
  }
  const { t, i18n } = useTranslation();
  const history = useHistory();
  function openUserRegister() {
    // if (window.cordova) {
    //   localStorage.setItem("deviceuuid", window.device.uuid);
    // }
    history.push('/OnboardingRegVertical')
  }
  return (
    // <div className={keyboardonclick && "keyboardactive loginphonepage" : "loginphonepage windowdesktop"}>
    <div className='mainlogSection'>
      <Grid container className='loginphonepagegrid'>

        <Grid container xs={12} md={12} className='loginnav'>

          <Grid xs={3} className='backimg'>
          <IconButton
                className="backsvg"
                aria-label="go back"
                onClick={() => handleBack()}
                style={{marginTop: "2%", width: "6%"}}
              >
              <ArrowBack />
              </IconButton>
          </Grid>
          <Grid xs={6} className='text-center'>
            {/* <Typography variant='subtitle1' className='logname oneuhcfont'>Login</Typography> */}
          </Grid>
          <Grid xs={3}> 
          {/* <Typography variant='body2' className='stepname'><Feedback></Feedback>
          </Typography> */}
          
          </Grid>

        </Grid>
        <Grid container xs={12} md={12} >
        <Grid item xs={0} md={4} >

         </Grid>
         <Grid item xs={12} md={4} className="loginsection">
           <div className=''>
                 {/* <div className="useravtarimgapp" /> */}
                
                {/* <Typography variant='h4' className='signmob mb-30px'>Sign In</Typography> */}
            </div>
            <div className='loginwweb webphone'>
              {/* <Typography variant='h4' className='signweb mb-30px'>Sign In</Typography> */}

              <div className="loginpageformholder logindetails loginphone">
                <p className="placeholdertext">{t("Access via your phone number")}</p>
                <div className="phonenoinput">
                  <TextField
                    //   disabled
                    className='disno'
                    type="number"
                    value={t(phonecode)}
                    placeholder={t("91")}
                    onFocus={() => handleonfocus()}
                    onBlur={() => handleonblur()}
                    onChange={({ target }) => handleonchange(target.value)}
                  />
                  <TextField
                    type="tel"
                    value={t(phoneno)}
                    placeholder={t("Phone number")}
                    onFocus={() => handleonfocus()}
                    onBlur={() => handleonblur()}
                    inputProps={{ maxlength: "10" }}
                    onChange={({ target }) => handleonPhonechange(target.value)}
                  />
                </div>
                {/* <Typography className="form_title project_title noacc">No account yet?</Typography>

                <Grid item xs={12} className='addben'>
                  <Typography variant='subtitle1' className='regbene' onClick={() => openUserRegister()}>
                    <a> Register as a new client</a>

                  </Typography>
                </Grid> */}
              </div>
              <div className="buttons">
                <Button
                  type="submit"
                  //disabled={submitting}
                  onClick={() => handleClick()}
                  className="loginbtn loginsubmitbtn loginsubmit loginb"
                >
                  {t("send access code")}
                </Button>
                {/* <Button
                  type="submit"
                  onClick={() => handleNavigateQRscan()}
                  //disabled={submitting}
                  className="loginbtn loginsubmitbtn loginsubmit loginb"
                >
                  {t("login via qr scan")}
                </Button> */}
                {/* <div className="visitlinks mt-20px">
                  <Typography
                    className="visit"
                    variant="subtitle2"
                    component="subtitle2"
                  >
                    Visit our
                  </Typography>
                  <Typography className='dashboardlink parafont' variant="subtitle2" component="subtitle2">
                    <a href='#' className='dashlink'>Dashboard</a>
                  </Typography>
                </div> */}
              </div>
              <br></br>
              <input
                  type="checkbox"
                  checked={defaultChecked}
                  onChange={handleDefaultLogin}
              // style={{marginLeft: "120px",marginTop: "10px"}}
              />{" "}
              Use Default Credentials
              </div>
         

            </Grid>
            <Grid item xs={0} md={4} >

              </Grid>
        </Grid>
        {/* <Grid container xs={12} className="mainloginscreen"> */}
           {/* <Grid item xs={12} sm={12} md={6} lg={6} className="pageinfopart">

            <div className='user-doh'>
              <div>
               
                <img src={imgUrl.userpass} className='userimg' /></div>
              <div className='text-center'><img src={imgUrl.dohlogo} className='dohimg ' />
                <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>

              </div>

            </div>
            <div className="loginpageformholder logindetails">
              <p className="placeholdertext">{t("Access via your phone number")}</p>
              <div className="phonenoinput">
                <TextField
                  //   disabled
                  className='disno'
                  type="number"
                  value={t(phonecode)}
                  placeholder={t("+63")}
                  onFocus={() => handleonfocus()}
                  onBlur={() => handleonblur()}
                  onChange={({ target }) => handleonchange(target.value)}
                />
                <TextField
                  type="number"
                  value={t(phoneno)}
                  placeholder={t("Phone number")}
                  onFocus={() => handleonfocus()}
                  onBlur={() => handleonblur()}
                  onChange={({ target }) => handleonPhonechange(target.value)}
                />
              </div>
              <Typography className="form_title project_title noacc">No account yet?</Typography>

              <Grid item xs={12} className='addben'>
                <Typography variant='subtitle1' onClick={() => openUserRegister()} className="regbene">
                  <a> Register as a new beneficiary</a>

                </Typography>
              </Grid>
            </div>


          </Grid>  */}

         
        {/* </Grid> */}
      </Grid>
      {
        <Dialog
          open={modalopen}
          aria-labelledby="server-modal-title"
          aria-describedby="server-modal-description"
          className='usersPopUp phonepopup'
        >
          <DialogTitle id="simple-dialog-title">{t('Please enter the OTP')}</DialogTitle>
          <TextField
            type={'number'}
            inputProps={{ maxlength: 6 }}
            onChange={(evt) => inputChangevent(evt.target.value)}
            className="otpfield"
            defaultValue={phoneno == '1234567890' ? "1234" : ''}
          />
          <br></br>
          <Button
            variant="contained"
            // color = "primary"
            className="userSelect userSelectBtn"
            disableElevation
            onClick={() => { verifyOtp() }}
          >
            {t('Submit')}
          </Button>
        </Dialog>
      }
      {
        <Dialog
          open={tas}
          aria-labelledby="server-modal-title"
          aria-describedby="server-modal-description"
          className='usersPopUp phonepopup'
        >
          <DialogTitle id="simple-dialog-title" className='text-center'>
            <Typography variant='h5' className='oneuhcfont'>{t('Agree to continue')}</Typography>
          </DialogTitle>
          <div className='text-center'>
            {/* <Typography variant='h5' className='oneohcfont'>{t('Agree to continue')}</Typography> */}
            <Typography variant='subtitle1'>{t('To continue with the registration you have to agreee to our')}</Typography>
            {/* <div className={"toslink"} onClick={() => tosclick()} > */}
            <div className={"toslink"}>
              Terms & conditions
            </div>
          </div>
          <Button
            variant="contained"
            // color = "primary"
            className="agreebtn"
            disableElevation
            onClick={() => { history.push('/Userprofile', { "userlist": userlist }) }}
          >
            {t('I AGREE')}
          </Button>
          <Button
            variant="contained"
            // color = "primary"
            className="disagreebtn"
            disableElevation
            onClick={() => { history.push(' /onboarding') }}
          >
            {t('I DON\'T AGREE')}
          </Button>
        </Dialog>
      }
    </div>
  );
}

export default PhoneNumberLogin