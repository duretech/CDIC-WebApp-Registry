import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Link } from "react-router-dom";
import { MenuItem, Menu } from "@dhis2/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PersonIcon from "@material-ui/icons/Person";
import {
  faHome,
  faUserPlus,
  faSearch,
  faBullhorn,
  faFileAlt,
  faUsers,
  faFileInvoice,
  faEdit,
  faWifi,
  faCog,
  faSignOutAlt,
  faFileSignature,
  faUserFriends,
  faShareSquare,
  faPrescriptionBottle,
  faFlask,
  faPills,
  faMale,
  faRobot,
  faVideo,
  faEye,
  faFilePdf,
  faLanguage,
  faHdd,
  faExchangeAlt,
  faCommentMedical,
  faMapPin,
  faBookMedical,
  faCalendar,
  faBookOpen,
  faBook,
  faSitemap,
  faArrowRight,
  faBuilding,
  faCubes,
  faChalkboardTeacher,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Configuration } from "../../assets/data/config";
import swal from "sweetalert";
import "../../assets/css/customstyles.css";
//import '../../assets/css/theme_grey.css'
import "../../assets/css/theme_blue.css";
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'
import {
  setSidebarToggel,
  getPageRelaodFlag,
  setLoginUser,
} from "../../redux/actions/action";
import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  menuitem: {},
  whitetext: {
    color: "#fff !important",
  },
  noDeco: {
    "text-decoration": "none",
  },
});

