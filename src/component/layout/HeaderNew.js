import React, { Component, useState, useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';

import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ExitToApp from '@material-ui/icons/ExitToApp';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PaletteIcon from '@material-ui/icons/Palette';
import MoreIcon from '@material-ui/icons/MoreVert';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FontDownloadIcon from '@material-ui/icons/FontDownload';
import { connect } from "react-redux";
import { initReactI18next } from "react-i18next";
import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import imgUrl from '../../assets/images/imageUrl';
import getImgUrl from "../../assets/images/imageUrlDynamic.js";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from '@mui/icons-material/Delete';
//import i18n from "i18next";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import OfflineDb from '../../db'
//import {Configuration} from '../../assets/data/config'
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { setSidebarToggel, setLoginUser } from "../../redux/actions/action";
import swal from 'sweetalert'
import PersonIcon from "@material-ui/icons/Person";
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import { apiServices } from '../../services/apiServices';
import { encryptData, decryptData } from '../../imon/encryption/AesEnc';
import axios from "axios";
import { APP_LOCALE, Configuration as conf } from '../../assets/data/config.js';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'block',
    textTransform: 'capitalize',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    display: 'none',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: '16px',
    margin: 'auto'
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function HeaderNew({ setSidebarToggel, setLoginUser }) {
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElDropdown, setAnchorElDropdown] = useState(null);

  const handleDropdownMenuOpen = (event) => {
    setAnchorElDropdown(event.currentTarget);
  };

  const handleDropdownMenuClose = () => {
    setAnchorElDropdown(null);
  };


  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorThemeEl, setAnchorThemeEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isThemeMenuOpen = Boolean(anchorThemeEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { t, i18n } = useTranslation();
  const [progarmData, setProgarmData] = useState(null)
  const [Configuration, setConfiguration] = useState(null);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [languageList, setlanguageList] = useState([
    { value: "en", label: "English" },
  ]);
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') ? localStorage.getItem('fontSize') : 14)
  const [programBoDetails, setProgramBoDetails] = useState(null)

  const [showFlag, setShowFlag] = useState(false);

  const changeTheme = (themeclassname) => {

    document.body.classList.remove(document.body.classList[0]);
    document.body.classList.add(themeclassname);
  }
  async function getMetaData() {
    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let metadata = await OfflineDb.getDataFromPouchDB('metaData')
    setProgarmData(metadata.data)

    let programBoDetails = await OfflineDb.getDataFromPouchDB('programBoDetails')
    setProgramBoDetails(programBoDetails.data)


    let configurations = await OfflineDb.getDataFromPouchDB('configurations')
    if (configurations && configurations.data && configurations.data.configuration) {
      setConfiguration(configurations.data.configuration)
    }
    let languagelist = await OfflineDb.getDataFromPouchDB("languageList");
    if (languagelist && languagelist.data) {
      setlanguageList(languagelist.data);
    }
  }

  useEffect(() => {
    getMetaData()
  }, [])

  useEffect(() => {
    if (fontSize) {
      changeFontSize(fontSize)
    }
  }, [fontSize])

  useEffect(() => {
    // Retrieve the flag setting from local storage
    const flagSetting = localStorage.getItem('navbarflag');
    // Set showFlag to true only if flagSetting explicitly contains 'true'
    setShowFlag(flagSetting === 'true');
  }, []);

  const changeLanguage = async (languageCode) => {
    if (!languageCode) return;

    try {
      // Safely parse translations
      const translations = localStorage.getItem("translations");
      const resources = translations ? JSON.parse(translations) : {};

      // Set language in localStorage
      localStorage.setItem("locale", languageCode);

      // Change language in i18n
      await i18n.changeLanguage(languageCode).catch((err) => {
        console.error("Error changing language in i18n :", err);
      });

      // Decrypt credentials
      const basicAuth = localStorage.getItem("basicAuth");
      const decrypted = decryptData(basicAuth);

      // Send user setting update to backend
      const response = await axios.post(
        `${conf.apiService.key}/40/userSettings/keyUiLocale`,
        languageCode,
        {
          headers: {
            Authorization: `${decrypted}`,
            "Cache-Control": "no-cache",
            "Content-Type": "text/plain",
          },
        }
      );

      const responseData = response.data;
      if (responseData.httpStatusCode === 200 && responseData.status === "OK") {
        console.log("Language preference saved successfully.");
      } else {
        console.warn("Failed to save language preference:", responseData.message);
      }

    } catch (error) {
      console.error("Error in changeLanguage:", error);
    } finally {
      // This runs regardless of success/failure
      handleMenuClose();
    }
  };

  const toggleDrawer1 = (changedrawstat) => {
    //  setSidebarToggel(true);
    setSidebarToggel((prevState) => {
      return !prevState;
    });
    /*
    setState({
      ['isOpen']: !changedrawstat,
      ['isClicked']: true
    });
    toggleDrawer(true, !changedrawstat);*/
  }

  const goBack = () => {
    history.goBack()
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeMenuOpen = (event) => {
    setAnchorThemeEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setAnchorThemeEl(null);
    // handleMobileMenuClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const changeFontSize = (value) => {
    if (value <= 22 && value >= 10) {
      localStorage.setItem('fontSize', value)
      if (localStorage.getItem('fontSize')) {
        document.querySelectorAll('.innertabdivreg label').forEach((userItem) => {
          userItem.style.fontSize = localStorage.getItem('fontSize') + 'px'
        });
        document.querySelectorAll('.innertabdivreg input').forEach((userItem1) => {
          userItem1.style.fontSize = localStorage.getItem('fontSize') + 'px'
        });

        document.querySelectorAll('.innertabdivreg .root-input').forEach((userItem2) => {
          userItem2.style.fontSize = localStorage.getItem('fontSize') + 'px'
        });

        document.querySelectorAll('.innertabdivreg span').forEach((userItem3) => {
          userItem3.style.fontSize = localStorage.getItem('fontSize') + 'px'
        });
      }
    }
  }
  const deleteAccount = () => {
    let userrorle = localStorage.getItem('userrole')

    swal({
      // title: t("New Visit"),
      text: t("Your user profile and all its data will be deleted. It may take up to a week to delete all data associated with your account. Please confirm"),
      icon: "warning",
      buttons: [t("No"), t("Yes")],
    })
      .then((AlertRes) => {
        if (AlertRes) {
          let tempHolder = {
            "type": "GET",
            "url": "dhis-web-commons-security/logout.action",
            "data": {}
          }
          const encryptedData = encryptData(tempHolder);
          apiServices.postAPI('commonencryption/loginOut', { "data": encryptedData }).then((result) => {

          }).catch((err) => {

          });
          OfflineDb.getAllEntities().then(res => {
            if (userrorle && userrorle == "Patient") {
              localStorage.clear()
              OfflineDb.deleteDatabse().then(res => {
                setLoginUser(false)
                //history.push('/onboarding')
              }).catch(err => {
                setLoginUser(false)
                //history.push('/onboarding')
              })
            } else if (res == undefined || res.total_rows == 0) {
              localStorage.clear()
              OfflineDb.deleteDatabse().then(res => {
                setLoginUser(false)
              }).catch(err => {
                setLoginUser(false)
              })
            } else {
              swal({
                title: t("Offline data"),
                text: t("Offline records found, please sync data before logout"),
                icon: "warning",
                buttons: "Close",
              })/*.then(result=>{
					if(result){
						localStorage.clear()
						OfflineDb.cleanAppDB().then(response=>{
						})
						OfflineDb.deleteDatabse().then(res=>{
							setLoginUser(false)
						}).catch(err=>{
							setLoginUser(false)
						}) 
					}
				})*/
            }
          })
        }

      })
  }
  const logout = () => {
    let userrorle = localStorage.getItem('userrole')

    swal({
      // title: t("New Visit"),
      text: t("Are you sure you want to logout ?"),
      icon: "warning",
      buttons: [t("No"), t("Yes")],
    })
      .then((AlertRes) => {
        if (AlertRes) {
          let tempHolder = {
            "type": "GET",
            "url": "dhis-web-commons-security/logout.action",
            "data": {}
          }
          const encryptedData = encryptData(tempHolder);
          apiServices.postAPI('commonencryption/loginOut', { "data": encryptedData }).then((result) => {

          }).catch((err) => {

          });
          OfflineDb.getAllEntities().then(res => {
            if (userrorle && userrorle == "Patient") {
              localStorage.clear()
              OfflineDb.deleteDatabse().then(res => {
                setLoginUser(false)
                //history.push('/onboarding')
              }).catch(err => {
                setLoginUser(false)
                //history.push('/onboarding')
              })
            } else if (res == undefined || res.total_rows == 0) {
              localStorage.clear()
              OfflineDb.deleteDatabse().then(res => {
                setLoginUser(false)
              }).catch(err => {
                setLoginUser(false)
              })
            } else {
              swal({
                title: t("Offline data"),
                text: t("Offline records found, please sync data before logout"),
                icon: "warning",
                buttons: "Close",
              })/*.then(result=>{
					if(result){
						localStorage.clear()
						OfflineDb.cleanAppDB().then(response=>{
						})
						OfflineDb.deleteDatabse().then(res=>{
							setLoginUser(false)
						}).catch(err=>{
							setLoginUser(false)
						}) 
					}
				})*/
            }
          })
        }

      })
  }

  const menuId = 'primary-search-account-menu';
  const menuId1 = 'primary-search-account-menu1';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* {Configuration && Configuration.language.languageList.map((languageList,i) => {
        return (languageList.showHide != undefined && languageList.showHide) ? <MenuItem key={i} onClick={() => changeLanguage(languageList.value)}>{t(languageList.name)}</MenuItem>:""
      })} */}
      {languageList &&
        languageList.map((lang, i) => {
          return (
            <MenuItem key={i} onClick={() => changeLanguage(lang.value)}>
              {t(lang.label)}
            </MenuItem>
          );
        })}
    </Menu>
  );

  const renderThemeMenu = (
    <Menu
      anchorEl={anchorThemeEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isThemeMenuOpen}
      onClose={handleThemeMenuClose}
    >
      {Configuration && Configuration.theme[Configuration.theme.name].map((theme, i) => {
        return <MenuItem key={i} onClick={() => changeTheme(theme.className)}>{t(theme.name)}</MenuItem>
      })}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      className={classes.menuButton2}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* { window.location && window.location.pathname && window.location.pathname.includes('/registration') && 
      <MenuItem onClick={()=>{
        setAnchorEl(null);
        handleMobileMenuClose();
        setOpen(true)
        }}>
        <IconButton
          aria-label="account of current use1r"
          aria-controls="primary-search-account-menu1"
          aria-haspopup="true"
          color="inherit"
        >
          <FontDownloadIcon />
        </IconButton>
        <p>{t("Font Resize")}</p>
      </MenuItem>
      } */}

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <GTranslateIcon />
        </IconButton>
        <p>{t("Translations")}</p>
      </MenuItem>

      {/* <MenuItem onClick={handleThemeMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <PaletteIcon />
        </IconButton>
        <p>{t("Theme")}</p>
      </MenuItem> */}
      <MenuItem onClick={() => { logout() }}>
        <IconButton
          aria-label="logout of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="false"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{t("Logout")}</p>
      </MenuItem>
      {APP_LOCALE === "CC002" ? (
        <MenuItem onClick={() => { deleteAccount() }}>
          <IconButton
            aria-label="logout of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="false"
            color="inherit"
          >
            <DeleteIcon />
          </IconButton>
          <p>{t("Delete Account")}</p>
        </MenuItem>)
        : null}

    </Menu>
  );
  const imageUrlDynamic = getImgUrl();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={"classes.menuButton: backMainButton"}
            color="inherit"
            aria-label="go back"
            onClick={() => history.goBack()}

          //style={{display:'none'}}
          >
            <ArrowBack />
          </IconButton>
          {window.document.body.clientWidth < 1023 || window.cordova ?
            <IconButton
              edge="start"
              className={classes.menuButton}
              onClick={() => toggleDrawer1()}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            : <></>
          }
          {/* <Typography className={classes.title} variant="h6" noWrap> */}
          {showFlag && (
            <img src={imageUrlDynamic['navbarimage']} alt="Country Logo" className="navbaricon_" />
          )}
          <Typography className={`${classes.title} ${showFlag ? 'pb5' : ''}`} variant="h6" noWrap>

            {`${(programBoDetails != null && programBoDetails != undefined) ? programBoDetails.name : (Configuration != null) ? Configuration.programname : ""} 
              `}

            {`${sessionUserBoValue &&

              sessionUserBoValue.organisationUnits &&

              sessionUserBoValue.organisationUnits.length > 0

              ? sessionUserBoValue.organisationUnits[0].displayName.charAt(0).toUpperCase() +

              sessionUserBoValue.organisationUnits[0].displayName.slice(1).toLowerCase()

              : ""

              }`}
          </Typography>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />

          <div className={classes.sectionDesktop}>
            {sessionUserBoValue && sessionUserBoValue.userCredentials && sessionUserBoValue.userCredentials.username ?
              <div className="web-username-tag"><PersonIcon /> <span>{sessionUserBoValue.userCredentials.username}</span></div>
              : <></>}
            {/* { window.location && window.location.pathname && window.location.pathname.includes('/registration') && 
            <Tooltip title={t("Font Resize")} arrow>
            <IconButton
              aria-label="chat"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={()=>{setOpen(true)}}
              color="inherit"
            >
              <FontDownloadIcon />
            
            </IconButton>
            </Tooltip>
            } */}
            <Typography className={classes.userName} variant="h6" noWrap>
              {(sessionUserBoValue != null && sessionUserBoValue != undefined) ? sessionUserBoValue.firstName : ""}
            </Typography>
            <Tooltip title={t("Translations")} arrow>
              <IconButton
                edge={false}
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <GTranslateIcon />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title={t("Theme")} arrow>
            <IconButton
              edge={false}
              aria-label="account of current user"
              aria-controls={menuId1}
              aria-haspopup="true"
              onClick={handleThemeMenuOpen}
              color="inherit"
            >
              <PaletteIcon />
            </IconButton>
            </Tooltip> */}
            <>
              <Tooltip title={t("Profile Options")} arrow>
                <IconButton
                  edge="end"
                  aria-label="account options"
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleDropdownMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>



              <Menu
                id="profile-menu"
                anchorEl={anchorElDropdown}
                open={Boolean(anchorElDropdown)}
                onClose={handleDropdownMenuClose}
                keepMounted
                PaperProps={{
                  sx: {
                    width: 120, // Fixed width
                    mt: 4, // Increased top margin for better spacing
                    boxShadow: 3,
                    borderRadius: 2, // Slight rounding for a modern look
                    "& .MuiListItemIcon-root": {
                      minWidth: "20px", // Reduced space between icon & text
                    },
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleDropdownMenuClose();
                    if (navigator.onLine) {
                      history.push("/layout/settings");
                    } else {
                      swal({
                        title: "This operation is not available while offline. Please go online to proceed.",
                        icon: "warning",
                        button: "OK",
                        // className: "custom-swalwarning"
                      });

                    }

                  }}
                >
                  <ListItemIcon sx={{ mr: -1 }}> {/* Reduces space between icon & text */}
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("Settings")} />
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleDropdownMenuClose();
                    logout();
                  }}
                >
                  <ListItemIcon sx={{ mr: -1 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t("Logout")} />
                </MenuItem>
                {APP_LOCALE === "CC002" ? (
                  <MenuItem onClick={() => {
                    handleDropdownMenuClose();
                    deleteAccount();
                  }}>
                    <ListItemIcon sx={{ mr: -1 }}>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("Delete Account")} />

                  </MenuItem>)
                  : null}
              </Menu>

            </>
          </div>
          <div className={classes.sectionMobile}>
            {/* <IconButton
              aria-label="chat"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={openchatbot}
              color="inherit"
            >
              <WhatsAppIcon />
            </IconButton> */}
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderThemeMenu}
      {/* <BottomSheet 
      open={open} 
      onDismiss={() => setOpen(false)}
      //blocking={false}  
      header={<span style={{fontSize:"20px",fontWeight:"bold"}}>{t("Font Resize")}</span>}
      >
        <div className="fontresize-block">
            <Button variant="text" style={{'fontSize': '36px'}} onClick={()=>{fontSize < 22 && setFontSize(Number(fontSize) + 2)} }>A</Button>
            <Button variant="text" style={{'fontSize': '20px'}} onClick={()=>{fontSize > 10 && setFontSize(Number(fontSize) - 2)}}>A</Button>
            <Button variant="text" onClick={()=>{setFontSize(14)}}><RefreshIcon/></Button>
        </div>
      </BottomSheet> */}
    </>
  );
}


export default connect(null, { setSidebarToggel, setLoginUser })(HeaderNew);