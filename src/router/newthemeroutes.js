import React from "react";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import NewHomePage from "../pages/home/NewThemeHomePage";
import SearchCases from "../pages/search/NewThemeSearch";
import Cases from "../pages/cases/NewThemeCases";
import TaskList from "../pages/tasklist/NewThemeTaskList"
import Registration from "../pages/registration/NewThemeRegistration";
import SeeIndividualRecord from "../pages/seeIndividualRecord/SeeIndividualRecord";
import AlertsPage from "../pages/alerts/NewThemeAlerts";
import ReferralCases from "../pages/referralCases/NewThemeReferralCases";
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

import CasesList from "../pages/casesList/NewThemeCases";
import HomepageContainer from '../pages/home/HomepageContainer';

import MyJourney from '../pages/certificates/myjourney'
import Patientadherence from '../pages/certificates/Patientadherence';
import Historypatient from '../pages/certificates/patientHistory';
import Getaccess from '../imon/components/Nearme/Access'
import Eduandknow from '../imon/components/govern/EduandKnow';
import NewKnowledge from '../imon/components/Knowledge/NewKnowledge';
import ChatContainer from '../imon/components/Chat/ChatContainer';
import ChatContainerFuncComp from '../imon/components/Chat/ChatContainerFuncComp';
import Chat from '../imon/components/Chat/Chat';
import ChatWindow from '../imon/components/Chat/ChatWindow';
import GroupChatList from '../imon/components/Chat/GroupChatList';
import WidgetList from "../widgets/WidgetList";
import TreatmentStatus from "../widgets/TreatmentStatus";
import BMICalculator from "../widgets/BMICalculator";
import Diseaseadvpro from "../imon/components/govern/Diseaseadv";
import Pdfrender from '../imon/components/govern/Pdfrender';
import PatientCard from "../pages/patientcard/PatientCard";
import WaitingIn from "../pages/transferIn/waitinginList";
import WaitingOut from "../pages/transferOut/waitingoutList";
import ContactTaskList from "../pages/tasklist/ContactTaskList";
import AdherenceManagement from "../pages/adherenceManagement/AdherenceManagement";
import DeactivatedCases from "../pages/casesLineList/DeactivatedCasesList";
import CasesLineList from "../pages/casesLineList/CasesLineList";


import FacilityManagement from "../pages/facilitymanagement/FacilityManagement"
import StockManagement from "../pages/stockmanagement/StockManagement"
import EquipmentManagement from "../pages/equipmentmanagement/EquipmentManagement"
import Training from "../pages/training/Training"
import UserManagement from "../pages/usermanagement/UserManagement"
import Followup from "../pages/followup/followup";
import DatsetManagement from "../pages/dataEntry/DatsetManagement"

