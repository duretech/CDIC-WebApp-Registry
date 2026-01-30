import React, {Component} from 'react'
import { connect } from "react-redux";
import {apiServices} from '../../services/apiServices'
import createDecorator from 'final-form-calculate'
import CreateField from '../fields/CreateStageField'
import { withTranslation, Trans } from 'react-i18next';
import Grid from '@material-ui/core/Grid';

import {
    Button, 
    ButtonStrip, 
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm, 
    hasValue,
    CircularLoader,
    CenteredContent
} from '@dhis2/ui';
import moment from 'moment'

import swal from 'sweetalert'

import '../../assets/css/formStyle.css'
import {resetField} from '../../assets/data/resetField'

import {
    AssignValueValidation, AlertComponent, formValues
} from '../../redux/actions/action';

const {Form, Field } = ReactFinalForm


class StageFrom extends Component { 
    constructor(props){
        super(props);
        this.state = {
            formStructure: null,
            resetInitialValue: null,
            resetFields : [],
            loading: false
        }
        this.resetForm = this.resetForm.bind(this)
    }

    massageDataForPostCall = (data, currentStage, UserBo, metaData, programData, eventId, caseDetails) => {
        this.setState({loading: true})
        const fieldValueWithAttribute = []
        const orgUnit = UserBo.organisationUnits[0].id        
        const trackedEntityType = programData.trackedEntityType.id
        const programId = programData.id
        const DataElementGroup = JSON.parse(localStorage.getItem('dataElementGroup')).dataElementGroups

        

        Object.keys(data).map(function(objectKey, index) {
            
            
            if(DataElementGroup.find(array => array.id == objectKey) == undefined) {
                var obj = {
                    "dataElement": objectKey,
                    "value": Array.isArray(data[objectKey]) == true ? data[objectKey].toString() : data[objectKey]
                }
                fieldValueWithAttribute.push(obj)
            } else {
                
                data[objectKey].map(eachFields => {
                    var obj = {
                        "dataElement": eachFields,
                        "value": true
                    }
                    fieldValueWithAttribute.push(obj)
                })
            }
            
        });

        const trackedEntityInstance = localStorage.getItem('trackedEntityInstance')
        const enrollmentId = localStorage.getItem('enrollmentId')
        const saveStageInput = {
            "trackedEntityInstance":trackedEntityInstance,
            "program": programId,
            "programStage":currentStage.id,
            "enrollment":enrollmentId,
            "orgUnit":orgUnit,
            "notes":[],
            "dataValues":fieldValueWithAttribute,
            "status":"COMPLETED",
            "eventDate":moment().format("YYYY-MM-DD")
        }
        

        const referalAPIObject = {
            "events":[
                
            ]
        }

        referalAPIObject.events.push(saveStageInput)
        
        const getAllKeys = Object.keys(data)
        let OUFieldSelectedLocation = ''
        
        const filterReferalField = getAllKeys.map(keys => {
            const filter = currentStage.programStageDataElements.filter(obj => obj.dataElement.id == keys)
            if(filter.length > 0) {
                filter.map(filteredField => {
                    if(filteredField.dataElement.fieldMask == 'Facility Referral'){
                        const filteredKey = filteredField.dataElement.id
                        const selectedOUField = currentStage.programStageDataElements.filter(obj => obj.dataElement.fieldMask == 'Facility Referral OU')
                        const selectedOUFieldData = selectedOUField.length > 0 ? data[selectedOUField[0].dataElement.id] : ''
                        OUFieldSelectedLocation = selectedOUFieldData
                        
                        const referalFieldValue = data[filteredKey]
                        
                        referalFieldValue.map(stageId => {
                            const obj = {
                                "trackedEntityInstance": trackedEntityInstance,
                                "program": programId,
                                "programStage": stageId,
                                "enrollment": enrollmentId,
                                "orgUnit": selectedOUFieldData,
                                "notes":[],
                                "dataValues":[],
                                "status":"SCHEDULE",
                                "dueDate":moment().format("YYYY-MM-DD")
                            }
                            referalAPIObject.events.push(obj)
                        })
                        
                        // apiServices.postAPI('events.json', referalAPIObject)
                        // .then(stageResponse => {   
                        //     
                        //     this.props.onStageSubmit(true)                
                        // })
                    }
                    
                })
            }
            
        })

        
        
        
        
        if(UserBo.displayName == "User Facility") {
            

            const eventsList = caseDetails.enrollments[0].events

            const ScheduledEvents = caseDetails.enrollments[0].events.filter(obj => obj.status == "SCHEDULE")
            
            const url = 'events/'+ ScheduledEvents[0].event +'/eventDate'
            
            const PUTObject = ScheduledEvents.length > 0 ? {
                "event":ScheduledEvents[0].event,
                "enrollment":ScheduledEvents[0].enrollment,
                "dueDate":"2020-10-12",
                "status":"ACTIVE",
                "program":ScheduledEvents[0].program,
                "programStage":ScheduledEvents[0].programStage,
                "orgUnit":ScheduledEvents[0].orgUnit,
                "orgUnitName":ScheduledEvents[0].orgUnitName,
                "orgUnitPath":"/ziKWva3ugzr/M9xpKnQXD0Q",
                "eventDate":"2020-10-12",
                "trackedEntityInstance":ScheduledEvents[0].trackedEntityInstance
            } : {}
            
            apiServices.putAPI(url,PUTObject)
            .then(ReferalResponse => {
                
                apiServices.postAPI('events.json',referalAPIObject)
                .then(stageResponse => {
                    this.props.onStageSubmit(true)
                    this.setState({loading: false})
                    swal({
                        title: "Success",
                        text: "Successfully submited event",
                        icon: "success",
                        button: "Close",
                    });
                })
                .catch(error => {
                    this.setState({                                
                        loading: false
                    });
                    swal({
                        title: "Error",
                        text: "",
                        icon: "error",
                        button: "Close",
                      });
                })
            })
            .catch(error => {
                this.setState({                                
                    loading: false
                });
                swal({
                    title: "Error",
                    text: "",
                    icon: "error",
                    button: "Close",
                  });
            })

        } else {
            apiServices.postAPI('events.json',referalAPIObject)
            .then(stageResponse => {
                this.setState({loading: false})
                swal({
                    title: "Success",
                    text: "Successfully submited event",
                    icon: "success",
                    button: "Close",
                });
                if(OUFieldSelectedLocation != '') {
                    let subURLApi = 'tracker/ownership/transfer?trackedEntityInstance='+ trackedEntityInstance +'&program='+ programId +'&ou='+ OUFieldSelectedLocation

                    apiServices.putAPI(subURLApi,{})
                    .then(ReferalResponse => {
                        this.props.onStageSubmit(true)
                        this.setState({loading: false})
                        
                    })
                    .catch(error => {
                        this.setState({                                
                            loading: false
                        });
                        swal({
                            title: "Error",
                            text: "",
                            icon: "error",
                            button: "Close",
                          });
                    })
                } else {
                    this.props.onStageSubmit(true)
                    this.setState({loading: false})
                }
            })
            .catch(error => {
                this.setState({                                
                    loading: false
                });
                swal({
                    title: "Error",
                    text: "",
                    icon: "error",
                    button: "Close",
                  });
            })

        }
        
    }

