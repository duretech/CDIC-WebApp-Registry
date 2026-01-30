import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import swal from "sweetalert";
import SwipeableViews from "react-swipeable-views";
import WifiOffIcon from '@material-ui/icons/WifiOff';
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BusinessIcon from "@material-ui/icons/Business";
import RoomIcon from "@material-ui/icons/Room";
import Slider from "@material-ui/core/Slider";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Fab from '@material-ui/core/Fab';
import FilterListIcon from '@material-ui/icons/FilterList';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MapIcon from '@material-ui/icons/Map';
import PeopleIcon from '@material-ui/icons/People';
import ContactsIcon from '@material-ui/icons/Contacts';
import Accessrating from "./Accessrating.js";
import Getaccesssettings from "./Getaccesssettings";
import Getaccesssources from "./Getaccesssources";
import Map from "./Map";
import MapmarList from "./MapmarList";
import GooglemarkerList from "./GooglemarkerList";
import Maplistviewpagen from "./maplistviewpagen";
import { connect } from "react-redux";
import Services from "../../api/api";
import Loader from "../loaders/loader";
import { TextareaAutosize } from "@material-ui/core";
import maplistviewpagen from "./maplistviewpagen";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import EditIcon from '@material-ui/icons/Edit';

import AutorenewIcon from '@material-ui/icons/Autorenew';
import SettingsIcon from '@material-ui/icons/Settings';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from "@material-ui/core/TextField";
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import MenuIcon from '@material-ui/icons/Menu';
import { BottomSheet } from "react-spring-bottom-sheet";

