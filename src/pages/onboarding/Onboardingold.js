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

  return (
    <div className={window.cordova ? "onboardingPage" : 'onboardingPage windowdesktop'}>
       <section
                    className="mainsection onboardingSection pb-0"
                    style={{
                        flexGrow: 1,
                        // padding: 12,
                    }}
                >
                    <Grid container className="homelanding homemain">
                       
                        <Grid item xs={12} sm={12} md={12} lg={12} className="pl-0px homeholder">
                            
                            <div className="homeholder h-100">
                               <Grid container className='homeholdergrid margin-top-0 main-div'>
                                    <Grid item xs={12} sm={12} md={12}  className="text-center vert-center mb-30px" >
                                    
                                    <img src={imgUrl['who-logo']} className="whologo"/>
                                  
                                    <Typography variant='h4' className='clini-head mt-20px'>  CDIC </Typography>
                                 
                                    </Grid>
                                    
                                   
                                 
                                </Grid> 
                              {/* <Grid container>
                                <Grid item xs={0}  md={4} >
            

                                </Grid>  
                                <Grid item xs={12}  md={4} className="pagelaterpart">
                                  <Grid container xs={12} lg={12} className='userselectgrid'>
                                    
                                   
                                    
                                    <Grid container  xs={12} lg={12} className="onboardSelect right">
                                      <Grid item xs={12} lg={5} className='providerimggrid'>
                                      <div className='providerimg text-center pos-relative'>
                                        <img src={imgUrl['prov-home']} className="patientImg "/>
                                      </div>
                                      </Grid>
                                      <Grid item xs={12} lg={7} className="text-center vert-center h-100">
                                        <Button variant='filled' className='onboardBtn' onClick={() => handleUserRoleChange("Health Provider")}>
                                        <img src={imgUrl['map-doctor']} className="doc-logo mr-10px"/>
                                        Healthcare Provider/ Primary physician</Button>
                                      </Grid>
                                    
                                        
                                      </Grid>
                                      <Grid container xs={12}  lg={12} className="onboardSelect">
                                    
                                      <Grid item xs={12} lg={5} className='benimggrid'>
                                    
                                        <div className='benimg text-center pos-relative'>
                                  
                                        <img src={imgUrl.patientHome} className="patientImg" />
                                        </div>
                                        </Grid>
                                      <Grid item xs={12} lg={7} className="text-center vert-center h-100 borderonboard">
                                      <Button variant='filled' className='onboardBtn' onClick={() => handleUserRoleChange("Patient")}>
                                        <img src={imgUrl['user-circle']} className="user-logo mr-10px"/>
                                          Facility Supervisor</Button>
                                      </Grid>
                                      
                                      </Grid>
                                    
                                      <Grid container  xs={12} lg={12} className="onboardSelect left">
                                      <Grid item xs={12} lg={5} className='providerimggrid'>
                                      <div className='providerimg text-center pos-relative'>
                                        <img src={imgUrl['client-logo']} className="patientImg "/>
                                      </div>
                                      </Grid>
                                      <Grid item xs={12} lg={7} className="text-center vert-center h-100">
                                        <Button variant='filled' className='onboardBtn' onClick={() => handleUserRoleChange("Health Provider")}>
                                        <img src={imgUrl['map-doctor']} className="doc-logo mr-10px"/>
                                        Client/Patient</Button>
                                      </Grid>
                                    
                                        
                                      </Grid>
                                      <Grid item xs={0} lg={1}></Grid>
                                      
                                  </Grid> 
                                </Grid>
                                <Grid item xs={0} md={4} >

                                </Grid>
                              </Grid>   */}
                              <Grid container className="">   
                                <Grid item xs={0}  md={4} ></Grid>
                                <Grid item xs={12}  md={4} className="">
                                
                                  <div className='langSection onboarding-section'>
                                      <div className="langitems onboarding-items">
                                          <Grid container xs={12} lg={12}>
                                           
                                              <Grid item xs={12} className='text-center'>
                                              <Grid container xs={12} lg={12}>
                                                  <Grid item xs={12} lg={12}>
                                                  <Typography variant='h6' className='mt-90px'>Select the USERS</Typography>
                                                  </Grid>
                                              </Grid>
                                         
                                                <Grid container xs={12} lg={12} className='onboarding-items'>
                                                    <Grid item xs={4}>
                                                    <img src={imgUrl['prov-home']} className="patientImg "/>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                    <Button variant='filled' className='onboardBtn w-90percent' onClick={() => handleUserRoleChange("Health Provider")}>
                                                          <img src={imgUrl['map-doctor']} className="doc-logo mr-10px"/>
                                                          Healthcare Provider/ Primary Physician</Button>
                                                    </Grid>
                                                </Grid>
                                                <Grid container xs={12} lg={12} className='onboarding-items'>
                                                    <Grid item xs={4}>
                                                    <img src={imgUrl.patientHome} className="patientImg" />
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                    <Button variant='filled' className='onboardBtn' onClick={() => handleUserRoleChange("Patient")}>
                                                          <img src={imgUrl['user-circle']} className="user-logo mr-10px"/>
                                                            Facility Supervisor</Button>
                                                    </Grid>
                                                </Grid>
                                                <Grid container  xs={12} lg={12} className='onboarding-items'>
                                                        <Grid item xs={4}>
                                                      
                                                          <img src={imgUrl['client-logo']} className="patientImg "/>
                                                      
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                          <Button variant='filled' className='onboardBtn' onClick={() => handleUserRoleChange("Health Provider")}>
                                                          <img src={imgUrl['map-doctor']} className="doc-logo mr-10px"/>
                                                          Client/Patient</Button>
                                                        </Grid>
                                                      
                                                          
                                                </Grid>
                                              </Grid>
                                          </Grid>
                                      </div>
                                      
                                  </div>
                                  
                                 
                                </Grid>
                                <Grid item xs={0} md={4} >

                                </Grid>
                             </Grid>
                              
                            </div>
                        </Grid>
                       
                    </Grid>
                </section>
    </div>
  )
}

export default Onboarding;