    componentDidMount () {
        this.resetFields()
    }
     
    MassageInitailValue = (data) => {
        var InitialValueData = {}
        const DataElementGroup = JSON.parse(localStorage.getItem('dataElementGroup')).dataElementGroups
        
        
        data.dataValues.map(fields => {
            
            const filter = this.props.stageObject.programStageDataElements.filter(obj => obj.dataElement.id == fields.dataElement)

            

            if(filter.length > 0) {
                
                if(filter[0].dataElement.fieldMask == 'Facility Referral') {
                    InitialValueData[fields.dataElement] =  fields.value.split(",")
                } else {
                    
                    DataElementGroup.map(DEG => {
                        
                        DEG.dataElements.map(dataElements => {
                            if(DEG.dataElements.find(array => array.id == fields.dataElement)) {
                                
                                if(InitialValueData[DEG.id] == undefined) {
                                    InitialValueData[DEG.id] = [fields.dataElement]
                                    
                                } else {
                                    
                                    if(!InitialValueData[DEG.id].includes(fields.dataElement)) {
                                        InitialValueData[DEG.id].push(fields.dataElement)
                                    }
                                    
                                }
                            }
                        })
                    })
                    InitialValueData[fields.dataElement] = fields.value == 'false' ? false : fields.value == 'true' ? true : fields.value
                }
            }

            
        })
        
        return InitialValueData
    }

