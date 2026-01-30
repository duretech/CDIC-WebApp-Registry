import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import * as _ from "lodash";
import Slider from "react-slick";
import serialize from "form-serialize";
import swal from "sweetalert";
import ApiServices from "../../api/api";
import { withTranslation, Trans } from "react-i18next";
import Onboardinglanguage from "./Onboardinglanguage.js";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Onboardingage from "./Onboardingage.js";
import Onboardinggender from "./Onboardinggender.js";
import Onboardingprofession from "./Onboardingprofession.js";
import OnboardingRegistration from "./OnboardingRegistration";
import { connect } from "react-redux";
import { setLangID, setOnboardPernt, setCommunityId } from "../../redux/actions/appActions";
import Services from "../../api/api";
import Loader from "../loaders/loader";
import imgUrl from "../../assets/images/imageUrl.js";
import { ButtonStrip, InputFieldFF, SingleSelectFieldFF, ReactFinalForm, hasValue, AlertBar, CircularLoader, CenteredContent } from '@dhis2/ui';
import { Link, useHistory, withRouter } from "react-router-dom";
import { signInAnonymously, logError } from "../../helpers/auth";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from "@material-ui/core/TextField";
import { apiServices } from '../../../services/apiServices';
import Typography from '@material-ui/core/Typography';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";
import Feedback from "../Feedback";
import moment from 'moment'
import OfflineDb from "../../../db";
import { Configuration } from "../../../assets/data/config";
import axios from "axios";

const inputParsers = {
  date(input) {
    const [month, day, year] = input.split("/");
    return `${year}-${month}-${day}`;
  },
  uppercase(input) {
    return input.toUpperCase();
  },
  number(input) {
    return parseFloat(input);
  },
};

const { Form, Field, FormSpy } = ReactFinalForm

class SimpleSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barangayUid:null,
      cityUid:null,
      OUJSON: [],
      metaDataParam: [],
      queslist1: [],
      queslist2: [],
      queslist3: [],
      loading: true,
      isOpened: false,
      slide: 1,
      phoneNo: '',
      userphn: '',
      otp: '',
      Fncheck: false,
      Lncheck: false,
      Pncheck: false,
      modalopen: false,
      userage:'',
      renderq:'',
      userAddParam: {
        "userCredentials": {
          "cogsDimensionConstraints": [],
          "catDimensionConstraints": [],
          "username": "",
          "password": "Test@123",
          "userRoles": [
            {
              "id": "ZxLxU5t9rA9"
            }
          ]
        },
        "surname": "",
        "firstName": "",
        "email": "",
        "phoneNumber": "",
        "organisationUnits": [
          {
            "id": localStorage.getItem("selfregbarangay")
          }
        ],
        "dataViewOrganisationUnits": [
          {
            "id": localStorage.getItem("selfregbarangay")//"ZAlc8GZfY1g"
          }
        ],
        "teiSearchOrganisationUnits": [{ "id": localStorage.getItem("selfregbarangay") }],
        "attributeValues": [{ "value": "", "attribute": { "id": "gFQlTzAEZhj" } }]
      },
      registrationProgramId : "zMBE0Puod96_2",
      tbProgramId : "C06Q5dI7C7_2",
      metaDataApiParam: Configuration.homepage.metaDataParam,
      patientAddParam : { "trackedEntityType": "mmeBG44SDWZ", "orgUnit": localStorage.getItem("selfregbarangay"), "attributes": [], "enrollments": [{ "program": "zMBE0Puod96_2", "orgUnit": localStorage.getItem("selfregbarangay"), "enrollmentDate": new Date().toISOString().slice(0, 10), "incidentDate": new Date().toISOString().slice(0, 10) }] }

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValue = this.getValue.bind(this)
    this.getRegisQues = this.getRegisQues.bind(this)
    this.addUser = this.addUser.bind(this)
    this.next = this.next.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this)
    this.inputChangevent = this.inputChangevent.bind(this)
    this.getUserAge = this.getUserAge.bind(this)
  }

  componentDidMount() {
    this.getMetaData()
    this.getOUOptions()
    console.log("phone", this.props)
    if (this.props.location.state) {
      this.setState({
        Pncheck: true,
        phoneNo: '+91' + this.props.location.state.user.phoneNumber,
      })
      this.state.userAddParam.phoneNumber = this.props.location.state.user.phoneNumber
    }
    gaLogEvent("Patient registration", '', '');
    gaLogScreen("Patient registration");
  }

  async getMetaData() {
    var that = this
    const runtime = window.RUNTIME_CONFIG || {};
    const Authorization = runtime.basicAuth;
    apiServices.loginApi(Authorization).then(res => {
      console.log("res",res);
      OfflineDb.setDataIntoPouchDB('adhereprog',res.data.programs)
      // apiServices.getAPI('dataStore/configuration/configuration').then(res => {
      //   console.log("res", res.data)
      //   that.setState({ metaDataParam: res.data.configuration.homepage.metaDataParam })
      //   that.getRegisQues()
      // }).catch(error => {
      //   console.log(error)
      // })

      // var param = "metadata?fields=:owner,displayName&programs:filter=id:eq:zMBE0Puod96&programs:fields=:owner,unique,playName,attributeValues[:all,attribute[id,name,displayName]]"
      apiServices.getAPI(this.state.metaDataApiParam).then((metaData) => {

        let completeMetadata = _.cloneDeep(metaData);
        let registerProgram = _.cloneDeep(_.filter(metaData.data.programs, { "code": Configuration.registrationProgramCode }))
        let tbProgram = _.cloneDeep(_.filter(metaData.data.programs, { "code": "tbprogram" }))
        metaData.data.programs = tbProgram && tbProgram.length > 0 ? tbProgram : metaData;
        OfflineDb.setDataIntoPouchDB("completeMetadata", completeMetadata.data);
        OfflineDb.setDataIntoPouchDB('metaData', metaData.data)
        let registerProgramId = registerProgram && registerProgram.length > 0 ? registerProgram[0].id : this.state.registrationProgramId
        let defaultTbProgramId = tbProgram && tbProgram.length > 0 ? tbProgram[0].id : this.state.tbProgramId
        this.state.registrationProgramId = registerProgramId
        this.state.tbProgramId = defaultTbProgramId
        this.state.patientAddParam.enrollments[0].program = registerProgramId
        //console.log("tbProgramId ",registerProgramId,tbNewProgramId,this.state.registrationProgramId,this.state.tbProgramId,this.state.patientAddParam);
        // var param = "metadata?programs:filter=id:eq:"+this.state.registrationProgramId+"&fields=:owner,displayName,description&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],organisationUnits[id,path,displayName,description,level],dataEntryForm[:owner],programSections[id,name,displayName,description,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,description,code,sortOrder,attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,description,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,description,translations[*],style]],attributeValues[:all,attribute[id,name,displayName,description]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,description,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id,options[id,code,displayName,description,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName,description],dataEntryForm[:owner],programStageSections[:owner,displayName,description,translations[*],dataElements[id,displayName,description]]]&dataElements:fields=id,displayName,description,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,description,valueType,optionSet[id,options[id,code,displayName,description,style]],unique"
        // apiServices
        //   .getAPI(param)
        //   .then(metaData => {
        //     console.log("meta", metaData.data.programs)
        //     var regques = metaData.data.programs.filter((p) => {
        //       console.log(p.programTrackedEntityAttributes)
        //       if (p.code && p.code == 'registration') {
        //         return p
        //       }
        //     })
            this.setState({
              renderq:registerProgram[0].programTrackedEntityAttributes
            })
            console.log("ques", registerProgram[0].programTrackedEntityAttributes)
            this.getQuestion(registerProgram[0].programTrackedEntityAttributes,'')
          // }).catch(error => {
          //   console.log(error)
          // })

          
      })

    }).catch(error => {
      if (error.response) {

        swal({
          title: "Login failed",
          text: error.response.data.message,
          icon: "error",
          button: "Close",
        });
      } else {
        swal({
          title: "Login failed",
          text: "",
          icon: "error",
          button: "Close",
        });
      }
    })
  }

  getOUOptions () {
    axios
    .get(
      "https://cdn.jsdelivr.net/gh/duretech/shared@master/OUStructureDPCB-latest.json",
      function (req, res) {
        res.header(
          "Access-Control-Allow-Origin",
          "*"
        );
      }
    )
    .then((OUStructureParams) => {
      this.state.OUJSON = OUStructureParams.data.organisationUnits

     })
    .catch(error=>{
      console.log(error)
    });
  }

  getRegisQues() {
    apiServices.getAPI(this.state.metaDataParam)
      .then(metaData => {
        console.log("meta", metaData.data.programs)
        var regques = metaData.data.programs.filter((p) => {
          console.log(p.programTrackedEntityAttributes)
          if (p.code && p.code == 'registration') {
            return p
          }
        })
        console.log("ques", regques[0].programTrackedEntityAttributes)
        this.getQuestion(regques[0].programTrackedEntityAttributes)
      })

  }

  getValue(name, value) {
    console.log("dddval ",name, value)
    if (name.includes("OneUHC ID")) {
      this.state.userAddParam.userCredentials.username = value
    }
    else if (name.includes("First Name")) {
      this.state.userAddParam.firstName = value
      this.setState({
        Fncheck: true
      })
    }
    else if (name.includes("Last Name")) {
      this.state.userAddParam.surname = value
      this.setState({
        Lncheck: true
      })
    } else if (name.includes("Email ID")) {
      this.state.userAddParam.email = value
    } else if (name.includes("Phone number")) {
      this.state.userAddParam.phoneNumber = value
      this.setState({
        phoneNo: '+91' + value.toString(),
        Pncheck: true
      })
    }
    console.log("params", this.state.userAddParam)
  }

  getUserAge(selectedDate){
    let dt2 = new Date(selectedDate);
    let dt1 = new Date();

    var a = moment(dt2);
    var b = moment(dt1);

    var years = a.diff(b, "years");
    var birth = Math.abs(years);
    var age = Math.abs(years);
    console.log("years", age);
    
    this.getQuestion(this.state.renderq,age)
    
  }

  getQuestion(element,userage) {
    var questions = element.map((e) => {
      //console.log("ques",element,userage,e)
      var name = e.trackedEntityAttribute.displayName.toLowerCase()
      try{
        if(!this.state.cityUid && name.includes("municipality/city")){
          this.setState({cityUid:e.trackedEntityAttribute.id})
        }
        if(!this.state.barangayUid && name.includes("barangay")){
          this.setState({barangayUid:e.trackedEntityAttribute.id})
        }
      }catch(e){

      }
      if (name.includes("weight") || name.includes("gps") || name.includes("qr") || name.includes("testing") || name.includes("treatment")) {
        return null
      }
      else {
        return <div id={e.trackedEntityAttribute.id} className="questionRow" >
          <OnboardingRegistration
            question={e}
            getValue={this.getValue}
            calcAge={this.getUserAge}
            userage={userage}
            OUJSON={this.state.OUJSON}
            phoneno={this.props.location.state ? this.props.location.state.user.phoneNumber : ''}
          ></OnboardingRegistration>
        </div>
      }
    })
    var intmarr = questions.filter((i) => i != null)
    var a = intmarr.slice(0, 7)
    var a2 = intmarr.slice(7, 9)
    var a3 = intmarr.slice(9, 13)
    var a1 = a.concat(intmarr.slice(13, 20))
    // var finalarr=[a1,a2,a3]
    this.setState({ queslist1: a1 })
    this.setState({ queslist2: a2 })
    this.setState({ queslist3: a3 })
    this.setState({
      loading: false
    })
    console.log("questions", intmarr, this.state.queslist1)
  }

  addUser() {

    var that = this
    try{
      this.state.userAddParam.organisationUnits[0].id = localStorage.getItem("selfregbarangay")
      this.state.userAddParam.dataViewOrganisationUnits[0].id = localStorage.getItem("selfregbarangay")
      this.state.userAddParam.teiSearchOrganisationUnits[0].id = localStorage.getItem("selfregbarangay")
    }catch(e){

    }
    apiServices.postAPI('users', this.state.userAddParam).then(res => {
      console.log("user", res.data.response.uid)

      var userdet=res.data.response.uid+'?fields=:all,owner,access,displayName,userGroups,organisationUnits[id,displayName,path],dataViewOrganisationUnits[id,displayName,path],userCredentials[id,username,user,accountExpiry,lastLogin,externalAuth,userRoles[id,displayName],cogsDimensionConstraints[id,displayName,dimensionType],catDimensionConstraints[id,displayName,dimensionType],openId,ldapId,disabled],teiSearchOrganisationUnits[id,path],whatsApp,facebookMessenger,skype,telegram,twitter'
  
    apiServices.getAPI('users/' + userdet)
    .then(response => {
                    response.data["programs"]=[]
                    var orgparam='37/programs?ouid='+response.data.organisationUnits[0].id
                    apiServices.getAPI(orgparam).then(orgdata=>{
                      console.log(orgdata.data)
                      response.data["programs"]=orgdata.data.programs.map(item => item.id).reverse();
                    })
                

                var subURL = 'trackedEntityInstances/'+response.data.attributeValues[0].value+'.json?program='+this.state.registrationProgramId+'&fields=*?'
            apiServices.getAPI(subURL).then(searchResponse => {
                console.log(searchResponse)
                OfflineDb.setDataIntoPouchDB('loginDetails',response.data)
                OfflineDb.setDataIntoPouchDB('loggedinuser',response.data)
                OfflineDb.setDataIntoPouchDB('usertrackid',searchResponse.data.trackedEntityInstance)
                const activeCaseDetails = {
                  'trackedEntityInstance': searchResponse.data.trackedEntityInstance,
                  'enrollmentId': "",
                }
                OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
                OfflineDb.setDataIntoPouchDB('userdetails',searchResponse.data.attributes)
                OfflineDb.setDataIntoPouchDB('providerobj',searchResponse.data.storedBy)
                

                // var param1 = "metadata?programs:filter=id:eq:"+this.state.tbProgramId+"&fields=:owner,displayName,description&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],organisationUnits[id,path,displayName,description,level],dataEntryForm[:owner],programSections[id,name,displayName,description,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,description,code,sortOrder,attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,description,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,description,translations[*],style]],attributeValues[:all,attribute[id,name,displayName,description]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,description,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id,options[id,code,displayName,description,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName,description],dataEntryForm[:owner],programStageSections[:owner,displayName,description,translations[*],dataElements[id,displayName,description]]]&dataElements:fields=id,displayName,description,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,description,valueType,optionSet[id,options[id,code,displayName,description,style]],unique"

                // apiServices
                // .getAPI(param1)
                // .then(metaData => {
    
                //   OfflineDb.setDataIntoPouchDB('metaData', metaData.data)
                //   console.log(metaData)

                  let communityId = "1602eb0d0662c0297ed5f156ec349953";
      var imonparams = {
        communityId: communityId,
        externalUser: {
          userUUID: res.data.response.uid,
        },
        externalUserFlag: true,
      };
      Services.externalLogin(imonparams).then((res) => {
        console.log("externalLogin", res);
        localStorage.setItem('CommunityId', communityId);
        localStorage.setItem('langId', 1);
        that.setState({
          loading: false,
        })
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

        that.props.history.push('/layout/imonhome')
        try{
          localStorage.removeItem("selfregcity")
          localStorage.removeItem("selfregbarangay")
        }catch(e){
    
        }

      }).catch((err) => {
        console.log("error::", err)
        that.setState({
          loading: false,
          isOpened: false,
          slide: 1
        })
      });

                // }).catch(error => {
                //   console.log(error)
                // })

                })

              
              
                }).catch(err => {
                  console.log(err)

                })

      

    }).catch(error => {
      swal({
        title: "Error",
        text: "Please fill all details correctly",
        icon: "error",
        button: "Close",
      });
      that.setState({
        loading: false,
        isOpened: false,
        slide: 1
      })
      that.state.patientAddParam.attributes.length=0


    })
  }

  addGuestUser() {

    const { t } = this.props;
    var geoLocation = this.state.lat != "" && this.state.lat != null ? true : false;
    var FBuser = JSON.parse(localStorage.getItem('FBuser'))
    if (navigator.onLine) {
      let uuid = localStorage.getItem('deviceuuid') != null ? localStorage.getItem('deviceuuid') : uuidv4();
      var geoLocation = this.state.lat != "" && this.state.lat != null ? true : false;
      localStorage.setItem("deviceuuid", uuid);
      var param = {
        communicationDetails: {
          fcmId: localStorage.getItem('fcmToken')
        },
        communityId: localStorage.getItem('CommunityId'),
        deviceDetails: {
          serialNumber: uuid,
        },
        profile: {
          location: {
            coordinates: [this.state.lat, this.state.lng],
            type: "point",
          },
          isProfileComplete: this.state.compleperc >= 100 ? true : false
        },
        preferredLanguageId: this.props.langId,
        geoLocation: geoLocation
      };
      if (window.cordova) {
        param.deviceDetails['uuid'] = window.device.uuid
        param.deviceDetails['cordova'] = window.device.cordova
        param.deviceDetails['manufacturer'] = window.device.manufacturer
        param.deviceDetails['model'] = window.device.model
        param.deviceDetails['platform'] = window.device.platform
        param.deviceDetails['serialNumber'] = window.device.uuid
        param.deviceDetails['version'] = window.device.version
        localStorage.setItem("deviceuuid", window.device.uuid);
      }

      if (FBuser != null) {
        param.profile['nickName'] = FBuser.displayName
        param.profile['avtaar'] = FBuser.photoURL
      }

      if (this.state.userPresent) {
        this.setProfileCompletion()
        this.props.history.push("/Thankspage1");
      } else {
        console.log(param)
        Services.addApplicant(param).then((res) => {
          try {
            if (res.data.status == 200) {
              localStorage.setItem(
                "obj",
                JSON.stringify({
                  roleId: res.data.data.roleId,
                  roleType: res.data.data.roleType,
                  userId: res.data.data.userId,
                  userType: res.data.data.userType,
                })
              );
              //let regiscomplete =  localStorage.getItem('regiscomplete') != null ? localStorage.getItem('regiscomplete') : "false";
              //localStorage.setItem("regiscomplete", "false")
              this.getUserDetail()
              this.setProfileCompletion()
              this.props.history.push("/Thankspage1");
            }
          } catch (err) {
            console.log("err::", err);
            var erroObj = {
              communityuid: localStorage.getItem("CommunityId"),
              component: 'OnboardingRegVertical',
              method: 'addGuestUser',
              error: err
            }
            logError(erroObj);
          }
        }).catch((error) => {
          console.log("getRequest err>>", error);
          this.checkUserExist()
        });
      }
    } else {
      swal({
        title: t("Unstable internet connection"),
        text: t("please check network connection"),
        icon: "success",
        button: t("Ok"),
      }).then((val) => {
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    var that = this
    this.setState({
      loading: true
    })


    const form = event.target;

    var obj = serialize(form, { hash: true, disabled: true });
    try{
      if(that.state.cityUid && that.state.barangayUid){
        obj[that.state.cityUid] = localStorage.getItem("selfregcity")
        obj[that.state.barangayUid] = localStorage.getItem("selfregbarangay")
      }
      that.state.patientAddParam.orgUnit = localStorage.getItem("selfregbarangay")
      that.state.patientAddParam.enrollments[0].orgUnit = localStorage.getItem("selfregbarangay")
    }catch(e){

    }
    
    Object.keys(obj).forEach((key, index) => {
      var att = { "attribute": key, "value": obj[key] }

      console.log(key, obj[key], att)
      that.state.patientAddParam.attributes.push(att)
    });

    console.log("param",obj,form,Object.keys(obj),that.state.patientAddParam )

    apiServices.postAPI('trackedEntityInstances', that.state.patientAddParam).then(res => {
      this.state.userAddParam.attributeValues[0].value = res.data.response.importSummaries[0].reference
      console.log("user", res.data.response.importSummaries[0].reference, this.state.userAddParam)
      that.addUser()
    }).catch(error => {
      swal({
        title: "Error",
        text: "Please fill all details correctly",
        icon: "error",
        button: "Close",
      });
      that.state.patientAddParam.attributes.length=0
      that.setState({
        loading: false,
        isOpened: false,
        slide: 1
      })

    })

  }


  next() {
    var that = this
    if ((this.state.Fncheck && this.state.Lncheck && this.state.Pncheck && this.state.slide == 1) || (this.state.slide == 2)) {

      if (this.state.slide == 1) {
        var Otp = Math.floor(100000 + Math.random() * 900000)
        that.setState({
          otp: Otp
        })
        // var param = 'Body=Your access code for OneHUC App' + String(Otp) + '&From=+18575759918&To=' + this.state.phoneNo
        var param = 'Body=Your access code for OneHUC App  ' + String(Otp) + '&From=+41798073277&To=' + this.state.phoneNo
        Services.sendOtp(param).then((res) => {
          console.log("twilio", res);
          if (res.status == 201) {
            that.setState({
              modalopen: true
            })

            const form = document.querySelector('#registerform');

            var obj = serialize(form, { hash: true, disabled: true });

            Object.keys(obj).forEach((key, index) => {
              var att = { "attribute": key, "value": obj[key] }

              console.log(key, obj[key], att)
              that.state.patientAddParam.attributes.push(att)
            });

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


      if (that.state.slide == 2) {
        that.setState({
          slide: that.state.slide + 1,
          isOpened: true
        })

        const form = document.querySelector('#registerform');

        var obj = serialize(form, { hash: true, disabled: true });
    
        Object.keys(obj).forEach((key, index) => {
          var att = { "attribute": key, "value": obj[key] }
    
          console.log(key, obj[key], att)
          that.state.patientAddParam.attributes.push(att)
        });
      }
    } else {
      swal({
        title: "Error",
        text: "Please fill all mandatory fields",
        icon: "error",
        button: "Close",
      });
      that.state.patientAddParam.attributes.length=0
    }
  }

  inputChangevent(value) {
    this.setState({
      userphn: value
    })
  }

  verifyOtp() {
    var that = this
    if (this.state.otp == this.state.userphn) {
      that.setState({
        slide: that.state.slide + 1,
        modalopen: false
      })
    }
    else {
      swal({
        title: "Error",
        text: "Please enter the correct otp",
        icon: "error",
        button: "Close",
      });
      that.state.patientAddParam.attributes.length=0
      that.setState({
        modalopen: false
      })
    }
  }

  handleBack() {
    window.history.back();
  }

  render() {

    const { t } = this.props;
    const Fragment = React.Fragment;


    return (
      <>
        {this.state.loading ? (
          <div className={window.cordova ? "onboarding-page patientreg" : 'onboarding-page patientreg windowdesktop'}>

              <Grid container className="patientreggrid">
                <Grid container xs={12} className='loginnav'>

                  <Grid xs={3} className='backimg' onClick={() => this.handleBack()}><img src={imgUrl.back} className='backsvg' /></Grid>
                  <Grid xs={6}>
                    <Typography variant='subtitle1' className='logname oneuhcfont'>Register</Typography>
                  </Grid>
                  <Grid xs={3}>
                    <Typography variant='body2' className='stepname'><Feedback></Feedback></Typography>
                  </Grid>

                </Grid>
                <Grid
                  item
                  xs={12}
                  className='regusercontent'
                  style={{ marginBottom: "590px" }}
                >
                  <div className='user-doh'>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' /></div>
                    <div>
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div className='user-dohreg'>
                    <div>
                      <img src={imgUrl.userpass} className='userimg' />
                    </div>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' />
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div>
                    <Typography variant="h6" className="oneuhcfont">Please complete the form as much as you can.</Typography>
                  </div>
                </Grid>
                <Loader isLoading={this.state.loading} />


              </Grid>

          </div>



        ) : (
          <div className={window.cordova ? "onboarding-page patientreg" : 'onboarding-page patientreg windowdesktop'}>
            

              <Grid container className="patientreggrid">
                <Grid container xs={12} className='loginnav'>

                  <Grid xs={3} className='backimg' onClick={() => this.handleBack()}><img src={imgUrl.back} className='backsvg' /></Grid>
                  <Grid xs={6}>
                    <Typography variant='subtitle1' className='logname oneuhcfont'>Register</Typography>
                  </Grid>
                  <Grid xs={3}>
                  <Typography variant='body2' className='stepname'><Feedback></Feedback></Typography>
                  </Grid>

                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                  className='regusercontent'
                >
                  <div className='user-doh'>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' /></div>
                    <div>
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div className='user-dohreg'>
                    <div>
                      <img src={imgUrl.userpass} className='userimg' />
                    </div>
                    <div><img src={imgUrl.dohlogo} className='dohimg ' />
                      <Typography className='dohtext oneuhcfont' variant='h4'>OneUHC App</Typography>
                    </div>
                  </div>
                  <div className="com-form">
                    <Typography variant="h6" className="oneuhcfont">Please complete the form as much as you can.</Typography>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={12}
                  lg={6}
                  className="onboardingsliderdivcontent onboardingscrollcontent patientnewreg"
                >
                  <div className="com-form text-center">
                    <Typography variant="h6" className="oneuhcfont">Please complete the form as much as you can.</Typography>
                  </div>
                  <form id="registerform" onSubmit={this.handleSubmit}>
                  {this.state.slide == 1 && <div className="onboardingslider-container patientnewregdiv">
                    <div>Mandatory Fields <span style={{ color: 'red' }}>*</span> </div>
                    {this.state.queslist1}

                  </div>}
                  {this.state.slide == 2 && <div className="onboardingslider-container patientnewregdiv">

                    {this.state.queslist2}

                  </div>}
                  {this.state.slide == 3 && <div className="onboardingslider-container patientnewregdiv">

                    {this.state.queslist3}

                  </div>}

                  <div className="patientregsubmit">
                    {!this.state.isOpened && <Button

                      color="primary"

                      className="skipbtn"
                      onClick={() => this.next()}
                    >
                      <Trans>
                        <span>{t("Next")} </span>{" "}
                      </Trans>
                    </Button>}
                    {this.state.isOpened && <Button
                      type="submit"
                      color="primary"

                      className="skipbtn"
                    // onClick={()=>this.addUser()}
                    >
                      <Trans>
                        <span>{t("Submit")} </span>{" "}
                      </Trans>
                    </Button>}

                  </div>
                  </form>
                </Grid>


              </Grid>

            

            {
              <Dialog
                open={this.state.modalopen}
                aria-labelledby="server-modal-title"
                aria-describedby="server-modal-description"
                className='usersPopUp phonepopup'
              >
                <DialogTitle id="simple-dialog-title">{t('Please enter the OTP')}</DialogTitle>
                <TextField
                  type={'number'}
                  inputProps={{ maxlength: 6 }}
                  onChange={(evt) => this.inputChangevent(evt.target.value)}
                  className="otpfield"
                />
                <Button
                  variant="contained"
                  // color = "primary"
                  className="userSelect userSelectBtn"
                  disableElevation
                  onClick={() => { this.verifyOtp() }}
                >
                  {t('Submit')}
                </Button>
              </Dialog>
            }
          </div>
        )}
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
  };
};

export default connect(mapStateToProps, { setLangID, setOnboardPernt })(
  withTranslation()(withRouter(SimpleSlider))
);