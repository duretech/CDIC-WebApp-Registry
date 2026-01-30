
import Login from '../pages/login/Login';
import LanguageSelection from "../pages/language/Languages";
import Home from '../pages/home/Home';
import Registration from '../pages/registration/Registration';
//import Layout from '../pages/container/layout';
import LayoutNew from '../pages/container/LayoutNew';
/** DESIGN TEMPLATE */
import Form from '../pages/template/Form';
import MainPage from '../pages/template/Home';
import SearchCase from '../pages/template/SearchCasesPage';
import LineList from '../pages/template/linelist';
import TaskList from '../pages/template/tasklist';
import DrawerLayoutPage from '../pages/template/drawerlayout';
import HomePage from '../pages/template/homepage';
import Homenewlayout from '../pages/template/homenewlayout';
import Registrationnewlayout from '../pages/template/registrationnewlayout';
import Casesnewlayout from '../pages/template/casesnewlayout';
import Homenewlayoutlight from '../pages/template/homenewlayoutlight';
import Servicecardnewlayout from '../pages/template/servicecardnewlayout';
import Tasklistlayout from '../pages/template/tasklistlayout';
import Tutoriallayout from '../pages/template/tutoriallayout';
import Alertslayout from '../pages/template/alertslayout';
import Alertssimple from '../pages/template/alertssimple';
import Disclaimerpage from '../pages/template/disclaimerpage';
import PrivacyPolicy from '../pages/login/PrivacyPolicy';
import UserConsent from '../pages/login/UserConsent';


/** */

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.
const routes = [
    {
      path: "/login",
      name: "Login",
      displayName: "Login",
      component: Login
    },
    {
      path: "/selectlanguage",
      name: "selectlanguage",
      displayName: "selectlanguage",
      component: LanguageSelection,
    },
    {
      path: "/disclaimerpage",
      name: "disclaimerpage",
      displayName: "disclaimerpage",
      component: Disclaimerpage,
    },
    
    {
      redirect: true, 
       path: "/", 
       to: "/login", 
      // name: "Login" 

      //default: "/",
      name: "Login",
      displayName: "Login",
      component: Login,
    },
    {
      path: "/privacy-policy",
      name: "privacypolicypage",
      displayName: "privacypolicypage",
      component: PrivacyPolicy,
    },
    {
      path: "/user-consent",
      name: "consentpage",
      displayName: "consentpage",
      component: UserConsent,
    },
    
];

export default routes;