import Mapfiltercheckbox from "./mapfiltercheckbox";
import BottomSheet2 from "./BottomSheet"
import { db, storageRef, firebaseConfig } from "../../service/firebase";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  speedDialroot: {
    height: 380,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

class FullWidthTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      value: 0,
      markerList: [],
      originalList: [],
      markerType: [],
      markerText: "imonitor",
      position: [],
      lat: -17.895114303749143,
      lng: 38.41781616210938,
      latlngupdated: false,
      zoom: 2,
      tabList: [],
      radius: 1000,
      distance: 10000,
      pagetoken:'',
      mapcounter: 0,
      content: 0,
      openbottom: false,
      openSpeedDail: true,
      checkedArr: [],
      open: false,
      googlepagecount:false,
      openslider: false,
      divisible:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePopupClose = this.handlePopupClose.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handleChangeSlider = this.handleChangeSlider.bind(this)
    this.handleClickSliderOpen = this.handleClickSliderOpen.bind(this)
    this.handleSliderClose = this.handleSliderClose.bind(this)
    this.syncOnlineData = this.syncOnlineData.bind(this);
    this.togglevisible = this.togglevisible.bind(this)
  }

  componentDidMount() {
    this.getTablist();
    this.getCurrentLocation();
    this.getNearMelist();
    this.getNearMeTypes();
    this.triggerOnResume();
    //this.getStateListForNearme();
  }

  getTablist() {
    var menuList = JSON.parse(localStorage.getItem("menuList"));
    var tab = menuList ? menuList.filter(obj => obj.path == 'nearme') : [];
    if (tab.length > 0) {
      var tblist = tab[0].childs.filter(obj => obj.isactive && obj.visible);
      // if (tblist.filter(obj => obj.path == "contact").length == 0) {
      //   tblist.push({
      //     componentId: 101,
      //     icon: "",
      //     isactive: true,
      //     label: "contact",
      //     name: "contact",
      //     path: "contact",
      //     show: "label",
      //     visible: true,
      //   })
      // }
      this.setState({
        tabList: tblist,
      });
    }
  }

  triggerOnResume() {
    var that = this;
    try{
      if (window.cordova) {
        document.addEventListener("deviceready", function () {
          document.addEventListener("resume", function () {
            console.log('GPS on resume')
            setTimeout(function () { that.getCurrentLocation(); }, 1500);
          }, false);
        }, false);
      }
    }catch(err){
      console.log(err)
    }
  }

  getCurrentLocation() {
    try{
      var that = this;
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
  
      //console.log(this.mapRef);
  
      let counter = this.state.mapcounter + 1;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            console.log('position:', position);
            let arr = [position.coords.latitude, position.coords.longitude];
            that.setState({
              mapcounter: counter,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              latlngupdated: true,
              isLoading: false,
              zoom: 13,
              position: arr
            });
            // that.setState({ position: arr });
            that.getNearMelist();
          },
          that.locationerror(),
          options
        );
      } else {
        that.getNearMelist();
        //that.setState({ position: [] });
      }
    }catch(err){
      console.log(err)
    }

  }

  syncOnlineData(){
    this.componentDidMount();
  }

  locationerror() {
    console.log('location error')
    this.getNearMelist();
    // if (window.cordova) {
    //   window.cordova.dialogGPS()
    // } else {
      // swal({
      //   text: "Geolocation is not enabled. Please enable to use this feature",
      //   icon: "warning",
      //   button: "setting",
      // }).then((val) => {
      //   window.open('https://support.google.com/chrome/answer/142065?hl=en','_BLANK')
      // });
    // }
  }

  getNearMelist() {
    if(navigator.onLine){
    let Proximitydist = localStorage.getItem("Proximity") ? localStorage.getItem("Proximity") : this.state.distance;
    let finaldist = parseInt(Proximitydist)
    let finallangid = parseInt(localStorage.getItem("langId"))
    let finallat = (this.state.lat).toString();
    let finallng = (this.state.lng).toString();
    var param = {
      latitude: finallat,
      longitude: finallng,
      distance: finaldist,
      tags: [],
      isactive: 1,
      // languageId: finallangid,
      communityId: localStorage.getItem("CommunityId"),
    };

    console.log("params1::", param)
    if(this.state && this.state.latlngupdated == true){
    Services.searchnearme(param).then((res) => {
      try {
        if (res && res.data && res.data.data.length > 0) {
          this.setState({ markerList: res.data.data, originalList: res.data.data, isLoading: false, });
          this.filterMaplist(res.data.data,JSON.parse(localStorage.getItem("mapfilters")));
          console.log("state::",this.state)
        } else {
          this.getGoogleNearMe();
        }
      } catch (err) {
        console.log("Error::", err);
        this.getGoogleNearMe();
      }
    }).catch((err) => {
      this.getGoogleNearMe();
    });
  }
  }
}

  getGoogleNearMe() {
    let GoogleProximitydist = localStorage.getItem("GoogleProximity") ? localStorage.getItem("GoogleProximity") : this.state.radius;
    let finaldist = parseInt(GoogleProximitydist)
    var param = {
      apiKey: firebaseConfig.googleMapKey,
      lat: this.state.lat,
      lng: this.state.lng,
      radius: finaldist, // radius is in metres
      pagetoken: '',
      keywords: "hospital", //googleTypes
    };
    console.log("GoogleMapApi params",param)
    Services.getGoogleNearme(param).then((data) => {
      try{
        console.log("googlepagedata",data)
        if (data && data.data.results.length > 0) {
          this.setState({ markerList: data.data.results, originalList: data.data.results, markerText: "google", isLoading: false, });
          //if google api returns more than 20 results, pagination is implemented to fetch next page results
          if(data.data.next_page_token){
            this.setState({
              googlepagecount: true,
              pagetoken: data.data.next_page_token,
              isLoading: false,
            });
            setTimeout(() => {
              this.googleMapPageFetch();            
            }, 4000);
          }
          // this.filterMaplist(data.data.results,JSON.parse(localStorage.getItem("mapfilters")));
        }
        else{
          this.setState({ markerList: [], isLoading: false, });
        }
      }catch(err){
        console.log(err)
      }
    });
  }

  googleMapPageFetch(){
    if(this.state && this.state.googlepagecount){
        if(this.state && this.state.pagetoken){
          let GoogleProximitydist = localStorage.getItem("GoogleProximity") ? localStorage.getItem("GoogleProximity") : this.state.radius;
          let finaldist = parseInt(GoogleProximitydist)
          var param = {
            apiKey: firebaseConfig.googleMapKey,
            lat: this.state.lat,
            lng: this.state.lng,
            radius: finaldist,
            pagetoken: this.state.pagetoken,
            keywords: "hospital", //googleTypes
          };
          console.log("GoogleMapApi params",param)
          Services.getGoogleNearme(param).then((data) => {
            try{
              console.log("googlepage1data",data)
              if(data && data.data.results.length > 0){
                let mainMarkerList = this.state.markerList.concat(data.data.results);
                let mainOriginalList = this.state.originalList.concat(data.data.results);
                console.log("finalgooglemaplist", mainMarkerList,mainOriginalList)
                this.setState({ 
                  markerList: mainMarkerList,
                  originalList: mainOriginalList, 
                  pagetoken: data.data.next_page_token,
                  markerText: "google", 
                  isLoading: false, 
                });
                if(data && data.data.next_page_token){
                  var params = {
                    apiKey: firebaseConfig.googleMapKey,
                    lat: this.state.lat,
                    lng: this.state.lng,
                    radius: finaldist,
                    pagetoken: this.state.pagetoken,
                    keywords: "hospital", //googleTypes
                  };
                  setTimeout(() => {
                    Services.getGoogleNearme(params).then((data) => {
                      try{
                        console.log("googlepage1data",data)
                        if(data && data.data.results.length > 0){
                          let mainMarkerList = this.state.markerList.concat(data.data.results);
                          let mainOriginalList = this.state.originalList.concat(data.data.results);
                          console.log("finalgooglemaplist", mainMarkerList,mainOriginalList)
                          this.setState({ 
                            markerList: mainMarkerList,
                            originalList: mainOriginalList, 
                            markerText: "google", 
                            isLoading: false, 
                          });                         
                        }
                      }catch(err){
                        console.log(err)
                      }
                    })
                  }, 6000);
                }               
            }
            }catch(err){
              console.log(err)
            }
          })
        }
    }
  }


  getNearMeTypes() {
    if(navigator.onLine){
    var param = {
      communityId: localStorage.getItem("CommunityId"),
      isactive: 1,
      languageId: localStorage.getItem("langId"),
      alltypes: false,
    };
    console.log("param nearme ",param);
    Services.getNearMeTypes(param).then((data) => {
      try {
        if (data && data.data.data.length > 0) {
          if(!JSON.parse(localStorage.getItem("mapfilters"))){
          this.setState({
            markerType: data.data.data,
            checkedArr: data.data.data.map(obj => obj.type)
          });
        }
        else{
          this.setState({
            markerType: data.data.data,
            checkedArr: JSON.parse(localStorage.getItem("mapfilters"))
          });
        }
          if(!JSON.parse(localStorage.getItem("mapfilters"))){
          localStorage.setItem("mapfilters",JSON.stringify(this.state.checkedArr))
          }
        }
      } catch (err) {
        console.log("Error::", err);
      }
    });
  }
}

  handleChangeSlider = (event, newValue) => {
    try {
      this.setState(
        {
          radius: newValue * 500,
          distance: newValue /2,
        }
      );
      localStorage.setItem("Proximity", this.state.distance);
      localStorage.setItem("GoogleProximity", this.state.radius);

      // this.getNearMelist();
      // this.resetMap();
    }
    catch (err) {
      console.log("Error::", err);
    }
  };

  handleChange = (event, newValue) => {
    try{
      if(newValue){
        this.setState({
          value: newValue,
        });
      }
    }catch(err){
      console.log(err)
    }
  };

  handleChangeIndex = (index) => {
    try{
      if(index){
        this.setState({
          value: index,
        });
      }
    }catch(err){
      console.log(err)
    }
    // setValue(index);
  };

  openListBottomSheet = () => {
    try{
      this.setState({
        openbottom: true,
        openSpeedDail: false,
      })
    }catch(err){
      console.log(err)
    }
  }

  onDismiss() {
    try{
      this.setState({
        openbottom: false,
      })
    }catch(err){
      console.log(err)
    }
  }

  filterMaplist(maplist,arr) {
    try{
        var originalList = this.state.originalList
        if(arr.length > 0){
        var filteFlist = originalList.filter(obj => arr.includes(obj.type))
        this.setState({
          markerList: filteFlist,
        })
      }
      else{
        var filterFlist = maplist.filter(obj => arr.includes(obj.type))
        this.setState({
          markerList: filterFlist,
        })
      }
    }catch(err){
      console.log(err)
    }

  }


  handleOpen() {
    this.setState({
      openSpeedDail: true,
    })
  };

  handleClose() {
    try{
      this.setState({
        openSpeedDail: false,
      })
    }catch(err){
      console.log(err)
    }
  };

  handlePopupClose() {
    try{
      this.setState({ open: false });
    }catch(err){
      console.log(err)
    }
  }
  handleSliderClose() {
    try{
      this.setState({ openslider: false });
      this.getNearMelist();
      this.resetMap();
    }catch(err){
      console.log(err)
    }
    // console.log("state::",this.state)
  }

  handleClickOpen() {
    this.setState({ open: true });
  }
  handleClickSliderOpen() {
    this.setState({ openslider: true });
  }

  handleCheckbox(event, isChecked, value) {
    if(this.state.markerText == "imonitor"){

      try{
        var array = [...this.state.checkedArr]; // make a separate copy of the array
        const { templateID } = this.props;
        var index = array.indexOf(value)
        if (!isChecked) {
          if (index !== -1) {
            array.splice(index, 1);
            this.setState({ checkedArr: array });
            localStorage.setItem("mapfilters",JSON.stringify(array))
          }
        } else {
          array.push(value)
          this.setState({ checkedArr: array });
          localStorage.setItem("mapfilters",JSON.stringify(array))
        }
        this.filterMaplist(this.state.markerList,array)
      }catch(err){
        console.log(err)
      }
    }

  }

  resetMap() {
    let key = this.state.mapcounter + 1;
    this.setState({
      mapcounter: key
    })
  }

  togglevisible(status) {
    this.setState({
      divisible: true
    })
  }

  render() {
    const { t } = this.props;
    const { classes, theme } = this.props;
    const  templateID  = 1
    let bgStyles = templateID == 2 ? { background: this.props.componentbgcolor } : {};
    let Proximitydist = localStorage.getItem("Proximity") ? localStorage.getItem("Proximity") : this.state.distance;
    return (
      <div className={classes.root + " nearmepage getknowledgeable_page"}>
        <AppBar className="tabheader" position="static" style={bgStyles}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            {
              templateID == 1 ? (
                <Tab label={t('Map')} {...a11yProps(0)} />
              ) : (
                this.state.tabList.length > 0 &&
                this.state.tabList.map((tabListObj, index) => {
                  return (<Tab label={t(tabListObj.label)} {...a11yProps(index)} />)
                })
              )
            }
          </Tabs>
        </AppBar>
        {/* <Button variant="contained" color="primary" disableElevation style={bgStyles} className="mapsettingsbtn" onClick={this.handleClickSliderOpen}> {t('Settings')}  </Button> */}

        {/* <div class="nearmeslider">
          <Box sx={{ width: 150 }}>
            <TextField
                id="standard-basic"
                label=""
                value={"Proximity - " + this.state.distance + "KM"}
                style={{ 'width': '200px', 'color': 'black' }}
                disabled
                InputProps={{ disableUnderline: true }}
            />
            <Slider
              defaultValue={30}
              min={20}
              onChange={this.handleChangeSlider}
              valueLabelDisplay="off"
            />
          </Box>
        </div> */}
        {navigator.onLine == true ? (
        <SwipeableViews
          disabled={templateID == 1 ? true : false}
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          className="infotabcontainer getaccesstabspage"
        >

          {
            templateID == 1 ? (
              <TabPanel value={this.state.value} index={0} dir={theme.direction}>
                <div id="nearMe-map-conatiner">
                  {
                    this.state.isLoading ? (
                      <Loader isLoading={this.state.isLoading} />
                    ) : (
                      <>
                        {/* <Fab aria-label="add" onClick={() => this.openListBottomSheet(1)} className="maplistviewfloatbtn">
                          <ListAltIcon />
                        </Fab> */}
                        <Map
                          key={this.state.mapcounter}
                          markerList={this.state.markerList}
                          position={this.state.position}
                          markerType={this.state.markerType}
                          markerText={this.state.markerText}
                          componentbgcolor={this.props.componentbgcolor}
                          templateID={templateID}
                          filterMaplist={(i) => this.filterMaplist(i)}
                          togglevisible={this.togglevisible}
                        ></Map>
                        {this.state.divisible ?
                          <div className={classes.speedDialroot + " nearmeSpeedDial"}>
                            <SpeedDial
                              ariaLabel="SpeedDial openIcon example"
                              className={classes.speedDial}
                              hidden={true}
                              icon={<SpeedDialIcon openIcon={<MenuIcon />} />}
                              onClose={this.handleClose}
                              onOpen={this.handleOpen}
                              open={true}
                            >
                              <SpeedDialAction
                                key="list"
                                icon={<ListAltIcon />}
                                tooltipTitle={t("list")}
                                onClick={() => this.openListBottomSheet(1)}
                              />
                              {
                                // this.state.markerText == "imonitor" && <SpeedDialAction
                                <SpeedDialAction
                                  key="Filter"
                                  icon={<FilterListIcon />}
                                  tooltipTitle={t("filter")}
                                  onClick={() => this.handleClickOpen()}
                                />
                              }
                              <SpeedDialAction
                                key="settings"
                                icon={<SettingsIcon />}
                                tooltipTitle={t("settings")}
                                onClick={() => this.handleClickSliderOpen()}
                              />
                              <SpeedDialAction
                                key="mapreset"
                                icon={<AutorenewIcon />}
                                tooltipTitle={t("mapreset")}
                                onClick={() => this.resetMap()}
                              />
                            </SpeedDial>
                          </div> : ""}

                      </>
                    )
                  }
                </div>
              </TabPanel>
            ) : (
              this.state.tabList.length > 0 &&
              this.state.tabList.map((tabListObj, index) => {
                return (
                  <TabPanel value={this.state.value} index={index} dir={theme.direction}>
                    
                    { tabListObj.componentId == 23 || tabListObj.path == "map" ?
                      (<div className="nearmemapcontainer">
                        {this.state.isLoading ? (
                          <Loader isLoading={this.state.isLoading} />
                        ) : (
                          <>
                            <Map
                              key={this.state.mapcounter}
                              position={this.state.position}
                              markerList={this.state.markerList}
                              markerType={this.state.markerType}
                              markerText={this.state.markerText}
                              componentbgcolor={this.props.componentbgcolor}
                              templateID={templateID}
                              filterMaplist={(i) => this.filterMaplist(i)}
                              togglevisible={this.togglevisible}
                            ></Map>
                            <Button variant="contained" color="primary" disableElevation style={bgStyles} className="mapfilterbtn" onClick={this.handleClickOpen}> {t('Filters')}  </Button>
                            <Button variant="contained" color="primary" disableElevation style={bgStyles} className="mapsettingsbtn" onClick={this.handleClickSliderOpen}> {t('Settings')}  </Button>

                          </>
                        )
                        }

                      </div>) : (
                        tabListObj.componentId == 24 || tabListObj.path == "list" ? (

                          <div className="markerList">
                            {this.state.markerText == "imonitor" ? (
                              <MapmarList
                                userposition={this.state.position}
                                markerType={this.state.markerType}
                                markerList={this.state.markerList}
                                uuid={localStorage.getItem("CommunityId")}
                              ></MapmarList>
                            ) : (
                              <GooglemarkerList
                                userposition={this.state.position}
                                markerList={this.state.markerList}
                                uuid={localStorage.getItem("CommunityId")}
                              ></GooglemarkerList>
                            )}
                          </div>
                        ) : (
                          tabListObj.componentId == 101 || tabListObj.path == "contact" ? (
                            <div className="neameContactview">
                              <Maplistviewpagen></Maplistviewpagen>
                            </div>
                          ) : ('')
                        )
                      )
                    }
                  </TabPanel>
                )
              })
            )
          }

          {
            this.state.openbottom && this.state.tabList.length > 0 &&
            <BottomSheet2
              open={this.state.openbottom}
              markerText={this.state.markerText}
              position={this.state.position}
              markerType={this.state.markerType}
              markerList={this.state.markerList}
              communityuid={localStorage.getItem("CommunityId")}
              onDismiss={() => this.onDismiss()}
              tablist={this.state.tabList}
              handleChangeIndex={(i) => this.handleChangeIndex(i)}
            >
            </BottomSheet2>
          }
        </SwipeableViews> ) : (  
        <div className="no-internet" onClick={this.syncOnlineData}>
          <div className="offline-icon"><WifiOffIcon /></div>
          <div className="offline-desc">{t("You are in offline mode")}</div>
        </div>)
        }
        <BottomSheet
          className="filterBottomSheet"
          blocking={true}
          open={this.state.open}
          onDismiss={this.handlePopupClose}
          defaultSnap={({ maxHeight }) => maxHeight / 2}
          snapPoints={({ maxHeight }) => [
            maxHeight - maxHeight / 10,
            maxHeight / 4,
            maxHeight * 0.6,
          ]}
        >
          <div className="mapfiltercheckboxlist">
            <FormControl component="fieldset">
              <FormGroup>
                {
                  this.state.markerType.map((element, i) => {
                    return <Mapfiltercheckbox
                      element={element}
                      key={element.id}
                      label={t(element.type)}
                      checked={this.state.checkedArr.includes(element.type)}
                      category={element.type}
                      onChange={this.handleCheckbox} ></Mapfiltercheckbox>
                  })
                }
              </FormGroup>
            </FormControl>
          </div>
        </BottomSheet>
        {/* <SwipeableDrawer
          anchor='bottom'
          className="filterBottomSheet"
          open={this.state.open}
          onClose={this.handlePopupClose}
          hysteresis={0.5}
          minFlingVelocit="300px"
        >
          <div className="mapfiltercheckboxlist">
            <FormControl component="fieldset">
              <FormGroup>
                {
                  this.state.markerType.map((element, i) => {
                    return <Mapfiltercheckbox
                      element={element}
                      key={element.id}
                      label={t(element.type)}
                      checked={this.state.checkedArr.includes(element.type)}
                      category={element.type}
                      onChange={this.handleCheckbox} ></Mapfiltercheckbox>
                  })
                }
              </FormGroup>
            </FormControl>
          </div>
        </SwipeableDrawer> */}

        <SwipeableDrawer
          anchor='bottom'
          disableSwipeToOpen = {true}
          className="mapslidermaindiv"
          open={this.state.openslider}
          hysteresis={1}
          onClose={this.handleSliderClose}
          minFlingVelocit="300px"
        >
          <div className="nearmeslider">
            <Box sx={{ width: "100%" }}>
              <TextField
                id="standard-basic"
                label=""
                value={t("Proximity ") + ("- ") + Proximitydist + t(" KM")}
                style={{ 'width': '200px', 'color': 'black' }}
                disabled
                InputProps={{ disableUnderline: true }}
              />
              <Slider
                defaultValue={30}
                min={1}
                onChange={this.handleChangeSlider}
                value={(Proximitydist) * 2}
                valueLabelDisplay="off"
              />
            </Box>
            <Box sx={{ width: 150 }}>
              {/* <Button variant="contained" color="primary" disableElevation style={bgStyles} className="mapsliderbackbtn" onClick={this.handleSliderClose}> {t('Close')}  </Button> */}
              <Button variant="contained" color="primary" disableElevation style={bgStyles} className="mapslidersubmitbtn" onClick={this.handleSliderClose}> {t('Set')}  </Button>
            </Box>
          </div>
        </SwipeableDrawer>

        {/* <Dialog open={this.state.open} onClose={this.handlePopupClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="simple-dialog-title" className="mapfilterdialogtitle"> {t('Select Filter')}</DialogTitle>
          <DialogContent>
            <div className="mapfiltercheckboxlist">
              <FormControl component="fieldset">
                <FormGroup>
                  {
                    this.state.markerType.map((element, i) => {
                      return <Mapfiltercheckbox
                        element={element}
                        key={element.id}
                        label={t(element.type)}
                        checked={this.state.checkedArr.includes(element.type)}
                        category={element.type}
                        onChange={this.handleCheckbox} ></Mapfiltercheckbox>
                    })
                  }
                </FormGroup>
              </FormControl>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};


const transFullWidthTabs = withTranslation()(FullWidthTabs);
const ThemeFullWidthTabs = withTheme(transFullWidthTabs);
export default withStyles(useStyles)(
  connect(mapStateToProps)(ThemeFullWidthTabs)
);
