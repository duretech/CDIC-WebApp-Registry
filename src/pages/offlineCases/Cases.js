import React, { useState, useEffect } from "react";
import { apiServices } from "../../services/apiServices";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SyncIcon from "@material-ui/icons/Sync";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import {
  Button,
  ButtonStrip,
  Divider,
  InputFieldFF,
  SingleSelectFieldFF,
  ReactFinalForm,
  hasValue,
  InputField,
  CircularLoader,
  CenteredContent,
} from "@dhis2/ui";
import { withTranslation, Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import moment from "moment";

import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import { Configuration } from "../../assets/data/config";
import _ from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../../assets/css/customstyles.css";
//import "../../assets/css/theme_grey.css";
import "../../assets/css/theme_blue.css";
//import "../../assets/css/theme_green.css";
//import "../../assets/css/theme_red.css";
import FooterMenu from "../../component/layout/FooterMenu";

const { Form, Field } = ReactFinalForm;

const domain = ""; //Configuration.domain.key

//regex for checking valid uuid
const regexExp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

/**
 * error code for offline sync
 *
 * 101: save household
 * 102: save individual
 * 103: get household data
 * 104: update houshold for link contact
 * 105: get inidividual data
 * 106: get household relationships data
 * 107: get all children data
 * 108: update household for vulnerability score
 * 109: get relationship for individual
 * 110: get detail of houshold for index update
 * 111: get detail of household for index update
 * 112: get detail of all children for index update
 * 113: update individual to index
 * 114: get data of existing houshold
 * 115: update existing household
 * 116: adding new hh but fail with error 409 conflict, but more data present in list
 * 117: user creation failed
 */

const CONSTANT_FIELDID = {
  hhVulnerabilityScore: "C3kyKVIuJiv",
};

function Cases() {
  const [sessionUserBoValue, setsessionUserBoValue] = React.useState(null);
  const [programData, setprogramData] = useState(null);
  const [offlineRecords, setOfflineRecords] = useState([]);
  const [listOfFields, setListOfFields] = useState(null);
  const [fieldsToDisplay, setFieldsToDisplay] = useState([]);
  const [fileUploadFieldsIdsList, setFileUploadFieldsIdsList] = useState([]);
  // const [newIndividualArr, setnewIndividualArr] = useState([])
  const [currentGeolocation, setCurrentGeoLocation] = useState({
    lat: -8.564650316988002,
    lng: 125.57640845468752,
  });
  const [relationshipId, setrelationshipId] = useState(null);
  const [geolocation, setGeoLocation] = useState(null);
  const [vulAvgScroreFieldId, setvulAvgScroreFieldId] = useState(null);
  const [regType, setRegType] = useState(null);
  const [clientTypeID, setclientTypeID] = useState(null);
  const history = useHistory();
  const { t } = useTranslation();
  const [viewType, setViweType] = useState("card");
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [uicID, setUicID] = useState(null)
  const [firstnameid, setfirstname] = useState(null)
  const [regPhoneNumberId, setRegPhoneNumberId] = useState(null)
  const [lastnameid, setlastname] = useState(null)
  const [passwordid, setpassword] = useState("Test@123")
  const [patientroleid, setpatientroleid] = useState(null);
  const [patienttrackedInstanceId, setpatienttrackedInstanceId] = useState(null);
  const [mainaccountId, setmainaccountId] = useState(null);
  const [userGroupId, setuserGroupId] = useState(null);
  const [Configuration, setConfiguration] = React.useState(null);
  const [page, setPage] = useState(1);
  const [noOfPages,setNoOfPages] = useState(0)

  async function getMetaData() {
    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    setprogramData(metadata.data);
    setListOfFields(metadata.data.programs[0].programTrackedEntityAttributes);

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setsessionUserBoValue(loginDetails.data);

    let allOfflineRecords = await OfflineDb.getAllEntities();
    setOfflineRecords(allOfflineRecords.rows);
    console.log("allOfflineRecords>>", allOfflineRecords);

    let geolocationData = await OfflineDb.getDataFromPouchDB("geolocation");
    setGeoLocation(geolocationData.data);

    let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    setConfiguration(configurations.data.configuration);
    setpatientroleid(configurations.data.configuration.patientroleid)
    setpatienttrackedInstanceId(configurations.data.configuration.patientTrackedInstanceId)
    setmainaccountId(configurations.data.configuration.mainAccountId)
    setuserGroupId(configurations.data.configuration.userGroupId)

    let relationShipId = await OfflineDb.getDataFromPouchDB(
      "relationshipTypeId"
    );

    if (relationShipId.data) {
      setrelationshipId(relationShipId.data);
    } else {
      setrelationshipId("");
    }
  }

  useEffect(() => {
    if (navigator.onLine && navigator.geolocation && geolocation != null) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setCurrentGeoLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          setCurrentGeoLocation({ lat: geolocation.lat, lng: geolocation.lng });
        },
        { timeout: 10000 }
      );
    } else if (geolocation != null) {
      setCurrentGeoLocation({ lat: geolocation.lat, lng: geolocation.lng });
    }
  }, [geolocation]);

  useEffect(() => {
    getMetaData();
  }, []);
  useEffect(() => {
    if (programData != null) {
      getFileUploadFieldsIds();
      getCustomVariableIds();
    }
  }, [programData]);

  useEffect(() => {
    if (listOfFields != null) {
      let filtteredFields = listOfFields.filter(
        (obj) => obj.displayInList == true
      );
      setFieldsToDisplay(filtteredFields);
    }
  }, [listOfFields]);

  useEffect(()=>{
    if(offlineRecords.length > 0 && Configuration != null){
        setNoOfPages(Math.ceil(offlineRecords.length / Configuration.pagination.itemsPerPage))
    }
},[offlineRecords,Configuration])

  const handlePageChange = (event, value) => {
    setPage(value);
  }

  function getCustomVariableIds() {
    programData.programs[0].programTrackedEntityAttributes.map((fieldName) => {
      // console.log('displayname>>>>', fieldName.trackedEntityAttribute)
      let regField = fieldName.trackedEntityAttribute.description
        ? fieldName.trackedEntityAttribute.description
        : fieldName.trackedEntityAttribute.formName
        ? fieldName.trackedEntityAttribute.formName
        : fieldName.trackedEntityAttribute.displayName;
      if (
        regField.trim().toLowerCase() == "client type"
      ) {
        setclientTypeID(fieldName.trackedEntityAttribute.id);
      }
      if (regField.trim().toLowerCase() == "uic") {
        setUicID(fieldName.trackedEntityAttribute.id)
      }
      if (regField.trim().toLowerCase() == "first name") {
          setfirstname(fieldName.trackedEntityAttribute.id)
      }
      if (regField.trim().toLowerCase() == "last name") {
          setlastname(fieldName.trackedEntityAttribute.id)
      }
      if (regField.trim().toLowerCase() == "phone number (permanent)") {
        setRegPhoneNumberId(fieldName.trackedEntityAttribute.id)
      }
      if (
        regField
          .trim()
          .toLocaleLowerCase() == "type of registration"
      ) {
        setRegType(fieldName.trackedEntityAttribute.id);
      }
      if (
        regField
          .trim()
          .toLocaleLowerCase() == "vulnerability score of the household"
      ) {
        setvulAvgScroreFieldId(fieldName.trackedEntityAttribute.id);
      }
    });
  }

  function getFileUploadFieldsIds() {
    programData.programs[0].programTrackedEntityAttributes.map((regField) => {
      if (
        regField.trackedEntityAttribute.valueType.trim() == "IMAGE" ||
        regField.trackedEntityAttribute.valueType.trim() == "FILE_RESOURCE"
      ) {
        fileUploadFieldsIdsList.push(regField.trackedEntityAttribute.id);
        setFileUploadFieldsIdsList(fileUploadFieldsIdsList);
      }
    });

    programData.programs[0].programStages.map((stage) => {
      stage.programStageDataElements.map((de) => {
        if (
          de.dataElement.valueType == "IMAGE" ||
          de.dataElement.valueType == "FILE_RESOURCE"
        ) {
          fileUploadFieldsIdsList.push(de.dataElement.id);
          setFileUploadFieldsIdsList(fileUploadFieldsIdsList);
        }
      });
    });
  }

  const handleViewChange = (event) => {
    setViweType(event.target.value);
  };
  const loadViewToggleButtons = () => {
    return (
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue="top"
        >
          <FormControlLabel
            value="card"
            control={
              <Radio
                checked={viewType === "card"}
                onChange={handleViewChange}
                value="card"
                name="radio-button-layout"
              />
            }
            label={t("Card View")}
          />
          <FormControlLabel
            value="list"
            control={
              <Radio
                checked={viewType === "list"}
                onChange={handleViewChange}
                value="list"
                name="radio-button-layout"
              />
            }
            label={t("List View")}
          />
        </RadioGroup>
      </FormControl>
    );
  };

  const addContact = (id) => {
    // const activeCaseFormData = {
    //   'formFormat': {[clientTypeId] : Configuration.ltbiLinkVariables.contact},
    //   'dhisFormat': null
    // }
    // const linkContact = {
    //   "enabled": true,
    //   "linkTrackedEntityInstance": row.row[0]
    // }
    // //OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    // OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
    // OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
    // history.push('/layout/registration')





    if (!navigator.onLine) {
      setGlobalSpinner(true);
      OfflineDb.getSingleEntity(id)
        .then((res) => {
          
          const activeCaseFormData = {
            formFormat: {[clientTypeID] : Configuration.ltbiLinkVariables.contact},
            dhisFormat: null,
          };
          const linkContact = {
            enabled: true,
            linkTrackedEntityInstance: res.trackedEntityInstance
              ? res.trackedEntityInstance
              : id,
          };
          OfflineDb.setDataIntoPouchDB(
            "activeCaseFormData",
            activeCaseFormData
          );
          OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
          setGlobalSpinner(false);
          history.push("/layout/registration");
        })
        .catch((err) => {
          setGlobalSpinner(false);
          swal({
            title: t("Edit"),
            text: err,
            icon: "error",
            button: t("Close"),
          });
        });
    } else {
      swal({
        title: t("Operation not permitted"),
        text: t("Adding contact is not allowed in online mode for offline Index"),
        icon: "info",
        button: t("Close"),
      });
    }


  }

  const lsitView = (entityObj) => {
    return (
      <>
        {fieldsToDisplay.length > 0
          ? fieldsToDisplay.map((eachFields, i) => {
              return (
                <p className="alerts_description_fields" key={i}>
                  {eachFields.trackedEntityAttribute.formName
                    ? eachFields.trackedEntityAttribute.formName
                    : eachFields.trackedEntityAttribute.displayName}{" "}
                  :
                  {entityObj[eachFields.trackedEntityAttribute.id]
                    ? entityObj[eachFields.trackedEntityAttribute.id]
                    : "N/A"}
                </p>
              );
            })
          : null}
      </>
    );
  };
  const caseListView = (entityObj) => {
    // console.log('offline>>111', entityObj.doc.data, JSON.stringify(clientTypeID), entityObj.doc.data[clientTypeID], Configuration.ltbiLinkVariables.index)
    return (
      <Grid item xs={12} sm={6} md={6} className="knowkedgelistcontainer">
        <div className="alertsdetailholder">
          {lsitView(entityObj.doc.data)}
          {/* <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList hide1">
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn mr-10px">
                            <VisibilityIcon /><span className="ml-10px">{t('See Individual Record')}</span>
                        </Button>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn mr-10px">
                            <EditIcon /> <span className="ml-10px">{t('New/Update Individual Record')}</span>
                        </Button> */}
          <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              className="infoviewmorebtn"
              onClick={() => UpdateRecord(entityObj.id)}
            >
              <EditIcon />
            </Button>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              className="infoviewmorebtn"
              onClick={() => DeleteRecord(entityObj.id)}
            >
              <DeleteIcon />
            </Button>
            {Configuration && entityObj.doc.data && entityObj.doc.data[clientTypeID] == Configuration.ltbiLinkVariables.index &&
              <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn ml-10px hide1" 
                onClick={() => addContact(entityObj.id)}>
                <PersonAddIcon />{/* <span className="ml-10px">{t('Add contact')}</span> */}
              </Button>
            }
            

            {/* <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={()=>SyncSingleRecord(entityObj.id)}>
                            <SyncIcon /> 
                        </Button> */}
            {entityObj.doc.formVersion != programData.programs[0].version ? (
              <Button
                variant="contained"
                disableElevation
                className="infoviewmorebtn float-right"
              >
                Outdated Record
              </Button>
            ) : (
              ""
            )}
          </p>
        </div>
      </Grid>
    );
  };
  const SyncSingleRecord = (id) => {
    if (navigator.onLine) {
      setGlobalSpinner(true);
      OfflineDb.getSingleEntity(id)
        .then(async (res) => {
          let finalObj = { trackedEntityInstances: [] };
          let finalBO = await getProcessedTEAttributeData(res);
          finalObj.trackedEntityInstances.push(finalBO);
          apiServices
            .postAPI("trackedEntityInstances", finalObj)
            .then(async (response) => {
              OfflineDb.deleteEntity(id);
              let pendingRecords = _.reject(offlineRecords.rows, { id: id });
              setOfflineRecords([]);
              setOfflineRecords(pendingRecords);
              setGlobalSpinner(false);
              await deleteofflinedatafromstore()
              swal({
                title: t("Sync"),
                text: t("Data sync success"),
                icon: "success",
                button: t("Close"),
              });
            })
            .catch((err) => setGlobalSpinner(false));
        })
        .catch((err) => {
          setGlobalSpinner(false);
          swal({
            title: t("Sync"),
            text: err,
            icon: "error",
            button: t("Close"),
          });
        });
    } else {
      swal({
        title: t("Network connection issue"),
        text: t("Please make sure your internet connection is working"),
        icon: "info",
        button: t("Close"),
      });
    }
  };

  /**
   *
   */
  const updateHousehold = (olexistinghouseholdarr) => {
    let datasavecount = 0;
    olexistinghouseholdarr.map((row) => {
      let offlineobj = row.doc;
      const programId = programData.programs[0].id;

      const getURL =
        "trackedEntityInstances/" +
        offlineobj.trackedEntityInstance +
        ".json?program=" +
        programId +
        "&fields=*?";
      apiServices
        .getAPI(getURL)
        .then((getParentData) => {
          //console.log('getParentData>>',getParentData)
          let updateobj = _.cloneDeep(getParentData.data);
          const parentAttribute = [];
          Object.keys(offlineobj.data).map((uid) => {
            if (uid != "null") {
              const obj = {
                attribute: uid,
                value: offlineobj.data[uid],
              };
              // parentAttribute.push(obj)
              updateobj.attributes.push(obj);
            }
          });

          // const orgUnit = sessionUserBoValue.organisationUnits[0].id
          // const programId = programData.programs[0].id
          // const trackedEntityType = programData.programs[0].trackedEntityType.id
          // const updateCaseInput = {
          //     "created": updateobj.created,
          //     "orgUnit": orgUnit,
          //     "createdAtClient": updateobj.createdAtClient,
          //     "trackedEntityInstance": updateobj.trackedEntityInstance,
          //     "lastUpdated": updateobj.lastUpdated,
          //     "trackedEntityType": trackedEntityType,
          //     "lastUpdatedAtClient": updateobj.lastUpdatedAtClient,
          //     "inactive": false,
          //     "deleted": false,
          //     "featureType": "NONE",
          //     "programOwners": [
          //         {
          //             "ownerOrgUnit": orgUnit,
          //             "program": programId,
          //             "trackedEntityInstance": updateobj.trackedEntityInstance,
          //         }
          //     ],
          //     "relationships": [],
          //     "attributes": parentAttribute,
          //     "geometry": {
          //         "type": "Point",
          //         "coordinates": [currentGeolocation.lng, currentGeolocation.lat]
          //     }
          // }

          const updateURL =
            "trackedEntityInstances/" + offlineobj.trackedEntityInstance;
          apiServices
            .putAPI(updateURL, updateobj)
            .then((updateRes) => {
              OfflineDb.deleteEntity(offlineobj._id);
              let indexToRemove = _.findIndex(offlineRecords, {
                id: row.doc._id,
              });
              offlineRecords.splice(indexToRemove, 1);
              setOfflineRecords([]);
              setOfflineRecords(offlineRecords);
              datasavecount += 1;
              if (datasavecount == olexistinghouseholdarr.length) {
                SyncRecords();
              }
            })
            .catch(async (error) => {
              console.log("error>>", error);
              setGlobalSpinner(false);
              //toast.error(JSON.stringify(error));
              await saveOfflineErrorToDataStore({...updateobj, apiurl: updateURL, "error": error, "errorStirng": JSON.stringify(error)}, '115')
              swal({
                title: t("Sync error"),
                text: "Error code 115",
                icon: "error",
                button: t("Close"),
              });
            });
        })
        .catch(async (error) => {
          console.log("err>>", error);
          setGlobalSpinner(false);
          //toast.error(JSON.stringify(error));
          await saveOfflineErrorToDataStore({apiurl:getURL, "error": error, "errorStirng": JSON.stringify(error)}, '114')
          swal({
            title: t("Sync error"),
            text: "Error code 114",
            icon: "error",
            button: t("Close"),
          });
        });
    });
  };

  /**
   * CUSTOM FUNCTION TO UPDATE INDEX
   * IMPLEMENT FOR PROJECT TIMOR-LESTE
   */
  function updateMemberClientTypeField(indiviualList) {
    //console.log('indiviualList', indiviualList)
    return new Promise(async (resolve, reject) => {
      const values = [];
      const UserBO = _.cloneDeep(sessionUserBoValue);
      const programData1 = programData.programs[0];
      const programId = programData1.id;
      const orgUnit = UserBO.organisationUnits[0].id;
      const trackedEntityType = programData1.trackedEntityType.id;
      const caseDetails = indiviualList.data;
      const updateURL =
        "trackedEntityInstances/" + caseDetails.trackedEntityInstance;

      caseDetails.attributes.map((attr) => {
        var obj = {
          attribute: attr.attribute,
          value: attr.value,
        };
        if (attr.attribute == clientTypeID) {
          obj["value"] = "Contact";
        }
        values.push(obj);
      });
      const updateCaseInput = {
        created: caseDetails.created,
        orgUnit: orgUnit,
        createdAtClient: caseDetails.createdAtClient,
        trackedEntityInstance: caseDetails.trackedEntityInstance,
        lastUpdated: caseDetails.lastUpdated,
        trackedEntityType: trackedEntityType,
        lastUpdatedAtClient: caseDetails.lastUpdatedAtClient,
        inactive: false,
        deleted: false,
        featureType: "NONE",
        programOwners: [
          {
            ownerOrgUnit: orgUnit,
            program: programId,
            trackedEntityInstance: caseDetails.trackedEntityInstance,
          },
        ],
        relationships: [],
        attributes: values,
      };
      apiServices
        .putAPI(updateURL, updateCaseInput)
        .then((updateRes) => {
          resolve(true);
        })
        .catch(async (error) => {
          setGlobalSpinner(false);
          resolve(true);
          //toast.error(JSON.stringify(error));
          await saveOfflineErrorToDataStore({...updateCaseInput, apiurl: updateURL, "error": error, "errorStirng": JSON.stringify(error)}, '113')
          swal({
            title: "Error",
            text: "Error code 113",
            icon: "error",
            button: "Close",
          });
        });
    });
  }

  /**
   * CUSTOM FUNCTION FOR INDEX
   * IMPLEMENT FOR PROJECT TIMOR-LESTE
   */
  function checkSameHouseHoldMembers(trackedEntityInstanceforCall) {
    return new Promise(async (resolve, reject) => {
      //console.log('linkContactFlag.data.linkTrackedEntityInstance', trackedEntityInstanceforCall)
      let programID = programData.programs[0].id,
        url = `trackedEntityInstances/${trackedEntityInstanceforCall}.json?program=${programID}&fields=relationships`;
      apiServices
        .getAPI(url)
        .then((res) => {
          let q = [];
          //setGlobalSpinner(true);
          //console.log('childrenArr1234', res)
          res.data.relationships.map((relobj) => {
            let url = `trackedEntityInstances/${relobj.from.trackedEntityInstance.trackedEntityInstance}.json?program=${programID}&fields=*?`;
            q.push(apiServices.getAPI(url));
          });

          //console.log('childrenArr123', q.length)
          Promise.all([...q])
            .then(([...res]) => {
              let childrenArr = [...res];

              // setGlobalSpinner(false);
              //setLinkIndexList(childrenArr)
              //console.log('childrenArr12', childrenArr)

              const url1 = `trackedEntityInstances/${childrenArr[0].data.trackedEntityInstance}.json?program=${programID}&fields=relationships`;
              apiServices
                .getAPI(url1)
                .then((res) => {
                  let p = [];
                  res.data.relationships.map((relobj1, idx) => {
                    if (
                      relobj1.to.trackedEntityInstance.trackedEntityInstance !=
                      trackedEntityInstanceforCall
                    ) {
                      let url2 = `trackedEntityInstances/${relobj1.to.trackedEntityInstance.trackedEntityInstance}.json?program=${programID}&fields=*?`;
                      p.push(apiServices.getAPI(url2));
                    }
                    //console.log('childrenArr12', p.length, relobj1)
                    if (p.length > 0) {
                      Promise.all([...p])
                        .then(([...res]) => {
                          let childrenArr1 = [...res];
                          // setGlobalSpinner(false);
                          // setLinkContactList(childrenArr1)

                          //console.log('childrenArr1>>>', childrenArr1)

                          if (childrenArr.length > 0) {
                            childrenArr1.map(async (indiviualList, id) => {
                              //console.log('updateMemberClientTypeField1', indiviualList)
                              const findClientField =
                                indiviualList.data.attributes.find(
                                  (x) =>
                                    x.displayName == "Client type" &&
                                    x.value == "Normal"
                                );
                              if (findClientField) {
                                //console.log('updateMemberClientTypeField', indiviualList)
                                await updateMemberClientTypeField(
                                  indiviualList
                                );
                              }

                              if (id == childrenArr1.length - 1) {
                                resolve(true);
                              }
                              //console.log('findClientField', findClientField)
                            });
                          } else {
                            if (idx == res.data.relationships.length - 1) {
                              resolve(true);
                            }
                          }
                        })
                        .catch((error) => {
                          setGlobalSpinner(false);
                          //toast.error(JSON.stringify(error));
                          swal({
                            title: "Error",
                            text: "Error code 112",
                            icon: "error",
                            button: "Close",
                          });
                        });
                    }
                    resolve(true);
                  });
                })
                .catch((error) => {
                  setGlobalSpinner(false);
                  //toast.error(JSON.stringify(error));
                  swal({
                    title: "Error",
                    text: "Error code 111",
                    icon: "error",
                    button: "Close",
                  });
                });
            })
            .catch((error) => {
              setGlobalSpinner(false);
              //toast.error(JSON.stringify(error));
              swal({
                title: "Error",
                text: "Error code 110",
                icon: "error",
                button: "Close",
              });
            });
        })
        .catch(async (error) => {
          setGlobalSpinner(false);
          //toast.error(JSON.stringify(error));
          await saveOfflineErrorToDataStore({apiurl: url, "error": error, "errorStirng": JSON.stringify(error)}, '109')
          swal({
            title: "Error",
            text: "Error code 109",
            icon: "error",
            button: "Close",
          });
        });
    });
  }

  /**
   * CUSTOM FUNCTION FOR UPDATING AVERAGE OF VULNERABILTY SCORE
   * USED FOR PROJECT TIMOR-LESTE
   */
  const updateHouseholdVulnerabiltyScore = (hhupdateobj) => {
    return new Promise(async (resolve, reject) => {
      let updateCaseInput = _.cloneDeep(hhupdateobj);
      const updateURL =
        "trackedEntityInstances/" + hhupdateobj.trackedEntityInstance;
      apiServices
        .putAPI(updateURL, updateCaseInput)
        .then((updateRes) => {
          resolve(true);
        })
        .catch(async (error) => {
          setGlobalSpinner(false);
          resolve(true);
          //toast.error(JSON.stringify(error));
          await saveOfflineErrorToDataStore({...updateCaseInput, apiurl: updateURL, "error": error, "errorStirng": JSON.stringify(error)}, '108')
          swal({
            title: "Error",
            text: "Error code 108",
            icon: "error",
            button: "Close",
          });
        });
    });
  };

  /**
   * CUSTOM FUNCTION FOR CALCULATING AVERAGE OF VULNERABILTY SCORE
   * USED FOR PROJECT TIMOR-LESTE
   */
  const calHouseholdVulnerabiltyScore = (offlineindobj) => {
    //console.log('updateHouseholdVulnerabiltyScore>>', activeCaseDetails, linkContactFlag, activevalue, activeCaseFormData)
    // return
    return new Promise(async (resolve, reject) => {
      let parentid = offlineindobj.parentId;
      let activevalue = offlineindobj.data;

      let activetrackedEntityInstance = null;
      let programID = programData.programs[0].id;

      // if(parentid == null) { // ADDING NEW INDIVIDUAL
      activetrackedEntityInstance = parentid; //houshold TrackedEntityInstance
      let q = [];
      let url = `trackedEntityInstances/${activetrackedEntityInstance}.json?program=${programID}&fields=*?`;
      q.push(apiServices.getAPI(url));
      Promise.all([...q])
        .then(([...res]) => {
          let childrenArr = [...res];

          // setGlobalSpinner(false);

          const url1 = `trackedEntityInstances/${childrenArr[0].data.trackedEntityInstance}.json?program=${programID}&fields=relationships`;
          apiServices
            .getAPI(url1)
            .then(async (res) => {
              let p = [];

              res.data.relationships.map((relobj1) => {
                if (
                  relobj1.from.trackedEntityInstance.trackedEntityInstance ==
                  activetrackedEntityInstance
                ) {
                  let url2 = `trackedEntityInstances/${relobj1.to.trackedEntityInstance.trackedEntityInstance}.json?program=${programID}&fields=*?`;
                  p.push(apiServices.getAPI(url2));
                }
              });

              // if(p.length > 0) {
              Promise.all([...p])
                .then(async ([...res]) => {
                  let childrenArr1 = [...res];
                  // setGlobalSpinner(false);
                  // setLinkContactList(childrenArr1)

                  //console.log('childrenArr1>>>aaa', childrenArr1, )

                  if (childrenArr.length > 0) {
                    //console.log('childrenArr>>>bbb', childrenArr)
                    let vulnerabilityScore =
                      parseInt(
                        activevalue[CONSTANT_FIELDID.hhVulnerabilityScore]
                      ) || 0;
                    childrenArr1.map((indiviualList) => {
                      let findVulField = indiviualList.data.attributes.find(
                        (x) => x.displayName == "Vulnerability Score"
                      );
                      if (findVulField) {
                        // updateMemberClientTypeField(indiviualList)
                        vulnerabilityScore += parseInt(findVulField.value);
                      }
                    });

                    let verScore = Number(
                      (vulnerabilityScore / (childrenArr1.length + 1)).toFixed(
                        0
                      )
                    );
                    childrenArr[0].data.attributes.push({
                      attribute: vulAvgScroreFieldId,
                      value: parseInt(verScore),
                    });
                    //console.log('vulnerabilityScore else:bb', vulnerabilityScore, childrenArr)

                    let status = await updateHouseholdVulnerabiltyScore(
                      childrenArr[0].data
                    );
                    if (status) resolve(true);
                  }
                })
                .catch((error) => {
                  setGlobalSpinner(false);
                  //toast.error(JSON.stringify(error));
                  swal({
                    title: "Error",
                    text: "Error code 107",
                    icon: "error",
                    button: "Close",
                  });
                });
              // }
            })
            .catch((error) => {
              setGlobalSpinner(false);
              //toast.error(JSON.stringify(error));
              swal({
                title: "Error",
                text: "Error code 106",
                icon: "error",
                button: "Close",
              });
            });
        })
        .catch(async (error) => {
          setGlobalSpinner(false);
          //toast.error(JSON.stringify(error));
          await saveOfflineErrorToDataStore({...offlineindobj, apiurl: url, "error": error, "errorStirng": JSON.stringify(error)}, '105')
          swal({
            title: "Error",
            text: "Error code 105",
            icon: "error",
            button: "Close",
          });
        });
    });
  };
  /**
   *
   */

  /**
   * FOR INCOMPLETE SYNC SEARCH HOUSEHOLD ID IN LOCALSTORAGE
   */
  const checkParentIdInLocalStorage = (childobj) => {
    return new Promise(async (resolve, reject) => {
      console.log("checkParentIdInLocalStorage>>", childobj);
      let hhoffdata = JSON.parse(localStorage.getItem("hhoffdata"));
      if (hhoffdata && hhoffdata.length > 0) {
        for (const hh of hhoffdata) {
          console.log("checkParentIdInLocalStorage>>", hhoffdata, hh);
          if (hh.raw._id == childobj.parentId) {
            resolve(hh.trackedEntityInstance);
          }
        }
        // hhoffdata.map(hh => {
        //     if(hh.raw._id == childobj.parentId) {
        //         resolve(hh.trackedEntityInstance)
        //     }
        // })
        resolve(false);
      } else {
        resolve(childobj.parentId);
      }
    });
  };
  /**
   *
   */

  /**
   * THIS FUNCTION IS USED TO SAVE OFFLINE INDIVIDUAL RECORDS ONLY
   * THIS FUNCTION WILL TRIGGER ONLY WHEN ALL HOUSEHOLD RECORDS HAS BEEN SAVED
   * IMPLEMENTED FOR TIMOR LESTE PROJECT
   */
  const SyncIndividualRecords = async (individualarr) => {
    console.log("newIndividualArr>>", individualarr);

    setGlobalSpinner(true);
    const orgUnit = sessionUserBoValue.organisationUnits[0].id;
    const trackedEntityType = programData.programs[0].trackedEntityType.id;
    let datasavecount = 0;

    for (const row of individualarr) {
        let firstnameUId, lastnameUId, regPhoneNumberUId, uicUID = null
        let orgUnit = row.doc.registration.orgUnit
        row.doc.registration.attributes.map((attr, idx) => {
            if (attr.attribute == firstnameid) {
                firstnameUId = row.doc.registration.attributes[idx]['value'];
            }
            if (attr.attribute == lastnameid) {
                lastnameUId = row.doc.registration.attributes[idx]['value'];
            }
            if (attr.attribute == uicID) {
                uicUID = row.doc.registration.attributes[idx]['value'];
            }
            if (attr.attribute == regPhoneNumberId) {
              regPhoneNumberUId = row.doc.registration.attributes[idx]['value'];
          }
        })
      let parentid = await checkParentIdInLocalStorage(row.doc);
      console.log("parentid>>>", parentid);
      let offlineobj = row.doc;

      if (parentid) {
        offlineobj.parentId = parentid;
      }

      let finalBO = await getProcessedTEAttributeData(offlineobj);

      const addIndividual = async () => {
        return new Promise(async (resolve, reject) => {
          await apiServices
            .postAPI("trackedEntityInstances", {
              trackedEntityInstances: [finalBO],
            })
            .then(async (response) => {
              console.log("indtrackedEntityInstancesresponse>>", response);
              const trackedEntityInstance =
                response.data.response.importSummaries[0].reference;
              // resolve(trackedEntityInstance)
              try{
                const userCreationInput = {
                  "userCredentials": {
                      "cogsDimensionConstraints": [],
                      "catDimensionConstraints": [],
                      "username": uicUID,
                      "password": "Test@123",
                      "userRoles": [{ "id": patientroleid }]
                  },
                  "surname": lastnameUId ? lastnameUId : "testsurname",
                  "firstName": firstnameUId,
                  "phoneNumber": regPhoneNumberUId,
                  "organisationUnits": [{ "id": orgUnit }],
                  "dataViewOrganisationUnits": [{ "id": orgUnit }],
                  "teiSearchOrganisationUnits": [{ "id": orgUnit }],

                  //"userGroups": [{"id": userGroupId}],
                  "attributeValues": [{ "value": trackedEntityInstance, "attribute": { "id": patienttrackedInstanceId } }, { value: true, attribute: { id: mainaccountId } }]
                }
                apiServices.postAPI('users', userCreationInput)
                .then(usersuccess => {

                }).catch(async (err) => {
                  await saveOfflineErrorToDataStore({...userCreationInput, "error": err, "errorStirng": JSON.stringify(err)}, '117')
                })
                await saveInLocalStorage({
                  raw: row.doc,
                  final: finalBO,
                  trackedEntityInstance,
                });
              }catch(e){

              }
              const programId = programData.programs[0].id;
              const getURL =
                "trackedEntityInstances/" +
                offlineobj.parentId +
                ".json?program=" +
                programId +
                "&fields=*?";
              await apiServices
                .getAPI(getURL)
                .then(async (getParentData) => {
                  const parentAttribute = [];
                  getParentData.data.attributes.map((attributes) => {
                    const obj = {
                      attribute: attributes.attribute,
                      value: attributes.value,
                    };
                    parentAttribute.push(obj);
                  });

                  getParentData.data.relationships.push({
                    from: {
                      trackedEntityInstance: {
                        trackedEntityInstance: offlineobj.parentId,
                      },
                    },
                    to: {
                      trackedEntityInstance: {
                        trackedEntityInstance: trackedEntityInstance,
                      },
                    },
                    relationshipType: relationshipId,
                  });

                  const linkContactJson = {
                    created: moment().format("YYYY-MM-DD"),
                    orgUnit: orgUnit,
                    createdAtClient: moment().format("YYYY-MM-DD"),
                    trackedEntityInstance: offlineobj.parentId,
                    lastUpdated: moment().format("YYYY-MM-DD"),
                    trackedEntityType: trackedEntityType,
                    lastUpdatedAtClient: moment().format("YYYY-MM-DD"),
                    inactive: false,
                    deleted: false,
                    featureType: "NONE",
                    programOwners: [
                      {
                        ownerOrgUnit: orgUnit,
                        program: programId,
                        trackedEntityInstance: offlineobj.parentId,
                      },
                    ],
                    relationships: getParentData.data.relationships,
                    attributes: parentAttribute,
                    geometry: {
                      type: "Point",
                      coordinates: [
                        currentGeolocation.lng,
                        currentGeolocation.lat,
                      ],
                    },
                  };

                  const putURL =
                    "trackedEntityInstances/" + offlineobj.parentId;
                  await apiServices
                    .putAPI(putURL, linkContactJson)
                    .then(async (linkResponse) => {
                      /**
                       * UPDATE HOUSEHOLD VULNERABILITY AVERAGE SCORE
                       */
                      /*if(offlineobj.data[regType] == "Individual") {
                                            await calHouseholdVulnerabiltyScore(offlineobj)
                                        }

                                        if(offlineobj.data[clientTypeID] == 'Index') {
                                            await checkSameHouseHoldMembers(trackedEntityInstance)
                                        }*/

                      OfflineDb.deleteEntity(offlineobj._id);
                      let indexToRemove = _.findIndex(offlineRecords, {
                        id: row.doc._id,
                      });
                      offlineRecords.splice(indexToRemove, 1);
                      setOfflineRecords([]);
                      setOfflineRecords(offlineRecords);
                      datasavecount += 1;
                      resolve(true);
                      if (datasavecount == individualarr.length) {
                        // SyncRecords()
                        setOfflineRecords([]);
                        localStorage.removeItem("hhoffdata");
                        await deleteofflinedatafromstore()
                        swal({
                          title: t("Sync"),
                          text: t("Data sync success"),
                          icon: "success",
                          button: t("Close"),
                        });
                        setGlobalSpinner(false);
                      }
                    })
                    .catch(async (error) => {
                      console.log("indparup:", error);
                      setGlobalSpinner(false);
                      //toast.error(JSON.stringify(error));
                      await saveOfflineErrorToDataStore({...linkContactJson, apiurl: putURL, "error": error, "errorStirng": JSON.stringify(error)}, '104')
                      swal({
                        title: "Error",
                        text: "Error code 104",
                        icon: "error",
                        button: "Close",
                      });
                    });
                })
                .catch(async(error) => {
                  console.log("indparget:", error);
                  setGlobalSpinner(false);
                  //toast.error(JSON.stringify(error));
                  await saveOfflineErrorToDataStore({apiurl:getURL, "error": error, "errorStirng": JSON.stringify(error)}, '103')
                  swal({
                    title: "Error",
                    text: "Error code 103",
                    icon: "error",
                    button: "Close",
                  });
                });
            })
            .catch(async (error) => {
              console.error("indsave:", error);
              console.log(
                '.includes("oo")>>',
                JSON.stringify(error).includes("409")
              );
              await saveOfflineErrorToDataStore({
                trackedEntityInstances: [finalBO],
                "error": error, "errorStirng": JSON.stringify(error)
              }, '409')
              if (JSON.stringify(error).includes("409")) {
                OfflineDb.deleteEntity(offlineobj._id);
                let indexToRemove = _.findIndex(offlineRecords, {
                  id: row.doc._id,
                });
                offlineRecords.splice(indexToRemove, 1);
                setOfflineRecords([]);
                setOfflineRecords(offlineRecords);
                datasavecount += 1;
                resolve(true);
                if (datasavecount == individualarr.length) {
                  // SyncRecords()
                  setOfflineRecords([]);
                  localStorage.removeItem("hhoffdata");
                  await deleteofflinedatafromstore()
                  swal({
                    title: t("Sync"),
                    text: t("Data sync success"),
                    icon: "success",
                    button: t("Close"),
                  });
                  setGlobalSpinner(false);
                }
                return;
              }
              setGlobalSpinner(false);
              //toast.error(JSON.stringify(error));
              await saveOfflineErrorToDataStore({
                trackedEntityInstances: [finalBO],
                "error": error, "errorStirng": JSON.stringify(error)
              }, '102')
              swal({
                title: "Error",
                text: "Error code 102",
                icon: "error",
                button: "Close",
              });
            });
        });
      };

      const trackedEntityInstance = await addIndividual();

    }
  };
  /**
   *
   */

  const InternetSpeedCheck = () => {
    return new Promise(async (resolve, reject) => {
      var imageAddr = `${domain}/sampleimage.jpg`;
      // var imageAddr = `${domain}/sampleimage700kb.jpg`;

      // var downloadSize = 13055440;1781287
      var downloadSize = 1781287;
      var startTime, endTime;
      var download = new Image();
      download.onload = function () {
        endTime = new Date().getTime();
        showResults();
      };
      download.onerror = function (err, msg) {
        console.log("Invalid image, or error downloading");
      };
      startTime = new Date().getTime();
      var cacheBuster = "?nnn=" + startTime;
      download.src = imageAddr + cacheBuster;
      function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);

        if (speedMbps > 1) {
          console.log("Your connection speed is " + speedMbps + " Mbps");
          resolve(true);
        } else if (speedKbps > 1) {
          console.log("Your connection speed is " + speedKbps + " kbps");
          if (speedKbps > 100 && speedKbps < 200) {
            swal({
              title: t("Warning"),
              text: t(
                "Your internet speed is too low. It will take longer time to sync. Click ok to continue"
              ),
              icon: "warning",
              button: t("Ok"),
            }).then((val) => {
              resolve(true);
            });
            return;
          }

          if (speedKbps < 100) {
            swal({
              title: t("Warning"),
              text: t("Your internet speed is too low. Can not proceed sync"),
              icon: "warning",
              button: t("Ok"),
            });
            resolve(false);
          }
          resolve(true);
        } else {
          console.log("Your connection speed is " + speedBps + " bps");
          swal({
            title: t("Warning"),
            text: t("Your internet speed is too low. Can not proceed sync"),
            icon: "warning",
            button: t("Ok"),
          });
          resolve(false);
        }
      }
    });
  };

  const saveErrorInHH = (data) => {
    return new Promise(async (resolve, reject) => {
      console.log("saveErrorInHH>>", data);
      let errorinhhoffdata = JSON.parse(
        localStorage.getItem("errorinhhoffdata")
      );
      if (errorinhhoffdata) {
        let tempArr = [...errorinhhoffdata];
        if (!_.find(tempArr, (o) => o.raw._id == data.raw._id)) {
          tempArr.push(data);
        }
        localStorage.setItem("errorinhhoffdata", JSON.stringify(tempArr));
      } else {
        localStorage.setItem("errorinhhoffdata", JSON.stringify([data]));
      }
      resolve(true);
    });
  };

  const saveInLocalStorage = (data) => {
    return new Promise(async (resolve, reject) => {
      console.log("saveInLocalStorage>>", data);
      let hhoffdata = JSON.parse(localStorage.getItem("hhoffdata"));
      if (hhoffdata) {
        let tempArr = [...hhoffdata];
        tempArr.push(data);
        localStorage.setItem("hhoffdata", JSON.stringify(tempArr));
      } else {
        localStorage.setItem("hhoffdata", JSON.stringify([data]));
      }
      resolve(true);
    });
  };

  const deleteofflinedatafromstore = () => {
    setGlobalSpinner(true)
    return new Promise(async (resolve, reject) => {
      let offlinestoreurl = `dataStore/offlineSync/${sessionUserBoValue.id}`
      apiServices.deleteFromDataStoreAPI(offlinestoreurl, {})
        .then(res => {
          // console.log('postAPI>>>', res)
          if(res && 
            res.data &&
            res.data.httpStatusCode
          ) {
            setGlobalSpinner(false)
            resolve(true)
          }
        })
        .catch(err => {
          // console.log('postAPIerr>>>', err, err.response.data.httpStatusCode)
          setGlobalSpinner(false)
          resolve(true)
        })
    })
    
  }

  const saveOfflineToDataStore = (offlineobjtostore) => {

    return new Promise(async (resolve, reject) => {
      let offlinestoreurl = `dataStore/offlineSync/${sessionUserBoValue.id}`
      apiServices.postAPI(offlinestoreurl, offlineobjtostore)
      .then(res => {
        // console.log('postAPI>>>', res)
        if(res && 
          res.data &&
          res.data.httpStatusCode
        ) {
          resolve(true)
        }
      })
      .catch(err => {
        // console.log('postAPIerr>>>', err, err.response.data.httpStatusCode)
        resolve(true)
      })
    }) 
  }

  
  const saveOfflineErrorToDataStore = (errorparams, errorstatus) => {	
    return new Promise(async (resolve, reject) => {	
      let offlinestoreurl = `dataStore/offlineSync/${sessionUserBoValue.id}_${errorstatus}_${Number.parseFloat(Math.random()*9999).toFixed(0)}`	
      apiServices.postAPI(offlinestoreurl, errorparams)	
      .then(res => {	
        // console.log('postAPI>>>', res)	
        if(res && 	
          res.data &&	
          res.data.httpStatusCode	
        ) {	
          resolve(true)	
        }	
      })	
      .catch(err => {	
        // console.log('postAPIerr>>>', err, err.response.data.httpStatusCode)	
        resolve(true)	
      })	
    }) 	
  }
  const SyncRecords = async () => {
    if (navigator.onLine) {
      setGlobalSpinner(true);
      await saveOfflineToDataStore(offlineRecords)
      // let speedtest = await InternetSpeedCheck()
      // if(!speedtest) {
      //     console.log('low sync:', speedtest)
      //     setGlobalSpinner(false)
      //     return null;
      // }
      // console.log('proceed sync:', speedtest)
      // setGlobalSpinner(false)
      // return;
      // setGlobalSpinner(true)
      let tempIndividualArr = [];
      //let finalObj = {'trackedEntityInstances' : []};
      const allRecords = [...offlineRecords];
      const tempRecords = [...offlineRecords];
      console.log('allRecords ',allRecords)
      if (allRecords.length == 0) {
        setOfflineRecords([]);
        localStorage.removeItem("hhoffdata");
        await deleteofflinedatafromstore()
        swal({
          title: t("Sync"),
          text: t("Data sync success"),
          icon: "success",
          button: t("Close"),
        });
        setGlobalSpinner(false);
        return;
      }

      let olExistingHouseholdCountArr = tempRecords.filter(
        (row) =>
          row.doc.hasOwnProperty("trackedEntityInstance") &&
          !regexExp.test(row.doc.trackedEntityInstance)
      );
      if (olExistingHouseholdCountArr != 0) {
        updateHousehold(olExistingHouseholdCountArr);
        return;
      }

      let householdcount = tempRecords.filter(
        (row) => !row.doc.hasOwnProperty("parentId")
      );
      if (householdcount.length == 0 && tempRecords.length != 0) {
        SyncIndividualRecords(tempRecords);
        return;
      }

      allRecords.map(async (row, idx) => {
        // check from verion and offline data form version
        //console.log(row.doc.formVersion,programData.programs[0].version)
        //console.log("finalBO:",row, row.doc.formVersion, programData.programs[0].version)

        if (row.doc.formVersion == programData.programs[0].version) {
          //finalObj.trackedEntityInstances.push(getProcessedTEAttributeData(row.doc))
          if (row.doc.parentId) {
            return;
          }

          let finalBO = await getProcessedTEAttributeData(row.doc);
          // setGlobalSpinner(false)

          console.log("finalBO>>>", finalBO);
          //return;
          let firstnameUId, lastnameUId,regPhoneNumberUId, uicUID = null
          let orgUnit = row.doc.registration.orgUnit
          row.doc.registration.attributes.map((attr, idx) => {
              if (attr.attribute == firstnameid) {
                  firstnameUId = row.doc.registration.attributes[idx]['value'];
              }
              if (attr.attribute == lastnameid) {
                  lastnameUId = row.doc.registration.attributes[idx]['value'];
              }
              if (attr.attribute == uicID) {
                  uicUID = row.doc.registration.attributes[idx]['value'];
              }
              if (attr.attribute == regPhoneNumberId) {
                regPhoneNumberUId = row.doc.registration.attributes[idx]['value'];
            }
          })
          await apiServices
            .postAPI("trackedEntityInstances", {
              trackedEntityInstances: [finalBO],
            })
            .then(async (response) => {
              const trackedEntityInstance =
                response.data.response.importSummaries[0].reference;
              //setGlobalSpinner(false);
              try{
                const userCreationInput = {
                  "userCredentials": {
                      "cogsDimensionConstraints": [],
                      "catDimensionConstraints": [],
                      "username": uicUID,
                      "password": "Test@123",
                      "userRoles": [{ "id": patientroleid }]
                  },
                  "surname": lastnameUId ? lastnameUId : "testsurname",
                  "firstName": firstnameUId,
                  "phoneNumber":regPhoneNumberUId,
                  "organisationUnits": [{ "id": orgUnit }],
                  "dataViewOrganisationUnits": [{ "id": orgUnit }],
                  "teiSearchOrganisationUnits": [{ "id": orgUnit }],
                  //"userGroups": [{"id": userGroupId}],
                  "attributeValues": [{ "value": trackedEntityInstance, "attribute": { "id": patienttrackedInstanceId } }, { value: true, attribute: { id: mainaccountId } }]
                }
                apiServices.postAPI('users', userCreationInput)
                .then(usersuccess => {

                }).catch((err) => {
                  
                })
                await saveInLocalStorage({
                  raw: row.doc,
                  final: finalBO,
                  trackedEntityInstance,
                });
              }catch(e){

              }

              let newRec = allRecords.filter((oldrec) => {
                if (oldrec.doc.parentId && oldrec.doc.parentId == row.doc._id) {
                  oldrec.doc.parentId = trackedEntityInstance;
                  return oldrec;
                }
              });

              //console.log('newRec>>', newRec)
              tempIndividualArr.push(...newRec);
              // setnewIndividualArr([...newIndividualArr, ...newRec])
              // return
              //console.log('tempIndividualArr>>', tempIndividualArr)
              OfflineDb.deleteEntity(row.doc._id);
              let indexToRemove = _.findIndex(tempRecords, { id: row.doc._id });
              tempRecords.splice(indexToRemove, 1);
              setOfflineRecords([]);
              setOfflineRecords(tempRecords);

              let householdcount = tempRecords.filter(
                (row) => !row.doc.hasOwnProperty("parentId")
              );
              //console.log('householdcount>>', householdcount, tempRecords)
              if (householdcount.length == 0 && tempRecords.length != 0) {
                console.log("SyncIndividualRecords>>", tempRecords);
                // if(tempIndividualArr.length != 0) {
                //     SyncIndividualRecords(tempIndividualArr)
                // } else {

                SyncIndividualRecords(tempRecords);
                // }
                return;
              }

              if (tempRecords.length == 0) {
                setOfflineRecords([]);
                localStorage.removeItem("hhoffdata");
                await deleteofflinedatafromstore()
                swal({
                  title: t("Sync"),
                  text: t("Data sync success"),
                  icon: "success",
                  button: t("Close"),
                });
                setGlobalSpinner(false);
              }


            })
            .catch(async (error) => {
              console.error("parsave:", error, typeof error);
              // console.log('par.includes("oo")>>', JSON.stringify(error).includes("409"))
              if (JSON.stringify(error).includes("409")) {
                // OfflineDb.deleteEntity(row.doc._id);
                await saveOfflineErrorToDataStore({
                  trackedEntityInstances: [finalBO],
                  "error": error, "errorStirng": JSON.stringify(error)
                }, '409')
                let indexToRemove = _.findIndex(tempRecords, {
                  id: row.doc._id,
                });
                tempRecords.splice(indexToRemove, 1);
                setOfflineRecords([]);
                setOfflineRecords(tempRecords);
                if (tempRecords.length == 0) {
                  // SyncRecords()
                  OfflineDb.deleteEntity(row.doc._id);
                  setOfflineRecords([]);
                  localStorage.removeItem("hhoffdata");
                  await deleteofflinedatafromstore()
                  swal({
                    title: t("Sync"),
                    text: t("Data sync success"),
                    icon: "success",
                    button: t("Close"),
                  });
                  setGlobalSpinner(false);
                  deleteofflinedatafromstore()
                  return;
                }

                setGlobalSpinner(false);
                await saveErrorInHH({
                  raw: row.doc,
                  final: finalBO,
                });
                await OfflineDb.deleteEntity(row.doc._id);
                //toast.error(JSON.stringify(error));
                swal({
                  title: t("Sync Error"),
                  text: t(
                    "Data sync Fail, Error code 116 Index already sync"
                  ),
                  icon: "error",
                  button: t("Close"),
                });
                return;
              }

              setGlobalSpinner(false);
              await saveErrorInHH({
                raw: row.doc,
                final: finalBO,
              });
              //toast.error(JSON.stringify(error));
              await saveOfflineErrorToDataStore({
                trackedEntityInstances: [finalBO],
                "error": error, "errorStirng": JSON.stringify(error)
              }, '101')
              swal({
                title: t("Sync Error"),
                text: t("Data sync Fail, Error code 101"),
                icon: "error",
                button: t("Close"),
              });
            });

        } else {
          setGlobalSpinner(false);
          swal({
            title: t("Sync Error"),
            text: t(
              "Offline stored data is out dated, kindly update the data and try again"
            ),
            icon: "error",
            button: t("Close"),
          });
        }
      });
      // setGlobalSpinner(false)
    } else {
      swal({
        title: t("Network connection issue"),
        text: t("Please make sure your internet connection is working"),
        icon: "info",
        button: t("Close"),
      });
    }
  };
  const removeFile = (path) => {
    return new Promise((resolve, reject) => {
      const filePath = path.substr(0, path.lastIndexOf("/"));

      window.resolveLocalFileSystemURL(
        filePath,
        (dir) => {
          const fileName = path.substr(path.lastIndexOf("/") + 1);
          dir.getFile(
            fileName,
            { create: false },
            (fileEntry) => {
              fileEntry.remove(
                () => {
                  resolve("file removed!");
                },
                (error) => reject("error occurred: " + error.code),
                () => reject("file does not exist")
              );
            },
            (error) => reject(error)
          );
        },
        (error) => reject(error)
      );
    });
  };
  const getFileResourceId = (fileURI) => {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      window.resolveLocalFileSystemURL(
        fileURI,
        function (fileEntry) {
          fileEntry.file(
            function (file) {
              var reader = new FileReader();
              reader.onloadend = async function (e) {
                //console.log("e",file.type)
                var imgBlob = new Blob([this.result], { type: file.type });
                formData.append("file", imgBlob);
                //post formData here
                //console.log("formData",formData)
                await apiServices
                  .postAPI("fileResources", formData)
                  .then((res) => {
                    if (res.data) {
                      resolve(res.data.response.fileResource.id);
                    } else {
                      resolve(res);
                    }
                    removeFile(fileURI)
                      .then((res) => console.log(res))
                      .catch((err) => console.log(err));
                  });
              };
              reader.readAsArrayBuffer(file);
            },
            function (err) {
              console.log("err", JSON.stringify(err));
              reject(err);
            }
          );
        },
        function (err) {
          console.log("err", JSON.stringify(err));
          reject(err);
        }
      );
    });
  };
  const offlineUIC = (len, chars='A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5') => [...Array(len)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
  const generateUIC = (uicfield) => {
      return new Promise((resolve, reject) => {
          apiServices
              .generateUIC(uicfield)
              .then((response) => {
                  if (response && response.value) {
                      resolve(response.value);
                  } else {
                      //reject({})
                      resolve(offlineUIC(12))
                  }
              })
              .catch((err) => {
                  //reject(err)
                  resolve(offlineUIC(12))
              });

      });

  }
  const getProcessedTEAttributeData = (doc) => {
    return new Promise(async (resolve, reject) => {
      //console.log(fileUploadFieldsIdsList)
      if (window.cordova) {
        for (let objectKey of Object.keys(doc.data)) {
          if (uicID && uicID == objectKey && doc.data[uicID] && (doc.data[uicID]).includes('OFF')) {
              //generate uic offline
              let uic = await generateUIC(uicID)
              doc.registration.attributes.map((attr, idx) => {
                  if (attr.attribute == objectKey) {
                      doc.registration.attributes[idx]['value'] = uic;
                  }
              })
          }
          if (
            fileUploadFieldsIdsList.indexOf(objectKey) != -1 &&
            doc.data[objectKey]
          ) {
            //console.log("doc.data[objectKey]",doc.data[objectKey])

            //upload file and get the resource id
            let resid = await getFileResourceId(doc.data[objectKey]);
            //console.log("resid",resid)

            //update registration object
            doc.registration.attributes.map((attr, idx) => {
              if (attr.attribute == objectKey) {
                doc.registration.attributes[idx]["value"] = resid;
              }
            });
            //update service object
            if (doc.services.length > 0) {
              doc.services.map((servicearr, serviceIndex) => {
                servicearr.events.map((eventObj, eventIndex) => {
                  eventObj.dataValues.map((de, deIndex) => {
                    if (de.dataElement == objectKey) {
                      doc.services[serviceIndex]["events"][eventIndex][
                        "dataValues"
                      ][deIndex]["value"] = resid;
                    }
                  });
                });
              });
            }
          }
        }
        //console.log("doc",doc)

        let instanceBO = doc.registration;
        if (doc.services.length > 0) {
          instanceBO.enrollments[0]["events"] = [];
          doc.services.map((servicearr) => {
            servicearr.events.map((eventObj) => {
              instanceBO.enrollments[0]["events"].push(
                _.omit(eventObj, ["enrollment", "trackedEntityInstance"])
              );
            });
          });
        }
        resolve(instanceBO);
      } else {
        for (let objectKey of Object.keys(doc.data)) {
          if (uicID && uicID == objectKey && doc.data[uicID] && (doc.data[uicID]).includes('OFF')) {
                //generate uic offline
                let uic = await generateUIC(uicID)
                doc.registration.attributes.map((attr, idx) => {
                    if (attr.attribute == objectKey) {
                        doc.registration.attributes[idx]['value'] = uic;
                    }
                })
          }
        }
        let instanceBO = doc.registration;
        if (doc.services.length > 0) {
          instanceBO.enrollments[0]["events"] = [];
          doc.services.map((servicearr) => {
            servicearr.events.map((eventObj) => {
              instanceBO.enrollments[0]["events"].push(
                _.omit(eventObj, ["enrollment", "trackedEntityInstance"])
              );
            });
          });
        }
        resolve(instanceBO);
      }
    });
  };
  const UpdateRecord = (id) => {
    if (!navigator.onLine) {
      setGlobalSpinner(true);
      OfflineDb.getSingleEntity(id)
        .then((res) => {
          const activeCaseDetails = {
            trackedEntityInstance: id,
            enrollmentId: "",
          };
          const activeCaseFormData = {
            formFormat: res.data,
            dhisFormat: null,
          };
          const linkContact = {
            enabled: false,
            linkTrackedEntityInstance: res.trackedEntityInstance
              ? res.trackedEntityInstance
              : id,
          };
          OfflineDb.setDataIntoPouchDB("activeCaseDetails", activeCaseDetails);
          OfflineDb.setDataIntoPouchDB(
            "activeCaseFormData",
            activeCaseFormData
          );
          OfflineDb.setDataIntoPouchDB("linkContactFlag", linkContact);
          OfflineDb.setDataIntoPouchDB(
            "showBtnAddHouseholdMemberForOffline",
            true
          );
          setGlobalSpinner(false);
          history.push("/layout/registration");
        })
        .catch((err) => {
          setGlobalSpinner(false);
          swal({
            title: t("Edit"),
            text: err,
            icon: "error",
            button: t("Close"),
          });
        });
    } else {
      swal({
        title: t("Operation not permitted"),
        text: t("Offline stored data is not possible to edit in online mode"),
        icon: "info",
        button: t("Close"),
      });
    }
  };
  const DeleteRecord = (id) => {
    swal({
      title: t("Delete"),
      text: t("Do you want to delete record?"),
      icon: "warning",
      buttons: [t("No"),t("Yes")],
    }).then(alertRes => {
      if(alertRes){
        OfflineDb.deleteEntity(id);
        let indexToRemove = _.findIndex(offlineRecords, {
          id: id,
        });
        offlineRecords.splice(indexToRemove, 1);
        setOfflineRecords([]);
        setOfflineRecords(offlineRecords);
      }
    });
  }


  return (
    <>
    <FooterMenu></FooterMenu>
    <section
      className="searchcustombg offline-case-page"
      style={{
        backgroundColor: "#fff",
        flexGrow: 1,
        padding: 20,
      }}
    >
      <div className="searchformcontainer">
      <p className="searchformheading">
  <div className="heading-container">
    <span>
      <Trans>Offline Clients</Trans>
    </span>
    {offlineRecords.length > 0 ? (
      <span className="ml-10px">
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className="infoviewmorebtn"
          onClick={SyncRecords}
        >
          <SyncIcon />
          <span className="ml-10px">{t("Sync Data")}</span>
        </Button>
      </span>
    ) : null}
  </div>
</p>


        {programData && Configuration && offlineRecords.length > 0
          ? offlineRecords
            .slice((page - 1) * Configuration.pagination.itemsPerPage, page * Configuration.pagination.itemsPerPage)
            .map((row,i) => {
            //.map((row) => {
              return caseListView(row);
            })
          : 
          <div className="no-data-container">
        <Trans>{t("No Data Found")}</Trans>
      </div>
          }
        <ToastContainer
          className="offline-toast"
          position="top-right"
          autoClose={false}
          hideProgressBar={true}
          closeOnClick={false}
        />
        <Pagination
            count={noOfPages}
            page={page}
            onChange={handlePageChange}
            defaultPage={1}
            //color="primary"
            size="large"
            showFirstButton
            showLastButton
            variant="outlined" 
            shape="rounded" 
        />
      </div>
    </section>
    </>
  );
}
export default Cases;
