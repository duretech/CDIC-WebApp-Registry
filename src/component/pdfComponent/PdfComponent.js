import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";

import { useTranslation, Trans } from "react-i18next";
import "../../assets/css/customstyles.css";
import imgUrl from "../../assets/images/imageUrl.js";
import "../../assets/css/theme_blue.css";
import "../../assets/css/theme_blue.css";
import { Configuration } from "../../assets/data/config.js";

import _, { valuesIn } from "lodash";

import Grid from "@material-ui/core/Grid";
import TextField from "@mui/material/TextField";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getHospitalName, getHospitalAddress } from '../../config/validationutils.js';
// import OfflineDb from "../db";
import PouchDB from 'pouchdb';
import OfflineDb from "../../db";
import { APP_LOCALE } from '../../assets/data/config';
import GetInsulinTableDetailOffline from "../../pages/seeIndividualRecord/GetInsulinTableDetailOffline.js";
import Typography from "@material-ui/core/Typography";
import cdicLogo from '../../assets/images/cdic-logo.png';

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: "16px",
          fontWeight: 500,
        },
      },
    },
  },
});

export const waitForImageLoad = async (id) => {
  const logoImg = document.querySelector('#' + id + ' img');

  if (!logoImg) {
    console.warn("❌ Logo image not found in DOM");
    return;
  }

  while (!logoImg.complete) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

export const waitForImagePaint = async (imageId) => {
  return new Promise((resolve) => {
    const checkImage = () => {
      const img = document.getElementById(imageId);
      if (img && img.complete && img.naturalHeight !== 0) {
        resolve();
      } else {
        setTimeout(checkImage, 100); // check again after 100ms
      }
    };
    checkImage();
  });
};

export const preloadImage = (src) =>
    new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // Force rendering
      canvas.toDataURL('image/png');
      resolve();
    };
  });


