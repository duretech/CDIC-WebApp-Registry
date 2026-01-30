import React, {Component, useState, useEffect} from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
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
import { connect } from "react-redux";
import { initReactI18next } from "react-i18next";
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
import { setSidebarToggel,setLoginUser } from "../../redux/actions/action";
import swal from 'sweetalert'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    display:'none',
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

function HeaderNew({setSidebarToggel,setLoginUser,languageliststore}) {
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [anchorThemeEl, setAnchorThemeEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isThemeMenuOpen = Boolean(anchorThemeEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const {t, i18n} = useTranslation();
  const [progarmData,setProgarmData] = useState(null)
  const [Configuration,setConfiguration] = useState(null);
  const [languageList, setlanguageList] = useState([
    { value: "en", label: "English" },
  ]);
  const changeTheme = (themeclassname) => {
    
    document.body.classList.remove(document.body.classList[0]);
    document.body.classList.add(themeclassname);
  }
  async function getMetaData(){
      let metadata = await OfflineDb.getDataFromPouchDB('metaData')
      setProgarmData(metadata.data)

      let configurations = await OfflineDb.getDataFromPouchDB('configurations')
      setConfiguration(configurations.data.configuration)
  }

  useEffect(()=>{
    getMetaData()
  },[])

  useEffect(() => {
    if(languageliststore && languageliststore.length > 0) {
      setlanguageList(languageliststore);
    }
  }, [languageliststore])

  const changeLanguage = (languageCode) =>{
    
    if(languageCode){
      const resources = JSON.parse(localStorage.getItem("translations"));
      localStorage.setItem("locale",languageCode);
      i18n.changeLanguage(languageCode);
      /*i18n
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
        resources,
        fallbackLng: 'en',
        lng: localStorage.getItem('locale') || languageCode, //localStorage.getItem('locale') ? localStorage.getItem('locale'): 'en',

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
          escapeValue: false // react already safes from xss
        },
        react: {
          useSuspense: false,
          wait: false,
        },
      })*/
      handleMenuClose();
      
    } 
    return;
  }
  
  const toggleDrawer1 = (changedrawstat) => {
    setSidebarToggel(true);
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

  const logout = () => {
    OfflineDb.getAllEntities().then(res=>{
			if(res == undefined || res.total_rows == 0){
				localStorage.clear()
				OfflineDb.deleteDatabse().then(res=>{
					setLoginUser(false)
				}).catch(err=>{
					setLoginUser(false)
				}) 
			}else{
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
     {Configuration && Configuration.theme[Configuration.theme.name].map((theme,i) => {
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
      
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <GTranslateIcon />
        </IconButton>
        <p>Translations</p>
      </MenuItem>
      
       <MenuItem onClick={handleThemeMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <PaletteIcon />
        </IconButton>
        <p>Theme</p>
      </MenuItem>
      <MenuItem onClick={() => {logout()}}>
        <IconButton
          aria-label="logout of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="false"
          color="inherit"
        >
          <ExitToApp />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
     
    </Menu>
  );
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="go back"
            onClick={() => history.goBack()}
            //style={{display:'none'}}
          >
            <ArrowBack />
          </IconButton>
          {window.document.body.clientWidth < 800 || window.cordova ?
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
          <Typography className={classes.title} variant="h6" noWrap>
            {(progarmData != null && progarmData != undefined) ? progarmData.programs[0].name: (Configuration != null) ? Configuration.programname:""}
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
            <IconButton
              edge={false}
              aria-label="logout of current user"
              aria-controls={menuId}
              aria-haspopup="false"
              color="inherit"
              onClick={() => {logout()}}
            >
              <ExitToApp />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
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
    </>
  );
}

function mapStateToProps(state) {
  const { storeState } = state;
  return { languageliststore: storeState.languagelist };
}

export default connect(mapStateToProps, {setSidebarToggel,setLoginUser})(HeaderNew);