import Appointments from "../component/appointments/Appointments";
import PdfPreviewPage from "../component/pdfComponent/PdfPreviewPage";
import { useEffect } from "react";
import ExternalLink from "../component/help/ExternalLink";
import { Configuration } from "../../src/assets/data/config";

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
    component: HomepageContainer,//NewHomePage,
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
    path: "/layout/waitingIn",
    name: "WaitingIn",
    displayName: "WaitingIn",
    component: WaitingIn,
  },
  {
    path: "/layout/waitingOut",
    name: "WaitingOut",
    displayName: "WaitingOut",
    component: WaitingOut,
  },
  {
    path: "/layout/contactTaskList",
    name: "ContactTaskList",
    displayName: "ContactTaskList",
    component: ContactTaskList,
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
    path: "/layout/caseslist",
    name: "caseslist",
    displayName: "caseslist",
    component: CasesList,
  },
  {
    path: "/layout/patientcard",
    name: "patientcard",
    displayName: "patientcard",
    component: PatientCard,
  },
  {
    path: "/myjourney",
    name: "MyJourney",
    displayName: "MyJourney",
    component: MyJourney,
  },
  {
    path: "/layout/adherence",
    name: 'patientadherence',
    displayName: 'patientadherence',
    component: Patientadherence
  },
  {
    path: "/layout/adherenceMonitoring",
    name: 'adherenceManagement',
    displayName: 'adherenceManagement',
    component: AdherenceManagement
  },
  {
    path: "/historypatient",
    name: "Historypatient",
    displayName: "Historypatient",
    component: Historypatient,
  },
  {
    path: "/layout/getknowledgeable",
    name: "Get knowledgeable",
    displayName: "getknowledgeable",
    component: NewKnowledge
  },
  {
    path: '/layout/eduandknow',
    name: 'Eduandknow',
    component: Eduandknow
  },
  {
    path: "/layout/peerchat",
    name: "Chat List",
    displayName: "chatlist",
    // component: ChatContainer
    component: ChatContainerFuncComp
  },
  {
    path: "/layout/nearme",
    name: "Get Access",
    displayName: "Getaccess",
    component: Getaccess
  },
  {
    path: "/layout/chatwindow",
    name: "Chat",
    displayName: "chat",
    component: ChatWindow
  },
  {
    path: "/layout/switch-to-peer",
    name: "Chat",
    displayName: "chat",
    component: ChatWindow
  },
  {
    path: "/layout/widgetlist",
    name: "widgetlist",
    displayName: "widgetlist",
    component: WidgetList,
  },
  {
    path: "/layout/treatmentstatus",
    name: "treatmentstatus",
    displayName: "treatmentstatus",
    component: TreatmentStatus,
  },
  {
    path: "/layout/bmicalculator",
    name: "bmicalculator",
    displayName: "bmicalculator",
    component: BMICalculator,
  },
  {
    path: '/layout/diseaseadvpro',
    name: 'Diseaseadvpro',
    component: Diseaseadvpro
  },
  {
    path: '/layout/pdfrender',
    name: 'Pdfrender',
    component: Pdfrender
  },
  {
    path: "/layout/deactivatecases",
    name: "deactivatecases",
    displayName: "deactivatecases",
    component: DeactivatedCases,
  },
  {
    path: "/layout/linelist",
    name: "linelist",
    displayName: "linelist",
    component: CasesLineList,
  },
  {
    path: "/layout/facilitymanagement",
    name: "facilitymanagement",
    displayName: "facilitymanagement",
    component: FacilityManagement,
  },
  {
    path: "/layout/stockmanagement",
    name: "StockManagement",
    displayName: "StockManagement",
    component: StockManagement,
  },
  {
    path: "/layout/datasetmanagement",
    name: "DatsetManagement",
    displayName: "DatsetManagement",
    component: DatsetManagement,
  },
  {
    path: "/layout/equipmentmanagement",
    name: "EquipmentManagement",
    displayName: "EquipmentManagement",
    component: EquipmentManagement,
  },
  {
    path: "/layout/training",
    name: "Training",
    displayName: "Training",
    component: Training,
  },
  {
    path: "/layout/usermanagement",
    name: "UserManagement",
    displayName: "UserManagement",
    component: UserManagement,
  },
  {
    path: "/layout/followup",
    name: "followup",
    displayName: "followup",
    component: Followup,
  },
  {
    path: "/layout/appointment",
    name: "Appointments",
    displayName: "Appointments",
    component: Appointments,
  },
  {
    path: "/layout/help",
    name: "home",
    displayName: "home",
    isExternal: true,
    component: () => {
      const runtime = window.RUNTIME_CONFIG || {};
      const dynamicBaseUrl = runtime.baseUrl;
      return <ExternalLink url={`${dynamicBaseUrl}helpdocs/T1D_USER_MANUAL.pdf`} />;
    }
  },
  {
  path: "/layout/pdfpreview",
  name: "PdfPreview",
  displayName: "PdfPreview",
 
  component: PdfPreviewPage, // you’ll create this component below
},
  {
    redirect: true,
    // default: "/layout/home",
    to: '/layout/home',
    path: "/",
    name: "home",
    displayName: "home",
    // component: NewHomePage,
  }
 
];

export default routes;
