import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";

import "../../assets/css/customstyles.css";
import _ from "lodash";
import GeneralTable from "../../component/tables/InsulinTable";
import { Paper, TableContainer } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { APP_LOCALE } from "../../assets/data/config";

const GetInsulinTableDetail = (props) => {
  const { t, i18n } = useTranslation();
  let currentStage = props.currentStage
  let currentStageData = props.currentStageData
  let insulinTableHeader = {};
  let nonInsulinTableHeader = {};
  currentStage.programStageDataElements.map((de) => {
    if (
      _.find(de.dataElement.attributeValues, {
        attribute: { name: "ShowInInsulinTable" },
      }) &&
      _.find(de.dataElement.attributeValues, {
        attribute: { name: "ShowInInsulinTable" },
      }).value == "true"
    ) {
      insulinTableHeader[de.dataElement.id] = de.dataElement.formName;
    }

    if (
      _.find(de.dataElement.attributeValues, {
        attribute: { name: "ShowInNon-InsulinTable" },
      }) &&
      _.find(de.dataElement.attributeValues, {
        attribute: { name: "ShowInNon-InsulinTable" },
      }).value == "true"
    ) {
      nonInsulinTableHeader[de.dataElement.id] = de.dataElement.formName;
    }
  });

  let desiredOrder = [
    "Medication Name",
    "Name of the Insulin",
    "Regime Type",
    "Regimen Type",
    "Type of Insulin",
    // "Frequency",
    "Before/After Meal",
    "Any Other Medications",
    // " Dosage (units/day) ",
    // "Dosage (breakfast)",
    // "Dosage (lunch)",
    // "Dosage (dinner)",
    //"Additional Comments",
    "Total Daily Dosage (Units)",
    "Daily Dosage units",
    "Dosage (units/day)",
    "Course of Days",
    "Any Additional Shot",
    "Reason for the Shot",
    "",
  ];

  // Insert "Frequency" only when APP_LOCALE === "CC006"
  if (APP_LOCALE === "CC006") {
    const index = desiredOrder.indexOf("Before/After Meal");

    if (index !== -1) {
      // Insert Frequency AFTER "Before/After Meal"
      desiredOrder.splice(index + 1, 0, "Frequency");

      // Insert Route BEFORE "Before/After Meal"
      desiredOrder.splice(index, 0, "Route");
    }
  }

  let desiredOrderNonInsulin = [
    "Name of Non-Insulin diabetic medication",
    "Name of Non Insulin Diabetic Medication",
    "Frequency",
    "Dosage units",
    "Before/After Meal",
    "Any Other Medications",
    " Dosage (units/day) ",
    "Dosage (breakfast)",
    "Dosage (lunch)",
    "Dosage (dinner)",
    "Course of Days",
    "Additional Comments"
  ];

  // Reorder the headers
  let reorderedInsulinTableHeader = {};
  let reorderedNonInsulinTableHeader = {};
  if (desiredOrder && insulinTableHeader) {
    desiredOrder.forEach((header) => {
      for (let key in insulinTableHeader) {
        if (insulinTableHeader[key] === header) {
          reorderedInsulinTableHeader[key] = insulinTableHeader[key];
          break;
        }
      }
    });
  }

  if (desiredOrderNonInsulin && nonInsulinTableHeader) {
    desiredOrderNonInsulin.forEach((header) => {
      for (let key in nonInsulinTableHeader) {
        if (nonInsulinTableHeader[key] === header) {
          reorderedNonInsulinTableHeader[key] = nonInsulinTableHeader[key];
          break;
        }
      }
    });
  }

  // setInsulinHeader(reorderedInsulinTableHeader);
  // setNonInsulinHeader(reorderedNonInsulinTableHeader);
  let headerInsulin = reorderedInsulinTableHeader;
  let headerNonInsulin = reorderedNonInsulinTableHeader;

  let sortedEvents = _.filter(currentStageData, {
    programStage: currentStage.id,
  });

  let insulinArr = [];
  let nonInsulinArr = [];
  let uniqueEvents = [];
  if (sortedEvents?.length > 0) {
    sortedEvents.map((event) => {
      let insulinTableObj = {};
      let headers = Object.keys(headerInsulin);
      let matchedData = [];

      // Collect matched data values and their created date
      event.dataValues.forEach((data) => {
        if (headers.includes(data.dataElement)) {
          matchedData.push({
            dataElement: data.dataElement,
            value: data.value,
            created: new Date(data.created),
          });
        }
      });

      matchedData.sort((a, b) => a.created - b.created);

      //  Create the final ordered object with dataElement as key and value as the matched value
      insulinTableObj = matchedData.reduce((acc, curr) => {
        acc[curr.dataElement] = curr.value;
        return acc;
      }, {});

      // Check if insulinArr already contains an object with the same properties as insulinTableObj

      const isDuplicate = insulinArr.some((existingObj) => {
        // Sort the keys of both objects and compare their stringified versions
        const sortedExistingObj = Object.keys(existingObj)
          .sort()
          .reduce((acc, key) => {
            acc[key] = existingObj[key];
            return acc;
          }, {});

        const sortedNewObj = Object.keys(insulinTableObj)
          .sort()
          .reduce((acc, key) => {
            acc[key] = insulinTableObj[key];
            return acc;
          }, {});

        // Compare the sorted objects
        return (
          JSON.stringify(sortedExistingObj) === JSON.stringify(sortedNewObj)
        );
      });
      // const isDuplicate = insulinArr.some(existingObj => {
      //   return JSON.stringify(existingObj) === JSON.stringify(insulinTableObj);
      // });

      // Only push the object if it's not a duplicate
      if (!isDuplicate && Object.keys(insulinTableObj).length > 0) {
        insulinTableObj["eventdetails"] = event;
        insulinArr.push(insulinTableObj);
      }

      // Only push non-empty objects to insulinArr
    });
  }

  if (sortedEvents?.length > 0) {
    sortedEvents.map((event) => {
      let nonInsulinTableObj = {};
      let headers = Object.keys(headerNonInsulin);
      let matchedData = [];

      // Collect matched data values and their created date
      event.dataValues.forEach((data) => {
        if (headers.includes(data.dataElement)) {
          matchedData.push({
            dataElement: data.dataElement,
            value: data.value,
            created: new Date(data.created),
          });
        }
      });

      // Sort by created date
      matchedData.sort((a, b) => a.created - b.created);

      // Create the final ordered object with dataElement as key and value as the matched value
      nonInsulinTableObj = matchedData.reduce((acc, curr) => {
        acc[curr.dataElement] = curr.value;
        return acc;
      }, {});

      const isDuplicate = nonInsulinArr.some((existingObj) => {
        // Sort the keys of both objects and compare their stringified versions
        const sortedExistingObj = Object.keys(existingObj)
          .sort()
          .reduce((acc, key) => {
            acc[key] = existingObj[key];
            return acc;
          }, {});

        const sortedNewObj = Object.keys(nonInsulinTableObj)
          .sort()
          .reduce((acc, key) => {
            acc[key] = nonInsulinTableObj[key];
            return acc;
          }, {});

        // Compare the sorted objects
        return (
          JSON.stringify(sortedExistingObj) === JSON.stringify(sortedNewObj)
        );
      });

      // const isDuplicate = nonInsulinArr.some(existingObj => {
      //   return JSON.stringify(existingObj) === JSON.stringify(nonInsulinTableObj);
      // });

      // Only push the object if it's not a duplicate
      if (!isDuplicate && Object.keys(nonInsulinTableObj).length > 0) {
        nonInsulinTableObj["eventdetails"] = event;
        nonInsulinArr.push(nonInsulinTableObj);
      }
    });
  }
  return (
    <>
      <Grid container spacing={3} style={{ marginTop: "10px" }}>
        <h4 className="ml-10px mt-10px mt-2">{t("Prescription Pad")}</h4>
        <TableContainer
          component={Paper}
          className="ml-10px mr-10px mb-20px sputumtable previousVisitTable"
        >
          <GeneralTable
            table="insulin"
            // stageId={stage.id}
            // currentSectionName={section.name}
            tableData={insulinArr}
            insulinType={"Insulin"}
            tableHeaders={headerInsulin}
            hideDelete= {true}
          />
        </TableContainer>
      </Grid>
{/* 
      <Grid container spacing={3} style={{ marginTop: "10px" }}>
        <h4 className="ml-10px">{t("Non-Insulin Prescription")}</h4>
        <TableContainer
          component={Paper}
          className="ml-10px mr-10px mb-20px sputumtable"
        >
          <GeneralTable
            table="non-insulin"
            // stageId={stage.id}
            // currentSectionName={section.name}
            tableData={nonInsulinArr}
            insulinType={"Non-Insulin"}
            tableHeaders={headerNonInsulin}
            hideDelete= {true}
          />
        </TableContainer>
      </Grid> */}
    </>
  );
  // Your existing logic for getInsulinTableDetail
};

export default GetInsulinTableDetail;