function PdfComponent({
  GroupArr,
  data,
  values,
  groupStages,
  allStages,
  getTranslatedLabels,
  GetInsulinTableDetail,
  getEntityData,
  insulinTable,
  radRows,
  labRows,
  uicIdattribute, managementStage, labId, radId, programData,dataElementGroup,medIconUrl,logoReady
}) {
  const { t, i18n } = useTranslation();
  const [structure, setStructure] = useState([]);
  const [managementData, setManagementData] = useState(false);
  //const [medIconUrl, setMedIconUrl] = useState(false);
  const [eventsdatas, setEvents] = useState();
  const [matchedRows, setmatchedRows] = useState("N/A");
  const [GroupArr1, serGroupArr] = useState([])
  const [currentsdata, setcurrentsdata] = useState();

  const [diabeticprofile, setDiabeticProfile] = useState();
  const [lipidprofile, setLipidProfile] = useState();
  const [liverfunction, setLiverFunction] = useState();
  const [renalprofile, setRenalProfile] = useState();
  const [pancreaticenzymes, setPancreaticEnzymes] = useState();
  const [hormonalassay, setHormonalAssay] = useState();
  const [haematology, setHaematology] = useState();
  const [pathology, setPathology] = useState();

  const db = new PouchDB('myDatabase');

if (window.cordova?.platformId === 'ios') {
  (async () => {
    const pdfPayload = {
      _id: "pdf_payload", // Static ID to overwrite every time
      data,
      GroupArr,
      allStages,
      groupStages,
      insulinTable,
      getTranslatedLabels: null, // ❗ functions cannot be stored
      GetInsulinTableDetail: null,
      getEntityData: null,
      radRows,
      labRows,
      uicIdattribute,
      managementStage,
      labId,
      radId,
      programData,
      dataElementGroup,
      medIconUrl,
      logoReady,
      APP_LOCALE
    };

    try {
      const existing = await db.get("pdf_payload");
      await db.put({ ...existing, ...pdfPayload, _rev: existing._rev }); // update
    } catch (err) {
      if (err.status === 404) {
        await db.put(pdfPayload); // insert new
      } else {
        console.error("Error storing in PouchDB:", err);
      }
    }
  })();
}


  useEffect(() => {
    if (!navigator.onLine) {
      const LOCAL_KEY = "offlineMatchedRow"; // Customize key if needed
      const cachedData = localStorage.getItem(LOCAL_KEY);
      if (cachedData) {
        const parsed_value = JSON.parse(cachedData);
        const uiid = parsed_value.uicIdToMatch;
        const parsed = JSON.parse(cachedData);
        const matchedRow = parsed.matchedRow;
        const trackedEntityInstance = parsed.trackedEntityInstance;

        OfflineDb.getSingleEntity(trackedEntityInstance).then((res) => {
          let documents = [];

          if (res.rows && Array.isArray(res.rows)) {
            // CouchDB/PouchDB style response with rows
            documents = res.rows.map(row => row.doc);
          } else if (res.registration || res.services) {
            // Direct document response
            documents = [res];
          } else if (Array.isArray(res)) {
            // Array of documents
            documents = res;
          } else {
            return;
          }

          // Find document with matching UIC ID
          const matchedDocument = documents.find(doc => {
            return doc.registration?.attributes?.some(
              attr => attr.attribute === uicIdattribute && attr.value === uiid
            );
          });

          if (matchedDocument) {
            setmatchedRows(matchedDocument);
            // Extract events from services
            const matchedEvents = matchedDocument.services?.flatMap(service => service.events || []) || [];
            setEvents(matchedEvents);

            return;
          } else {
            //   id: doc._id,
            //   attributes: doc.registration?.attributes
            // })));
          }
        }).catch((err) => {
          console.error("Error fetching single entity:", err);
        });
        //return; 

      }

    }
  }, []);

// useEffect(() => {
//   convertImageToBase64(cdicLogo).then((base64) => {
//     setMedIconUrl(base64); // use this in your <img />
//   });
// }, []);

  let eventsData = [];


  if (eventsdatas) {
    eventsData = eventsdatas;
  }

  const removeDuplicates = (array) => {
    return array.filter((item, index) => {
      return array.findIndex((other) => isEqual(item.dataValues, other.dataValues)) === index;
    });
  };

  const GroupEventData = (arrayData) => {
    arrayData.forEach((element) => {
      element.groupDate = element?.lastUpdated?.split("T")[0]; //manually added new Date key for grouping
    });

    let GroupArrData = arrayData.reduce(function (r, a) {
      r[a.groupDate] = r[a.groupDate] || [];
      r[a.groupDate].push(a);
      return r;
    }, Object.create(null));

    return GroupArrData;
  };

  const isEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  };


  useEffect(() => {
    if (eventsdatas && eventsdatas.length > 0) {
      const uniqueEvents = removeDuplicates(eventsdatas);
      const groupedData = GroupEventData(uniqueEvents);

      serGroupArr((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(groupedData)) {
          return groupedData;
        }
        return prev;
      });
    }

  }, [eventsdatas]);

  useEffect(() => {
    if (!navigator.onLine) {
      const timer = setTimeout(() => {
        const currentStageData = Object.keys(GroupArr1).reduce((acc, key) => {
          const filtered = GroupArr1[key].filter(
            (item) => item.programStage === managementStage.id
          );
          return [...acc, ...filtered];
        }, []);

        setcurrentsdata(currentStageData)

      }, 10);

      return () => clearTimeout(timer);
    }
  }, [GroupArr1, managementStage]);

  //
  useEffect(() => {
    if (navigator.onLine) {
      if (GroupArr && Object.keys(GroupArr).length > 0) {
        const tempStructure = [];
        for (const key in allStages) {
          if (
            GroupArr[allStages[key].id] &&
            GroupArr[allStages[key].id].length > 0
          ) {
            if (allStages[key]?.displayName === "Management") {
              if (GroupArr[allStages[key].id].length > 0) {
                setManagementData(true);
              }
            }
            tempStructure.push(
              <Grid container className="mt-10px mb-10px" key={key}>
                <Grid item xs={12} sm={12} md={12} className="mb-10px">
                  <div>
                    {allStages[key]?.displayName === "Management" &&
                      _.find(allStages[key].attributeValues, {
                        attribute: { name: "InsulinTable" },
                      })?.value === "true" ? (
                      <GetInsulinTableDetail
                        currentStage={allStages[key]}
                        currentStageData={GroupArr[allStages[key].id]}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </Grid>
              </Grid>
            );
          }
        }
        setStructure(tempStructure);
      }

      loadMedIcon();
     // preloadImage(medIconUrl_);
    }
  }, [GroupArr, allStages]);

  useEffect(() => {
    if (!navigator.onLine) {
      if (!currentsdata || currentsdata.length === 0) {
        return;
      }

      if (!managementStage || !managementStage.id) {
        return;
      }
      const tempStructure_ = [];

      tempStructure_.push(
        <Grid container className="mt-10px mb-10px" key="offline-insulin">
          <Grid item xs={12} sm={12} md={12} className="mb-10px">
            <div>

              <GetInsulinTableDetailOffline
                currentStage={managementStage}
                currentStageData={currentsdata}
              />

            </div>
          </Grid>
        </Grid>
      );
      setStructure(tempStructure_);
    loadMedIcon();
   // preloadImage(medIconUrl_);
    }
  }, [GroupArr1, currentsdata]);

//   const convertImageToBase64 = (url) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = 'Anonymous'; // this is required only for external URLs
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(img, 0, 0);
//       resolve(canvas.toDataURL('image/png'));
//     };
//     img.onerror = (err) => reject(err);
//     img.src = url;
//   });
// };

const loadMedIcon = async () => {
};
// useEffect(() => {
//   convertImageToBase64(cdicLogo).then((base64) => {
//     setMedIconUrl(base64); // use this in your <img />
//   });
// }, []);

//   const loadMedIcon = async () => {
//     // try {
//     //   const doc = await db.get('img_b', { attachments: true, binary: true });
//     //   // const doc = await db.get('img_b', { attachments: true, binary: true });
//     //   // const attachment = doc._attachments['user.png'];
//     //   if (!doc._attachments || !doc._attachments['cdic-logo.png']) {
//     //     console.error('Attachment cdic-logo.png not found', doc._attachments?.['cdic-logo.png'], doc);
//     //     return;
//     //   }

//     //   const attachment = doc._attachments['cdic-logo.png'];
//     //   const blob = new Blob([attachment.data], { type: attachment.content_type });
//     //   //const imageUrl = URL.createObjectURL(blob);

//     //   const convertBlobToBase64 = (blob) => {
//     //   return new Promise((resolve, reject) => {
//     //     const reader = new FileReader();
//     //     reader.onloadend = () => resolve(reader.result); // result is data URL
//     //     reader.onerror = reject;
//     //     reader.readAsDataURL(blob); // automatically gives base64 data URL
//     //   });
//     // };

//     //   const base64Image = await convertBlobToBase64(blob);


//     //   setMedIconUrl(base64Image); // ✅ this should be a function call, not assignment

//     // } catch (err) {
//     //   console.error('Error loading med icon:', err);
//     // }

// //     const convertImageToBase64 = (url) => {
// //   return new Promise((resolve, reject) => {
// //     const img = new Image();
// //     img.crossOrigin = 'Anonymous';
// //     img.onload = () => {
// //       const canvas = document.createElement('canvas');
// //       canvas.width = img.width;
// //       canvas.height = img.height;
// //       const ctx = canvas.getContext('2d');
// //       ctx.drawImage(img, 0, 0);
// //       resolve(canvas.toDataURL('image/png'));
// //     };
// //     img.onerror = (err) => reject(err);
// //     img.src = url;
// //   });
// // };

// const convertImageToBase64 = (url) => {
//   return new Promise((resolve, reject) => {
//     if (!url) {
//       reject(new Error('No URL provided'));
//       return;
//     }

//     // If it's already a base64 data URL, return it
//     if (url.startsWith('data:')) {
//       resolve(url);
//       return;
//     }

//     // Process URL for mobile environment
//     const processedUrl = processImageUrl(url);

//     const img = new Image();
    
//     // Handle CORS for mobile apps
//     if (window.cordova) {
//       // For Cordova apps, don't set crossOrigin for local files
//       if (!processedUrl.startsWith('file://') && !processedUrl.startsWith('cdvfile://')) {
//         img.crossOrigin = 'Anonymous';
//       }
//     } else {
//       img.crossOrigin = 'Anonymous';
//     }

//     img.onload = () => {
//       try {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
        
//         // Set canvas size to match image
//         canvas.width = img.naturalWidth || img.width;
//         canvas.height = img.naturalHeight || img.height;
        
//         // Draw image on canvas
//         ctx.drawImage(img, 0, 0);
        
//         // Convert to base64 with high quality
//         const dataURL = canvas.toDataURL('image/png', 1.0);
//         resolve(dataURL);
//       } catch (error) {
//         console.error('Canvas conversion error:', error);
//         reject(error);
//       }
//     };

//     img.onerror = (error) => {
//       console.error('Image loading error:', error, 'URL:', processedUrl);
//       reject(new Error(`Failed to load image: ${processedUrl}`));
//     };

//     // Set timeout for image loading
//     const timeout = setTimeout(() => {
//       reject(new Error(`Image loading timeout for: ${processedUrl}`));
//     }, 15000);

//     img.onload = () => {
//       clearTimeout(timeout);
//       try {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
        
//         canvas.width = img.naturalWidth || img.width;
//         canvas.height = img.naturalHeight || img.height;
        
//         ctx.drawImage(img, 0, 0);
        
//         const dataURL = canvas.toDataURL('image/png', 1.0);
//         resolve(dataURL);
//       } catch (error) {
//         console.error('Canvas conversion error:', error);
//         reject(error);
//       }
//     };

//     img.src = processedUrl;
//   });
// };

// const processImageUrl = (url) => {
//   if (!url) return '';
  
//   // If it's already a data URL, return as is
//   if (url.startsWith('data:')) {
//     return url;
//   }
  
//   // Handle different URL formats for mobile
//   if (window.cordova) {
//     // Handle relative paths
//     if (url.startsWith('./') || url.startsWith('../')) {
//       const appDir = window.cordova.file.applicationDirectory;
//       const wwwDir = appDir + 'www/';
//       return wwwDir + url.replace(/^\.\.?\//, '');
//     }
    
//     // Handle absolute paths starting with /
//     if (url.startsWith('/') && !url.startsWith('//')) {
//       const appDir = window.cordova.file.applicationDirectory;
//       const wwwDir = appDir + 'www';
//       return wwwDir + url;
//     }
    
//     // Handle assets folder
//     if (url.startsWith('assets/')) {
//       const appDir = window.cordova.file.applicationDirectory;
//       const wwwDir = appDir + 'www/';
//       return wwwDir + url;
//     }
    
//     // Handle img folder or similar
//     if (url.startsWith('img/') || url.startsWith('images/')) {
//       const appDir = window.cordova.file.applicationDirectory;
//       const wwwDir = appDir + 'www/';
//       return wwwDir + url;
//     }
//   }
  
//   return url;
// };

//     const base64Logo = await convertImageToBase64(imgUrl?.cdicLogo);
//     setMedIconUrl(base64Logo);

//   };

  let obj = {
    displayName: "",
    middleName: "",
    lastName: "",
    age: "",
    gender: "",
    complaints: "-",
    diagnosis: "-",
    address: "",
    other: "-",
    dateAdvise: "",
    advise: "-",
    phoneNumber: "-",
  };
  obj.gender = data.filter((item) => item.description === "Sex at birth").length
    ? data.filter((item) => item.description === "Sex at birth")[0].value
    : "-";
  obj.dob = data.filter((item) => item.description === "Date of birth").length
    ? data.filter((item) => item.description === "Date of birth")[0].value
    : "-";
  obj.displayName = data.filter((item) => item.description == "First Name")
    .length
    ? data.filter((item) => item.description == "First Name")[0].value
    : "-";
  obj.middleName = data.filter((item) => item.description == "Middle name")
    .length
    ? data.filter((item) => item.description == "Middle name")[0].value
    : "-";

  obj.lastName = data.filter((item) => item.description == "Last Name")
    .length
    ? data.filter((item) => item.description == "Last Name")[0].value
    : "-";
  obj.date = moment(new Date()).format("YYYY-MM-DD");
  obj.age = data.filter((item) => item.description === "Age").length
    ? data.filter((item) => item.description === "Age")[0].value
    : "-";
  obj.address = data.filter((item) => item.description === "Patient Address")
    .length
    ? data.filter((item) => item.description === "Patient Address")[0].value
    : "-";

  const getFullName = (displayName, middleName, lastName) => {
    return [displayName, middleName, lastName].filter(Boolean).join(" ");
  };

  Object.keys(GroupArr).map((key) => {
    // add fields to obj here
    if (
      _.find(_.find(allStages, { id: key }).programStageDataElements, {
        dataElement: {
          description: "Diagnosis based on history and examination findings",
        },
      })
    ) {
      obj.diagnosis = _.find(GroupArr[key][0].dataValues, {
        dataElement: _.find(
          _.find(allStages, { id: key }).programStageDataElements,
          {
            dataElement: {
              description:
                "Diagnosis based on history and examination findings",
            },
          }
        ).dataElement.id,
      })?.value;
    }

    if (
      _.find(_.find(allStages, { id: key }).programStageDataElements, {
        dataElement: { description: "Next Follow Up Date" },
      })
    ) {
      obj.dateAdvise = _.find(GroupArr[key][0].dataValues, {
        dataElement: _.find(
          _.find(allStages, { id: key }).programStageDataElements,
          { dataElement: { description: "Next Follow Up Date" } }
        ).dataElement.id,
      })?.value;
    }

    if (
      _.find(_.find(allStages, { id: key }).programStageDataElements, {
        dataElement: {
          description: "Chief complaint / Primary Presenting Problem ",
        },
      })
    ) {
      obj.complaints = _.find(GroupArr[key][0].dataValues, {
        dataElement: _.find(
          _.find(allStages, { id: key }).programStageDataElements,
          {
            dataElement: {
              description: "Chief complaint / Primary Presenting Problem ",
            },
          }
        ).dataElement.id,
      })?.value;
    }

    if (
      _.find(_.find(allStages, { id: key }).programStageDataElements, {
        dataElement: { description: "Patient Advice / Notes/ Suggestion" },
      })
    ) {
      obj.advise = _.find(GroupArr[key][0].dataValues, {
        dataElement: _.find(
          _.find(allStages, { id: key }).programStageDataElements,
          { dataElement: { description: "Patient Advice / Notes/ Suggestion" } }
        ).dataElement.id,
      })?.value;
    }
  });



  const hospitalName = getHospitalName();
  const hospitalAddress = getHospitalAddress();


  // 1. Find the latest event based on eventDate
  const getLatestLabRowsOffline = (eventsData) => {
    if (!Array.isArray(eventsData) || eventsData.length === 0) return [];

    const filteredLabValues = eventsData.flatMap(event =>
      (event.dataValues || []).filter(
        (dv) => labId.includes(dv.dataElement) && dv.value?.trim() !== ""
      )
    );

    const labRows = filteredLabValues.map((dv) => ({
      id: dv.dataElement,
      selectedTest: {
        label: dv.value,
        value: dv.value,
      }
    }));

    // Optional: remove duplicate rows by dataElement ID
    const uniqueLabRows = Array.from(new Map(labRows.map(row => [`${row.id}-${row.selectedTest.value}`, row])).values());

    return uniqueLabRows;
  };

  const getLatestRadRowsOffline = (eventsData) => {
    if (!Array.isArray(eventsData) || eventsData.length === 0) return [];

    // 2. Filter matching labid entries with non-empty values
    const filteredRadValues = eventsData.flatMap(event =>
      (event.dataValues || []).filter(
        (dv) => radId.includes(dv.dataElement) && dv.value?.trim() !== ""
      )
    );

    // 3. Construct labRows array just like online
    const radRows = filteredRadValues.map((dv) => ({
      id: dv.dataElement,
      selectedTest: {
        label: dv.value,
        value: dv.value,
      }
    }));
    const uniqueRadRows = Array.from(
      new Map(
        radRows
          .map(row => [`${row.id}-${row.selectedTest.value}`, row]) // composite key: id + value
      ).values()
    );
    return uniqueRadRows;
  };

  let labRowsOffline;
  let radRowsOffline;
  if (!navigator.onLine) {
    labRowsOffline = getLatestLabRowsOffline(currentsdata);
    radRowsOffline = getLatestRadRowsOffline(currentsdata);

    const firstNameAttribute = programData.programs[0].programTrackedEntityAttributes.find(
      (attr) => attr.trackedEntityAttribute.description === "First Name"
    );

    const middleNameAttribute = programData.programs[0].programTrackedEntityAttributes.find(
      (attr) => attr.trackedEntityAttribute.description === "Middle name"
    );

    const lastNameAttribute = programData.programs[0].programTrackedEntityAttributes.find(
      (attr) => attr.trackedEntityAttribute.description === "Last Name"
    );

    const ageAttribute = programData.programs[0].programTrackedEntityAttributes.find(
      (attr) => attr.trackedEntityAttribute.description === "Age"
    );

    const genderAttribute = programData.programs[0].programTrackedEntityAttributes.find(
      (attr) => attr.trackedEntityAttribute.description === "Sex at birth"
    );

    const dobAttribute = programData.programs[0].programTrackedEntityAttributes.find(
      (attr) => attr.trackedEntityAttribute.description === "Date of birth"
    );

    const addressAttribute = programData.programs[0].programTrackedEntityAttributes.find(
      (attr) => attr.trackedEntityAttribute.description === "Patient Address"
    );


    /**
       * Find a single dataElement ID by its description inside a program stage.
       *
       * @param {Array} programStages   – programData.programs[0].programStages
       * @param {string} stageId        – e.g. "HNnj45fIS5C"
       * @param {string} description    – the dataElement.description you’re looking for
       * @param {boolean} [ci=false]    – case-insensitive search (optional)
       * @returns {string}              – dataElement.id or "" if not found
       */
    const findDataElementId = (programStages, stageId, description, ci = false) => {
      const stage = programStages.find(s => s.id === stageId);
      if (!stage || !Array.isArray(stage.programStageSections)) return "";

      const cmp = ci
        ? (a, b) => a?.trim().toLowerCase() === b.trim().toLowerCase()
        : (a, b) => a?.trim() === b.trim();

      for (const section of stage.programStageSections) {
        const match = (section.dataElements || []).find(de =>
          cmp(de.description, description)
        );
        if (match) return match.id;
      }

      return "";                                    // nothing matched
    };

    const programStages = programData.programs[0]?.programStages || [];
    const targetStageId = managementStage.id;
    const advice = findDataElementId(programStages, targetStageId, "Patient Advice / Notes/ Suggestion");
    const nextfollowup = findDataElementId(programStages, targetStageId, "Next Follow Up Date");
    const attributesArray = matchedRows.registration?.attributes || [];

    // Utility to get value from attributes array by ID
    const getAttributeValue = (attributeId) => {
      const match = attributesArray.find((attr) => attr.attribute === attributeId);
      return match?.value || "";
    };

    //   const getValueFromLatestEvent = (matchedRows, dataElementId) => {
    //   const events = matchedRows?.services?.[0]?.events || [];
    //   const latestEvent = events.reduce((latest, current) => {
    //     return new Date(current.eventDate) > new Date(latest.eventDate) ? current : latest;
    //   }, events[0]);

    //   return latestEvent?.dataValues?.find(dv => dv.dataElement === dataElementId)?.value || "";
    // };
    const getValueFromLatestEvent = (matchedRows, dataElementId) => {
      const events = matchedRows?.services?.flatMap(service => service.events || []) || [];

      if (events.length === 0) return "";

      // Filter events that have the desired dataElement
      const filteredEvents = events.filter(event =>
        (event.dataValues || []).some(dv => dv.dataElement === dataElementId)
      );

      if (filteredEvents.length === 0) return "";

      // Get the latest event among filtered ones
      const latestEvent = filteredEvents.reduce((latest, current) => {
        return new Date(current.eventDate) > new Date(latest.eventDate) ? current : latest;
      }, filteredEvents[0]);

      return latestEvent.dataValues.find(dv => dv.dataElement === dataElementId)?.value || "";
    };


    const firstNameAttributeId = firstNameAttribute?.trackedEntityAttribute?.id;
    const middleNameAttributeId = middleNameAttribute?.trackedEntityAttribute?.id;
    const lastNameAttributeId = lastNameAttribute?.trackedEntityAttribute?.id;
    const ageAttributeId = ageAttribute?.trackedEntityAttribute?.id;
    const genderAttributeId = genderAttribute?.trackedEntityAttribute?.id;
    const dobAttributeId = dobAttribute?.trackedEntityAttribute?.id;
    const addressAttributeId = addressAttribute?.trackedEntityAttribute?.id;

    obj.advise = getValueFromLatestEvent(matchedRows, advice);
    obj.dateAdvise = getValueFromLatestEvent(matchedRows, nextfollowup);

    // 2. Get values from matchedrows.registration.attributes
    obj.displayName = getAttributeValue(firstNameAttributeId);
    obj.middleName = getAttributeValue(middleNameAttributeId);
    obj.lastName = getAttributeValue(lastNameAttributeId);
    obj.age = getAttributeValue(ageAttributeId);
    obj.gender = getAttributeValue(genderAttributeId);
    obj.dob = getAttributeValue(dobAttributeId);
    obj.address = getAttributeValue(addressAttributeId);

    

  }
  // Lab Test DropwDown
//      useEffect(() => {
//   const diabeticprofile_ = dataElementGroup.find(
//     group =>
//       group.description === "Diabetic Profile_LT" &&
//       Array.isArray(group.dataElements) &&
//       group.dataElements.length > 0
//   );

//   let idsToCheck_1 = [];

//   if (diabeticprofile_) {
//     idsToCheck_1 = diabeticprofile_.dataElements.map(el => el.id);
//   }

//   const programStageKey = "GI1uxvM13fg";
//   const eventsArray = GroupArr[programStageKey] || [];

//   const sortedEvents = [...eventsArray].sort(
//     (a, b) => new Date(b.completedDate) - new Date(a.completedDate)
//   );

//   let matchedIds_1 = [];
//   if (sortedEvents.length > 0) {
//     const latestDataValues = sortedEvents[0].dataValues;

//     matchedIds_1 = latestDataValues
//       .filter(dv => idsToCheck_1.includes(dv.dataElement) && dv.value === "true")
//       .map(dv => dv.dataElement);
//   }

//   const matchedForms_11 = programData.dataElements
//     .filter(el => matchedIds_1.includes(el.id))
//     .map(el => el.formName);

//   setDiabeticProfile(matchedForms_11.length > 0 ? matchedForms_11.join(", ") : "N/A");

// }, [dataElementGroup, GroupArr, programData]); // Add dependencies here

const getLabProfileSummary = ({
  groupName,
  dataElementGroup,
  groupArray,
  programStageKey,
  programData,
  setStateFn,
}) => {
  const profileGroup = dataElementGroup.find(
    group =>
      group.description === groupName &&
      Array.isArray(group.dataElements) &&
      group.dataElements.length > 0
  );

  if (!profileGroup || !groupArray || !groupArray[programStageKey]) {
    setStateFn("N/A");
    return;
  }

  const idsToCheck = profileGroup.dataElements.map(el => el.id);
  const eventsArray = groupArray[programStageKey];

  const sortedEvents = [...eventsArray].sort(
    (a, b) => new Date(b.completedDate) - new Date(a.completedDate)
  );

  if (sortedEvents.length === 0) {
    setStateFn("N/A");
    return;
  }

  const latestDataValues = sortedEvents[0].dataValues;
  const matchedIds = latestDataValues
    .filter(dv => idsToCheck.includes(dv.dataElement) && (dv.value === true || dv.value === "true"))
    .map(dv => dv.dataElement);
  const matchedFormNames = programData.dataElements
    .filter(el => matchedIds.includes(el.id))
    .map(el => el.formName);

  setStateFn(matchedFormNames.length > 0 ? matchedFormNames.join(", ") : "N/A");
};


// useEffect(() => {
//   const programStageKey = "GI1uxvM13fg"; // Adjust if dynamic

//   getLabProfileSummary({
//     groupName: "Diabetic Profile_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setDiabeticProfile,
//   });

//   getLabProfileSummary({
//     groupName: "Lipid Profile_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setLipidProfile,
//   });

//   getLabProfileSummary({
//     groupName: "Liver Function Test_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setLiverFunction,
//   });

//   getLabProfileSummary({
//     groupName: "Renal Profile_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setRenalProfile,
//   });

//   getLabProfileSummary({
//     groupName: "Pancreatic Enzymes_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setPancreaticEnzymes,
//   });

//   getLabProfileSummary({
//     groupName: "Hormonal Assay_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setHormonalAssay,
//   });

//   getLabProfileSummary({
//     groupName: "Haematology_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setHaematology,
//   });

//   getLabProfileSummary({
//     groupName: "Pathology/ Microbiology_LT",
//     dataElementGroup,
//     groupArray: GroupArr,
//     programStageKey,
//     programData,
//     setStateFn: setPathology,
//   });

// }, [dataElementGroup, GroupArr, programData]);

useEffect(() => {
   if (GroupArr1 && GroupArr1.undefined) {
    GroupArr1["GI1uxvM13fg"] = GroupArr1.undefined;
    delete GroupArr1.undefined;
  }
  const programStageKey = "GI1uxvM13fg"; // Adjust if dynamic
  const selectedGroupArray = navigator.onLine ? GroupArr : GroupArr1;

  const profileConfigs = [
    { groupName: "Diabetic Profile_LT", setStateFn: setDiabeticProfile },
    { groupName: "Lipid Profile_LT", setStateFn: setLipidProfile },
    { groupName: "Liver Function Test_LT", setStateFn: setLiverFunction },
    { groupName: "Renal Profile_LT", setStateFn: setRenalProfile },
    { groupName: "Pancreatic Enzymes_LT", setStateFn: setPancreaticEnzymes },
    { groupName: "Hormonal Assay_LT", setStateFn: setHormonalAssay },
    { groupName: "Haematology_LT", setStateFn: setHaematology },
    { groupName: "Pathology/ Microbiology_LT", setStateFn: setPathology },
  ];

  profileConfigs.forEach(({ groupName, setStateFn }) => {
    getLabProfileSummary({
      groupName,
      dataElementGroup,
      groupArray: selectedGroupArray,
      programStageKey,
      programData,
      setStateFn,
    });
  });
}, [dataElementGroup, GroupArr, GroupArr1, programData]);



const commonInputProps = {
  readOnly: true,
  sx: { paddingLeft: 2 }, // adds ~16px left padding
};

 

const imageRef = useRef();
  return (
    <div className="prescriptioninfo prescriptionPdfSection">
      <ThemeProvider theme={theme}>
        <Grid container spacing={2} className="prescription ">
          <div className="prescipheaderdiv" id="prescriptionHeaderDiv">
            <Grid item xs={1} sm={1} md={1} lg={1} className="prescripheader">
              {/* {window?.cordova?.platformId === 'ios' ? <></> : <img src={medIconUrl} alt="Logo" />} */}
              {/* <img src={medIconUrl ? medIconUrl : imgUrl?.cdicLogo} alt="Logo" /> */}
               {/* <img src={medIconUrl} alt="Logo" /> */}
               <img id="cdicLogoImg" src={medIconUrl}  alt="Logo" style={{ display: window?.cordova?.platformId === "ios" ? "none" : "block" }}/>
               
               {/* <img
                src={medIconUrl ? medIconUrl : ""}
                alt="Logo"
                ref={imageRef}
                onLoad={() => {
                  console.log("✅ Image loaded:", imageRef.current?.complete);
                }}
              /> */}
            </Grid>

            <Grid item xs={11} sm={11} md={11} lg={11} className="headertext">
              <p style={{ textAlign: "center" }} className="headingText">
                {hospitalName || ""}
                {hospitalAddress || ""}
              </p>
            </Grid>
          </div>
        </Grid>

        <div className="presriptionform" style={{ padding: "30px" }}>
          <h3 className="notetext">Prescription Note</h3>

          <Grid container spacing={1} item xs={12}>
            <Grid item xs={9} className="d-flex justify-content-end">
              <label className="datetext">Date</label>
            </Grid>
            <Grid item xs={2} className="prestextfield" style={{ marginLeft: "15px" }}>
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={obj.date}
                placeholder={obj.date}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={0}
            item
            xs={12}
            className="presinputfields mt-30px"
          >
            <Grid item xs={2} sm={2} lg={2} className="prescdate d-contents">
              <label className="datetext">Patient's Name</label>
            </Grid>
            <Grid item xs={10} sm={10} lg={10} className="prestextfield pl-10px">
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={getFullName(obj.displayName, obj.middleName, obj.lastName)}
                placeholder={getFullName(obj.displayName, obj.middleName, obj.lastName)}
              />
            </Grid>
          </Grid>
         

          <Grid
            container
            spacing={2}
            item
            xs={12}
            className="presinputfields mt-30px"
          >
            <Grid item xs={1} sm={1} md={1} lg={1} className="prescdate">
              <label className="datetext">Age</label>
            </Grid>
            <Grid item xs={1} sm={1} md={1} lg={1} className="prestextfield">
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={obj.age}
                placeholder={obj.age}
              />
            </Grid>

            <Grid item xs={1} sm={1} md={1} lg={1} className="prescdate ">
              <label style={{ marginLeft: "25px" }}>
                Gender
              </label>
            </Grid>
            <Grid item xs={1} sm={1} md={1} lg={1} className="prestextfield">
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={obj.gender}
              />
            </Grid>

            <Grid item xs={1} sm={1} md={1} lg={1} className="prescdate ">
              <label style={{ marginLeft: "25px" }}>
                DOB
              </label>
            </Grid>
            <Grid item xs={1} sm={1} md={1} lg={1} className="prestextfield">
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={obj.dob}
              />
            </Grid>

          </Grid>

          <Grid
            container
            spacing={2}
            item
            xs={12}
            className="presinputfields mt-30px"
          >
            <Grid item xs={1} sm={1} md={1} lg={1} className="prescdate">
              <label className="datetext">Address</label>
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={11} className="prestextfield">
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={obj.address}
                placeholder={obj.address}
              />
            </Grid>
          </Grid>

          {/* <Grid
            container
            spacing={2}
            item
            xs={12}
            className="presinputfields mt-30px"
          >
            <Grid item xs={3} sm={3} md={3} lg={3} className="prescdate d-contents">
              <label className="datetext">Current complaints/Findings</label>
            </Grid>
            <Grid item xs={9} sm={9} md={9} lg={9} className="prestextfield">
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={obj.complaints}
              />
            </Grid>
          </Grid> */}

          {/* <Grid
            container
            spacing={2}
            item
            xs={12}
            className="presinputfields mt-30px justify-content-start"
            style={{justifyContent:"flex-start"}}
          >
            <Grid item xs={1} sm={1} lg={1} md={1} className="prescdate">
              <label className="datetext">
                Diagnosis 
              </label>
            </Grid>
            <Grid item xs={11} sm={11} lg={11} md={11} className="prestextfield" style={{ marginBottom: "2px" }}>
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={obj.diagnosis}
                placeholder={obj.diagnosis}
               
              />
            </Grid>
          </Grid> */}

          {/* {GroupArr && Object.keys(GroupArr).length > 0 ? ( */}
          {structure.length > 0 ? (
            <Grid
              spacing={0}
              xs={12}
              lg={12}
              // style={{ marginBottom: "50px" }}
              className="previous-section"
            >
              {structure.length > 0 ? (
                <Grid>{structure}</Grid>
              ) : (
                <div>No stage data found</div>
              )}
            </Grid>
          ) : (
            <div className="no-data-message">{t("No stage data found.")}</div>
          )}



          {/* {!managementData && (
            <div>
              
              <h3 className="insulintext">
                Prescription Pad
                
                </h3>
              <label>Treatment (Rx)</label>
              <div className="insulintable">
                <TableContainer className="insulinbordertable">
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Regimen Type</TableCell>
                        <TableCell align="right">Type of Insulin</TableCell>
                        <TableCell align="right">Name of the insulin</TableCell>
                        <TableCell align="right">Before/After Meal</TableCell>
                        <TableCell align="right">Course of Days</TableCell>
                        <TableCell align="right">Additional Comments</TableCell>
                        <TableCell align="right">Total Daily Dosage (Units)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          align="center"
                          style={{
                            padding: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          Data Not Found
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          )} */}

          <div>
            <h3 className="insulintext">
              Investigations
            </h3>
            {/* <Box display="flex" gap={2} mt={2} className="tables-wrapper"> */}
              {/* Lab Tests Table */}
              {APP_LOCALE === "CC012" ? (
            
           <Box width="100%" mb={4}>
            <Typography variant="h8" sx={{ fontWeight: "bold"}}>
              Lab Test
            </Typography>

            <Grid container spacing={2}>
              {/* Row 1 */}
              <Grid item xs={6}>
                <TextField fullWidth label="Diabetic Profile" value={diabeticprofile || ""} multiline InputProps={{ readOnly: true , sx: { paddingLeft: 2 }, style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }}}  />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Lipid Profile" value={lipidprofile || ""} multiline InputProps={{ readOnly: true , sx: { paddingLeft: 2 }, style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }}} />
              </Grid>

              {/* Row 2 */}
              <Grid item xs={6}>
                <TextField fullWidth label="Liver Function" value={liverfunction || ""} multiline InputProps={{ readOnly: true , sx: { paddingLeft: 2 }, style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }}} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Renal Profile" value={renalprofile || ""} multiline InputProps={{ readOnly: true , sx: { paddingLeft: 2 }, style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }}} />
              </Grid>

              {/* Row 3 */}
              <Grid item xs={6}>
                <TextField fullWidth label="Pancreatic Enzymes" value={pancreaticenzymes || ""} multiline InputProps={{ readOnly: true ,  sx: { paddingLeft: 2 }, style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    } }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Hormonal Assay" value={hormonalassay || ""} multiline InputProps={{ readOnly: true ,  sx: { paddingLeft: 2 } , style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }}} />
              </Grid>

              {/* Row 4 */}
              <Grid item xs={6}>
                <TextField fullWidth label="Haematology" value={haematology || ""} multiline InputProps={{ readOnly: true, sx: { paddingLeft: 2 } ,style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    } }} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Pathology / Microbiology" value={pathology || ""} multiline InputProps={{ readOnly: true ,  sx: { paddingLeft: 2 }, style: {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    }}} />
              </Grid>
            </Grid>
          </Box>

          ) : (
              <TableContainer component={Paper} sx={{ flex: 1, p: 1, boxShadow: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#e0f7fa" }}>
                        Lab Tests
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* {labRows?.map((row) => (
              <TableRow key={row.id}>
                {row.selectedTest?.value && (
                  <TableCell align="center" sx={{ py: 1, borderRadius: 1, bgcolor: "#f5f5f5" }}>
                    <div className="test-info">{row.selectedTest?.label}</div>
                  </TableCell>
                )}
              </TableRow>
            ))} */}
                    {navigator.onLine ? (
                      labRows?.map((row) => (
                        <TableRow key={row.id}>
                          {row.selectedTest?.value && (
                            <TableCell align="center" sx={{ py: 1, borderRadius: 1, bgcolor: "#f5f5f5" }}>
                              <div className="test-info">{row.selectedTest?.label}</div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      labRowsOffline?.map((row) => (
                        <TableRow key={row.id}>
                          {row.selectedTest?.value && (
                            <TableCell align="center" sx={{ py: 1, borderRadius: 1, bgcolor: "#f5f5f5" }}>
                              <div className="test-info">{row.selectedTest?.label}</div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}

                  </TableBody>
                </Table>
              </TableContainer>
              )}

              {/* Radiology Tests Table */}
              <TableContainer component={Paper} sx={{ flex: 1, p: 1, boxShadow: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#e1bee7" }}>
                        Radiology Tests
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {navigator.onLine ? (radRows?.map((row) => (
                      <TableRow key={row.id}>
                        {row.selectedTest?.value && (
                          <TableCell align="center" sx={{ py: 1, borderRadius: 1, bgcolor: "#f5f5f5" }}>
                            <div className="test-info">{row.selectedTest?.label}</div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))) : (radRowsOffline?.map((row) => (
                      <TableRow key={row.id}>
                        {row.selectedTest?.value && (
                          <TableCell align="center" sx={{ py: 1, borderRadius: 1, bgcolor: "#f5f5f5" }}>
                            <div className="test-info">{row.selectedTest?.label}</div>
                          </TableCell>
                        )}
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </TableContainer>
            {/* </Box> */}
          </div>

          <Grid
            container
            spacing={0}
            item
            xs={12}
            className="presinputfields mt-30px justify-content-start"
            style={{ justifyContent: "flex-start" }}
          >
            <Grid item xs={2} sm={2} md={2} lg={2} className="prescdate d-contents">
              <label className="datetext">Follow Up Date</label>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} className="prestextfield pl-10px">
              <TextField
                id="standard-basic"
                label=""
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
                variant="standard"
                value={
                  obj.dateAdvise
                    ? moment(obj.dateAdvise).format("YYYY-MM-DD")
                    : "-"
                }
                placeholder={
                  obj.dateAdvise
                    ? moment(obj.dateAdvise).format("YYYY-MM-DD")
                    : "-"
                }
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={0}
            item
            xs={12}
            className="presinputfields mt-30px"
          >
            <Grid item xs={1} sm={1} md={1} lg={1} className="prescdate d-contents">
              <label className="datetext">Advise</label>
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={11} className="prestextfield pl-10px">
              <TextField
                id="standard-basic"
                label=""
                variant="standard"
                value={obj.advise}
                placeholder={obj.advise}
                InputProps={{
                  classes: {
                    input: "custom-input",
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={0}
            item
            xs={12}
            className="presinputfields mt-30px justify-content-end"
          >
            <Grid item xs={2} sm={2} md={2} lg={2} className="prestextfield doctorssignfield">
              <TextField id="standard-basic" label="" variant="standard" />
              <label className="datetext doctorsign mt-10px">Doctor's Signature</label>
            </Grid>
            {/* <Grid item xs={12} sm={10} md={10} lg={10}></Grid> */}
            {/* <Grid item xs={12} sm={6} md={6} lg={6} className="prescdate">
              
            </Grid> */}
          </Grid>

          <Grid
            container
            spacing={0}
            item
            xs={12}
            className="presinputfields mt-10px d-none"
          >

            {/* <Grid item xs={2}>
            <label className="datetext phoneno">Phone No:</label>
          </Grid>
          <Grid item xs={4} className="prestextfield">
            <TextField id="standard-basic" label="" variant="standard" />
          </Grid> */}
          </Grid>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default PdfComponent;