    updateCallForStage = (data, currentStage, UserBo, metaData, programData, eventId) => {
        
        this.setState({loading: true})
        const fieldValueWithAttribute = []
        const orgUnit = UserBo.organisationUnits[0].id        
        const trackedEntityType = programData.trackedEntityType.id
        const programId = programData.id
        const DataElementGroup = JSON.parse(localStorage.getItem('dataElementGroup')).dataElementGroups
        Object.keys(data).map(function(objectKey, index) {
            if(DataElementGroup.find(array => array.id == objectKey) == undefined) {
                var obj = {
                    "dataElement": objectKey,
                    "value": Array.isArray(data[objectKey]) == true ? data[objectKey].toString() : data[objectKey]
                }
                fieldValueWithAttribute.push(obj)
            } else {
                
                data[objectKey].map(eachFields => {
                    var obj = {
                        "dataElement": eachFields,
                        "value": true
                    }
                    fieldValueWithAttribute.push(obj)
                })
            }
            
        });

        const trackedEntityInstance = localStorage.getItem('trackedEntityInstance')
        const enrollmentId = localStorage.getItem('enrollmentId')
        const UpdateStageInput = 
        {
            "dataValues":fieldValueWithAttribute,
            "event":eventId,
            "program":programId,
            "programStage":currentStage.id,
            "orgUnit":orgUnit,
            "trackedEntityInstance":trackedEntityInstance,
            "status":"COMPLETED",
            "dueDate":moment().format("YYYY-MM-DD"),
            "eventDate":moment().format("YYYY-MM-DD"),
            "completedDate":moment().format("YYYY-MM-DD")
        }

        const referalAPIObject = {
            "events":[
                
            ]
        }

        referalAPIObject.events.push(UpdateStageInput)

        const getAllKeys = Object.keys(data)
        
        const filterReferalField = getAllKeys.map(keys => {
            
            const filter = currentStage.programStageDataElements.filter(obj => obj.dataElement.id == keys)
            if(filter.length > 0) {
                filter.map(filteredField => {
                    if(filteredField.dataElement.fieldMask == 'Facility Referral') {
                        const filteredKey = filteredField.dataElement.id
                        const referalFieldValue = data[filteredKey]
                        
                        referalFieldValue.map(stageId => {
                            const obj = {
                                "trackedEntityInstance": trackedEntityInstance,
                                "program": programId,
                                "programStage": stageId,
                                "enrollment": enrollmentId,
                                "orgUnit": orgUnit,
                                "notes":[],
                                "dataValues":[],
                                "status":"VISITED",
                                "dueDate":"2020-09-18"
                            }
                            referalAPIObject.events.push(obj)
                        })
                        
                    }

                    
                })
            }
            
        })
        
        const updateURL = 'events/' + eventId
        this.props.onStageSubmit(true)
        // this.setState({                                
        //             loading: false
        //         });
        apiServices.putAPI(updateURL,UpdateStageInput)
        .then(stageResponse => {
            
            this.props.onStageSubmit(true)
            this.setState({                                
                loading: false
            });
            swal({
                title: "Updated",
                text: "Successfully updated event",
                icon: "success",
                button: "Close",
            });
            
        })
        .catch(error => {
            this.setState({                                
                loading: false
            });
            swal({
                title: "Error",
                text: "",
                icon: "error",
                button: "Close",
              });
        })
    }

