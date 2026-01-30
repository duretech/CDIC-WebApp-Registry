import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import * as _ from "lodash";
import Slider from "react-slick";
import serialize from "form-serialize";
import swal from "sweetalert";
import { logError, signInAnonymously } from "../../helpers/auth";
import { auth } from "../../service/firebase";
import { withTranslation, Trans } from "react-i18next";
import Onboardinglanguage from "./Onboardinglanguage.js";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Onboardingage from "./Onboardingage.js";
import Onboardinggender from "./Onboardinggender.js";
import Onboardingprofession from "./Onboardingprofession.js";
import OnboardingRegistration from "./OnboardingRegistration";
import { connect } from "react-redux";
import { setLangID, setOnboardPernt } from "../../redux/actions/appActions";
import Services from "../../api/api";
import imgUrl from "../../assets/images/imageUrl.js";
import Customcircularprogress from "./Customcircularprogress.js";
import { Link, useHistory, withRouter } from "react-router-dom";
import Header from "./Header";
import OffileDb from '../../config/pouchDB';

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

let counterArr = [];
let slidercounter = 0;
let dependentQuesArr = {};
let dependentResponseArr = [];
let dependentQueSet = [];
let userType = '';
let age = '';
let gender = '';
let checkvalidation = true;
let Nickname = '';

class SimpleSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionlist: [],
      isOpened: false,
      isLoading: true,
      lat: '',
      lng: '',
      showSlider: true,
      currentSlide: 0,
      newSlide: 0,
      reintialise: true,
      sliderLng: 0,
      userPresent: false,
      animCssClasses: "animate__animated animate__zoomIn animate__faster",
      headerLogo: imgUrl.logo,
      footerLogo: imgUrl.stoptblogo,
    };
    this.afterChange = this.afterChange.bind(this);
    this.beforeChange = this.beforeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCompletionPer = this.updateCompletionPer.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {
    counterArr = [];
    dependentQueSet = [];
    dependentQuesArr = {};
    let deviceuuid = localStorage.getItem('deviceuuid');
    let userObj = localStorage.getItem('obj');
    this.props.setOnboardPernt(0);
    OffileDb.setDatabase()
    this.getAppLogos();
    this.getCurrentLocation();
    this.getRegistrationForm();
    this.resetFcmToken();
    console.log(deviceuuid, userObj)
    if (deviceuuid && userObj) {
      this.props.history.push("/layout");
    } else {
      this.checkUserPresent();
    }
  }


  checkUserPresent() {
    if(navigator.onLine){
    if (window.cordova) {
      var para = {
        "communityId": localStorage.getItem("CommunityId"),
        "serialNumber": window.device.uuid //param.deviceDetails.serialNumber,
      }
      console.log(para)
      Services.checkIfApplicantExists(para).then((res) => {
        try{
          console.log(res)
          if (res && res.data.status == 200) {
            localStorage.setItem(
              "obj",
              JSON.stringify({
                roleId: res.data.data.roleId,
                roleType: res.data.data.roleType,
                userId: res.data.data.userId,
                userType: res.data.data.userType,
              })
            );
            this.setState({ userPresent: true });
            localStorage.setItem("deviceuuid", window.device.uuid);
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Onboardingslider',
            method: 'checkUserPresent',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }
}

  resetFcmToken() {
    if (window.cordova && window.FCMPlugin) {
      window.FCMPlugin.getToken(function (token) {
        localStorage.setItem('fcmToken', token);
      });
    }
  }

  getAppLogos() {
    var that = this
    if (navigator.onLine) {
      OffileDb.getData('applogos').then(function (result) {
        if (!result.status && result.status != 404) {
          let hlogo = result.data.brandingDetails.filter(o => o.tagline == "headerlogo").map(o => o.icon)[0] || imgUrl.logo;
          let flogo = result.data.brandingDetails.filter(o => o.tagline == "footerlogo").map(o => o.icon)[0] || imgUrl.stoptblogo;
          that.setState({
            headerLogo: hlogo,
            footerLogo: flogo
          });
        }
      });
    }
  }

  getCurrentLocation() {
    var that = this;
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          that.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: 13,
          });
        },
        null,
        options
      );

    }
  }

  getRegistrationForm() {
    //this.loadOfflineData()
    if (navigator.onLine) {
      var param = {
        communityId: localStorage.getItem("CommunityId"),
        languageId: localStorage.getItem("langId"),
      };
      console.log(param)

      Services.getRegistrationQuestions(param).then((data) => {
        try{
          console.log(data.data.data)
          if (data.data.status == 200) {
            if (data.data.data.length > 0) {
              this.setState({
                questionlist: data.data.data,
                sliderLng: data.data.data.length
              });
              OffileDb.setData('RegistrationForm', data.data.data)
              this.loadOfflineRegDeatils()
            }
          }
          this.setState({
            isLoading: false
          });
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Onboardingslider',
            method: 'getRegistrationForm',
            error: err
          }
          logError(errorObj);
        }
      });

      // Services.getStaticContent(param).then((data) => {
      //   if (data.data.status == 200) {
      //     if (data.data.data.contentList.length > 0) {
      //       data.data.data.contentList[0].questionList.forEach((element) => {
      //         element.anstext = element.questiontype == "text" ? null : "";
      //       });
      //       this.setState({
      //         questionlist: data.data.data.contentList[0].questionList,
      //         sliderLng: data.data.data.contentList[0].questionList.length
      //       });
      //       OffileDb.setData('RegistrationForm', data.data.data.contentList[0].questionList)
      //       this.loadOfflineRegDeatils()
      //     }

      //   }
      // });
    }
  }

  beforeChange(current, newslide) {
    var len = document.getElementsByClassName("slick-slide").length - 1
    if (len == newslide) {
      this.setState({
        isOpened: true,
        animCssClasses: "invisible",
        showSlider: false,
        currentSlide: current,
        newSlide: newslide,
      });
    } else {
      this.setState({
        isOpened: false,
        currentSlide: current,
        newSlide: newslide,
        showSlider: false,
        animCssClasses: "invisible",
      });
    }

    setTimeout(() => {
      this.setState({
        animCssClasses: "animate__animated animate__zoomIn animate__faster",
      });
    }, 1000);
  }

  afterChange(current, newslide, slick) {
    this.setState({
      showSlider: true,
      // animCssClasses: 'animate__animated animate__zoomIn animate__faster'
    });

    // setTimeout(() => {
    //   this.setState({
    //     showSlider: true,
    //   });
    // }, 0);
  }

  // circularPertangeCal(current) {
  //   var len = this.state.questionlist.length
  //   var num = 100 / len
  //   this.props.setOnboardPernt(num * current)
  // }

  handleSubmit(event) {
    event.preventDefault();
    checkvalidation = true;
    let questionlist = _.cloneDeep(this.state.questionlist);
    const { t } = this.props;
    const form = event.target;
    var Qtype = ['radio','checkbox','dropdown']
    var str = serialize(form);
    var obj = serialize(form, { hash: true });

    if (Object.keys(obj).length == 0) {
      alert(t('Please select option'))
      return;
    }

    let registrationInfo = [];
    questionlist.map(qobj => {

      var questionobj = qobj['questionList'][0]

      if (obj[questionobj.questionId]) {
        /*start condition for usertype */
        var qname = questionobj.name.toLowerCase()
        if (qname == "age") {
          age = Qtype.includes(questionobj.type.toLowerCase()) ? questionobj.optionMap[obj[questionobj.questionId]] : obj[questionobj.questionId]
        }

        if (qname == "gender" || qname == 'sex') {
          gender = Qtype.includes(questionobj.type.toLowerCase()) ? questionobj.optionMap[obj[questionobj.questionId]] : obj[questionobj.questionId]
        }
        
        if (questionobj.name == "usertype" || questionobj.name == 'userrole') {
          let selectedUserType = questionobj.optionMap[obj[questionobj.questionId]]
          userType = selectedUserType;
        }

        if (qname == "nickname" || qname == "your profile name") {
          Nickname = Qtype.includes(questionobj.type.toLowerCase()) ? questionobj.optionMap[obj[questionobj.questionId]] : obj[questionobj.questionId]
        }

        /*end condition for usertype */
        if (Array.isArray(obj[questionobj.questionId])) {
          questionobj['response'] = obj[questionobj.questionId]
        } else {
          questionobj['response'] = Qtype.includes(questionobj.type.toLowerCase())? [...new Set(obj[questionobj.questionId].split(','))] : [obj[questionobj.questionId]]
        }

        if (questionobj.isValidation) {
          this.checkValidation(questionobj)
        }

        if (questionobj.dependentQuestionsList) {
          this.checkDependentResponsed(questionobj, obj)
        }


        registrationInfo.push(questionobj)
      }
    })

    this.saveApplicantdeatils(registrationInfo, userType, age, gender, Nickname);

  }


  checkDependentResponsed(questionobj, obj) {
    if (questionobj.dependentQuestionsList) {
      questionobj.dependentQuestionsList = this.getDependentResponse(questionobj.dependentQuestionsList, questionobj.questionId, obj)
      if (questionobj.dependentQuestionsList) {
        questionobj.dependentQuestionsList.forEach(q => {
          this.checkDependentResponsed(q, obj)
        })

      }
    }
  }

  getDependentResponse(depenArr, parantid, formObj) {
    var arr = []
    depenArr.forEach(obj => {
      if (obj.name == "age") {
        age = obj.optionMap[formObj[obj.questionId]]
      }

      if (obj.name == "gender") {
        gender = obj.optionMap[formObj[obj.questionId]]
      }

      if (obj.name == "usertype" || obj.name == 'userrole') {
        let selectedUserType = obj.optionMap[formObj[obj.questionId]]
        userType = selectedUserType;
      }

      var id = obj.questionId
      if (formObj[id] != undefined) {
        //obj.response = [formObj[id]]
        obj.response = obj.type == "checkbox" && typeof formObj[id] == "object" ? formObj[id] : [formObj[id]]
        arr.push(obj)

        if (obj.isValidation) {
          this.checkValidation(obj)
        }
      }
    })
    return arr;
  }

  checkValidation(questionobj) {
    if (!questionobj.response) {
      checkvalidation = false;
    } else if (questionobj.validations != null && questionobj.validations.length > 0) {
      if (questionobj.validations[0].validationType == "Verify") {
        if (questionobj.validations[0].validationValues[1] != questionobj.response[0]) {
          checkvalidation = false;
        }
      }
    }
  }

  saveApplicantdeatils(registrationInfo, userType, age, gender, Nickname) {
    let uuid = uuidv4();
    var geoLocation = this.state.lat != "" && this.state.lat != null ? true : false;
    localStorage.setItem("deviceuuid", uuid);

    let params = {
      communicationDetails: {
        fcmId: localStorage.getItem('fcmToken')
      },
      communityId: localStorage.getItem("CommunityId"),
      deviceDetails: {
        serialNumber: uuid,
      },
      preferredLanguageId: localStorage.getItem("langId"),
      profile: {
        age: age,
        gender: gender,
        nickName: Nickname,
        location: {
          coordinates: [this.state.lat, this.state.lng],
          type: "point",
        },
      },
      registrationInfoList: {
        languageId: localStorage.getItem("langId"),
        registrationInfo: registrationInfo
      },
      geoLocation: geoLocation
    }

    if (checkvalidation) {
      params.userType = userType;
    }

    if (window.cordova) {
      params.deviceDetails['uuid'] = window.device.uuid
      params.deviceDetails['cordova'] = window.device.cordova
      params.deviceDetails['manufacturer'] = window.device.manufacturer
      params.deviceDetails['model'] = window.device.model
      params.deviceDetails['platform'] = window.device.platform
      params.deviceDetails['serialNumber'] = window.device.uuid
      params.deviceDetails['version'] = window.device.version
      localStorage.setItem("deviceuuid", window.device.uuid);
    }

    // param.profile = Object.assign({}, obj, param.profile);
    console.log(params)
    if (navigator.onLine) {
      this.state.userPresent ? this.updateUserData(params) : this.submitApiData(params);
    } else {
      this.saveRegiFormOffline(params)
    }

    if(Nickname) {
      signInAnonymously().then((res) => {
        auth().onAuthStateChanged((user) => {
          if (user) {
            user.updateProfile({
              displayName: Nickname,
            }).then(function (res) {
                console.log("updateProfile res>>", res);
              }).catch(function (error) {
                console.log("updateProfile error>>", error);
              });
          } else {
            console.log("error>>", user);
          }
        });
      }).catch((err) => console.log("err>>>", err));
    }
  }
  if(Nickname) {
    signInAnonymously().then((res) => {
      auth().onAuthStateChanged((user) => {
        if (user) {
          user.updateProfile({
            displayName: Nickname,
          }).then(function (res) {
              console.log("updateProfile res>>", res);
            }).catch(function (error) {
              console.log("updateProfile error>>", error);
            });
        } else {
          console.log("error>>", user);
        }
      });
    }).catch((err) => console.log("err>>>", err));
  }

  submitApiData(params) {
    Services.addApplicant(params).then((res) => {
      try{
        if (res.data.status == 200) {
          OffileDb.removeData('Applicantdeatils')
          localStorage.setItem('obj', JSON.stringify({
            roleId: res.data.data.roleId,
            roleType: res.data.data.roleType,
            userId: res.data.data.userId,
            userType: res.data.data.userType,
          }))
          this.props.history.push("/Thankspage1");
        }
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'Onboardingslider',
          method: 'submitApiData',
          error: err
        }
        logError(errorObj);
      }
    }).catch((error) => {
      this.checkUserExist()
    });;
  }

  updateUserData(params) {
    console.log(params)
    params['userId'] = JSON.parse(localStorage.getItem('obj')).userId;
    Services.updateApplicant(params).then((res) => {
      try{
        console.log(res)
        if (res.data.status == 200) {
          localStorage.setItem('obj', JSON.stringify({
            roleId: res.data.data.roleId,
            roleType: res.data.data.roleType,
            userId: res.data.data.userId,
            userType: res.data.data.userType,
          }))
          this.props.history.push("/Thankspage1");
        }
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'Onboardingslider',
          method: 'updateUserData',
          error: err
        }
        logError(errorObj);
      }
    });
  }

  loadOfflineData() {
    var that = this;
    OffileDb.getData('RegistrationForm').then(function (result) {
      if (!result.status && result.status != 404) {
        that.setState({
          questionlist: result.data
        });
        that.loadOfflineRegDeatils()
        that.setState({
          isLoading: false
        });
      }
    });
  }

  saveRegiFormOffline(params) {
    var self = this;
    const { t } = this.props;
    swal({
      title: t("Unstable internet connection"),
      text: t("Details saved in offline mode"),
      icon: "success",
      button: t("Ok"),
    }).then((val) => {
      var id = "Applicantdeatils"
      OffileDb.setData(id, params)
      //self.props.history.push("/layout/survey");
    });
  }


  loadOfflineRegDeatils() {
    var that = this;
    OffileDb.getData('Applicantdeatils').then(function (formData) {
      if (!formData.status && formData.status != 404) {
        var questionArr = formData.data.registrationInfoList.registrationInfo
        var questionlist = that.state.questionlist
        questionlist.forEach((element) => {
          var quob = questionArr.filter(obj => obj.questionId == element.questionId)
          if (quob.length > 0) {
            element['response'] = quob[0]['response']
          }
        });
        that.setState({
          questionlist: questionlist,
          sliderLng: questionlist.length
        });
        //that.props.setOnboardPernt(100);
        // swal({
        //   text: t("Offline data synced successfully."),
        //   icon: "success",
        //   button: "Ok",
        // }).then((val) => {
        //   console.log(val)
        // });
      }
    })
  }

  updateCompletionPer(id, val, type) {
    if (!counterArr.includes(id)) {
      counterArr.push(id);
    }
    dependentQuesArr[id] = val;
    this.setState({
      reintialise: true,
    });
    this.showSubmitButton(type)
    this.calcultePercentage()
  }

  calcultePercentage() {
    setTimeout(() => {
      var len = document.getElementsByClassName("slick-slide").length
      var counterlen = counterArr.length;
      var avg = 100 / len;
      var per = avg * counterlen;
      this.props.setOnboardPernt(per);
    }, 500);
  }

  addGuestUser() {
    const { t } = this.props;
    var geoLocation = this.state.lat != "" && this.state.lat != null ? true : false;
    if (navigator.onLine) {
      let uuid = uuidv4();
      localStorage.setItem("deviceuuid", uuid);
      var param = {
        communicationDetails: {
          fcmId: localStorage.getItem('fcmToken')
        },
        communityId: localStorage.getItem("CommunityId"),
        deviceDetails: {
          serialNumber: uuid,
        },
        profile: {
          location: {
            coordinates: [this.state.lat, this.state.lng],
            type: "point",
          },
        },
        preferredLanguageId: localStorage.getItem("langId"),
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
      if (this.state.userPresent) {
        this.props.history.push("/Thankspage1");
      } else {
        Services.addApplicant(param).then((res) => {
          try{
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
              this.props.history.push("/Thankspage1");
            }
          }catch(err){
            console.log("err::", err)
            var errorObj = {
              component: 'Onboardingslider',
              method: 'addGuestUser',
              error: err
            }
            logError(errorObj);
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

  checkUserExist(param) {
    if (window.cordova) {
      var para = {
        "communityId": localStorage.getItem("CommunityId"),
        "serialNumber": window.device.uuid //param.deviceDetails.serialNumber,
      }
      Services.checkIfApplicantExists(para).then((res) => {
        try{
          if (res && res.data.status == 200) {
            localStorage.setItem(
              "obj",
              JSON.stringify({
                roleId: res.data.data.roleId,
                roleType: res.data.data.roleType,
                userId: res.data.data.userId,
                userType: res.data.data.userType,
              })
            );
            localStorage.setItem("deviceuuid", window.device.uuid);
            this.props.history.push("/Thankspage1");
          }
        }catch(err){
          console.log("err::", err)
          var errorObj = {
            component: 'Onboardingslider',
            method: 'checkUserExist',
            error: err
          }
          logError(errorObj);
        }
      })
    }
  }

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  showSubmitButton(type) {
    setTimeout(() => {
      var len = document.getElementsByClassName("slick-slide").length - 1
      if (len == this.state.newSlide) {
        this.setState({
          isOpened: true,
        });
      } else {
        if (type != "checkbox") {
          this.next();
        }
        this.setState({
          isOpened: false,
        });
      }
    }, 500);
  }

  checkdependtquestion(id, val) {
    var quesobj = this.state.questionlist.filter(obj => obj.questionId == id);
    if (quesobj.length > 0) {
      if (quesobj[0].dependentQuestion) {
        var dependentQueObj = quesobj[0].dependentQuestion.filter(o => o.selectedOption == val)
        if (dependentQueObj.length > 0) {
          if (this.state.questionlist.length == 1) {
            this.setState({
              reintialise: true,
            });
          }
        }
      }
    }
  }

  getQuestion(element) {
    slidercounter++;
    let values = element.response != undefined ? element["response"][0] : '';
    return <div id={element.questionId} key={slidercounter}>
      <OnboardingRegistration
        question={element}
        values={values}
        updateCompletionPer={this.updateCompletionPer}
        animCssClasses={this.state.animCssClasses}
        showSlider={this.state.showSlider}
        currentSlide={this.state.currentSlide}
        newSlide={this.state.newSlide}
      ></OnboardingRegistration>
    </div>
  }

  getQuestionSlider() {
    var quslist = [];
    slidercounter = 0;
    this.state.questionlist.map((element) => {
      var elemet = element.questionList[0];
      let values = elemet.response != undefined ? elemet["response"][0] : '';
      quslist.push(this.getQuestion(elemet));
      this.getDependentQuestion(elemet)
    });

    dependentQueSet = dependentQueSet.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.key === thing.key
      ))
    )

    quslist.push(...dependentQueSet)
    quslist =  quslist.sort((a,b) => a.key - b.key);
    return quslist;
  }

  getDependentQuestion(element) {
    if (element.dependentQuestionsList && dependentQuesArr[element.questionId]) {
      var dependentQueObj = element.dependentQuestionsList.filter(o => o.selectedOption == dependentQuesArr[element.questionId])

      if (dependentQueObj.length > 0) {
        dependentQueObj.map((element2) => {
          dependentQueSet.push(this.getQuestion(element2));
          this.getDependentQuestion(element2)
        })
      }
    }
  }


  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 1000,
      slidesToShow: 1,
      swipeToSlide: true,
      adaptiveHeight: true,
      slidesToScroll: 1,
      fade: false,
      afterChange: this.afterChange,
      beforeChange: this.beforeChange,
    };
    const { t } = this.props;
    const Fragment = React.Fragment;

    if (this.state.questionlist.length > 0) {
      var quslist = this.getQuestionSlider()
    } else if (!this.state.isLoading) {
      // quslist = <h5>{t('No data found')}</h5>
      quslist = <Customcircularprogress/>
    }
    
    return (
      <div className="onboarding-page fulllengthpage selectlangpage">
        <div className="gridcontainer">
          <Grid container spacing={3} className="gridcontainer">
            <Header></Header>
            <Grid
              item
              xs={12}
              className="onboardingsliderdivcontent onboardingscrollcontent"
            >
              <div className="onboardingslider-container">
                <form id="registerform" onSubmit={this.handleSubmit} className={this.state.isOpened ? "lastslide": ""}>
                  <Slider {...settings} ref={(c) => (this.slider = c)}>
                    {quslist}
                  </Slider>
                  {this.state.isOpened && (
                    <Grid container spacing={3} className="">
                      <Grid
                        item
                        xs={12}
                        className="text-center registaionsubmit"
                      >
                        <div className="">
                          <Button
                            type="submit"
                            color="primary"
                            disableElevation
                            className="skipbtn w-50percent"
                          >
                            <Trans>
                              <span>{t("Next")} </span>{" "}
                            </Trans>
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  )}
                </form>
              </div>
            </Grid>
            {!this.state.isOpened && (
              <div className="reg-slide-next-btn-holder">
                <div className="reg-slide-next-btn text-center">
                  <a className="skipbtn w-50percent" onClick={() => this.next()}
                  >
                    <Trans>
                      <span>{t("Next")} </span>{" "}
                    </Trans>
                  </a>
                </div>
              </div>)}
            {!this.state.isOpened && (
              <Grid item xs={12} className="text-center skipbtnholder zero">
                <div className="getstarted-btn-holder">
                  {/* <Link to="/Thankspage1"> */}
                  <Button
                    variant=""
                    color="primary"
                    disableElevation
                    className="skipbtn"
                    onClick={() => this.addGuestUser()}
                  >
                    <Trans> {t("Skip")} </Trans>
                  </Button>
                  {/* </Link> */}
                </div>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  console.log(state);
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

export default connect(mapStateToProps, { setLangID, setOnboardPernt })(
  withTranslation()(withRouter(SimpleSlider))
);
