import React, { Component } from 'react';
import { withTranslation, Trans } from "react-i18next";
import {
  withStyles,
  makeStyles,
  useTheme,
  withTheme,
} from "@material-ui/core/styles";
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link, Redirect, useHistory } from "react-router-dom";
import NotificationsIcon from '@material-ui/icons/Notifications';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import LaunchIcon from '@material-ui/icons/Launch';
import CommentIcon from '@material-ui/icons/Comment';
import Fab from '@material-ui/core/Fab';
import FilterListIcon from '@material-ui/icons/FilterList';
import MapIcon from '@material-ui/icons/Map';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import Listselect1 from './listselect1.js'
import Mapfilteraccordion from './mapfilteraccordion.js'
import { connect } from "react-redux";
import Services from "../../api/api";
import Loader from "../loaders/loader";



class Maplistviewpagen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      originalList: [],
      stateArr: [],
      stateList: [],
      townshipList: [],
      townshipArr: [],
      categoryList: [],
      categoryArr: [],
      statename: '',
      townname: '',
      categorname: '',
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getStateListForNearme();
  }

  getStateListForNearme() {
    var param = { "communityId": localStorage.getItem("CommunityId"), "languageId": 1 }
    Services.getStateListForNearmeByCommunityId(param).then((res) => {
      console.log(res.data.data)
      if (res && res.status == 200 && res.data.data) {
        this.setState({ originalList: res.data.data })
        this.setState({ stateList: res.data.data.stateList })
        this.setState({ isLoading: false })
        this.getAllCategory()
        this.getStateList(res.data.data)
      }
    });
  }

  getAllCategory() {
    var stateList = this.state.stateList;
    var tempArr = [];
    var catgeorArr = [];
    for (const key in stateList) {
      var townList = stateList[key].filter(obj => Object.keys(obj).length > 0)
      if (townList.length > 0) {
        townList.forEach(obj => {
          for (var keys in obj) {
            obj[keys].forEach(cobj => {
              for (var category in cobj) {
                catgeorArr.push(category + ':' + cobj[category])
                if (!tempArr.includes(category)) {
                  tempArr.push(category)
                }
              }
            })
          }
        })
      }
    }
    this.setState({ categoryArr: tempArr, categoryList: catgeorArr })
  }

  getFilteCategory(value, type) {
    console.log(value, type)
    var stateList = this.state.stateList;
    var statename = this.state.statename;
    var townname = this.state.townname;
    if (townname != "") {
      this.getTownFilteCategory(townname, true, value);
    } else if (statename != '') {
      this.getStateFilteCategory(statename, true, value);
    } else {
      var catgeorArr = [];
      for (const key in stateList) {
        var townList = stateList[key].filter(obj => Object.keys(obj).length > 0)
        if (townList.length > 0) {
          townList.forEach(obj => {
            for (var keys in obj) {
              obj[keys].forEach(cobj => {
                for (var category in cobj) {
                  if (type == 'category' && value == category) {
                    catgeorArr.push(category + ':' + cobj[category])
                  }
                }
              })
            }
          })
        }
      }
      console.log(catgeorArr)
      this.setState({ categoryList: catgeorArr })
    }
  }

  getStateFilteCategory(value, categorflag, categorname) {
    console.log(categorflag, categorname)
    var stateList = this.state.stateList;
    var catgeorArr = [];
    var tempArr = [];
    var townList = stateList[value].filter(obj => Object.keys(obj).length > 0)
    if (townList.length > 0) {
      townList.forEach(obj => {
        for (var keys in obj) {
          obj[keys].forEach(cobj => {
            for (var category in cobj) {
              if (categorflag) {
                if (categorname == category) {
                  catgeorArr.push(category + ':' + cobj[category])
                }
              } else {
                catgeorArr.push(category + ':' + cobj[category])
                if (!tempArr.includes(category)) {
                  tempArr.push(category)
                }
              }
            }
          })
        }
      })
    }

    console.log(catgeorArr)

    if (categorflag) {
      this.setState({ categoryList: catgeorArr })
    } else {
      this.setState({ categoryArr: tempArr, categoryList: catgeorArr })
    }
  }


  getTownFilteCategory(value, categorflag, categorname) {
    var stateList = this.state.stateList;
    var statename = this.state.statename;
    var catgeorArr = [];
    var tempArr = [];
    var townList = stateList[statename].filter(obj => Object.keys(obj).length > 0)
    if (townList.length > 0) {
      townList.forEach(obj => {
        for (var keys in obj) {
          if (keys == value) {
            obj[keys].forEach(cobj => {
              for (var category in cobj) {
                if (categorflag) {
                  if (categorname == category) {
                    catgeorArr.push(category + ':' + cobj[category])
                  }
                } else {
                  catgeorArr.push(category + ':' + cobj[category])
                  if (!tempArr.includes(category)) {
                    tempArr.push(category)
                  }
                }
              }
            })
          }
        }
      })
    }
    if (categorflag) {
      this.setState({ categoryList: catgeorArr })
    } else {
      this.setState({ categoryArr: tempArr, categoryList: catgeorArr })
    }

  }

  getStateList(data) {
    var stateList = data.stateList
    var temparr = []
    for (const key in stateList) {
      temparr.push(key)
    }
    console.log(temparr)
    this.setState({ stateArr: temparr })
  }


  getTownship(value) {
    console.log(this.state.stateList)
    var townList = this.state.stateList[value].filter(obj => Object.keys(obj).length > 0)
    this.setState({ townshipList: townList })
    var temparr = townList.map(obj => Object.keys(obj)[0])
    this.setState({ townshipArr: temparr })
  }



  handleChange(value, type) {
    console.log(value, type)
    if (type == 'state') {
      this.setState({ statename: value })
      if (value != "") {
        this.getTownship(value)
        this.getStateFilteCategory(value, false)
      }
    } else if (type == 'town') {
      this.setState({ townname: value })
      if (value != "") {
        this.getTownFilteCategory(value, false)
      }
    } if (type == 'category') {
      this.setState({ categorname: value })
      if (value != "") {
        this.getFilteCategory(value, type)
      }
    }
  }


  render() {
    const { t } = this.props;
    const { templateID } = this.props;

    return (

      <div className="gridcontainer">
        <Grid container spacing={3} className="gridcontainer">
          <Grid item xs={12} className="pt-0px">
            <div className="getknowledgepagedetailedmaindiv ml-0px mr-0px maplistcontactviewpage">
              <Grid container spacing={0} className="gridcontainer">
                <Grid item xs={12}>
                  <div className="informationcardholder mapfilterviewcontainer p-0">
                    <div className="maplistingdiv_mainholder height500">
                      {
                        this.state.isLoading ? (
                          <Loader isLoading={this.state.isLoading} />
                        ) : (
                          <>

                            <Grid container spacing={3} className="gridcontainer">

                              {
                                this.state.stateArr.length > 0 &&
                                <Grid item xs={12} className="pb-0px pl-0px pr-0px">
                                  <p className="zero chatusername">Region/State</p>
                                  <Listselect1 options={this.state.stateArr} onOptionChange={(value) => { this.handleChange(value, 'state') }}></Listselect1>
                                </Grid>
                              }


                              {
                                this.state.townshipArr.length > 0 &&
                                <Grid item xs={12} className="pb-0px pl-0px pr-0px">
                                  <p className="zero chatusername">Township</p>
                                  <Listselect1 options={this.state.townshipArr} onOptionChange={(value) => { this.handleChange(value, 'town') }}></Listselect1>
                                </Grid>
                              }

                              {
                                this.state.categoryArr.length > 0 &&
                                <Grid item xs={12} className="pb-0px pl-0px pr-0px">
                                  <p className="zero chatusername">Category</p>
                                  <Listselect1 options={this.state.categoryArr} onOptionChange={(value) => { this.handleChange(value, 'category') }}></Listselect1>
                                </Grid>
                              }

                            </Grid>
                            <Grid container spacing={3} className="gridcontainer">
                              <Grid item xs={12} className="text-left pl-0px pr-0px">
                                <div className="MuiAccordionDetails-root">
                                  {
                                    this.state.categoryList.length > 0 ? (
                                      <>
                                        {
                                          this.state.categoryList.map(obj => {
                                            return <div className="contactcard"><p className="zero w-100"><p className="hospitalname">{obj.split(":")[0]}</p><p className="hospitalinfo">{obj.split(":")[1]}</p></p></div>
                                          })
                                        }
                                      </>
                                    ) : (
                                      <Loader isLoading={this.state.isLoading} />
                                    )
                                  }
                                </div>
                              </Grid>
                            </Grid>
                          </>
                        )
                      }
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

//export default Maplistviewpagen;

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor
  };
};


const transFullWidthTabs = withTranslation()(Maplistviewpagen);
const ThemeFullWidthTabs = withTheme(transFullWidthTabs);
export default withStyles({})(connect(mapStateToProps)(ThemeFullWidthTabs));
