import React, { useEffect, useState } from "react";
//Plugins Import
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MuiDialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import CreateStageField from "../../../component/fields/CreateStageField";
import { useGlobalSpinnerActionsContext } from "../../../context/GlobalSpinnerContext";
import axios from "axios";
import moment from "moment";
import { apiServices } from "../../../";
import Grid from '@material-ui/core/Grid';
import { Trans } from "react-i18next";
import {
    ReactFinalForm,
  } from "@dhis2/ui";
import swal from "sweetalert";
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

    const handleTextPatientChange = event => {
        setPatientInput(event.target.value);
    };

    const handleChange = () => {
      setChecked((prev) => !prev);
    };

    const ShowPatVal = (value) => {
        setPatientValue(value);
    }

    function onStageSubmit(values, index) {
        setGlobalSpinner(true);
        if(patientInput && patientInput.length > 0) {
            setPatientValue({});
            addNewPatientAppointment(patientInput,values);
        } else if(patientValue && Object.keys(patientValue).length > 0) {
            setPatientInput('');
            updateAppointmentInUserProfile(patientValue.instanceuid,values)
        } else {
            setGlobalSpinner(false);
            return
        }
    }

    const addNewPatientAppointment = (newPatientName, otherData) => {
        setGlobalSpinner(true);
        let paramObj = {}
        if(otherData && Object.keys(otherData).length > 0 && Object.keys(otherData).length === 4) {
            let objectKeys = Object.keys(otherData);
            formFields && formFields.length > 0 && formFields.map((fields) => {
                if(objectKeys.includes(fields.dataElement.id)) {
                    paramObj[fields.dataElement.description] = otherData[fields.dataElement.id]
                }
            })
        } else {
            setGlobalSpinner(false);
            swal({
                title: "Error",
                text: 'Please fill all fields.',
                icon: "error",
                button: "Close",
            });
            return;
        }

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
                    title: "Done",
                    text: 'Appointment Booked!',
                    icon: "success",
                    button: "Close",
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
        if(Object.keys(submittedData).length > 0 && Object.keys(submittedData).length === 4) {
            let ObjKeys = Object.keys(submittedData);
            ObjKeys.forEach((obj) => {
                let newObj = {}
                newObj["dataElement"] = obj;
                newObj["value"] = submittedData[obj];
                dataVal.push(newObj)
            })
        } else {
            setGlobalSpinner(false);
            swal({
                title: "Error",
                text: 'Please fill all fields.',
                icon: "error",
                button: "Close",
            });
            return;
        }

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
        .postAPI('33/events?strategy=CREATE_AND_UPDATE',pJson)
        .then(
            response => {
                swal({
                    title: "Done",
                    text: "Appointment Booked!",
                    icon: "success",
                    button: "Close",
                }).then(response=>{
                    props.closeDialog(); 
                    props.updateCalender();
                });
                setGlobalSpinner(false);
            }
        )
    }

    function AppointmentForm(values) {
        let programStages =  props.programData.programs[0].programStages;
        return programStages && programStages.map((program) => {
            if(program.description == "Appointments") {
                setAppointmentStageId(program.id)
                setFormFields(program.programStageDataElements)
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
                style={{ width: 500, padding:'0px 20px', marginTop:'20px' }}
                options={getAllPatientData}
                onChange={(event, newValue) => {
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
                    <TextField
                    className="appointments-select-input"
                    {...params}
                    label="Choose a Patient"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                    />
                )}
            />
            <Grid xs={12} md={12} style={{ textAlign: "right", padding: "0 10px" }}>
                <FormControlLabel
                    control={<Typography variant="caption" display="block" gutterBottom onClick={handleChange}>{t("New patient? Click here.")}</Typography>}
                />
                <Collapse in={checked}>
                    <Paper elevation={4} className={classes.paper}>
                        <TextField id="standard-required" label="Patient Name" variant="outlined" value={patientInput} onChange={handleTextPatientChange}/>
                    </Paper>
                </Collapse>
            </Grid>
            <Grid xs={12} md={12}>
                <Form
                    onSubmit={onStageSubmit}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form
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