function SidebarNew({
  isOpen,
  setSidebarToggel,
  getPageRelaodFlag,
  setLoginUser,
  customClass,
}) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const icons = {
    faHome,
    faUserPlus,
    faSearch,
    faBullhorn,
    faFileAlt,
    faUsers,
    faFileInvoice,
    faEdit,
    faWifi,
    faCog,
    faSignOutAlt,
    faFileSignature,
    faUserFriends,
    faShareSquare,
    faPrescriptionBottle,
    faFlask,
    faPills,
    faMale,
    faRobot,
    faVideo,
    faEye,
    faFilePdf,
    faLanguage,
    faHdd,
    faExchangeAlt,
    faCommentMedical,
    faMapPin,
    faBookMedical,
    faCalendar,
    faBookOpen,
    faBook,
    faSitemap,
    faArrowRight,
    faBuilding,
    faCubes,
    faChalkboardTeacher,
    faQuestionCircle
  };
  var self = this;

  const [state, setState] = React.useState({
    top: false,
    left: isOpen,
    bottom: false,
    right: false,
  });
  const [ConfigurationFromServer, setConfiguration] = useState(null);
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null);
  const [userrolename, setuserrolename] = React.useState(null);
  const [programDetailsValue, setprogramDetailsValue] = React.useState(null);
  const patientRole = "Patient Role";
  const superAdmin = "superuser";
  const facilityUser = "facilityUser";
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  async function getConfig() {
    let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    setConfiguration(configurations.data.configuration);

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let programDetails = await OfflineDb.getDataFromPouchDB("programBoDetails");
    setprogramDetailsValue(programDetails)
  }
  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    const handleResize = () => {
        console.log("Screen orientation changed. Checking sidebar state...");
        
        if (isOpen) {
            console.log("Sidebar should be open. Forcing re-open.");
            setSidebarToggel(false);
            setTimeout(() => setSidebarToggel(true), 50); // Close and reopen
        }
    };

    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, [isOpen]);

  useEffect(() => {
    if (sessionUserBoValue != null) {
      setuserrolename(
        sessionUserBoValue.userRoles[0].name ||
        sessionUserBoValue.userRoles[0].displayName
      );
    }
  }, [sessionUserBoValue]);

  const toggleDrawer = (anchor, open) => (event) => {
    setSidebarToggel(false);
  };

  const logout = () => {
    setSidebarToggel(false);
    OfflineDb.deleteDatabse()
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        window.location.reload();
      });
    localStorage.clear();
  };

  const onMenuClick = (menuName) => {
    console.log("menuName ", menuName);
    setSidebarToggel(false);

    if (menuName == "Logout") {
      OfflineDb.getAllEntities().then((res) => {
        if (res == undefined || res.total_rows == 0) {
          localStorage.clear();
          OfflineDb.deleteDatabse()
            .then((res) => {
              //(window.cordova) ? navigator.app.exitApp() : window.location.reload()
              setLoginUser(false);
            })
            .catch((err) => {
              //(window.cordova) ? navigator.app.exitApp() : window.location.reload()
              setLoginUser(false);
            });
        } else {
          swal({
            title: t("Offline data"),
            text: t("Offline records found, please sync data before logout"),
            icon: "warning",
            buttons: "Close",
          }); /*.then(result=>{
					if(result){
						localStorage.clear()
						OfflineDb.cleanAppDB().then(response=>{
						})
						OfflineDb.deleteDatabse().then(res=>{
							//(window.cordova) ? navigator.app.exitApp() : window.location.reload()
							setLoginUser(false)
						}).catch(err=>{
							//(window.cordova) ? navigator.app.exitApp() : window.location.reload()
							setLoginUser(false)
						}) 
					}
				})*/
        }
      });
    }

    if (menuName == "Add New Client") {
      OfflineDb.removeDataFromPouchDB("activeCaseDetails");
      OfflineDb.removeDataFromPouchDB("activeCaseFormData");
      OfflineDb.removeDataFromPouchDB("linkContactFlag");
      //localStorage.setItem('newClient', true);
      //history.push('/layout/registration',{"newClient":true})
    }

    if (menuName == "Patient Record List") {
      OfflineDb.removeDataFromPouchDB("activeCaseDetails");
      OfflineDb.removeDataFromPouchDB("activeCaseFormData");
      OfflineDb.removeDataFromPouchDB("linkContactFlag");
      history.push("/layout/cases");
    }
  };

  const newCaseClick = () => {
    const self = this;
    setSidebarToggel(false);
    localStorage.removeItem("trackedEntityInstance");
    localStorage.removeItem("linkTrackedEntityInstance");
    localStorage.removeItem("enrollmentId");
    localStorage.removeItem("linkContact");
    localStorage.removeItem("hideButton");

    history.push("/layout/registration");

    getPageRelaodFlag(true);
  };

  // const list = (anchor) => (
  //   <div
  //     className={clsx(classes.list, {
  //       [classes.fullList]: anchor === "top" || anchor === "bottom",
  //     })}
  //     role="presentation"
  //     onClick={() => toggleDrawer(anchor, false)}
  //     onKeyDown={() => toggleDrawer(anchor, false)}
  //   >

  //     <Menu className="sidebar_list">
  //       {ConfigurationFromServer &&
  //         ConfigurationFromServer.sidebar.menuItems.map((menuItems, index) => {
  //       //     if (
  //       //       userrolename &&
  //       //       userrolename == patientRole &&
  //       //       menuItems.userrole &&
  //       //       menuItems.userrole == patientRole
  //       //     ) {
  //       //       return (
  //       //         <Link
  //       //           className={classes.noDeco}
  //       //           to={menuItems.path}
  //       //           onClick={() => onMenuClick(menuItems.name)}
  //       //           key={index}
  // 			// 					disabled={menuItems.disabled}
  //       //         >
  //       //           <MenuItem
  //       //             className="menuitem"
  //       //             dataTest="dhis2-uicore-menuitem"
  //       //             icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
  //       //             label={t(menuItems.name)}
  // 			// 						disabled={menuItems.disabled}
  //       //           />
  //       //         </Link>
  //       //       );
  //       //     } else if (
  //       //       userrolename &&
  //       //       userrolename.toLowerCase() == superAdmin &&
  //       //       menuItems.userrole &&
  //       //       menuItems.userrole.toLowerCase() == superAdmin
  //       //     ) {
  //       //       return (
  //       //         <Link
  //       //           className={classes.noDeco}
  //       //           to={menuItems.path}
  //       //           onClick={() => onMenuClick(menuItems.name)}
  //       //           key={index}
  // 			// 					disabled={menuItems.disabled}
  //       //         >
  //       //           <MenuItem
  //       //             className="menuitem"
  //       //             dataTest="dhis2-uicore-menuitem"
  //       //             icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
  //       //             label={t(menuItems.name)}
  // 			// 						disabled={menuItems.disabled}
  //       //           />
  //       //         </Link>
  //       //       );
  //       //     } else if (
  //       //       userrolename &&
  //       //       userrolename.toLowerCase() == facilityUser.toLowerCase() &&
  //       //       menuItems.userrole &&
  //       //       menuItems.userrole.toLowerCase() == facilityUser.toLowerCase()
  //       //     ) {
  //       //       return menuItems.showMenu ? (
  //       //         menuItems.name == "My Clients" ? (
  //       //           <Link
  //       //             className={classes.noDeco}
  //       //             //to={menuItems.path}
  //       //             onClick={() => onMenuClick(menuItems.name)}
  //       //             key={index}
  // 			// 						disabled={menuItems.disabled}
  //       //           >
  //       //             <MenuItem
  //       //               className="menuitem"
  //       //               dataTest="dhis2-uicore-menuitem"
  //       //               icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
  //       //               label={t(menuItems.name)}
  // 			// 							disabled={menuItems.disabled}
  //       //             />
  //       //           </Link>
  //       //         ) : (
  //       //           <Link
  //       //             className={classes.noDeco}
  //       //             to={menuItems.path}
  //       //             onClick={() => onMenuClick(menuItems.name)}
  //       //             key={index}
  // 			// 						disabled={menuItems.disabled}
  //       //           >
  //       //             <MenuItem
  //       //               className="menuitem"
  //       //               dataTest="dhis2-uicore-menuitem"
  //       //               icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
  //       //               label={t(menuItems.name)}
  // 			// 							disabled={menuItems.disabled}
  //       //             />
  //       //           </Link>
  //       //         )
  //       //       ) : null;
  //       //     } else if (
  //       //       userrolename &&
  //       //       userrolename != patientRole &&
  //       //       userrolename.toLowerCase() != superAdmin &&
  // 		  // userrolename.toLowerCase() != facilityUser.toLowerCase() &&
  // 		  // !menuItems.userrole &&
  //       //       menuItems.showMenu
  //       //     ) {
  //       //       return menuItems.showMenu ? (
  //       //         menuItems.name == "My Clients" ? (
  //       //           <Link
  //       //             className={classes.noDeco}
  //       //             //to={menuItems.path}
  //       //             onClick={() => onMenuClick(menuItems.name)}
  //       //             key={index}
  // 			// 						disabled={menuItems.disabled}
  //       //           >
  //       //             <MenuItem
  //       //               className="menuitem"
  //       //               dataTest="dhis2-uicore-menuitem"
  //       //               icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
  //       //               label={t(menuItems.name)}
  // 			// 							disabled={menuItems.disabled}
  //       //             />
  //       //           </Link>
  //       //         ) : (
  //       //           <Link
  //       //             className={classes.noDeco}
  //       //             to={menuItems.path}
  //       //             onClick={() => onMenuClick(menuItems.name)}
  //       //             key={index}
  // 			// 						disabled={menuItems.disabled}
  //       //           >
  //       //             <MenuItem
  //       //               className="menuitem"
  //       //               dataTest="dhis2-uicore-menuitem"
  //       //               icon={<FontAwesomeIcon icon={icons[menuItems.icon]} />}
  //       //               label={t(menuItems.name)}
  // 			// 							disabled={menuItems.disabled}
  //       //             />
  //       //           </Link>
  //       //         )
  //       //       ) : null;
  //       //     }
  //       //     else{
  //             if (programDetailsValue && programDetailsValue.data) {
  //               let userRoleData;
  //               const roleBasedArray = programDetailsValue.data.roleBasedArray[0];
  //               userRoleData = roleBasedArray[userrolename];
  //             return (
  //               <Menu className="">
  //                 {userRoleData.map((userRoleData, index) => {
  //                     return userRoleData.showMenu && !userRoleData.userrole ? (
  //                       userRoleData.name == "Logout" ? (
  //                                         <Link
  //                           className={classes.noDeco}
  //                           //to={menuItems.path}
  //                           to="#"
  //                           onClick={() => onMenuClick(userRoleData.name)}
  //                           key={index}
  //                           disabled={userRoleData.disabled ? true : false}
  //                         // state={{test: 'test'}}
  //                         >
  //                           <MenuItem
  //                             // className="menuitem"
  //                             dataTest="dhis2-uicore-menuitem"
  //                             icon={<FontAwesomeIcon icon={icons[userRoleData.icon]} />}
  //                             label={t(userRoleData.name)}
  //                             disabled={userRoleData.disabled ? true : false}
  //                           />
  //                         </Link>
  //                       ) : (
  //                         <Link
  //                           className={classes.noDeco}
  //                           to={userRoleData.disabled ? "#" : userRoleData.path}
  //                           disabled={userRoleData.disabled ? true : false}
  //                           onClick={() => {
  //                             // localStorage.setItem("followup", true)
  //                             onMenuClick(userRoleData.name);
  //                           }}
  //                           key={index}
  //                         >
  //                           <MenuItem
  //                             // className="menuitem"
  //                             dataTest="dhis2-uicore-menuitem"
  //                             icon={<FontAwesomeIcon icon={icons[userRoleData.icon]} />}
  //                             label={t(userRoleData.name)}
  //                             disabled={userRoleData.disabled ? true : false}
  //                           />
  //                         </Link>
  //                       )
  //                     ) : null;
  //                   })}
  //               </Menu>
  //             );

  //           }
  //         })}
  //     </Menu>
  //   </div>
  // );

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={() => toggleDrawer(anchor, false)}
      onKeyDown={() => toggleDrawer(anchor, false)}
    >
      {programDetailsValue && programDetailsValue.data ? (
        (() => {
          let userRoleData;
          const roleBasedArray = programDetailsValue?.data?.roleBasedArray[0];
          userRoleData = roleBasedArray[userrolename] ? roleBasedArray[userrolename] : []

          if(roleBasedArray){
            const hasSortOrder = userRoleData?.some(item => item.sortOrder !== undefined);

            if (hasSortOrder) {
              // Find logout item
              const logoutItemIndex = userRoleData.findIndex(
                item => item.name?.toLowerCase() === "logout"
              );

              let logoutItem = null;
              if (logoutItemIndex !== -1) {
                logoutItem = userRoleData[logoutItemIndex];
              }

              // Separate items with & without sortOrder
              const withOrder = userRoleData.filter(item => item.sortOrder !== undefined && item !== logoutItem);
              const withoutOrder = userRoleData.filter(item => item.sortOrder === undefined && item !== logoutItem);

              // Sort items with sortOrder
              withOrder.sort((a, b) => a.sortOrder - b.sortOrder);

              // Final Order: withOrder → withoutOrder → Logout
              userRoleData = [
                ...withOrder,
                ...withoutOrder,
                ...(logoutItem ? [logoutItem] : [])
              ];
            }
          }

          if (userRoleData && Array.isArray(userRoleData)) {
            return (
              <Menu className="hswsidebar">
                {userRoleData.map((userRoleData, index) => {
                  return userRoleData.showMenu && !userRoleData.userrole ? (
                    userRoleData.name == "Logout" ? (
                      <Link
                        className={classes.noDeco}
                        //to={menuItems.path}
                        to="#"
                        onClick={() => onMenuClick(userRoleData.name)}
                        key={index}
                        disabled={userRoleData.disabled ? true : false}
                      // state={{test: 'test'}}
                      >
                        <MenuItem
                          // className="menuitem"
                          dataTest="dhis2-uicore-menuitem"
                          icon={<FontAwesomeIcon icon={icons[userRoleData.icon]} />}
                          label={t(userRoleData.name)}
                          disabled={userRoleData.disabled ? true : false}
                        />
                      </Link>
                    ) : (
                      <Link
                        className={classes.noDeco}
                        to={userRoleData.disabled ? "#" : userRoleData.path}
                        disabled={userRoleData.disabled ? true : false}
                        // onClick={() => {
                        //   // localStorage.setItem("followup", true)
                        //   onMenuClick(userRoleData.name);
                        // }}
                          onClick={(e) => {
                          if (
                            userRoleData.name.toLowerCase() === "settings" ||
                            userRoleData.path.includes("/layout/settings")
                          ) {
                              onMenuClick(userRoleData.name);
                               if(!navigator.onLine){
                                e.preventDefault();
                                 setSidebarToggel(false);
                                swal({
                                title: "This operation is not available while offline. Please go online to proceed.",
                                icon: "warning",
                                button: "OK",
                              });
                               history.push("/layout/home");
                            }
                          } else {
                            onMenuClick(userRoleData.name);
                          }
                        }}
                        key={index}
                      >
                        <MenuItem
                          // className="menuitem"
                          dataTest="dhis2-uicore-menuitem"
                          icon={<FontAwesomeIcon icon={icons[userRoleData.icon]} />}
                          label={t(userRoleData.name)}
                          disabled={userRoleData.disabled ? true : false}
                        />
                      </Link>
                    )
                  ) : null;
                })}
              </Menu>
            );
          }
        })()
      ) : (
        <div>No menu items available</div>
      )}
    </div>
  );


  return (
    <>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}  className="responsive-sidebar">
        
          <Drawer
            className={"customClass responsive-sidebar"}
            anchor={anchor}
            open={isOpen}
            onClose={() => setSidebarToggel(false)}
           
          >
            {list(anchor)}
            {sessionUserBoValue &&
              sessionUserBoValue.userCredentials &&
              sessionUserBoValue.userCredentials.username ? (
              <div className="username-tag">
                <PersonIcon /> {sessionUserBoValue.userCredentials.username}
              </div>
            ) : (
              <></>
            )}
            <div className="version-tag">
              {t("Version No")} : 1.0.8s
            </div>{" "}
            {/*{Configuration != null ? Configuration.mobileAppVersion : ""}*/}
          </Drawer>
          
        </React.Fragment>
      ))}
    </>
  );
}

function mapStateToProps(state) {
  const { storeState } = state;

  return { isOpen: storeState.isSidebarOpen };
}

export default connect(mapStateToProps, {
  setSidebarToggel,
  getPageRelaodFlag,
  setLoginUser,
})(SidebarNew);