    resetForm = (form, values) => {
        let uniqueField = []
        let newInitalValues = {}
        const metaData = JSON.parse(localStorage.getItem('metaData'))
        

        this.props.stageFormObject.map(fields => {
            if(fields.dataElement.unique == true) {
                
                uniqueField.push(fields.dataElement.id)
            }
           
        })
        
        uniqueField.map(fieldID => {
            newInitalValues[fieldID] = values[fieldID]
        })


        this.setState({resetInitialValue: newInitalValues})
        const a = form.reset()
               
        
    }

    resetFields = () => {
        let resetField = []
        const operators = ['==', '!=']
        let Flag = null
        let val = null
        let conditionArray = []
        
        const conditionalSigns = ['&&', '||']


        
        

        this.props.programRules.programRule.map(rule => {
            

            let rules = rule
            let programRulesVariables = this.props.programRules.programRuleVariable
            const condition = rule.condition
            const splitConditions = condition.split("&&")

            splitConditions.map(splitCondition => {
                
                const variableName = splitCondition.match(/\{(.*?)\}/) == null ? '' : splitCondition.match(/\{(.*?)\}/)[1]
                
                const parentRaw = programRulesVariables.filter(obj => obj.displayName == variableName) //[0] .dataElement.id
                const parentNameFromFilter = parentRaw.length > 0 ? parentRaw[0].displayName : undefined
                const parentId = parentRaw.length > 0 ? parentRaw[0].dataElement ? parentRaw[0].dataElement.id : undefined : undefined
        
                const parentNameFromFilterStart = splitCondition.search(parentNameFromFilter)
                const parentNameLength = parentNameFromFilter ? parentNameFromFilter.length : undefined
        
                const operatorInitLength = parentNameFromFilterStart + parentNameLength + 2
        
                const operator = splitCondition.substring(operatorInitLength, operatorInitLength+2)
                
                const alternateOperatorFinding = operators.map(ops => {
                    
                    if(splitCondition.search(ops) > -1) {
                        
                        const a = {
                            'operator': ops,
                            'operatorLength': splitCondition.search(ops)
                        }
                        return a
                    }
        
                     
                    
                })
        
                const stringLength = splitCondition.length
        
                if(parentNameFromFilter) {
                    const filteredOperator = alternateOperatorFinding.filter(obj => obj != undefined)
        
                    const conditionValueRaw = filteredOperator.length > 0 ? splitCondition.substring(filteredOperator[0].operatorLength + 3, splitCondition.length) : undefined
                    
                    const removeEmptySpace = conditionValueRaw != undefined ? conditionValueRaw.replace(/\s/g,'') : undefined
                    
                    const conditionValue = removeEmptySpace != undefined ? removeEmptySpace.substring(1, removeEmptySpace.length-1) : undefined
                    
                    const conditionalOperator = filteredOperator.length > 0 ? filteredOperator[0].operator : undefined
                    
                    

                    if(parentId != undefined) {
                        
                        
                        let childId = []
                        rules.programRuleActions.map(actions => {
                            
                            if(actions.dataElement != undefined && actions.programRuleActionType == "HIDEFIELD") {
                                childId.push(actions.dataElement.id)
                            } else {
                                childId.push('')
                            }

                            
                        })
                        let obj = {                            
                            'parent': parentId,
                            'value': conditionValue,
                            'child': childId
                        }
                        resetField.push(obj)
                        
                    }
                }
                
            })
        })
        
        this.setState({resetFields: resetField})
    }

    renderCreateField= (fieldsObject,values,form,programRules,stages)=>{
        return <CreateField fieldData = {fieldsObject} values={values} form={form} programRules={programRules} stage={stages} entityObjectName ='dataElement'/>;
    }

