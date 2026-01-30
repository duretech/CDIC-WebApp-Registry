import Onboarding from '../pages/onboarding/Onboarding';
import Login from '../pages/login/NewThemeLogin';
import LanguageSelection from "../pages/language/NewThemeLanguages";
import Disclaimerpage from '../pages/template/disclaimerpage';
import NewLoginPage from "../pages/template/newLoginPage";
import NewLoginPageSec from "../pages/template/newLoginPageSec";
import NewLoginPageDesc from "../pages/template/newLoginPageDesc";
import NewSelectLanguagePage from "../pages/template/newSelectLanguagePage";
import NewHomePage from "../pages/template/newHomePage";
import PhoneNumberLogin from "../pages/phonenumberlogin/PhoneNumberLogin"
import GuestLanguageSelection from "../imon/components/GuestLanguageSelect/GuestLanguageSelection"
import Userselection from '../pages/home/Userselect';
import Terms from '../pages/terms/termsConditions.js'
import Termspatient from '../pages/terms/termsCondpatient'
import Userprofile from "../pages/profile/userProfile";
import ImonHomePage from '../pages/home/ImonHomePage';
import MyJourney from '../pages/certificates/myjourney'
import Patientadherence from '../pages/certificates/Patientadherence';
import Historypatient from '../pages/certificates/patientHistory';
import Registration from "../pages/registration/NewThemeRegistration";
import RenderStage from '../pages/renderStage/RenderStage'
// import ChatContainer from '../imon/components/Chat/ChatContainer';
// import ChatWindow from '../imon/components/Chat/ChatWindow';
// import Chat from '../imon/components/Chat/Chat';
import Getaccess from '../imon/components/Nearme/Access'
import Eduandknow from '../imon/components/govern/EduandKnow';
import EnterToken from '../pages/mfa/enterToken';
import GeneratePin from '../pages/mfa/generatePin';
import EnterPin from '../pages/mfa/enterPin';
import CheckPin from '../pages/mfa/pinCheck';
import PrivacyPolicy from '../pages/login/PrivacyPolicy';
import UserConsent from '../pages/login/UserConsent.js';
import Settings from '../pages/settings/Settings.js';
const routes = [
  // {
  //   path: "/layout/getknowledgeable",
  //   name: "Get knowledgeable",
  //   displayName: "getknowledgeable",
  //   component: Eduandknow
  // },
  // {
  //   path: "/layout/peerchat",
  //   name: "Chat List",
  //   displayName: "chatlist",
  //   // component: ChatContainer
  // },
  // {
  //   path: "/layout/nearme",
  //   name: "Get Access",
  //   displayName: "Getaccess",
  //   component: Getaccess
  // },
  // {
  //   path: "/layout/chatwindow",
  //   name: "Chat",
  //   displayName: "chat",
  //   // component: ChatWindow
  // },
  // {
  //   path: "/layout/switch-to-peer",
  //   name: "Chat",
  //   displayName: "chat",
  //   // component: ChatWindow
  // },
  {
    path: "/onboarding",
    name: "Onboarding",
    displayName: "Onboarding",
    component: Login
  },
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
        path: "/settings",
        name: "tasklist",
        displayName: "tasklist",
        component: Settings,
      },
    {
      path: "/disclaimerpage",
      name: "disclaimerpage",
      displayName: "disclaimerpage",
      component: Disclaimerpage,
    },
    {
      path: "/template/newLoginPage",
      name: "newLoginPage",
      displayName: "newLoginPage",
      component: NewLoginPage,
    },
    {
      path: "/template/newLoginPageSec",
      name: "newLoginPageSec",
      displayName: "newLoginPageSec",
      component: NewLoginPageSec,
    },
    {
      path: "/template/newLoginPageDesc",
      name: "newLoginPageDesc",
      displayName: "newLoginPageDesc",
      component: NewLoginPageDesc,
    },
    {
      path: "/template/newSelectLanguagePage",
      name: "newSelectLanguagePage",
      displayName: "newSelectLanguagePage",
      component: NewSelectLanguagePage,
    },
    {
      path: "/template/newhomepage",
      name: "newHomePage",
      displayName: "newHomePage",
      component: NewHomePage,
    },
    {
      path: "/phonenumberlogin",
      name: "PhoneNumberLogin",
      displayName: "PhoneNumberLogin",
      component: PhoneNumberLogin,
    },
    {
      path: "/guestselectlanguage",
      name: "guestselectlanguage",
      displayName: "guestselectlanguage",
      component: GuestLanguageSelection,
    },
    {
      path: "/terms",
      name: "Terms",
      displayName: "Terms",
      component: Terms,
    },
    {
      path: "/termspatient",
      name: "Termspatient",
      displayName: "Termspatient",
      component: Termspatient,
    },
    {
      path: "/Userprofile",
      name: "Userprofile",
      displayName: "Userprofile",
      component: Userprofile,
    },
    {
      path: "/enterToken",
      name: "enterToken",
      displayName: "enterToken",
      component: EnterToken,
    },
    {
      path: "/generatePin",
      name: "generatePin",
      displayName: "generatePin",
      component: GeneratePin,
    },
    {
      path: "/enterPin",
      name: "enterPin",
      displayName: "enterPin",
      component:EnterPin,
    },
    {
      path: "/checkPin",
      name: "checkPin",
      displayName: "checkPin",
      component:CheckPin,
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
    // {
    //   path: "/layout/imonhome",
    //   name: "imonhome",
    //   displayName: "imonhome",
    //   component: ImonHomePage,
    // },
    // {
    //   path: "/myjourney",
    //   name: "MyJourney",
    //   displayName: "MyJourney",
    //   component: MyJourney,
    // },
    // {
    //   path:"/layout/adherence",
    //   name:'patientadherence',
    //   displayName:'patientadherence',
    //   component:Patientadherence
    // },
    // {
    //   path: "/historypatient",
    //   name: "Historypatient",
    //   displayName: "Historypatient",
    //   component: Historypatient,
    // },
    // {
    //   path: "/layout/registration",
    //   name: "registration",
    //   displayName: "registration",
    //   component: Registration,
    // },
    // {
    //   path:"/layout/renderstage",
    //   name:'renderstage',
    //   displayName:'renderstage',
    //   component:RenderStage
    // },
    // {
    //   redirect: true, 
    //    path: "/", 
    //    to: "/login", 
    //   // name: "Login" 

    //   //default: "/",
    //   name: "Login",
    //   displayName: "Login",
    //   component: Login,
    // },
    {
      redirect: true, 
       path: "/", 
       to: "/onboarding", 
      // name: "Login" 

      //default: "/",
      name: "Onboarding",
      displayName: "Onboarding",
      component: Onboarding,
    }
    
];

export default routes;