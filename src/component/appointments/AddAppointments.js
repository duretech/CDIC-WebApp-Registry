import React, { useEffect, useState } from "react";
//Plugins Import
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MuiDialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import CreateStageField from "../fields/CreateStageField";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import axios from "axios";
import moment from "moment";
import { apiServices } from "../../services/apiServices";
import Grid from '@material-ui/core/Grid';
import { useTranslation,Trans } from "react-i18next";
import {
    ReactFinalForm,
  } from "@dhis2/ui";
import swal from "sweetalert";
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {createFormAutoFocusRef,useKeyboardAccessibility} from "../fields/keyboardHelper.js";


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    root: {
        display: 'flex',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
          },
    },
    paper: {
        margin: theme.spacing(1),
        'box-shadow': 'none',
        'margin-bottom': '15px',
        '& .MuiInputBase-root': {
            height: '56px',
            'box-shadow': 'none',
            'border-radius': '4px !important',
        },
        '& .MuiInputBase-input': {
            'padding-left': '15px',
        }
    },
}));

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const AddAppointments = (props) => {
    const setGlobalSpinner = useGlobalSpinnerActionsContext();
    const classes = useStyles();
    const [patientValue, setPatientValue] = useState({});
    const [appointmentStageId, setAppointmentStageId] = useState('');
    const [formFields, setFormFields] = useState([]);
    const { Form, Field, FormSpy } = ReactFinalForm;
    const getAllPatientData = props.allPatientData && props.allPatientData.length > 0 ? props.allPatientData : [];
    const [checked, setChecked] = React.useState(false);
    const [patientInput, setPatientInput] = useState('');
    const { t } = useTranslation();
    //const formAutoFocusRef = createFormAutoFocusRef();
    useKeyboardAccessibility(patientValue);
    const handleTextPatientChange = event => {
        setPatientInput(event?.fisrtname);
    };

    const handleChange = () => {
      setChecked((prev) => !prev);
    };

    const ShowPatVal = (value) => {
        setPatientValue(value);
    }

    function getMandatoryFieldIds(fields) {
        return fields
            .filter((field) => field?.compulsory === true) 
            .map((field) => field?.dataElement?.id); 
    }

    function getFieldByDisplayName(fields, displayName) {
        const matchedField = fields.find(
            (field) => field?.dataElement?.displayName?.includes(displayName)
        );
        return matchedField
            ? { id: matchedField.dataElement.id, value: matchedField.dataElement.value || "" }
            : null;
    }

    function onStageSubmit(values, index) {
        setGlobalSpinner(true);
        const mandatoryFieldIds = getMandatoryFieldIds(formFields || []);
        const missingFields = mandatoryFieldIds.filter((id) => !values[id]);
        if (missingFields.length > 0) {
            setGlobalSpinner(false);
            swal({
                text: t("Please fill all mandatory fields"),
                icon: "warning",
                button: t("Close"),
            });
            return;
        }

        const timeFromField = getFieldByDisplayName(formFields, "Time From");
        const timeToField = getFieldByDisplayName(formFields, "Time To");
    
        if (timeFromField && timeToField) {
            const timeFromValue = values[timeFromField.id];
            const timeToValue = values[timeToField.id];
            if(timeFromValue > timeToValue){
                setGlobalSpinner(false);
                swal({
                    title: t("Invalid Time Selection"),
                    text: t('Time To should be greater than Time From'),
                    icon: "warning",
                    buttons: t("Close"),
                  });
                return
              }
    
        } 

        const inputPatientName = document.getElementById("standard-required").value;
        if(inputPatientName && inputPatientName.length > 0 && checked) {
          
            setPatientValue({});
            addNewPatientAppointment(inputPatientName,values);
            setGlobalSpinner(true);
        } else if(patientValue && Object.keys(patientValue).length > 0) {
            setPatientInput('');
            updateAppointmentInUserProfile(patientValue.instanceuid,values)
        } 
        // else if (!values[`jfdXhr6gSrU`] || !values[`j1lyw0sG46L`] || !values[`H3oyWHEi28g`]){
        //     setGlobalSpinner(false);
        //     swal({
        //         // title: "Error",
        //         text: 'Please fill all Mandatory fields.',
        //         icon: "warning",
        //         button: "Close",
        //     });
        //     return
        // }
        else {
            setGlobalSpinner(false);
            if (!patientValue || Object.keys(patientValue).length === 0 && !checked) {
                swal({
                    title: t("Select Patient"),
                    text: t("Please Select Patient"),
                    icon: "warning",
                    buttons: t("Close"),
                  });
                return;
              }
              else if (!inputPatientName || inputPatientName.length === 0) {
                swal({
                    title: t("Patient Name"),
                    text: t("Enter Patient Name"),
                    icon: "warning",
                    buttons: t("Close"),
                  });
                return;
              }  
            return
        }
    }

    const addNewPatientAppointment = (newPatientName, otherData) => {
        setGlobalSpinner(true);
        let paramObj = {}
        // if(otherData && Object.keys(otherData).length > 0 && Object.keys(otherData).length === 4) {
            let objectKeys = Object.keys(otherData);
            formFields && formFields.length > 0 && formFields.map((fields) => {
                if(objectKeys.includes(fields.dataElement.id)) {
                    paramObj[fields.dataElement.description] = otherData[fields.dataElement.id]
                }
            })
        // } else {
        //     setGlobalSpinner(false);
        //     swal({
        //         // title: "Error",
        //         text: 'Please fill all Mandatory fields.',
        //         icon: "warning",
        //         button: "Close",
        //     });
        //     return;
        // }

        let pJson = {
            "patientname": newPatientName,
            "visitpurpose": paramObj['Reason for Appointment'],
            "appointmentdate": moment(paramObj['Date of Appointment']).format("YYYY-MM-DD"),
            "timefrom": paramObj['Time From'],
            "timeto": paramObj['Time To'],
            "sourcefrom":"App"
        }

        apiServices
        .postAPI('dashboardIndicator/insertAppointmentDetails',pJson)
        .then(
            response => {
                swal({
                    title: t("Done"),
                    text: t("Appointment Booked!"),
                    icon: "success",
                    button: t("Close"),
                }).then(response=>{
                    props.closeDialog(); 
                    props.updateCalender();
                });
                setGlobalSpinner(false);
            }
        )
        setGlobalSpinner(false);
    }

    const updateAppointmentInUserProfile = (trackEntityId,submittedData) => { //Update Patient Data with Appointment Details
        let dataVal = [];
      //  if(Object.keys(submittedData).length > 0 && Object.keys(submittedData).length === 5) {
        let ObjKeys = Object.keys(submittedData);
        ObjKeys.forEach((obj) => {
            let newObj = {};
            newObj["dataElement"] = obj;
            newObj["value"] = submittedData[obj];
    
            // Only push to dataVal if dataElement is not "undefined"
            if (newObj["dataElement"] !== "undefined") {
                dataVal.push(newObj);
            }
        });
        // } else {
        //     setGlobalSpinner(false);
        //     swal({
        //         title: "Error",
        //         text: 'Please fill all fields.',
        //         icon: "error",
        //         button: "Close",
        //     });
        //     return;
        // }

        let pJson = {
            "events": [
                {
                    "trackedEntityInstance": trackEntityId,
                    "program": props.programData.programs[0].id,
                    "programStage": appointmentStageId,
                    "enrollment": "",
                    "orgUnit": props.sessionUserBoValue.organisationUnits[0].id,
                    "notes": [],
                    "dataValues": dataVal,
                    "status": "COMPLETED",
                    "eventDate": moment(new Date()).format("YYYY-MM-DD")
                }
            ]
        }

        apiServices
        .postAPI('33/events?strategy=CREATE_AND_UPDATE', pJson)
        .then(response => {
            if (response.status === "ERROR") {
                // Extracting the error message if available
                const errorMessage = "Please check the entered data";
                setGlobalSpinner(false);
                swal({
                    title: t("Error"),
                    text: errorMessage,
                    icon: "error",
                    button: t("Close"),
                });
            } else {
                swal({
                    title: t("Done"),
                    text: t("Appointment Booked!"),
                    icon: "success",
                    button: t("Close"),
                }).then(() => {
                    props.closeDialog();
                    props.updateCalender();
                });
            }
            setGlobalSpinner(false);
        })
        .catch(error => {
            // Handle any API request errors
            swal({
                title: t("Error"),
                text: t("Something went wrong while booking the appointment."),
                icon: "error",
                button: t("Close"),
            });
            setGlobalSpinner(false);
        });
    }

    function AppointmentForm(values) { 
        let programStages =  props.programData.programs[0].programStages;
        return programStages && programStages.map((program) => {
            if(program.description == "Appointments") {
                setAppointmentStageId(program.id)
                setFormFields(program.programStageDataElements)
                // console.log("Mandatory Fields:", program.programStageDataElements);
                return program.programStageDataElements && program.programStageDataElements.map((fields) => {
                    return (    
                            <CreateStageField
                            fieldData={fields}
                            values={values}
                            programRules={[]}
                            programData={props.programData.programs[0]}
                            programRulesVariables={[]}
                            dataElementGroup={[]}
                            stages={program.programStageDataElements}
                            orgid={props.sessionUserBoValue.organisationUnits[0].id}
                            OUJSON={[]}
                            customfieldobj={[]}
                            programBoDetails={props.programBoDetails}
                            Configuration={props.Configuration}
                            customClassName={
                                localStorage.getItem("fontSize")
                                ? "FS" + localStorage.getItem("fontSize")
                                : ""
                            }
                            pageType="Appointment"
                            />
                      );
            })
            }
        })
    }
    
    return (
        <DialogContent dividers className="select-dialog">
            <Autocomplete
                id="country-select-demo"
                style={{ width: 500, padding:'0px 20px', marginTop:'20px'  , marginBottom:"22px" }}
                options={getAllPatientData}
                onChange={(event, newValue) => {
                    handleTextPatientChange(newValue)
                    ShowPatVal(newValue);
                }}
                classes={{
                    option: classes.option,
                }}
                autoHighlight
                getOptionLabel={(option) => option.fisrtname}
                renderOption={(option) => (
                    <React.Fragment>
                    {option.fisrtname} - ({option.uic})
                    </React.Fragment>
                )}
                renderInput={(params) => (
                    <>
                    <label> {t("Choose a Patient")} <span >*</span></label>
                    <TextField
                    {...params}
                    label=""
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    autoFocus
                    />
                    </>
                )}
            />
            <Grid xs={12} md={12} style={{ textAlign: "right", padding: "0 10px" , marginBottom:"10px" }}>
                <FormControlLabel
                    control={<Typography variant="caption" display="block" gutterBottom onClick={handleChange}>{t("New patient? Click here.")}</Typography>}
                />
               
                <Collapse in={checked}>
                
                    <Paper elevation={4} className={classes.paper}>
                    <label> {t("Patient Name")} <span>*</span></label>
                        <TextField id="standard-required"  
                        label=""
             variant="outlined" value={patientInput} onChange={handleTextPatientChange}/>
                    </Paper>
                </Collapse>
            </Grid>
            <Grid xs={12} md={12}>
                <Form
                    onSubmit={onStageSubmit}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form
                        //ref={formAutoFocusRef}
                        className="fullWidth addappointmentform"
                        onSubmit={handleSubmit}
                        encrypt="multipart/form-data"
                    >
                        {
                            AppointmentForm(values)
                        }
                            <div className="buttons btn-specimen">
                                <button
                                    className="regformsubmitbtn"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    <Trans>Submit</Trans>
                                </button>
                            </div>
                    </form>
                    )}
                />
            </Grid>
        </DialogContent>
    )
}

export default AddAppointments