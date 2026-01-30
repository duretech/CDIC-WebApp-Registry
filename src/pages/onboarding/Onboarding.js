import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import imgUrl from '../../assets/images/imageUrl';
import Typography from '@material-ui/core/Typography';
//import '../../assets/css/custom.css';
//Desktop screen css
//import '../../assets/css/customdesktop.css';
// import Services from '../../imon/api/api'
//import { setLangID, setCommunityId } from "../../imon/redux/actions/appActions";

//import '../../assets/css/weblayout.css'

import InputAdornment from '@material-ui/core/InputAdornment';

import AccountCircle from '@material-ui/icons/AccountCircle';
import TranslateIcon from '@material-ui/icons/Translate';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import WorkIcon from '@material-ui/icons/Work';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

//import LoginAppbar from '../../component/appbar/LoginAppbar';
import OfflineDb from '../../db'
import { useLocaleConfiguration } from "../../hooks/useLocaleConfiguration";
import swal from "sweetalert";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
}));

const userRole = [
  'Health Provider',
  'Beneficiary',
  'GuestUser'
]

function Onboarding({ onSuccess }) {
  const classes = useStyles();
  const history = useHistory();
  const [language, setlanguage] = useState('');
  const [location, setlocation] = useState('');
  const [userrole, setuserrole] = useState('');

  useEffect(() => {
    OfflineDb.getDataFromPouchDB('loginDetails')
      .then(loginDetails => {

        if (loginDetails.data != undefined) {
          // history.push("/layout/home")
          if(localStorage.getItem('userrole') && localStorage.getItem('userrole') != 'Health Provider'){
            //history.push("/layout/imonhome")
            onSuccess()
          }else{
            onSuccess()
          }
        }
      })
    //localStorage.setItem('userrole', JSON.stringify(userRole))
  }, [])

  const handleLanguageChange = (event) => setlanguage(event.target.value);
  const handleLocationChange = (event) => setlocation(event.target.value);
  const handleUserRoleChange = (userrole) => {
    setuserrole(userrole);
    //localStorage.setItem('userrole', userrole)
    if (userrole == "Health Provider") {
      history.push('/login')
    }
    if (userrole == "Patient") {
      history.push('/phonenumberlogin')
    }
    
    if(userrole == "Facilty") {
      history.push('/login')
      localStorage.setItem("facilty", true)
    }
    // if (userrole == "GuestUser") {
    //   let communityId = "1602eb0d0662c0297ed5f156ec349953";
    //   var imonparams = {
    //     communityId: communityId,
    //     externalUser: {
    //       userUUID: "9999999999",
    //     },
    //     externalUserFlag: true,
    //   };
    //   // Services.externalLogin(imonparams).then((res) => {
    //   //   console.log("externalLogin", res);
    //   //   localStorage.setItem('CommunityId', communityId);
    //   //   localStorage.setItem('langId', 1);
    //   //   setCommunityId(communityId);
    //   //   localStorage.setItem("menuList", JSON.stringify(res.data.data.component.mobileSections));
    //   //   localStorage.setItem('userrole', res.data.data.roleType)
    //   //   localStorage.setItem(
    //   //     "obj",
    //   //     JSON.stringify({
    //   //       roleId: res.data.data.roleId,
    //   //       roleType: res.data.data.roleType,
    //   //       userId: res.data.data.userId,
    //   //       userType: res.data.data.userType,
    //   //     })
    //   //   );
    //   // }).catch((err) => {
    //   //   console.log("error::", err)
    //   // });
    //   history.push('/guestselectlanguage')
    // }
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('handleSubmit>>', language, location)
    localStorage.setItem('language', language)
    localStorage.setItem('location', location)
    localStorage.setItem('userrole', userrole)
    history.push('/login')
  }

  const { config, loading, error } = useLocaleConfiguration('Onboarding');
  useEffect(() => {
    console.log("POSTLOGOUT")
    if (loading) {
       
        if (!document.querySelector('.swal-modal')) {
            swal({
                title: "Loading Configuration...",
                text: "Please wait while the configuration is being loaded.",
                icon: "info",
                buttons: false, 
                dangerMode: true,
            });
        }
    } else {
       
       if (document.querySelector('.swal-modal')) {
        swal.close();
    }
    }

    if (error) {
        swal("Error", `Failed to load configuration: ${error.message}`, "error");
    }
}, [loading, error]); // React on changes in loading and error state

if (!config) {
    // If no config and not loading, show error or empty state
    return loading ? null : <div>No configuration loaded or failed to load</div>;
}


  return (
    <div className={window.cordova ? "onboardingPage" : 'onboardingPage windowdesktop'}>
       <section
                    className="mainsection onboardingSection pb-0"
                    style={{
                        flexGrow: 1,
                        // padding: 12,
                    }}
                >
                    <Grid container className="homelanding homemain new-onboarding">
                       
                        <Grid item xs={12} sm={12} md={12} lg={12} className="pl-0px homeholder">
                            
                            <div className="homeholder h-100">
                               <Grid container className='homeholdergrid margin-top-0'>
                                    <Grid item xs={12} sm={12} md={12}  className="text-center vert-center" >
                                    
                                    <img src={imgUrl['who-logo']} className="whologo"/>
                                  
                                    <Typography variant='h4' className='clini-head mt-20px'>Changing Diabetes in Children E- Registry</Typography>
                                    </Grid>
                                 
                                </Grid> 
                              
                              <Grid container xs={12} lg={12} className='userselectgrid' style={{paddingBottom: '20px'}}>
                                  {/* <Grid item xs={0} lg={1}></Grid> */}
                                  <Grid container  xs={12} md={6} lg={6} sm={6} className="onboardSelect left">
                                  <Grid item xs={12} lg={5} md={5} xl={5} sm={5} className='providerimggrid'>
                                  <div className='providerimg text-center pos-relative'>
                                    <img src={imgUrl['prov-home']} className="patientImg "/>
                                  </div>
                                  </Grid>
                                  <Grid item xs={12} lg={7} md={7} xl={7} sm={7} className="text-center vert-center h-100 borderonboard">
                                  <Button variant='filled' className='onboardBtn' onClick={() => handleUserRoleChange("Health Provider")}>
                                    <img src={imgUrl['map-doctor']} className="doc-logo"/>
                                   HCP</Button>
                                  </Grid>
                                    
                                  </Grid>
                                  {/* <Grid container xs={12}  lg={4} md={4} xl={4} sm={4} className="onboardSelect mobile">
                                  <Grid item xs={12} lg={5} md={5} xl={5} sm={5} className='benimggrid'>
                                    <div className='benimg text-center pos-relative'>
                                    <img src={imgUrl.patientHome} className="patientImg" />
                                    </div>
                                    </Grid>
                                  <Grid item xs={12} lg={7} md={7} xl={7} sm={7} className="text-center vert-center h-100 borderonboard">
                                  <Button variant='filled' className='onboardBtn' 
                                    onClick={() => handleUserRoleChange("Facilty")}
                                  >
                                    <img src={imgUrl['user-circle']} className="user-logo"/>
                                    Facility Supervisor</Button>
                                  </Grid>
                                  
                                  </Grid> */}
                                 
                                  <Grid container  xs={12} lg={6} md={6} xl={6} sm={6} className="onboardSelect right" >
                                  <Grid item xs={12} lg={5} md={5} xl={5} sm={5} className='providerimggrid'>
                                  <div className='providerimg text-center pos-relative'>
                                    <img src={imgUrl['client-logo']} className="patientImg patientImg1"/>
                                  </div>
                                  </Grid>
                                  <Grid item xs={12} lg={7} md={7} xl={7} sm={7} className="text-center vert-center h-100">
                                  <Button variant='filled' className='onboardBtn' 
                                    onClick={() => handleUserRoleChange("Patient")}
                                  >
                                    <img src={imgUrl['map-doctor']} className="doc-logo"/>
                                    Client/Patient</Button>
                                  </Grid>
                                    
                                  </Grid>
                                  {/* <Grid item xs={0} lg={1}></Grid> */}
                              </Grid> 
                              
                            </div>
                        </Grid>
                       
                    </Grid>
                </section>
    </div>
  )
}

export default Onboarding;

