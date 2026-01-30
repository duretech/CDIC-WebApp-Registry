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
import { Typography } from '@material-ui/core';
//Desktop screen css
//import '../../assets/css/customdesktop.css';
import { Configuration } from "../../assets/data/config";
import _ from 'lodash';
import {
  InputFieldFF,
  SingleSelectFieldFF,
  ReactFinalForm,
  hasValue,
  CircularLoader,
  CenteredContent
} from '@dhis2/ui';
//import LoginAppbar from '../../component/appbar/LoginAppbar';
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import OfflineDb from '../../db'
import Services from "../../imon/api/api";
import { apiServices } from '../../services/apiServices';
import { setLangID, setOnboardPernt, setCommunityId } from "../../imon/redux/actions/appActions";
import Feedback from '../../imon/components/Feedback';
import { gaLogEvent, gaLogScreen } from "../../imon/helpers/analytics";

const { Form, Field } = ReactFinalForm

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
  'Data Entry',
  'Itis linked user'
]

function Userprofile() {
  const classes = useStyles();
  const history = useHistory();
  console.log(history)
  const [userlist,setuserlist] = React.useState(history.location.state.userlist)
  const setGlobalSpinner = useGlobalSpinnerActionsContext()
  const metaDataParam = Configuration.homepage.metaDataParam

  useEffect(()=>{

    gaLogEvent("Account selection", '', '');
    gaLogScreen("Account selection");
  },[])
  
  function handleBack() {
    window.history.back();
  }

  function userlogin(user){
    setGlobalSpinner(true)
    
    var userdet=user.id+'?fields=:all,owner,access,displayName,userGroups,organisationUnits[id,displayName,path],dataViewOrganisationUnits[id,displayName,path],userCredentials[id,username,user,accountExpiry,lastLogin,externalAuth,userRoles[id,displayName],cogsDimensionConstraints[id,displayName,dimensionType],catDimensionConstraints[id,displayName,dimensionType],openId,ldapId,disabled],teiSearchOrganisationUnits[id,path],whatsApp,facebookMessenger,skype,telegram,twitter'
  
    apiServices.getAPI('users/' + userdet)
    .then(response => {
      console.log("response ",response);
      localStorage.setItem("users", JSON.stringify(response.data.users))

      OfflineDb.setDataIntoPouchDB('userData', response.data)
      apiServices
      .getAPI(
        "29/organisationUnits/" + response.data.organisationUnits[0].id
      )
      .then((orgres) => {
        if (orgres && orgres.data && orgres.data.path) {
          try{
            let orgheirarchypath = orgres.data.path;
            let orgunit = orgheirarchypath.split("/")[2];
              apiServices
                .getAPI("dataStore/translations/" + orgunit)
                .then((res) => {
                  if(response.data && response.data.hasOwnProperty('interests') && response.data["interests"] && res.data && res.data.hasOwnProperty(response.data["interests"])){
                    res.data = res.data[response.data["interests"]]
                  }else{
                    let i = 0;
                    for(let prop in res.data){
                      if(i == 0 && _.isObject(res.data[prop])){
                        res.data = res.data[prop]
                      }
                      i++;
                    }
                  }
                  res.data["orguid"] = orgunit
                  

                  if(res.data.hasOwnProperty("TB")) {
                    OfflineDb.setDataIntoPouchDB(
                      "languageList",
                      res.data["TB"].selectedlanguage
                    );
                    OfflineDb.setDataIntoPouchDB(
                      "programBoDetails",
                      res.data["TB"]
                    );
                    response.data["programs"]=res.data["TB"].programuid;
                  } else {
                    OfflineDb.setDataIntoPouchDB(
                      "languageList",
                      res.data.selectedlanguage
                    );
                    OfflineDb.setDataIntoPouchDB(
                      "programBoDetails",
                      res.data
                    );
                    response.data["programs"]=res.data.programuid;
                  }


                  //setLanguageList(res.data.programdetails.selectedlanguage);
                  
                  try{
                    const Authorization = 'Basic ' + btoa(response.data.userCredentials.username + ":" + "YOUR_APP_PASSWORD")
                    console.log("response.data.userCredentials.username ",response.data,response.data.userCredentials.username);
                    localStorage.setItem('basicAuth', Authorization)
                    OfflineDb.setDataIntoPouchDB('basicAuth', Authorization)
                  }catch(e){

                  }
                  OfflineDb.setDataIntoPouchDB('loginDetails', response.data)
                  .then(a => {
                    let communityId = "38ac8718edc2806928aa643b7a59903f";// "64d9ccd7f5232708317202964a7777d1"; //"1602eb0d0662c0297ed5f156ec349953";
                      var imonparams = {
                        communityId: communityId,
                        externalUser: {
                          userUUID: response.data.userCredentials.username,
                        },
                        externalUserFlag: true,
                      };
                      Services.externalLogin(imonparams).then((res) => {
                        console.log("externalLogin", res);
                        localStorage.setItem('CommunityId', communityId);
                        localStorage.setItem('langId', 1);
                        setCommunityId(communityId);
                        localStorage.setItem("menuList", JSON.stringify(res.data.data.component.mobileSections));
                        localStorage.setItem('userrole', "Patient")
                        localStorage.setItem(
                          "obj",
                          JSON.stringify({
                            roleId: res.data.data.roleId,
                            roleType: "Patient",
                            userId: res.data.data.userId,
                            userType: res.data.data.userType,
                          })
                        );
                        setGlobalSpinner(false)
        
                      }).catch((err) => {
                        console.log("error::", err)
                      });
                      apiServices.getAPI('dataStore/configuration/configuration_ncd').then(res=>{
                          OfflineDb.setDataIntoPouchDB('configurations',res.data)      
                          setGlobalSpinner(false) 
                          setTimeout(()=>{
                              history.push("/selectlanguage",{"userid":user.id,"userrole":"patient", "userlist": userlist})
                          },500)  
                          
                      }).catch(error => {
                          setGlobalSpinner(false)
                          history.push("/selectlanguage",{"userid":user.id,"userrole":"patient", "userlist": userlist})
                      })
                  })
                  setGlobalSpinner(false)
                }).catch((e)=> {
                  setGlobalSpinner(false)
              })
            }catch(e){
              setGlobalSpinner(false)
            }
          }
        }).catch((e)=> {
          setGlobalSpinner(false)
      });
            //   OfflineDb.setDataIntoPouchDB('userData', response.data)
            //   response.data["programs"]=[]
            //   var orgparam='37/programs?ouid='+response.data.organisationUnits[0].id
            //   apiServices.getAPI(orgparam).then(orgdata=>{
            //     console.log(orgdata.data)
            //     response.data["programs"]=orgdata.data.programs.map(item => item.id).reverse();
            //   })
                
            //   apiServices.getAPI(metaDataParam).then((metaData) => {
                
            //     OfflineDb.setDataIntoPouchDB('metaData', metaData.data)
            //     let registerProgramId = "TMF8Tah3HFU"

            //     var subURL = 'trackedEntityInstances/'+response.data.attributeValues[0].value+'.json?program='+registerProgramId+'&fields=*?'
            // apiServices.getAPI(subURL).then(searchResponse => {
            //     console.log(searchResponse)
            //     console.log("user",user,response.data)
            //     OfflineDb.setDataIntoPouchDB('loginDetails',response.data)
            //     OfflineDb.setDataIntoPouchDB('loggedinuser',response.data)
            //     OfflineDb.setDataIntoPouchDB('usertrackid',searchResponse.data.trackedEntityInstance)
            //     const activeCaseDetails = {
            //       'trackedEntityInstance': searchResponse.data.trackedEntityInstance,
            //       'enrollmentId': "",
            //     }
            //     OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
            //     OfflineDb.setDataIntoPouchDB('userdetails',searchResponse.data.attributes)
            //     OfflineDb.setDataIntoPouchDB('userEnrollments',searchResponse.data.enrollments)
            //     OfflineDb.setDataIntoPouchDB('providerobj',searchResponse.data.storedBy)
              
            //   let communityId = "88e781c1e0900aa27a74c58cbe89be78";// "64d9ccd7f5232708317202964a7777d1"; //"1602eb0d0662c0297ed5f156ec349953";
            //   var imonparams = {
            //     communityId: communityId,
            //     externalUser: {
            //       userUUID: response.data.userCredentials.username,
            //     },
            //     externalUserFlag: true,
            //   };
            //   Services.externalLogin(imonparams).then((res) => {
            //     console.log("externalLogin", res);
            //     localStorage.setItem('CommunityId', communityId);
            //     localStorage.setItem('langId', 1);
            //     setCommunityId(communityId);
            //     localStorage.setItem("menuList", JSON.stringify(res.data.data.component.mobileSections));
            //     localStorage.setItem('userrole', "Patient")
            //     localStorage.setItem(
            //       "obj",
            //       JSON.stringify({
            //         roleId: res.data.data.roleId,
            //         roleType: "Patient",
            //         userId: res.data.data.userId,
            //         userType: res.data.data.userType,
            //       })
            //     );
            //     setGlobalSpinner(false)
            //     history.push('/layout/imonhome')

            //   }).catch((err) => {
            //     console.log("error::", err)
            //   });

            //   })
            
            // }).catch(error => {
            //   console.log(error)
            // })
           
            }).catch(err => {
              console.log(err)

            })
  }

  function adduser(){
    apiServices.getAPI('users/' + userlist[0].id)
            .then(response => {
              history.push("/OnboardingRegVertical",{"user":response.data})
            }).catch(err => {
              console.log(err)

            })
  }


  return (
    <div className="userprofilepage">
      {/* <LoginAppbar></LoginAppbar> */}
      <Grid container xs={12} className='registernav'>

<Grid xs={3} className='backimg' onClick={() => handleBack()}><img src={imgUrl.backlogo} className='backsvg'
 style={{ marginTop: "2%" , width: "6%"}} /></Grid>
<Grid xs={6} className='text-center'>
  <Typography variant='subtitle1' className='regname oneuhcfont user-name'>User Profile</Typography>
</Grid>
<Grid xs={3} >

</Grid>

      </Grid>

      <Grid container className="userprofilegrid mt-20px">

       
        <Grid item xs={0} md={4} >

         </Grid>
        <Grid container xs={12} md={4} className="pagelaterpart">
        <div className="langprefpageformholder">
        
      
          <div className='langSection text-center user-profilesection'>
          <div className="langitems">
              
              <div className="mainHolder_divcontainer">
                <div className="questionholderdiv registerform">
                  <Typography variant='subtitle1' className='oneuhcfont'>You can use your profile or add one for someone in your household.</Typography>

                </div>
                <div className='profilediv' onClick={()=>adduser()}>
                <img src={imgUrl.addicon} className='addicon' />
                <img src={imgUrl.userimage2} className="userimage2" />
                <Typography variant='h6'>Add</Typography>
                <Typography variant='body2'>Add (secondary account)</Typography>

              </div>
            
            
              <div className="userlist-block">
            
            {
              userlist.map((u)=>{
                return <div className='profilediv' onClick={()=>userlogin(u)}>
                  <img src={imgUrl.userimage1} className="userimage1" />
                  <Typography variant='h6'>{u.displayName}</Typography>
                  {/* <Typography variant='body2'>(main account)</Typography> */}
                </div>
                })
              }
              
          
              </div>

              </div>

            </div>
            {/* <div className='diffprofilediv w-100'>
              
             
            </div> */}
          </div>
        </div>
        </Grid>
        <Grid item xs={0} md={4} >

        </Grid>
          
         
       
        {/* <Grid container xs={12} className="homebottomnav">
                <Grid xs={2} className="home-svg" onClick={()=>(history.push('/layout/imonhome'))}>
                  <img src={imgUrl.homesvg} />
                  <Typography variant="caption" display="block">
                    Home
                  </Typography>
                </Grid>
                <Grid xs={2} className="journey-svg" onClick={()=>(history.push('/patientcertificate'))}>
                  <img src={imgUrl.journeysvg} />
                  <Typography variant="caption" display="block">
                    My Journey
                  </Typography>
                </Grid>
                <Grid xs={2} className="near-svg" onClick={()=>(history.push('/layout/nearme'))}>
                  <img src={imgUrl.nearsvg} />
                  <Typography variant="caption" display="block">
                    Near Me
                  </Typography>
                </Grid>
                <Grid xs={2} className="guide-svg" onClick={()=>(history.push('/layout/getknowledgeable'))}>
                  <img src={imgUrl.guidesvg} />
                  <Typography variant="caption" display="block">
                    Guide
                  </Typography>
                </Grid>
                <Grid xs={2} className="connect-svg" onClick={()=>(history.push('/layout/peerchat'))}>
                  <img src={imgUrl.connectsvg} />
                  <Typography variant="caption" display="block">
                    Connect
                  </Typography>
                </Grid>
                <Grid xs={2} className="screen-svg">
                  <img src={imgUrl.screensvg} />
                  <Typography variant="caption" display="block">
                    Screening
                  </Typography>
                </Grid>
              </Grid> */}
      </Grid>

    </div>

  )
}



export default Userprofile;

