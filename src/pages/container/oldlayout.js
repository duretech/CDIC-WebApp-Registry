import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
//import Header from '../../pages/template/Header';
import Header from '../../component/layout/Header';
import Sidebar from '../../component/layout/Sidebar';
import RouteWithSubRoutes from '../../router/RouteWithSubRoutes';
import dashboardRoutes from '../../router/dashboardroutes';

class Layout extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Router>
                <Header /> 
                <Sidebar history={this.props.history}/>
                
                    <Switch>
                        {dashboardRoutes.map((route, index) => (
                        // You can render a <Route> in as many places
                        // as you want in your app. It will render along
                        // with any other <Route>s that also match the URL.
                        // So, a sidebar or breadcrumbs or anything else
                        // that requires you to render multiple things
                        // in multiple places at the same URL is nothing
                        // more than multiple <Route>s.
                        <Route
                            key={index}
                            path={route.path}
                            component={route.component}
                        />
                        ))}
                    </Switch>
                
            </Router>
        );
    }
}

export default Layout;