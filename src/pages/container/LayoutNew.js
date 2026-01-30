import React, { Component, Suspense, lazy } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
  import { useHistory } from "react-router-dom";
import HeaderNew from '../../component/layout/HeaderNew';
import SidebarNew from '../../component/layout/SidebarNew';
import RouteWithSubRoutes from '../../router/RouteWithSubRoutes';
import dashboardRoutes from '../../router/dashboardroutes';
import newThemeRoutes from '../../router/newthemeroutes';
import {Configuration} from '../../assets/data/config'

const LayoutNew = () => {
    const history = useHistory();
	const [state, setState] = React.useState({
	    drawerOpen: false,
	    isClicked: false,
	 });

	const toggleDrawer = (isClicked, isOpen) => {
		
		setState({
			drawerOpen: isOpen,
			isClicked: isClicked
		})  
	}

	const closeDrawer = (close) => {
		setState({
			drawerOpen: close,
			isClicked: false
		})
    }

    function onUserNavigate() {
        
    }
    
    
    // if(localStorage.getItem('userBO') == null) {
        
    //     history.push("/login")
    //     return <> </>
    // } else {
        return (
            <Suspense fallback={<div>Loading...</div>}>
            <Router basename="/webapp" onEnter={onUserNavigate()}
                            onChange={onUserNavigate()}>
                    <HeaderNew toggleDrawer={(isClicked, isOpen) => toggleDrawer(isClicked, isOpen)}></HeaderNew> 
                    <SidebarNew 
                        drawerOpen={state['drawerOpen']} 
                        isClicked={state['isClicked']}
                        closeDrawer={() => closeDrawer(false)}
                        style={{
                            backgroundColor: '#fff',
                            flexGrow: 1,
                            padding: 20,
                            borderLeft: '1px solid white',
                        }}
                    />
                    
                    <Switch>
                        {
                            Configuration.theme.name == 'Template1' ?
                            dashboardRoutes.map((route, index) => (
                        // You can render a <Route> in as many places
                        // as you want in your app. It will render along
                        // with any other <Route>s that also match the URL.
                        // So, a sidebar or breadcrumbs or anything else
                        // that requires you to render multiple things
                        // in multiple places at the same URL is nothing
                        // more than multiple <Route>s.
                        
                        <Route
                            exact
                            key={index}
                            path={route.path}
                            component={route.component}
                            onEnter={onUserNavigate()}
                            onChange={onUserNavigate()}
                        />
                            )): newThemeRoutes.map((route, index) => (
                                // You can render a <Route> in as many places
                                // as you want in your app. It will render along
                                // with any other <Route>s that also match the URL.
                                // So, a sidebar or breadcrumbs or anything else
                                // that requires you to render multiple things
                                // in multiple places at the same URL is nothing
                                // more than multiple <Route>s.
                                
                                <Route
                                    exact
                                    key={index}
                                    path={route.path}
                                    component={route.component}
                                    onEnter={onUserNavigate()}
                                    onChange={onUserNavigate()}
                                />
                                ))
                    }
                    </Switch>
                    
                </Router>
                </Suspense>
                )
    // }

	
}
export default LayoutNew;