    render() {
        
        const stages = this.props.stageFormObject
        const currentStage = this.props.stageObject
        const linkContactFlag = this.props.linkContactFlag
        const UserBo = this.props.UserBo
        const metaData = this.props.metaData
        const programData = this.props.programData
        const DataElementGroup = JSON.parse(localStorage.getItem('dataElementGroup')).dataElementGroups
        const initialValues = this.props.initialValues ? this.props.initialValues : undefined
        
        let stageId = ''
        stageId = this.props.initialValues ? currentStage != null ? currentStage.id : undefined : undefined

        

        const currentStageDataFilter = initialValues && stageId ? 
        initialValues.enrollments[0].events.filter(obj => obj.programStage == stageId) 
        : []
        

        const massagedStageInitialData =
            this.state.resetInitialValue != null
        ?
            this.state.resetInitialValue
        :
            currentStageDataFilter 
        ? 
            currentStageDataFilter.length > 0 && this.props.linkContactFlag != true 
        ? 
            this.MassageInitailValue(currentStageDataFilter[currentStageDataFilter.length-1]) 
        : 
            this.props.newInitialValue 
        : 
            this.props.newInitialValue

        const eventId = currentStageDataFilter ? currentStageDataFilter.length > 0 ? currentStageDataFilter[0].event : undefined : undefined
        
       
        const onSubmit = async values => {
            Object.keys(massagedStageInitialData).length > 0 || currentStageDataFilter.length > 0
            ?  
                this.updateCallForStage(values, currentStage, UserBo, metaData, programData, eventId, this.props.initialValues)
            :   
                this.massageDataForPostCall(values, currentStage, UserBo, metaData, programData, eventId, this.props.initialValues)  
        }

        const hideButtonFlag = localStorage.getItem('hideButton')
        const hideButtons = hideButtonFlag == 'true' ? true : false

        const decorator = createDecorator(
            // Calculations:
              {
                  field: 'RHnyDy2qCzv', // when the value of foo changes...
                  updates: {
                  // ...set field "doubleFoo" to twice the value of foo
                  zO0wa0rrQXi: (values, allValues) => values == '02' ? null  : null
                //   
                //   
                  }
              }
        )
        return (  
            <>
                <>

                    { this.state.loading ?
                                <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                                    <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                                </CenteredContent>
                                :""
                        }
                </>          
                           
                <Form
                    
                    onSubmit={onSubmit}
                    initialValues={massagedStageInitialData}
                    // decorators={[decorator]}
                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                        <form className="fullWidth" onSubmit={handleSubmit}>
                            <> {
                                DataElementGroup.map(DataElementGroup => {
                                    
                                    if(values[DataElementGroup.id] != undefined) {
                                        

                                        DataElementGroup.dataElements.map(elements => {
                                            delete values[elements.id]
                                            // if(values[elements.id] != undefined)
                                        })

                                        values[DataElementGroup.id].map(value => {
                                            values[value] = true
                                        })
                                        // delete values[DataElementGroup.id]; 
                                    }
                                })
                            } </>
                            <>
                                
                                {/* {this.props.formValues(values)} */}
                            </>
                            <Grid container spacing={3}>
                                {
                                    stages ? stages.map(fieldsObject => {
                                        return this.renderCreateField(fieldsObject,values,form,this.props.programRules,stages);
                                    }) : undefined
                                }
                            </Grid>
            
                            {hideButtons == false ?
                                <div className="buttons">
                                <button className="regformsubmitbtn" type="submit" disabled={submitting || pristine}>
                                <Trans>Submit</Trans>
                                </button>
                                <button
                                className="regformresetbtn"
                                type="button"
                                onClick={form.reset}
                                disabled={submitting || pristine}
                                >
                                <Trans>Reset</Trans>
                                </button>
                                </div>
                                : null
                            }
                            {/* <>{submitting || pristine ? values = [] : null} </> */}
                            {/* <> {
                            <>{this.state.resetFields.map(item => {

                                //item.child.forEach(e => delete values[e])
                                
                                return  String(values[item.parent]) == String(item.value)  ? item.child.forEach(e => values[e] == 'true' || values[e] == 'false' ? values[e] = !values[e] :  delete values[e])  : undefined
                            })}</>
                        
                            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                        </form>
                    )}
                />
            </>        
        )
    }
}

function mapStateToProps(state) {
    
    const { storeState } = state;
    return { newOption: storeState.childOptions, newOptionFieldId: storeState.childId , newInitialValue: storeState.registerInitialValue }
}

export default connect(mapStateToProps, {AssignValueValidation, formValues})(StageFrom);