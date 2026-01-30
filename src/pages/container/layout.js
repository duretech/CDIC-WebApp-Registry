import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import DashboardRoutes from "../../router/dashboardroutes";
import newThemeRoutes from '../../router/newthemeroutes';
import {Configuration} from '../../assets/data/config'
import { connect } from "react-redux";

/* Lazy Loads */
//const HeaderNew = React.lazy(() => import("../../component/layout/HeaderNew"));
//const SidebarNew = React.lazy(() => import("../../component/layout/SidebarNew"));
import HeaderNew from "../../component/layout/HeaderNew"
import SidebarNew from "../../component/layout/SidebarNew"

// const Loader = React.lazy(() => import("../../component/loaders/loader"));
/*  */
// const MenuOrdering = ['Setup','Home','responsedashboard','Dashboard','charts','Linelist','Maps','Analytics','Translation'];
// const MenuOrdering = ['Setup','Home','responsedashboard','Dashboard','charts'];
/*  */
const Layout = (props) => {
  const [loading, setLoading] = useState(true);
  const [sideBarClass, setSideBarClass] = useState("");
  const [menus, setMenus] = useState([]);
  const [oRoutes, setoRoutes] = useState({});
  const [DashboardRoutesNew, setDashboardRoutesNew] = useState([]);
  const [state, setState] = React.useState({
	drawerOpen: false,
	isClicked: false,
  });
  useEffect(() => {
    Configuration.theme.name == 'Template1' ?  setDashboardRoutesNew(DashboardRoutes) : setDashboardRoutesNew(newThemeRoutes)
  },[])
  useEffect(() => {
    let aMenus = []; // keep empty (added Home fpor dev purpose);
    if (DashboardRoutesNew && DashboardRoutesNew.length) {
      let oRoutes = {};
      //   const CalcRecursive = (p_data) => {
      //     p_data.forEach(({ visible, componentType, label, name, childs }) => {
      //       // if(visible){
      //       // oRoutes[label] = oRoutes[label] || true;
      //       oRoutes[label] = (oRoutes[label] || []).concat(childs || []);
      //       if (componentType === "list" && childs && childs.length > 0) {
      //         CalcRecursive(childs);
      //       }
      //       // }
      //     });
      //   };
      
      //   CalcRecursive(DashboardRoutes);
      //   setoRoutes(oRoutes);

      DashboardRoutesNew.forEach((ele, idx) => {
        // if(ele.visible && ele.isactive){
        aMenus.push(ele);
        // }
      });
    }
    /* dev purpose */
    /**HARDCODED THE SEQUENCE OF MENU IN SIDEBAR
     * NEED TO BE CHANGED LATER
     */
    // aMenus = MenuOrdering;
    /*  */
    computeMenusList(aMenus);
  }, []);

  const testFunc = () => {};

  const getMenuRoutes = () => {
    let aMenuRoutes = [];
    
    DashboardRoutesNew.forEach((prop, key) => {
		
      //   if (!prop.multilevel) {
      if (prop.redirect) {
        aMenuRoutes.push(<Redirect from={prop.path} to={prop.to} key={key} />);
      } else {
        aMenuRoutes.push(
          <Route
            path={prop.path}
            render={() => <prop.component testFn={testFunc} routeData={prop} />}
            key={key}
          />
        );
      }
      //   }
    });
    return aMenuRoutes;
  };

  const toggleSideBar = () => {
    let sClass = "";
    if (!sideBarClass) {
      sClass = window.innerWidth < 992 ? "open-sidebar" : "close-sidebar";
    } else {
      sClass =
        sideBarClass === "open-sidebar" ? "close-sidebar" : "open-sidebar";
    }
    setSideBarClass(sClass);
  };

  const translationLoaded = (p_val) => {
    setLoading(p_val);
  };

  const computeMenusList = (aMenus) => {
    let i,
      j,
      aFinalRoutes = [];
    for (i in aMenus) {
      for (j in DashboardRoutesNew) {
        if (
          !DashboardRoutesNew[j].redirect &&
          DashboardRoutesNew[j].name === aMenus[i].label
        ) {
          let { name, componentType, childs, label } = aMenus[i];
          DashboardRoutesNew[j].displayName = label;
          DashboardRoutesNew[j].childs = childs;
          DashboardRoutesNew[j].multilevel = componentType === "list";
          /* HARDCODING ON HOME since not available in API */
          /* if(name === 'Home'){
						DashboardRoutes[j].multilevel = false;
					} */
          aFinalRoutes.push(DashboardRoutesNew[j]);
          break;
        }
      }
      if (aMenus.length === aFinalRoutes.length) {
        break;
      }
    }
    setMenus(aFinalRoutes);
  };

  const toggleDrawer = (isClicked, isOpen) => {
    setState({
      drawerOpen: isOpen,
      isClicked: isClicked,
    });
  };

  const closeDrawer = (close) => {
    setState({
      drawerOpen: close,
      isClicked: false,
    });
  };

  return (
    <div className="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show">
      {/* <Loader isLoading={loading} /> */}
      <HeaderNew
        toggleDrawer={(isClicked, isOpen) => toggleDrawer(isClicked, isOpen)}
      ></HeaderNew>
      {window.document.body.clientWidth < 800 || window.cordova ? 
          <SidebarNew
            drawerOpen={state["drawerOpen"]}
            isClicked={state["isClicked"]}
            closeDrawer={() => closeDrawer(false)}
            style={{
              backgroundColor: "#fff",
              flexGrow: 1,
              padding: 20,
              borderLeft: "1px solid white",
            }}
          />
          :<></>
    }
      {/* {!loading && ( */}
        <div className="app-body">
          {/* <SideBar menus={menus} className={sideBarClass} /> */}
          <main className={`main ${sideBarClass}`}>
            <Switch>{getMenuRoutes()}</Switch>
          </main>
        </div>
      {/* )} */}
    </div>
  );
};
const mapStateToProps = ({ communityData }) => {
  return {};
};

export default connect(mapStateToProps, null)(Layout);
