import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import NewHomePage from "../pages/home/NewHomePage";
import SearchCases from "../pages/search/Search";
import Cases from "../pages/cases/Cases";
import TaskList from "../pages/tasklist/TaskList"
import Registration from "../pages/registration/Registration";
import SeeIndividualRecord from "../pages/seeIndividualRecord/SeeIndividualRecord";
import AlertsPage from "../pages/alerts/Alerts";
import ReferralCases from "../pages/referralCases/ReferralCases";
import DataEntry from "../pages/dataEntry/DataEntry"
import TransferIn from "../pages/transferIn/trasferInList"
import TransferOut from "../pages/transferOut/trasferOutList"
import ReferedCase from "../component/referedCases/ReferedCase";
import Survey from '../pages/dataEntry/Survey'
import SurveyListing from '../pages/dataEntry/SurveyListing'
import Settings from '../pages/settings/Settings'
import Prescreen from '../pages/prescreening/Prescreen'

import Tasklistlayout from "../pages/template/tasklistlayout";
import Tutoriallayout from "../pages/template/tutoriallayout";
import Alertslayout from "../pages/template/alertslayout";
import Sectionlayout from "../pages/template/sectionlayout";
import Sectiontablelayout from "../pages/template/sectiontablelayout";
// import LanguageSelection from "../pages/language/Languages";
import IndividualCases from "../pages/individualCases/IndividualCases";
import offlineCases from "../pages/offlineCases/Cases";
import OfflineDb from "../db";



// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.
const routes = [
  // {
  //   path: "/layout/selectlanguage",
  //   name: "selectlanguage",
  //   displayName: "selectlanguage",
  //   component: LanguageSelection,
  // },
  {
    path: "/layout/home",
    name: "home",
    displayName: "home",
    component: NewHomePage,
  },
  {
    path: "/layout/search",
    name: "search",
    displayName: "search",
    component: SearchCases,
  },
  {
    path: "/layout/cases",
    name: "cases",
    displayName: "cases",
    component: Cases,
  },
  {
    path: "/layout/registration",
    name: "registration",
    displayName: "registration",
    component: Registration,
  },
  {
    path: "/layout/individualrecord",
    name: "SeeIndividualRecord",
    displayName: "SeeIndividualRecord",
    component: SeeIndividualRecord,
  },
  {
    path: "/layout/referedcase",
    name: "referedcase",
    displayName: "referedcase",
    component: ReferedCase,
  },
  {
    path: "/layout/referral",
    name: "referral",
    displayName: "referral",
    component: ReferralCases,
  },
  {
    path: "/layout/alerts",
    name: "alerts",
    displayName: "alerts",
    component: AlertsPage,
  },
  {
    path: "/layout/individual-cases-list",
    name: "IndividualCases",
    displayName: "IndividualCases",
    component: IndividualCases,
  },
  {
    path: "/layout/offline-clients",
    name: "OfflineCilents",
    displayName: "OfflineCilents",
    component: offlineCases,
  },
  {
    path: "/layout/dataentry",
    name: "DataEntry",
    displayName: "DataEntry",
    component: DataEntry,
  },
  {
    path: "/layout/transferIn",
    name: "TransferIn",
    displayName: "TransferIn",
    component: TransferIn,
  },
  {
    path: "/layout/transferOut",
    name: "TransferOut",
    displayName: "TransferOut",
    component: TransferOut,
  },
  {
    path: "/layout/survey",
    name: "Survey",
    displayName: "Survey",
    component: Survey,
  },
  {
    path: "/layout/surveylisting",
    name: "SurveyListing",
    displayName: "SurveyListing",
    component: SurveyListing,
  },
  {
    path: "/layout/tasklist",
    name: "tasklist",
    displayName: "tasklist",
    component: TaskList,
  },
  {
    path: "/layout/settings",
    name: "tasklist",
    displayName: "tasklist",
    component: Settings,
  },
  {
    path: "/layout/prescreen",
    name: "prescreening",
    displayName: "prescreening",
    component: Prescreen,
  },
 

  {
  redirect: true,
    // default: "/layout/home",
    to: '/layout/home',
      path: "/",
        name: "home",
          displayName: "home",
    // component: NewHomePage,
  },
];

export default routes;
