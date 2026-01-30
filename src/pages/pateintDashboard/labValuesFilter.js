import React, { useState } from "react";
import HealthMetricIndicator from "./HealthMetric";
import { Autocomplete, TextField, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";

// Function to get the latest three entries from events
function getLatestThreeEntries(events, key) {
    let result = [];
  
    // Handle null, undefined, or empty array cases
    if (!events || events.length === 0) {
      return Array(3).fill({ date: "NA", value: "NA" });
    }
  
    for (let event of events) {
      let dataValue = event.dataValues.find(dv => dv.dataElement === key);
      if (dataValue) {
        result.push({
          date: event.eventDate.split("T")[0], // Extracting date part
          value: dataValue.value
        });
      }
    }
  
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    while (result.length < 3) {
      result.push({ date: "NA", value: "NA" });
    }
  
    return result.slice(0, 3); // Return latest three or "NA" placeholders
  }
  


// Lab filter component
const LabValuesFilter = ({ labValues, onFilterChange }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const { t } = useTranslation()

  const handleChange = (event, newValues) => {
    setSelectedValues(newValues);
    onFilterChange(newValues.map(v => v.key));
  };

  console.log("LabValues",labValues)

  const isDrop = sessionStorage.getItem('userRoles') === 'DROP-HCP';

const filteredLabValues = isDrop
  ? labValues.filter(
      (item) =>
        ![
          "Glucose values from meter (mean)(mg/dl)",
          "Pulse(bpm)",
          "Glycemia(mg/dl)",
          "Patient Estimated Blood Glucose Range (Minimum)(mg/dl)",
          "Patient Estimated Blood Glucose Range (Maximum)(mg/dl)",
          "BMI Z Score"
        ].includes(item.displayName)
    )
  : labValues;

  return (
    <Autocomplete
      multiple
      options={filteredLabValues}
      getOptionLabel={(option) => option.displayName}
      value={selectedValues}
      onChange={handleChange}
      disablePortal
      PopperProps={{
        modifiers: [
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              boundary: "viewport",
            },
          },
        ],
      }}
      sx={{
        width: "100%",
        "& .MuiAutocomplete-inputRoot": {
          minHeight: "48px",
        },
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip key={option.key} label={option.displayName} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={t("Filter by Lab Values")}
          InputLabelProps={{ shrink: true }}
          sx={{
          "& .MuiOutlinedInput-root": {
            paddingTop: { xs: "12px", sm: "8px" }, // gives room for label on mobile
            flexWrap: "wrap", // allows chips to wrap properly
            alignItems: "flex-start", // keeps label above chips
          },
          "& .MuiInputLabel-root": {
            padding: "0 4px",
            top: { xs: "-22px", sm: "-4px" }, // slightly lift label
          },
          "& .MuiInputBase-input": {
            minWidth: "60px", // avoids input shrink on chip overflow
          },
        }}
        />
      )}
    />
  );
};

// Table component for lab values
const LabValuesTable = ({ selectedLabs, events, labValues, filterObject}) => {
  return (
    <div>
      {selectedLabs.map((labKey) => {
        const latestRecords = getLatestThreeEntries(events, labKey);
        console.log(latestRecords, 'records')
        const labDisplayName = labValues.find(lab => lab.key === labKey)?.displayName || 'NA';
        return (
          <TableContainer component={Paper} key={labKey} style={{ marginTop: "20px" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "30%", fontWeight: "bold" }}>Lab Test</TableCell>
                  {latestRecords.map((record, index) => (
                    <TableCell key={`${labKey}-${record.date}-${index}`}  style={{ width: "15%", fontWeight: "bold", textAlign: "center" }}>
                      {record.date}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "30%" }}>{labDisplayName}</TableCell>
                  {latestRecords.map((record, index) => {
                     const nextIndex = index + 1;
                     const prevValue = nextIndex < latestRecords.length ? latestRecords[nextIndex]?.value : 'NA';
                     const currValue = record.value !== "NA" ? record.value : 'NA';
                 
                     console.log(`prevValue: ${prevValue}, currValue: ${currValue}`);

                    return (
                        <TableCell key={`${labKey}-${record.date}-${index}`} style={{ width: "15%", textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <HealthMetricIndicator
                                    prevValue={prevValue}
                                    currValue={currValue}
                                    metric={labKey}
                                    filterObject={filterObject}
                                />
                                <span style={{ marginLeft: "5px" }}>{record.value}</span>
                            </div>
                        </TableCell>
                    );
                })}

                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );
      })}
    </div>
  );
};

// Parent Component
const LabDashboard = ({ labValues, events, filterObject}) => {
    console.log(filterObject, "obj")
  const [selectedLabs, setSelectedLabs] = useState([]);

  return (
    <div>
      <div className="responsiveDiv">
        <LabValuesFilter labValues={labValues} onFilterChange={setSelectedLabs} />
      </div>
      <LabValuesTable selectedLabs={selectedLabs} events={events} labValues={labValues} filterObject={filterObject}/>
    </div>
  );
};

export default LabDashboard;
