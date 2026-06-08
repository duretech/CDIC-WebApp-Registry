import React from "react";
import {
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
const GeneralTable = ({
  table,
  currentSectionName,
  tableData,
  insulinType,
  tableHeaders,
  handleRemove,
  hideDelete,
}) => {
  const { t, i18n } = useTranslation();
  // Identify all the headers containing "dosage"
  const keysWithDosage = [];
  const dosageHeaders = [];
  for (const [key, value] of Object.entries(tableHeaders)) {
    if (
      value &&
      ["dosage (breakfast)", "dosage (lunch)", "dosage (dinner)"].includes(
        value.toLowerCase()
      )
    ) {
      keysWithDosage.push(key);
      dosageHeaders.push(value);
    }
  }
  const getKeyByHeader = (headers, label) => {
    const target = label.toLowerCase();
    return Object.keys(headers).find(
      (key) => headers[key]?.toLowerCase() === target
    );
  };

  const DAILY_DOSAGE_KEY = getKeyByHeader(tableHeaders, "Daily Dosage (Units)");
  const DOSAGE_UNITS_KEY = getKeyByHeader(tableHeaders, "Dosage units");
  const DURATION_KEY = getKeyByHeader(tableHeaders, "Duration");
  const TIME_UNITS_KEY = getKeyByHeader(tableHeaders, "Time units");

  return (
    <>
      <Grid style={{ marginTop: "2px" }}>
        <TableContainer
          component={Paper}
          className={table === "insulin" ? "customTable" : ""}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {Object.keys(tableHeaders).map((header, index) => {
                  if (keysWithDosage.includes(header) || (TIME_UNITS_KEY && header == TIME_UNITS_KEY) || (DOSAGE_UNITS_KEY && header == DOSAGE_UNITS_KEY)) return null;
                  return (
                    <TableCell key={`${header}-${index}`}>
                      {t(tableHeaders[header])}
                    </TableCell>
                  );
                })}
                {dosageHeaders.length > 0 && (
                  <TableCell key="dosage">{t("Dosage")}</TableCell>
                )}
                {hideDelete ? null : <TableCell>{t("Remove")}</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={`${row[insulinType] || "row"}-${index}`}>
                  {Object.keys(tableHeaders).map((header) => {
                    // Skip helper keys that are merged into other columns
                    if (keysWithDosage.includes(header) || (TIME_UNITS_KEY && header == TIME_UNITS_KEY) || (DOSAGE_UNITS_KEY && header == DOSAGE_UNITS_KEY)) return null;

                    let cellValue = "N/A";

                    if (header === DAILY_DOSAGE_KEY) {
                      const val = row[DAILY_DOSAGE_KEY];
                      const unit = DOSAGE_UNITS_KEY && row[DOSAGE_UNITS_KEY] ? " ("+row[DOSAGE_UNITS_KEY]+")" : '';
                      cellValue = val ? `${t(val)} ${t(unit) || ""}` : "N/A";
                    } 
                    else if (header === DURATION_KEY) {
                      const val = row[DURATION_KEY];
                      const unit = TIME_UNITS_KEY && row[TIME_UNITS_KEY] ? " ("+row[TIME_UNITS_KEY]+")" : '';
                      // Only show unit if the duration value exists
                      cellValue = val ? `${t(val)} ${t(unit) || ""}` : "N/A";
                    } 
                    else {
                      cellValue = t(row[header]) || "N/A";
                    }

                    return (
                      <TableCell key={`${header}-${index}`}>
                        {cellValue}
                      </TableCell>
                    );
                  })}
                  {dosageHeaders.length > 0 && (
                    <TableCell>
                      {keysWithDosage
                        .map((header) => row[header] || 0)
                        .join("-")}
                    </TableCell>
                  )}
                  {hideDelete ? null : (
                    <TableCell
                      onClick={() => {
                        handleRemove(
                          tableData,
                          row.eventdetails ? row.eventdetails.event : "NA",
                          // row.eventid ? row.eventid : "NA",
                          index,
                          table
                        );
                      }}
                    >
                      <RemoveOutlinedIcon className="removeIcon" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default GeneralTable;
