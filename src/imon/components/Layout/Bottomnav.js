import React from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreVert";
import DescriptionIcon from "@material-ui/icons/Description";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ScheduleIcon from "@material-ui/icons/Schedule";
import GavelIcon from "@material-ui/icons/Gavel";
import MapIcon from "@material-ui/icons/Map";
import HelpIcon from "@material-ui/icons/Help";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import RoomIcon from "@material-ui/icons/Room";
import ListAltIcon from '@material-ui/icons/ListAlt';
import InfoIcon from '@material-ui/icons/Info';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withTranslation, Trans } from "react-i18next";
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Grid from '@material-ui/core/Grid';
import imgUrl from '../../assets/images/imageUrl.js';
import swal from "sweetalert";


import {
  Link,
  NavLink,
  useHistory,
  withRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import {
  setSelectedComponentObject,
  resetSelectedCompnentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor
} from "../../redux/actions/appActions";
import { findAllByDisplayValue } from "@testing-library/dom";
import { logError } from "../../helpers/auth.js";

var count = 0
var temp1popupmenu = []
class BottomAppBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      checked: false,
      isSettingSelected: false,
      anchorEl: null,
      disabled: false,
      // menuiconobj: {
      //   1: { id: 1, backgrond: "greenbg", icon: <GavelIcon /> },
      //   2: { id: 2, backgrond: "redbg", icon: <RoomIcon /> },
      //   3: { id: 3, backgrond: "bluebg", icon: <DescriptionIcon /> },
      //   4: { id: 4, backgrond: "yellowbg", icon: <QuestionAnswerIcon /> },
      //   5: { id: 5, backgrond: "blackbg", icon: <QuestionAnswerIcon /> },
      //   6: { id: 6, backgrond: "greenbg", icon: <ScheduleIcon /> },
      //   7: { id: 7, backgrond: "brownbg", icon: <ScheduleIcon /> },
      //   10: { id: 10, backgrond: "orangebg", icon: <ListAltIcon /> },
      //   28: { id: 28, backgrond: "yellowbg", icon: <HelpIcon /> },
      //   51: { id: 51, backgrond: "bluebg", icon: <DescriptionIcon /> },
      // },
      menuList:
        JSON.parse(localStorage.getItem("menuList")) != null
          ? JSON.parse(localStorage.getItem("menuList"))
          : [],
      settingsIcon: ''
    };


  }

  async componentDidMount() {
    if (this.props.location.pathname == "/layout/settings") {
      this.setState({
        isSettingSelected: true,
      })
    }

  }

  handleClickSetting(menuobj) {
    this.setState({
      isSettingSelected: true,
    })
    localStorage.setItem('componentbgcolor', menuobj.state.componentbgcolor)
    this.props.setcomponentbgcolor(menuobj.state.componentbgcolor)
    this.props.setBottomNavComponentObject({});
    this.props.partialSetSelectedComponentObject(menuobj.state);
    this.handlpopupClose()
    this.props.history.replace({
      pathname: menuobj.pathname,
      state: {},
    });
  }

  handleClick(menuobj, e) {
    try {
      const { t } = this.props;
      if (e) {e.preventDefault()}
      var self = this;
      console.log("footer menuobj::", menuobj, this.state.disabled);
      if (this.state.disabled) {
        return;
      }
      this.setState({disabled: true});
      setTimeout(function () { self.setState({disabled: false}); }, 1500);

      if (window.location.hash != `#${menuobj.pathname}`) {
        this.setState({
          isSettingSelected: false
        })
        if (!navigator.onLine && (menuobj.state.id == 25 || menuobj.state.id == 22)) {
      // swal({
      //   title: t("You are currently offline."),
      //   icon: "error",
      //   button: t("Ok"),
      // })
      localStorage.setItem('componentbgcolor', menuobj.state.componentbgcolor)
      if(!navigator.onLine && (menuobj.state.id == 25)){
        this.props.history.push("/layout/peerchat");
      }else if(!navigator.onLine && (menuobj.state.id == 22)){
        this.props.history.push("/layout/nearme");
      }
        } else {
        if (window.cordova && menuobj.pathname == "/layout/nearme") {
          localStorage.setItem('componentbgcolor', menuobj.state.componentbgcolor)
          this.props.setcomponentbgcolor(menuobj.state.componentbgcolor)
          this.props.setBottomNavComponentObject(menuobj.state);
          this.props.partialSetSelectedComponentObject(menuobj.state);
          this.handlpopupClose()
          this.props.history.push({
            pathname: menuobj.pathname,
            state: menuobj.state,
          });
        } else {
          // this.props.setSelectedComponentObject(menuobj.state);
          localStorage.setItem('componentbgcolor', menuobj.state.componentbgcolor)
          this.props.setcomponentbgcolor(menuobj.state.componentbgcolor)
          this.props.setBottomNavComponentObject(menuobj.state);
          this.props.partialSetSelectedComponentObject(menuobj.state);
          this.handlpopupClose()
          this.props.history.push({
            pathname: menuobj.pathname,
            state: menuobj.state,
          });
        }
      }
      }
    } catch (err) {
      console.log("error::", err);
      var errorObj = {
        component: 'Bottomnav',
        method: 'handleClick',
        error: err
      }
      logError(errorObj);
    }
  }

  mountMenu(menu, menuiconobj) {
    const { templateID } = this.props;
    if (templateID == 1) {
      return this.tempalte1Menu(menu, menuiconobj)
    } if (templateID == 2) {
      return this.tempalte2Menu(menu, menuiconobj)
    }
  }


  tempalte2Menu(menu, menuiconobj) {

    let menuContent = [];
    let menustr = menu.name.replace(/\s/g, '');
    let activeclass = this.props.history.location.pathname.includes(menu.path) ? "active" + menustr : "";
    if (this.props.history.location.pathname.includes('chatwindow') && menu.path == "peerchat") {
      activeclass = "active" + menustr;
    } else if (this.props.history.location.pathname.includes('ServiceForm') && menu.path == "services") {
      activeclass = "active" + menustr;
    }
    if (localStorage.getItem('adminobj')) {
      if (menu.path != "survey") {
        if (menu.layout != null) {
    
          let menuicon = this.getMenuIcon(menu)
          menuContent.push(
            <a
              // className={ this.props.selectedBottomComponentObj.id == menu.componentId ? "active" + menustr : ""}
              className={activeclass}
              key={menu.id}
              name={menu.name}
              onClick={(e) =>
                this.handleClick({
                  pathname: `/layout/${menu.path}`,
                  state: {
                    name: menu.name,
                    id: menu.componentId,
                    componentbgcolor: menu.layout.componentbgcolor,
                  },
                }, e)
              }
            >
              <IconButton color="inherit">
                {
                  menuicon
                }
              </IconButton>
            </a>
          );
        }
      }
    }
    else {
      if (menu.layout != null) {
        let menuicon = this.getMenuIcon(menu)
        menuContent.push(
          <a
            // className={this.props.selectedBottomComponentObj.id == menu.componentId ? "active" + menustr : ""}
            className={activeclass}
            key={menu.id}
            name={menu.name}
            onClick={() =>
              this.handleClick({
                pathname: `/layout/${menu.path}`,
                state: {
                  name: menu.name,
                  id: menu.componentId,
                  componentbgcolor: menu.layout.componentbgcolor,
                },
              })
            }
          >
            <IconButton color="inherit">
              {
                menuicon
              }
            </IconButton>
          </a>
        );
      }
    }
    return menuContent;
  }

  tempalte1Menu(menu, menuiconobj) {

    const { t } = this.props;
    let menuContent = [];
    if (localStorage.getItem('adminobj')) {
      if (menu.path != "survey") {
        if (count < 3 && menu.layout != null) {
          let menuicon = this.getMenuIcon(menu)
          let name = menu.label;
          menuContent.push(
            <Grid item xs={4} >
              <a
                className={
                  this.props.selectedBottomComponentObj.id == menu.componentId ? "active" : ""
                }
                key={menu.id}
                name={menu.name}
                onClick={() =>
                  this.handleClick({
                    pathname: `/layout/${menu.path}`,
                    state: {
                      name: menu.name,
                      id: menu.componentId,
                      componentbgcolor: menu.layout.componentbgcolor,
                    },
                  })
                }
              >
                <p className="zero vertical-align-center">
                  {menuicon}
                </p>
                {/* <p className="zero vertical-align-center">{t(name)}</p> */}
              </a>
            </Grid>
          );
          count++;
        } else if (menu.layout != null) {
          // var spliurtl = menu.icon.split("://")
          // let myUrl = spliurtl.length > 1 ? "https://" + spliurtl[1] : "https://" + spliurtl[0];
          let menuicon = this.getMenuIcon(menu)
          let name = menu.label;
          temp1popupmenu.push(
            <a
              className={
                this.props.selectedBottomComponentObj.id == menu.componentId ? "active" : ""
              }
              key={menu.id}
              name={menu.name}
              onClick={() =>
                this.handleClick({
                  pathname: `/layout/${menu.path}`,
                  state: {
                    name: menu.name,
                    id: menu.componentId,
                    componentbgcolor: menu.layout.componentbgcolor,
                  },
                })
              }
            >
              <ListItem button >
                <ListItemIcon>  {menuicon}</ListItemIcon>
                <Trans> <ListItemText primary={t(name)} /></Trans>
              </ListItem>
            </a>
          );
          count++;
        }
      }
    }
    else {
      if (count < 3 && menu.layout != null) {
        // var spliurtl = menu.icon.split("://")
        // let myUrl = spliurtl.length > 1 ? "https://" + spliurtl[1] : "https://" + spliurtl[0];
        let menuicon = this.getMenuIcon(menu)
        let name = menu.label;
        menuContent.push(
          <Grid item xs={4} >
            <a
              className={
                this.props.selectedBottomComponentObj.id == menu.componentId ? "active" : ""
              }
              key={menu.id}
              name={menu.name}
              onClick={() =>
                this.handleClick({
                  pathname: `/layout/${menu.path}`,
                  state: {
                    name: menu.name,
                    id: menu.componentId,
                    componentbgcolor: menu.layout.componentbgcolor,
                  },
                })
              }
            >
              <p className="zero vertical-align-center">
                {menuicon}
              </p>
              {/* <p className="zero vertical-align-center">{t(name)}</p> */}
            </a>
          </Grid>
        );
        count++;
      } else if (menu.layout != null) {
        // var spliurtl = menu.icon.split("://")
        // let myUrl = spliurtl.length > 1 ? "https://" + spliurtl[1] : "https://" + spliurtl[0];
        let menuicon = this.getMenuIcon(menu)
        let name = menu.label;
        temp1popupmenu.push(
          <a
            className={
              this.props.selectedBottomComponentObj.id == menu.componentId ? "active" : ""
            }
            key={menu.id}
            name={menu.name}
            onClick={() =>
              this.handleClick({
                pathname: `/layout/${menu.path}`,
                state: {
                  name: menu.name,
                  id: menu.componentId,
                  componentbgcolor: menu.layout.componentbgcolor,
                },
              })
            }
          >
            <ListItem button >
              <ListItemIcon>  {menuicon}</ListItemIcon>
              <Trans> <ListItemText primary={t(name)} /></Trans>
            </ListItem>
          </a>
        );
        count++;
      }
    }
    return menuContent;
  }

  getMenuIcon(menu) {
    //console.log("getMenuIcon", menu);
    if (0) {
      return <i className={"demo-icon " + menu.className}></i>
    } else if (menu.icon != "") {
      let myUrl = this.getHttpsUrl(menu.icon);
      return <img className="img-fluid" src={myUrl} />
    } else {
      return <InfoIcon />
    }
  }

  getHttpsUrl(iconurl) {
    var spliurtl = iconurl.split("://")
    let myUrl = spliurtl.length > 1 ? "https://" + spliurtl[1] : "https://" + spliurtl[0];
    return myUrl;
  }


  handlpopupClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handlpopupClose = () => {
    this.setState({ anchorEl: null })
  };


  render() {
    const { t } = this.props;
    let list = this.state.menuList;
    let menuiconobj = this.state.menuiconobj;
    var menuContent = [];
    const open = Boolean(this.state.anchorEl);
    const id = open ? 'simple-popover' : undefined;
    count = 0;
    temp1popupmenu = []
    // let settingsIcon = ''
    let settingicon = imgUrl.settings
    list.map((menu, i) => {
      if ((localStorage.getItem('adminobj') && menu.path != "peerchat") || (!localStorage.getItem('adminobj'))) {
        if (menu.visible && menu.isactive && menu.path != "settings") {
          menuContent.push(this.mountMenu(menu, menuiconobj));
        } else if (menu.path == "information") {
          menu.childs.map((submenu) => {
            if (submenu.visible && submenu.isactive) {
              menuContent.push(this.mountMenu(submenu, menuiconobj));
            }
          });
        }
        // if (menu && menu.path == "settings") {
        //   settingsIcon = this.getMenuIcon(menu);
        //   console.log("settingsIcon", settingsIcon);
        // }
      }
    });
    const { templateID } = this.props;
    var compcolor = window.location.hash == "#/layout/Notifications" ? "#009596" : localStorage.getItem('componentbgcolor');
    let colorStyles = templateID == 2 ? { background: compcolor } : {};
    return (
      <React.Fragment>
        <AppBar position="fixed" color="#fff" className={templateID == 2 ? 'bottom-appbar' : 'botnavmainholder'} style={colorStyles}>
          <Toolbar className={templateID == 2 ? 'zero bottom-toolbar' : 'bottom-navigation-menu'} style={{ overflowX: 'scroll' }}>
            {
              templateID == 1 ? (
                <Grid container spacing={3} className="gridcontainer botnavinnerholder">{menuContent}</Grid>
              ) : (menuContent)
            }

            {
              templateID == 2 ? (
                <Link className={this.state.isSettingSelected ? "active" : ""}
                  onClick={() =>
                    this.handleClickSetting({
                      pathname: `/layout/settings`,
                      state: {
                        name: "settings",
                        componentbgcolor: "#009596",
                      },
                    })
                  }
                >
                  <IconButton edge="end" color="inherit">
                    <MenuIcon />
                  </IconButton>
                </Link>) : (
                <div>
                  <Button
                    aria-describedby={id}
                    className="text-capitalize moremenu" variant="contained"
                    onClick={this.handlpopupClick}>
                    <MoreVertIcon />

                  </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handlpopupClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    className="bottonnavPopup"
                  >
                    <Typography>
                      {temp1popupmenu}
                      <Link className={this.state.isSettingSelected ? "active" : ""}
                        onClick={() =>
                          this.handleClickSetting({
                            pathname: `/layout/settings`,
                            state: {
                              name: "settings",
                              componentbgcolor: "#009596",
                            },
                          })
                        }
                      >
                        <ListItem button >
                          <ListItemIcon> <i className="demo-icon icon-settings" src={settingicon}></i></ListItemIcon>
                          {/* <ListItemIcon>{settingsIcon}</ListItemIcon> */}
                          <Trans> <ListItemText primary={t('Settings')} /></Trans>
                        </ListItem>
                      </Link>
                    </Typography>
                  </Popover>
                </div>
              )
            }
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

// export default BottomAppBar;

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    selectedComponentObj: storeState.componentObj,
    selectedBottomComponentObj: storeState.bottomComponentObj,
    componentbgcolor: storeState.componentbgcolor
  };
};

const TranslationBottomAppBar = withTranslation()(BottomAppBar);
const FinalBottomAppBar = withRouter(TranslationBottomAppBar);

export default connect(mapStateToProps, {
  setSelectedComponentObject,
  resetSelectedCompnentObject,
  setBottomNavComponentObject,
  partialSetSelectedComponentObject,
  setcomponentbgcolor
})(FinalBottomAppBar);
