import {
  faFilter,
  faUserEdit,
  faBell,
  faBook,
  faHdd,
  faHome,
  faUserPlus,
  faSearch,
  faBullhorn,
  faUsers,
  faEdit,
  faCog,
  faSignOutAlt,
  faShareSquare,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
const OUCountryId = "YUv0ube9634";
export const APP_LOCALE = "PRODUCT";
export const Configuration = {
  mobileAppVersion: "1.3.0",
  mobileAppMode: "debug",
  mobileAppDownloadUrl:
    "YOUR_GOOGLE_APP_URL", 
  mobileAppiOSUrl: "YOUR_APPLE_APP_URL", 
  apiService: {
    key: "https://your-server-url/api" 
  },
  apiSurvey: {
    key: "https://your-server-url/service/" 
  },
  baseUrl: "https://your-server-url/", 
  programname: "TPT",
  basename: "cdicv2",
  OUCountryId: "mqpu9Wy05Nk",
  searchbarfielduid: "MbaoNscs6dW",
  language: {
    languageList: [
      {
        name: "English",
        value: "en",
      },
      {
        name: "Persian",
        value: "fa",
      },
      {
        name: "Pashto",
        value: "ps",
      },
    ],
  },
  homepage: {
    pageTitle: "",
    pageSubtitle: "",
    metaDataParam:
      "metadata?fields=:owner,displayName,description&programs:fields=:owner,displayName,description,attributeValues[:all,attribute[id,name,displayName,description,formName]],organisationUnits[id,path,displayName,description,level],dataEntryForm[:owner],programSections[id,name,displayName,formName,description,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,formName,description,code,sortOrder,attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,formName,description,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,description,translations[*],style]],attributeValues[:all,attribute[id,name,displayName,description]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,displayName,description,attributeValues[:all,attribute[id,name,displayName,description]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,description,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName,description]],optionSet[id,options[id,code,displayName,description,translations[*],%20style]],domainType]],notificationTemplates[:owner,displayName,description],dataEntryForm[:owner],programStageSections[:owner,displayName,description,translations[*],dataElements[id,displayName,description]]]&dataElements:fields=id,displayName,formName,description,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,formName,description,valueType,optionSet[id,options[id,code,displayName,description,style]],unique",
    // "metaDataParam": 'metadata?fields=:owner,displayName&programs:fields=:owner,displayName,attributeValues[:all,attribute[id,name,displayName]],organisationUnits[id,path,displayName,level],dataEntryForm[:owner],programSections[id,name,displayName,translations[*],renderType,program,sortOrder,lastUpdated,trackedEntityAttributes[id,name,displayName,formName,sortOrder,attributeValues[:all,attribute[id,name,displayName]],optionSet[id]]],notificationTemplates[:owner],programTrackedEntityAttributes[:owner,renderType,trackedEntityAttribute[id,displayName,formName,translations[*],valueType,unique,optionSet[id,options[id,code,displayName,translations[*],style]],attributeValues[:all,attribute[id,name,displayName]],domainType]],user[id,name],programStages[:owner,user[id,name],userAccesses,displayName,attributeValues[:all,attribute[id,name,displayName]],programStageDataElements[:owner,renderType,unique,dataElement[id,displayName,formName,displayFormName,unique,valueType,fieldMask,translations[*],attributeValues[:all,attribute[id,name,displayName]],optionSet[id,options[id,code,displayName,translations[*], style]],domainType]],notificationTemplates[:owner,displayName],dataEntryForm[:owner],programStageSections[:owner,displayName,translations[*],dataElements[id,displayName]]]&dataElements:fields=id,displayName,valueType,translations[*],optionSet&dataElements:filter=domainType:eq:TRACKER&trackedEntityAttributes:fields=id,displayName,valueType,optionSet[id,options[id,code,displayName,style]],unique',
    relationshipTypeParam:
      "relationshipTypes.json?paging=false&fields=id,code,displayName,bidirectional,fromToName,toFromName,fromConstraint[*],toConstraint[*],access[*]",
    DEGParams:
      "dataElementGroups?filter=name:ne:default&fields=displayName,translations[*],shortName,description,id,lastUpdated,created,displayDescription,code,publicAccess,access,href,level,displayName,publicAccess,lastUpdated,dataElements[id,displayName]&paging=false",
    OUGroupParam:
      "organisationUnitGroups?filter=name:ne:default&fields=displayName%2CshortName%2Cid%2ClastUpdated%2Ccreated%2CdisplayDescription%2Ccode%2CpublicAccess%2Caccess%2Chref%2Clevel%2CdisplayName%2CpublicAccess%2ClastUpdated%2C&order=displayName%3AASC",
    programRuleVariableParam:
      "programRuleVariables?fields=id,displayName,programRuleVariableSourceType,program[id],programStage[id],dataElement[id],trackedEntityAttribute[id],useCodeForOptionSet&paging=false",
    dataSets:
      "dataSets?filter=name:ne:default&fields=version,displayName,id,periodType,translations[*],compulsoryDataElementOperands[id,dataElement[id],categoryOptionCombo[id]],mobile,dataSetElements[id,dataSet,periodType,compulsoryDataElementOperands[id,dataElement[id],categoryOptionCombo[id]],dataElement[translations[*],id,displayName,formName,valueType,attributeValues[:all,attribute[id,name,displayName]],compulsoryDataElementOperands[id,dataElement[id],categoryOptionCombo[id]],optionSet[translations[*],id,displayName,formName,options[translations[*],id,displayName,formName,code]],commentOptionSet[translations[*],id,displayName,formName,options[translations[*],id,displayName,formName,code]]]],sections[:all,dataElements[translations[*],id,displayName,formName,valueType,compulsoryDataElementOperands[id,dataElement[id],categoryOptionCombo[id]],optionSet[translations[*],id,displayName,formName,options[translations[*],id,displayName,formName,code]]]&paging=false",
    OUStrutureParams:
      "organisationUnits/" +
      OUCountryId +
      "?includeDescendants=true&paging=false&fields=id,level,name,displayFormName,children,comment",
    dataSetValidations:
      "29/validationRules?filter=name:ne:default&fields=:all,displayName,shortName,id,lastUpdated,created,displayDescription,code,publicAccess,access,href,level,displayName,importance,periodType,publicAccess,lastUpdated&order=displayName:ASC",
    gridCount: 2,
    menuItems: [
      {
        name: "Add New Client",
        icon: faUserEdit,
        path: "/layout/registration",
        showMenu: true,
        iconClass: "addclientmenubg",
      },
      {
        name: "Search",
        icon: faFilter,
        path: "/layout/search",
        showMenu: true,
        iconClass: "searchbg",
      },
      {
        name: "Alerts",
        icon: faBell,
        path: "/layout/alerts",
        showMenu: true,
        iconClass: "alertbg",
      },
      /*{
          "name": "Task List",
          "icon": faListUl,
          "path": "/layout/tasklist",
          "showMenu": true,
          "iconClass":"mytasksmenubg"
        },*/
      {
        name: "Patient Record List",
        icon: faUsers,
        path: "/layout/cases",
        showMenu: true,
        iconClass: "myclientsmenubg",
      },
      /*{
          "name": "Get Knowledge",
          "icon": faBook,
          "path": "/template/tutoriallayout",
          "showMenu": false,
          "iconClass":"tutorialmenubg"
        },*/
      {
        name: "Referral Cases",
        icon: faShareSquare,
        path: "/layout/referral",
        showMenu: true,
        iconClass: "referalbg",
      },
      /*{
          "name": "Data Entry",
          "icon": faEdit,
          "path": "/layout/dataentry",
          "showMenu": false,
          "iconClass":"databg"
        },*/
      {
        name: "Transfer In",
        icon: faExchangeAlt,
        path: "/layout/transferin",
        showMenu: true,
        iconClass: "transferIn",
      },
      {
        name: "Transfer Out",
        icon: faExchangeAlt,
        path: "/layout/transferout",
        showMenu: true,
        iconClass: "transferOut",
      },
    ],
    footerMenuItems: [
      {
        name: "Add New Client",
        icon: faUserEdit,
        path: "/layout/registration",
        showMenu: true,
        showInFooter: true,
        iconClass: "addclientmenubg",
      },
      {
        name: "Search",
        icon: faFilter,
        path: "/layout/search",
        showMenu: true,
        showInFooter: true,
        iconClass: "searchbg",
      },
      {
        name: "Patient Record List",
        icon: faUsers,
        path: "/layout/cases",
        showMenu: true,
        showInFooter: true,
        iconClass: "myclientsmenubg",
      },
      {
        name: "Dashboard",
        icon: faHome,
        path: "/layout/home",
        showMenu: false,
        showInFooter: true,
        iconClass: "dashboardmenubg",
      },
    ],
  },
  searchpage: {
    pageTitle: "Search",
    tabsList: [
      {
        name: "Profile",
        icon: "",
        showMenu: true,
      },
      {
        name: "UIC",
        icon: "",
        showMenu: true,
      },
      {
        name: "QR Scan",
        icon: "",
        showMenu: false,
      },
      {
        name: "Specimen",
        icon: "",
        showMenu: true,
      },
    ],
    searchby: {
      stagename: "Sample Collection",
      dataelement: "Specimen ID",
    },
  },
  registrationForm: {
    deDupEnabled: false,
    searchEnabled: true,
    linkEnabled: true,
    linkContactInAlert: false,
    showOCR: true,
    defaultTabOnSearchEnable: ["Search", "Registration"],
    googleLocationLatLngFeilds: {
      aWsWL2XZDfj: { lat: "axBJbUKhB7K", lng: "XTQznFGofCO" },
    },
  },
  sidebar: {
    menuItems: [
      {
        name: "Home",
        icon: faHome,
        path: "/layout/home",
        showMenu: true,
      },
      {
        name: "Add New Client",
        icon: faUserPlus,
        path: "/layout/registration",
        showMenu: true,
      },
      {
        name: "Search",
        icon: faSearch,
        path: "/layout/search",
        showMenu: true,
      },
      {
        name: "Alerts",
        icon: faBullhorn,
        path: "/layout/alerts",
        showMenu: true,
      },
      /*{
          "name": "Task List",
          "icon": faFileAlt,
          "path": "/layout/tasklist",
          "showMenu": true
        },*/
      {
        name: "Patient Record List",
        icon: faUsers,
        path: "/layout/cases",
        showMenu: true,
      },
      {
        name: "Get Knowledge",
        icon: faBook,
        path: "/template/tutoriallayout",
        showMenu: false,
      },
      {
        name: "Referral Cases",
        icon: faEdit,
        path: "/layout/referral",
        showMenu: true,
      },
      {
        name: "Offline Client",
        icon: faHdd,
        path: "/layout/offline-clients",
        showMenu: true,
      },
      {
        name: "Settings",
        icon: faCog,
        path: "/layout/settings",
        showMenu: true,
      },
      {
        name: "Logout",
        icon: faSignOutAlt,
        path: "",
        showMenu: true,
      },
    ],
  },
  ltbiLinkVariables: {
    index: "Index",
    contact: "Contact",
    presumptivetb: "Presumptive TB",
  },
  theme: {
    name: "Template2",
    Template1: [
      { className: "theme_grey", name: "Grey" },
      { className: "theme_blue", name: "Blue" },
      { className: "theme_green", name: "Green" },
      { className: "theme_red", name: "Red" },
    ],
    Template2: [
      { className: "theme_amber", name: "Amber" },
      { className: "theme_purple", name: "Purple" },
      { className: "theme_lightgreen", name: "Light Green" },
      { className: "theme_orange", name: "Orange" },
      { className: "theme_pink", name: "Pink" },
      { className: "theme_royalblue", name: "Blue" },
    ],
  },
  offline: {
    storagelimit: 50,
  },
  treatmentRegimens: [
    {
      phase: "Initial phase",
      code: "Regimen 1 - Child (Fixed)",
      associatedFieldName: "Fixed dose (Children) - Initial",
    },
    {
      phase: "Continuation phase",
      code: "Regimen 1 - Child (Fixed)",
      associatedFieldName: "Fixed dose (Children) - Continuation",
    },

    {
      phase: "Initial phase",
      code: "Regimen 1 - Child (Single dose)",
      associatedFieldName: "Single dose (children) - Initial",
    },
    {
      phase: "Continuation phase",
      code: "Regimen 1 - Child (Single dose)",
      associatedFieldName: "Single dose (children) - Continuation",
    },

    {
      phase: "Initial phase",
      code: "Regimen 1 - Adult (Fixed dose)",
      associatedFieldName: "Fixed dose (Adult) - Initial",
    },
    {
      phase: "Continuation phase",
      code: "Regimen 1 - Adult (Fixed dose)",
      associatedFieldName: "Fixed dose (Adult) - Continuation",
    },

    {
      phase: "Initial phase",
      code: "Regimen 2 - Short term regimen",
      associatedFieldName: "Short-term Regimen - Initial",
    },
    {
      phase: "Continuation phase",
      code: "Regimen 2 - Short term regimen",
      associatedFieldName: "Short-term Regimen - Continuation",
    },

    {
      phase: "Initial phase",
      code: "Regimen 2 - Long term regimen",
      associatedFieldName: "Long-term Regimen - Initial",
    },
    {
      phase: "Continuation phase",
      code: "Regimen 2 - Long term regimen",
      associatedFieldName: "Long-term Regimen - Continuation",
    },

    {
      phase: "Initial phase",
      code: "Regimen 2 - Fluoroquinolones resistant MDR & XDR TB",
      associatedFieldName:
        "Fluoroquinolones resistant MDR TB & XDR TB - Initial",
    },
    {
      phase: "Continuation phase",
      code: "Regimen 2 - Fluoroquinolones resistant MDR & XDR TB",
      associatedFieldName:
        "Fluoroquinolones resistant MDR TB & XDR TB - Continuation",
    },
  ],
  pagination: {
    itemsPerPage: 20,
    fetchNoOfRecords: 100,
  },
  hidenewservicebutton: {
    "Sample Collection": true,
  },
  hideformhistoryaccordian: {
    "Sample Collection": true,
  },
};

export const patchConfigurationWithRuntime = () => {
  const runtime = window.RUNTIME_CONFIG || {};
  if (!runtime || Object.keys(runtime).length === 0) return;

  Configuration.apiService.key = runtime.apiServiceKey || Configuration.apiService.key;
  Configuration.apiSurvey.key = runtime.apiSurveyKey || Configuration.apiSurvey.key;
  Configuration.basename = runtime.basename || Configuration.basename;
  Configuration.baseUrl = runtime.baseUrl || Configuration.baseUrl;

  // Add similar patches as needed
};
