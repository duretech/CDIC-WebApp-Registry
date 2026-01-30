import React, { useState, useEffect } from 'react';
import { withTranslation, Trans } from 'react-i18next';
import OfflineDb from '../../db'
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import CreateField from '../../component/fields/CreateSurveyField'
import classes from '../../App.module.css'
import moment from 'moment';
import swal from 'sweetalert'
import {useHistory} from "react-router-dom";
import { useGlobalSpinnerActionsContext } from '../../context/GlobalSpinnerContext'
import { ButtonStrip, InputFieldFF, SingleSelectFieldFF, ReactFinalForm, hasValue, AlertBar, CircularLoader, CenteredContent } from '@dhis2/ui';
import DateFnsUtils from '@date-io/date-fns';
import _ from 'lodash';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  import Rating from '@material-ui/lab/Rating';
  import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { apiServices } from '../../services/apiServices';
const { Form, Field, FormSpy } = ReactFinalForm

function Survey() {

    const [surveyFormData, setSurveyFormData] = useState(null)
    const [surveyDataSet, setSurveyDataSet] = useState(null)
    const [programRules, setProgramRules] = useState(null)
    const [programRulesVariables, setProgramRulesVariables] = useState(null)
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [initialSurveyValue, setInitialSurveyValue] = React.useState(null);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [value, setValue] = React.useState(1);
    const { t, i18n } = useTranslation();
    const history = useHistory();

    async function getDataFromDatabase() {
        let surveyFormData = await OfflineDb.getDataFromPouchDB('surveyFormData')
        setSurveyFormData(surveyFormData)

        let progRule = await OfflineDb.getDataFromPouchDB('programRules')
        setProgramRules(progRule.data)

        let progRuleVariable = await OfflineDb.getDataFromPouchDB('programRulesVariables')
        setProgramRulesVariables(progRuleVariable.data)

        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let dataSetId = await OfflineDb.getDataFromPouchDB('currentDataSet')
        setSurveyDataSet(dataSetId.data)
    }

    useEffect(() => {
        getDataFromDatabase()
    }, [])

    useEffect(() => {
        if(surveyFormData != null && programRules != null && programRulesVariables != null && sessionUserBoValue != null && surveyDataSet != null) {
            
            getsurveydata(moment(selectedDate).format('YYYYMMDD'))
        }

    }, [surveyFormData, programRules, programRulesVariables, sessionUserBoValue, surveyDataSet])

    function submitData (saveObj) {
        setGlobalSpinner(true)
        apiServices.postAPI('dataValueSets', saveObj)
        .then(response => {
            setGlobalSpinner(false)
            swal({
                title: t("Success"),
                text: t("Survey submitted successfully"),
                icon: "success",
                button: t("Close"),
            })
            .then((AlertRes) => {
                //history.push('/layout/dataentry')
            })
            
        })
        .catch(err => {
            swal({
                title: t("Error"),
                text: "",
                icon: "error",
                button: t("Close"),
            });
            setGlobalSpinner(false)
        })
    }

    function onSubmit(values) {
        
        let saveObj = {
            "dataValues": []
        }
        const data = values
        let promises = []

        Object.keys(values).map(function (objectKey, index) {
            const obj = {
                "dataElement": objectKey,
                "period": moment(selectedDate).format('YYYYMMDD'),
                "orgUnit": sessionUserBoValue.organisationUnits[0].id,
                "value": values[objectKey]
              }
              const CurrentStageValueFilter = surveyFormData.data.dataSetElements.find(obj => obj.dataElement.id == objectKey)

              if (CurrentStageValueFilter != undefined) {
                  if(CurrentStageValueFilter.dataElement.valueType == "IMAGE") {
                    let formData = new FormData();
                    formData.append('file', data[objectKey][0]);
                    promises.push(apiServices.postAPI('fileResources', formData)
                    .then(res => {                        
                        if(res.data) {
                            return {"dataElement": objectKey, "period": moment(selectedDate).format('YYYYMMDD'),
                            "orgUnit": sessionUserBoValue.organisationUnits[0].id, "value": res.data.response.fileResource.id }
                        }
                    }))
                  } else {
                    saveObj.dataValues.push(obj)
                  }
              }  

              
              

        })
        
        if(promises.length == 0) {
            submitData(saveObj)
        } else {
            Promise.all(promises).then((responses) => {
                responses.map(imageData => {
                    saveObj.dataValues.push(imageData)
                    
                })
                submitData(saveObj)
                
            })    
        }

        


        
    }

    function renderField(registrationFields, values) {
        return (
            <CreateField fieldData={registrationFields} values={values} programRules={programRules} programRulesVariables={programRulesVariables} />
        )
    }

    function createForm(createForm) {
        
        const initialValue = initialSurveyValue != null ? initialSurveyValue : {}
        return (
            <div className={classes.container}>
                <main style={{ display: 'flex', height: '100%', width: '100%' }}>
                    <section className="regcustombg customregistrationtabs regcasetabs surveyformholder feedbackformholder"
                        style={{
                            flexGrow: 1,
                            padding: 0,
                        }}>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialSurveyValue}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <form className="fullWidth" onSubmit={handleSubmit}>
                                    <div className="innertabdivreg">
                                        <Grid container spacing={3}>
                                            {
                                                surveyFormData.data.dataSetElements.map(fieldsObject => {
                                                    return renderField(fieldsObject, values != null ? values : {})
                                                })

                                                
                                            }
                                            <> 
                                            { createForm == "D1rVwo0ZU86" ?
                                               
                                            <Grid item xs={12} sm={4} md={4} className="ratingholder">
                                                <Box component="fieldset" mb={3} borderColor="transparent">
                                                    <Typography component="legend">Rating</Typography>
                                                        <Rating
                                                        name="simple-controlled"
                                                        value={value}
                                                        onChange={(event, newValue) => {
                                                            setValue(newValue);
                                                        }}
                                                    />
                                                </Box> 
                                            </Grid> :
                                                <> </>
                                                
                                                
                                            
                                            }
                                            </>
                                        </Grid>
                                        <div className="buttons">
                                            <button className="regformsubmitbtn" type="submit" disabled={submitting}>
                                                {t('Submit')}
                                            </button>
                                        </div>

                                        {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                                    </div>
                                </form>
                            )}
                        />
                    </section>
                </main>
            </div>
        )
    }

    function massageFetchedData(values) {
        const data = values.dataValues
        let promises = []
        let inintialValue = {}
        data.map(fieldsData => {
            const fieldId = fieldsData.id.split('-')
            

            const filter = surveyFormData.data.dataSetElements.filter(obj => obj.dataElement.id == fieldId[0])
            if (filter.length > 0) {
                if(filter[0].dataElement.valueType == 'IMAGE'){
                    if(fieldsData.val){
                        const resourceGetApi = 'fileResources/' + fieldsData.val
                        promises.push(apiServices.getAPI(resourceGetApi)
                        .then(resources => {
                            return {'dataElement': fieldId[0], "value": resources.data}
                        }))
                    }
                } else {
                    inintialValue[fieldId[0]] = fieldsData.val
                }
            }
        })
        

        if(promises.length == 0) { 
            setInitialSurveyValue(inintialValue)
            
        } else {
            Promise.all(promises).then((responses) => {
                responses.map(response => {
                    
                    inintialValue[response.dataElement] = [new File([response.value.displayName], response.value.displayName, {
                        "size": response.value.contentLength,
                        "type": response.value.contentType,
                        "path": response.value.displayName
                        // "webkitRelativePath": ""
                        })
                        
                    ]
                    
                })
                setInitialSurveyValue(inintialValue)
                
            })    
        }
    }

    function getsurveydata(data) {
        // https://undp.imonitorplus.com/service/dhis-web-dataentry/getDataValues.action?periodId=20210222&dataSetId=cb09xn93qsd&organisationUnitId=I9jfaLculAp&multiOrganisationUnit=false&_=1614138199910
        const getApi = 'dhis-web-dataentry/getDataValues.action?periodId='+ data +'&dataSetId='+surveyDataSet+'&organisationUnitId='+sessionUserBoValue.organisationUnits[0].id+'&multiOrganisationUnit=false&_=1614138199910'
        setGlobalSpinner(true)
        apiServices.getSurveyAPI(getApi)
        .then(response => {
            setGlobalSpinner(false)
            massageFetchedData(response.data)
        })
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
        
        getsurveydata(moment(date).format('YYYYMMDD'))
    };


    return (
        
        surveyFormData != null && surveyFormData.data && programRules != null && programRulesVariables != null && sessionUserBoValue != null && surveyDataSet != null? 
        <>
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid className={'showHistoryCaleder' }>
          {/* <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            InputLabelProps={{
                shrink: true,
              }}
          /> */}

<KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Show history"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          disableFuture={true}
        />
          
        </Grid>
      </MuiPickersUtilsProvider>
        {createForm(surveyDataSet) }
        </>

        : <> </>

    )
}

export default Survey