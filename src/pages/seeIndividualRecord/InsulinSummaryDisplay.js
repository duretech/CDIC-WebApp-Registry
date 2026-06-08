import React, { useState, useEffect } from "react";
import { Typography, Paper, Grid } from "@material-ui/core";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { APP_LOCALE } from "../../assets/data/config";

const InsulinSummaryDisplay = (props) => {
  const { t } = useTranslation();
  const currentStage = props.currentStage;
  const currentStageData = props.currentStageData;
  // ✅ Store medNameId once safely
  const [medNameId, setMedNameId] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("insulinNameID")) {
      setMedNameId(localStorage.getItem("insulinNameID"));
    }
  }, [localStorage.getItem("insulinNameID")]);

  // Build header mapping based on the "ShowInInsulinTable" attribute
  let insulinTableHeader = {};
  currentStage.programStageDataElements.forEach((de) => {
    const attr = _.find(de.dataElement.attributeValues, {
      attribute: { name: "ShowInInsulinTable" },
    });
    if (attr && attr.value === "true") {
      insulinTableHeader[de.dataElement.id] = de.dataElement.formName;
    }
  });

  // Define desired order for display
  const desiredOrder = [
    "Regime Type",
    "Regimen Type",
    "Type of Insulin",
    "Medication Name",
    "Name of the Insulin",
    "Frequency",
    "Before/After Meal",
    "Meal",
    "Any Other Medications",
    "Course of Days",
    "Duration",
    "Additional Comments",
    "Total Daily Dosage (Units)",
    "Daily Dosage (Units)",
    "Daily Dosage units",
    "Dosage (units/day)",
    "Any Additional Shot",
    "Reason for the Shot",
    "Dosage (breakfast)",
    "Dosage (lunch)",
    "Dosage (dinner)",
    " Dosage (units/day) ",
    "Time units",
    "Dosage units",
  ];

  // Reorder header mapping
  let reorderedHeader = {};
  desiredOrder.forEach((headerLabel) => {
    Object.keys(insulinTableHeader).forEach((key) => {
      if (insulinTableHeader[key].trim().toLowerCase() === headerLabel.trim().toLowerCase()) {
        reorderedHeader[key] = insulinTableHeader[key];
      }
    });
  });

  // Filter events for current stage
  const sortedEvents = _.filter(currentStageData, {
    programStage: currentStage.id,
  });

  // Build insulin array
  let insulinArr = [];
  if (sortedEvents && sortedEvents.length > 0) {
    sortedEvents.forEach((event) => {
      let insulinObj = {};
      const headers = Object.keys(reorderedHeader);
      let matchedData = [];

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

      insulinObj = matchedData.reduce((acc, curr) => {
        acc[curr.dataElement] = curr.value;
        return acc;
      }, {});

      if (Object.keys(insulinObj).length > 0) {
        insulinObj["eventdetails"] = event;
        insulinArr.push(insulinObj);
      }
    });
  }

  // Helper to extract field value
const getFieldValue = (entry, fieldLabel) => {

  // Find the key in reorderedHeader that matches the given field label
  const key = Object.keys(reorderedHeader).find(
    (k) => reorderedHeader[k]?.trim().toLowerCase() === fieldLabel?.trim().toLowerCase()
  );

  // Retrieve value from either entry directly or from eventdetails.dataValues
  if (key && entry) {
    return (
      entry[key] ||
      entry?.eventdetails?.dataValues?.find((d) => d.dataElement === key)?.value ||
      t("N/A")
    );
  }

  // Fallback if key not found
  return t("N/A");
};


  // Render summary
  const renderInsulinSummary = () => {
    return insulinArr.map((entry, index) => {
      const insulinName = getFieldValue(entry, "Name of the Insulin");
      const insulinType = getFieldValue(entry, "Type of Insulin");
      const dosage = getFieldValue(entry, "Dosage (units/day) ") ? getFieldValue(entry, " Dosage (units/day) ") : t("N/A");
      const mealTiming = APP_LOCALE != "CC005"?(getFieldValue(entry, "Before/After Meal") ? getFieldValue(entry, "Before/After Meal") : t("N/A"))
        : getFieldValue(entry, "Meal")?getFieldValue(entry, "Meal"):t("N/A");
      const regimen =
        getFieldValue(entry, "Regimen Type") ||
        getFieldValue(entry, "Regime Type");
      const durationLabel = APP_LOCALE == "CC013"  ? "Duration" : "Course of Days"
      const duration = getFieldValue(entry, durationLabel) ? getFieldValue(entry, durationLabel) : t("N/A");
      const dailyDosageLabel = APP_LOCALE == "CC006" ? "Dosage (units/day)" : APP_LOCALE == "CC013" ? "Daily Dosage (Units)" : "Total Daily Dosage (Units)"
      const breakfastDosage = getFieldValue(entry, dailyDosageLabel) ? getFieldValue(entry, dailyDosageLabel) :  t("N/A");  
      const lunchDosage = getFieldValue(entry, "Dosage (lunch)") ?? 0;
      const dinnerDosage = getFieldValue(entry, "Dosage (dinner)") ?? 0;
      const timeUnits = getFieldValue(entry, "Time units") ?? '';
      const dosageUnits = getFieldValue(entry, "Dosage units") ?? '';

      // ✅ Compute medicationName inline (no hooks inside map)
      const medicationName =
        medNameId &&
        entry?.eventdetails?.dataValues?.find(
          (d) => d.dataElement === medNameId
        )?.value;
      return (
        <Grid item xs={10} key={index}>
          <div style={{ marginBottom: "16px" }}>
            <Typography variant="subtitle1">
              <b>{medicationName ? medicationName : ""}</b>
              {regimen ? ` (${regimen!="N/A" ? regimen : t("Non-Insulin Medication")})` : ""}
            </Typography>
            <Typography variant="body1">
              {/* {`${dosage} | ${mealTiming} | ${breakfastDosage} | ${duration} days`} */}
              {`Meal: ${mealTiming} | Dosage: ${breakfastDosage} ${dosageUnits ? dosageUnits != "N/A" ? " ("+dosageUnits+")" : '' : '' } | Duration: ${duration}${duration !== "N/A" ? timeUnits ?  timeUnits != "N/A" ? " ("+timeUnits+")" : '' : " days" : ""}`}
            </Typography>
          </div>
        </Grid>
      );
    });
  };

  return (
    <div>
      <Typography variant="" gutterBottom>
        {/* {t("Basal Bolus Regimen")} */}
      </Typography>
      {renderInsulinSummary()}
    </div>
  );
};

export default InsulinSummaryDisplay;
