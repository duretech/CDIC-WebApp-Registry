import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventNoteIcon from '@material-ui/icons/EventNote';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import PortraitIcon from '@material-ui/icons/Portrait';
import { red } from '@material-ui/core/colors';
import { Trans, useTranslation } from "react-i18next";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: '0 auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const actionColumns = ["edit","followup","view","patientcard",];

const PatientListMobileUI = ({columns, data, itemsPerPage}) => {
  console.log("data: ", columns, data);
  const ITEMS_PER_PAGE = itemsPerPage || 20;
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const handleChange = (event, value) => setPage(value);
  
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!data || data.length === 0) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color:"#000",
        height:"100px",
        width: "100%",
      }}
    >
      <Typography variant="body1" color="textSecondary">
        {t("No data found")}
      </Typography>
    </Box>
  );
}


  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      {currentItems.map((item, index) => {
        const uniqueKey = `${item["UIC"]}-${index}`;
        
        return (
        <Grid item xs={12} sm={12} md={12} className="knowkedgelistcontainer clientListMobileAccordion">
          <Accordion 
            key={uniqueKey}
            expanded={expanded === uniqueKey}
            onChange={handleAccordionChange(uniqueKey)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                width: '100%',
                overflow: 'hidden'
              }}>
                <Typography
                  className={classes.heading}
                  style={{ paddingTop: '10px', display: 'flex', alignItems: 'center' }}
                >
                  <EventNoteIcon />
                </Typography>

                <Typography
                  style={{
                    padding: '10px 15px',
                    wordBreak: 'break-word',
                    flex: 1,
                    minWidth: 0,
                    overflowWrap: 'break-word'
                  }}
                >
                  {item["First name"] || item["First Name"] || item["Patient Name"]}
                </Typography>
              </div>
            </AccordionSummary>
            
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                {columns
                  .filter((col) => 
                    !actionColumns.includes(col.name.toLowerCase()) && 
                    col.name !== "Patient Dashboard" && 
                    col.name !== "Follow up" && 
                    col.name !== "Patient Card"
                  )
                  .map((col, colIndex) => (
                    <p className="alerts_description_fields row-block" key={`${uniqueKey}-col-${colIndex}`}>
                      <div className="fl-left">{col.name}: </div>
                      <div className="fl-left">&nbsp;{item[col.name] || "N/A"}</div>
                    </p>
                  ))}

                <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
                  {actionColumns.map((key, btnIndex) => {
                    const element = item[key];
                    const onClickHandler = element?.props?.onClick;
                     // SKIP conditions
                    if (
                      (key === "followup" && !_.find(columns, { name: "Follow up" })) ||
                      (key === "view" && !_.find(columns, { name: "Patient Dashboard" }))
                    ) {
                      return null;
                    }
                    return (
                      <Button
                        key={`${uniqueKey}-btn-${btnIndex}`}
                        variant="contained" 
                        color="primary" 
                        disableElevation 
                        className="infoviewmorebtn case-action-btn"
                        onClick={(e) => onClickHandler && onClickHandler(e)}
                      >
                        {key === "edit" && <><EditIcon /> <span className="ml-10px"></span></>}
                        {key === "followup" && <><AssignmentTurnedInIcon /> <span className="ml-10px"></span></>}
                        {key === "view" && <><VisibilityIcon /><span className="ml-10px"></span></>}
                        {key === "patientcard" && <><PortraitIcon /> <span className="ml-10px"></span></>}
                      </Button>
                    );
                  })}
                </p>
              </div>
            </AccordionDetails>
          </Accordion>
        </Grid>
        );
      })}

      {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(data.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box> */}
       <div className="Tablepagination mobileClientPagination">
        <Pagination
            count={Math.ceil(data.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handleChange}
            defaultPage={1}
            //color="primary"
            size="small"
            showFirstButton
            showLastButton
            variant="outlined"
            shape="rounded"
            className="TableSubPagination"
        />
        </div>
   </>
  );
};

export default PatientListMobileUI;