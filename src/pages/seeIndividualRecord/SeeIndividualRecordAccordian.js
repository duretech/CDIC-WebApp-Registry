import React, { useEffect, useState } from "react";
import { apiServices } from "../../services/apiServices";
import moment from "moment";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";

import Avatar from "@material-ui/core/Avatar";
import DescriptionIcon from "@material-ui/icons/Description";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import swal from "sweetalert";
import { useHistory } from "react-router";

import "../../assets/css/customstyles.css";

import { useLocation } from "react-router-dom";
import OfflineDb from "../../db";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import { useTranslation } from "react-i18next";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "#4DB6AC",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

function SeeIndividualRecordAccordian({ currentStage }) {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [sessionUserBoValue, setSessionUserBoValue] = useState(null);
  const [sessionMetaData, setSessionMetaData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const setGlobalSpinner = useGlobalSpinnerActionsContext();
  const [activeCaseDetails, setActiveCaseDetails] = useState(null);
  async function getUserMeta() {
    let CaseDetails = await OfflineDb.getDataFromPouchDB("activeCaseDetails");
    setActiveCaseDetails(CaseDetails);

    let metadata = await OfflineDb.getDataFromPouchDB("metaData");
    setSessionMetaData(metadata.data);

    let userdata = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(userdata.data);
  }

  useEffect(() => {
    getUserMeta();
    setGlobalSpinner(false);
  }, []);

  useEffect(() => {
    if (sessionUserBoValue != null && activeCaseDetails != null) {
      if(activeCaseDetails.data) {
        getDetails();
      }
      
    }
  }, [sessionUserBoValue, activeCaseDetails]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function getDetails() {
    setGlobalSpinner(true);
    const programId = sessionUserBoValue.programs[0];
     
    const getURL =
      "trackedEntityInstances/" +
      activeCaseDetails.data.trackedEntityInstance +
      ".json?program=" +
      programId +
      "&fields=*?";
    apiServices
      .getAPI(getURL)
      .then((res) => {
        setGlobalSpinner(false);
        let allEvents = res.data.enrollments[0].events;
        setEventsData(allEvents);
        if (allEvents.length == 0 || allEvents.length < 1) {
          // swal({
          //   title: t("Success"),
          //   text: t("No records found"),
          //   icon: "success",
          //   button: t("Close"),
          // }).then((res) => {
          //   if (res) {
          //     history.goBack();
          //     //   history.push('layout/cases')
          //   }
          // });
        }
      })
      .catch((error) => {
        setGlobalSpinner(false);
        swal({
          title: "Error",
          text: error,
          icon: "error",
          button: "Close",
        });
      });
  }
  function createStructure(events) {
    const dataElements = sessionMetaData.dataElements;

    return events.dataValues.map((values, i) => {
      return sessionMetaData.programs[0].programStages.map((stages) => {
        let filterFieldData = stages.programStageDataElements.filter(
          (obj) => obj.dataElement.id == values.dataElement
        );
        if (filterFieldData.length > 0) {
          const filterShowFlagAttr =
            filterFieldData[0].dataElement.attributeValues.filter(
              (obj) => obj.attribute.displayName == "enableInIndividualRecord"
            );

          if (filterShowFlagAttr.length > 0) {
            return (
              <ListItem key={i}>
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                </ListItemAvatar>
                <Typography>
                  <span className="zero servicequestiontitle">
                    {filterFieldData[0].dataElement.displayName} :{" "}
                  </span>
                  &nbsp;
                  <span className="zero servicequestionanswer">
                    {values.value}
                  </span>
                </Typography>
              </ListItem>
            );
          }
        }
      });
    });
  }

  function getEntityData(events, i) {
    const classes = makeStyles((theme) => ({
      root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      },
    }));

    const allStages = sessionMetaData.programs[0].programStages;

    const filterStageEvent = allStages.filter(
      (obj) => obj.id == events.programStage && currentStage.id == obj.id
    );

    if (!filterStageEvent.length) {
      return null;
    }
    return (
      <>
        {/* <Grid item xs={12} sm={6} md={4} key={i}>
          <Card className={classes.root}>
            <CardHeader
              className="casescardheader"
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  <DescriptionIcon />
                </Avatar>
              }
              title={moment(events.lastUpdatedAtClient).format(
                "MMMM Do YYYY, h:mm a"
              )}
              subheader={filterStageEvent[0].description}
            />

            <CardContent className="zero caselistholder serviceslist seviceslist-cardbody">
              <List className={classes.root}>{createStructure(events)}</List>
            </CardContent>
          </Card>
        </Grid> */}
        <Grid item xs={12} sm={12} md={12} key={i} className="mb-10px">
          <Accordion
            expanded={
              expanded ===
              (moment(events.lastUpdatedAtClient).format("MMMM Do YYYY, h:mm a") + events.event)
            }
            onChange={handleChange(
              (moment(events.lastUpdatedAtClient).format("MMMM Do YYYY, h:mm a") + events.event)
            )}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                {moment(events.lastUpdatedAtClient).format(
                  "MMMM Do YYYY, h:mm a"
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List className={classes.root}>{createStructure(events)}</List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </>
    );
  }

  return (
    <section
      className="individualrecord"
      style={{
        backgroundColor: "#fff",
        flexGrow: 1,
        padding: 0,
      }}
    >
      <div className="searchformcontainer">
        {eventsData != null && eventsData.length > 0 ? (
          <Grid container className="mt-30px mb-30px">
            {eventsData.map((events, i) => {
              return getEntityData(events, i);
            })}
          </Grid>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}
export default SeeIndividualRecordAccordian;
