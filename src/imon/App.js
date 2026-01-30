import React, { Component } from 'react';
import { BrowserRouter, HashRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import { createBrowserHistory, createHashHistory } from "history";
import './App.css';
import { connect } from "react-redux";
import RouteWithSubRoutes from './router/RouteWithSubRoutes';
import LoginRoutes from './router/LoginRoutes';
import Services from "./api/api";
import OffileDb from './config/pouchDB';
import { createStore } from 'redux';
import reducer from './redux/reducers/appReducer';
const store = createStore(reducer);
const loading = <div className="loading"></div>;

const customHistory = createHashHistory();

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      templateID: 1,
      redirectTo: '',
      isLoading: false
    };
  }

  componentDidMount() {
    //this.getApptempaleID()  
    this.checkIfCommunityConfigured();
  }

  UNSAFE_componentWillMount() {
    customHistory.listen((location, action) => {
      //this.getAppLogos();
    });
  }

  checkIfCommunityConfigured() {
    const myState = store.getState();
    if (myState.communityId) {
    } else {
      this.setState({ redirectTo: '/CommunityList' })
    }
  }

  getApptempaleID() {
    if (navigator.onLine) {
      var param = {
        communityId: localStorage.getItem("CommunityId"),
      };
      Services.getTemplatesByCommunityId(param).then((res) => {
        console.log(res)
        if (res.status == 200) {
          console.log(res.data.data.templateList)
          var tempobj = res.data.data.templateList.filter(obj => obj.isDefault == true)[0]['templateId']
          this.setState({ templateID: tempobj })
          //localStorage.setItem('templateID', tempobj)
          console.log(tempobj)
        }
      })
    }
  }

  getContentListByCommunityId() {
    if (navigator.onLine) {
      var param = {
        communityId: localStorage.getItem("CommunityId"),
      };
      Services.contentListByCommunityId(param).then((res) => {
        console.log(res)
        if (res.status == 200) {
          console.log(res.data.data.templateList)
          var tempobj = res.data.data.templateList.filter(obj => obj.isDefault == true)[0]['templateId']
          this.setState({ templateID: tempobj })
          console.log(tempobj)
        }
      })
    }
  }

  getAppLogos() {
    var that = this;
    OffileDb.getData('applogos').then(function (result) {
      if (result.status && result.status == 404) {
        if (navigator.onLine) {
          var param = {
            communityId: localStorage.getItem("CommunityId"),
          };
          Services.getCommunityBrandingByCommunityId(param).then((res) => {
            if (res.status == 200) {
              OffileDb.setData('applogos', res.data.data)
            }
          })
        }
      }
    });
  }

  render() {
    var tempid = localStorage.getItem('templateID') || 1;
    return (
      <HashRouter history={customHistory}>
        {
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return (
                  <Redirect to={this.state.redirectTo} />
                )
              }}
            />
            {LoginRoutes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        }
      </HashRouter>
    );
  }
}


const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    templateID: storeState.templateID,
    langId: storeState.langId,
  };
};
// export default connect(mapStateToProps, {})(NetworkDetector(App));
export default connect(mapStateToProps, {})(App);
//export default App;
