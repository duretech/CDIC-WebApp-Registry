import React, {Component} from 'react'
import { connect } from "react-redux";
import CreateField from '../fields/CreateField'
import {apiServices} from '../../services/apiServices'
import '../../assets/css/formStyle.css'
import moment from 'moment';
import Alert from '../alert/Alert'

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';

import CloseIcon from '@material-ui/icons/Close';

import '../../assets/css/formStyle.css'

import {
    // Button, 
    ButtonStrip, 
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm, 
    hasValue,
    AlertBar,
    CircularLoader,
    CenteredContent
    // Card
} from '@dhis2/ui';

import swal from 'sweetalert'

import Grid from '@material-ui/core/Grid';

import createDecorator from 'final-form-calculate'
import {
    AssignValueValidation
} from '../../redux/actions/action';

import '../../assets/css/customstyles.css'

import Customcasescard from '../../pages/cases/Customcasescard';

const {Form, Field, FormSpy } = ReactFinalForm



class RegistrationForm extends Component { 
    constructor(props){
        super(props);
        this.state = {
            registrationFieldObject: null,
            onSubmitStatus: null,

            newInitialValues: null,
            resetInitialValue: null,
            resetFields : [],
            newOptions: {},
            showSearchAlert: false,
            searchResponse: null,
            searchHeader: null,
            sendSubmitRequestPostSearch: false,
            formValues: null
        }
        this.resetForm = this.resetForm.bind(this)
    }

    componentDidMount() {
        this.resetFields()
    }

    static getDerivedStateFromProps(props, state) {
        

        return state
      }



    componentWillUnmount() {
        this.props.AssignValueValidation({})
        this.resetFields()
      }

    renderCreateField = (fieldsObject, values, form, programRules, icons) => {
        
        
        return (
                this.props.newOption.filter(obj => obj.fieldId == fieldsObject.trackedEntityAttribute.id).length > 0
            ?
                <CreateField options={this.props.newOption.filter(obj => obj.fieldId == fieldsObject.trackedEntityAttribute.id)[0].value}
                    fieldData = {fieldsObject} values={values} form={form} programRules={programRules} icons={icons} />
            :   
                <CreateField
                    fieldData = {fieldsObject} values={values} form={form} programRules={programRules} icons={icons} />
        )
        
        
        
        
    }

    MassageInitailValue = (data) => {
        var InitialValueData = {}
        
        const attributes = data.attributes
        attributes.map(fields => {
            
            InitialValueData[fields.attribute] = fields.value
        })

       return InitialValueData
    }

    // showAlert = () => {
    //     if(this.state.showSearchAlert == false) {
           
    //     }

    //     if(this.state.showSearchAlert == true) {

    //     }
    // }

    massageDataForPostCall = (data, UserBo, metaData, programData, initialValues, linkContactFlag, sendSubmitRequestPostSearch) => {
        this.setState({loading: true})
        const fieldValueWithAttribute = []
        
        const orgUnit = UserBo.organisationUnits[0].id        
        const trackedEntityType = programData.trackedEntityType.id
        const programId = programData.id

        Object.keys(data).map(function(objectKey, index) {
            var obj = {
                "attribute": objectKey,
                "value": data[objectKey]
            }
            fieldValueWithAttribute.push(obj)
        });
        
        fieldValueWithAttribute.push({
            "attribute": 'DyvjG42flhS',
            "value": localStorage.getItem('linkContact') ? 'Contact' : 'Index'
        })
        
        const saveCaseInput = {
            "trackedEntityType":trackedEntityType,
            "orgUnit":orgUnit,
            "attributes":fieldValueWithAttribute
        }
        
        const updateCaseInput = 
        this.props.initialValues ? 
        {
            "created":this.props.initialValues.created,
            "orgUnit":orgUnit,
            "createdAtClient":this.props.initialValues.createdAtClient,
            "trackedEntityInstance":this.props.initialValues.trackedEntityInstance,
            "lastUpdated":this.props.initialValues.lastUpdated,
            "trackedEntityType":trackedEntityType,
            "lastUpdatedAtClient":this.props.initialValues.lastUpdatedAtClient,
            "inactive":false,
            "deleted":false,
            "featureType":"NONE",
            "programOwners":[
                {"ownerOrgUnit":orgUnit,
                "program":programId,
                "trackedEntityInstance":this.props.initialValues.trackedEntityInstance,}
            ],
            "relationships":[],
            "attributes": fieldValueWithAttribute
        } : {}
        //DyvjG42flhS

        

        

        //get trackedEntityInstance from local
            
        const trackedEntityInstance = localStorage.getItem('trackedEntityInstance')
        const updateURL = 'trackedEntityInstances/' + trackedEntityInstance

        

        if (Object.keys(initialValues).length > 0) {
            //FIX ME : take id dynamically
            
            apiServices.putAPI(updateURL, updateCaseInput)
            .then(updateRes=> {
                
                this.setState({
                    onSubmitStatus: true,
                    loading: false
                })
                swal({
                    title: "Updated",
                    text: "Client data successfully updated",
                    icon: "success",
                    button: "Close",
                  });
                this.props.onRegistrationSubmit(true)
                
            })
        } else {
            // let searchableFields = ['BDvK0qXNHet', 'c7u1Iqbasx3']
            let searchableFields = []
            let searchQuery = ``
            programData.programTrackedEntityAttributes.map(fields => {
                if(fields.searchable == true || fields.fields == 'true') {
                    searchableFields.push(fields.trackedEntityAttribute.id)
                }
            })
            searchableFields.map(searchableField => {
                if(data[searchableField] != undefined) {
                    searchQuery += `&attribute=${searchableField}:LIKE:${data[searchableField]}`
                }
                
            })

            let subURL = 'trackedEntityInstances/query.json?ou='+ orgUnit +'&ouMode=ACCESSIBLE&&order=created:desc&program='+ programId + searchQuery+'&pageSize=50&page=1&totalPages=false'
            
            if(this.state.sendSubmitRequestPostSearch == true || this.state.sendSubmitRequestPostSearch == 'true') {

            } else {
                //this.props.onRegistrationSubmit(true)
                //return;
                apiServices.getAPI(subURL).then(searchResponse => { 
                    
                    if(searchResponse.data.rows.length <= 0) {
                        apiServices.postAPI('trackedEntityInstances', saveCaseInput)
                        .then(res => {
                            
                            const trackedEntityInstance = res.data.response.importSummaries[0].reference
                            
                            const enrollmentInputJson = {
                                "trackedEntityInstance":trackedEntityInstance,
                                "program":programId,
                                "status":"ACTIVE",
                                "orgUnit":orgUnit,
                                "enrollmentDate":moment().format("YYYY-MM-DD"),
                                "incidentDate":moment().format("YYYY-MM-DD")
                            }
                            apiServices.postAPI('enrollments',enrollmentInputJson)
                            .then(enrollmentRes => {
                                
                                const enroll = enrollmentRes.data.response.importSummaries[0].reference
                                this.setState({
                                    // onSubmitStatus: true,
                                    loading: false

                                })
                                
                                /*swal({
                                    title: "Success",
                                    text: "New Client Registered",
                                    icon: "success",
                                    button: "Close",
                                  });*/
                                localStorage.setItem('trackedEntityInstance', trackedEntityInstance)
                                localStorage.setItem('enrollmentId', enroll)
                                this.props.onRegistrationSubmit(true)
                                
                                if(localStorage.getItem('linkContact') && !localStorage.getItem('linkTrackedEntityInstance')){
                                    localStorage.setItem('linkTrackedEntityInstance',trackedEntityInstance);
                                }
                                const linkTrackedEntityInstance = localStorage.getItem('linkTrackedEntityInstance')
                                // const linkContactJson =  linkContactFlag == true ? {} : {}
    
                                
                                if(linkContactFlag == true) {
                                    
                                    const getURL = 'trackedEntityInstances/' + linkTrackedEntityInstance + '.json?program='+ programId +'&fields=*?'
    
                                    apiServices.getAPI(getURL)
                                    .then(getParentData => {
                                        const parentAttributeRaw = this.MassageInitailValue(getParentData.data);
                                        const parentAttribute = []
    
                                        getParentData.data.attributes.map(attributes => {
                                            const obj = {
                                                'attribute': attributes.attribute, 
                                                'value' : attributes.value
                                            }
    
                                            parentAttribute.push(obj)
                                        })
                                        
                                        
    
                                        const linkContactJson = {
                                            "created":moment().format("YYYY-MM-DD"),
                                            "orgUnit":orgUnit,
                                            "createdAtClient":moment().format("YYYY-MM-DD"),
                                            "trackedEntityInstance":linkTrackedEntityInstance,
                                            "lastUpdated":moment().format("YYYY-MM-DD"),
                                            "trackedEntityType":trackedEntityType,
                                            "lastUpdatedAtClient":moment().format("YYYY-MM-DD"),
                                            "inactive":false,
                                            "deleted":false,
                                            "featureType":"NONE",
                                            "programOwners":[
                                                {"ownerOrgUnit":orgUnit,
                                                "program": programId,
                                                "trackedEntityInstance":linkTrackedEntityInstance
                                            }],
                                            "relationships":[
                                                {"from":
                                                    {"trackedEntityInstance":
                                                        {"trackedEntityInstance":linkTrackedEntityInstance}
                                                    },
                                                "to":
                                                    {"trackedEntityInstance":
                                                        {"trackedEntityInstance": trackedEntityInstance}
                                                    },
                                                "relationshipType":localStorage.getItem('relationshipTypesId')}
                                            ],
                                            "attributes":parentAttribute
                                        }
    
                                        const putURL = 'trackedEntityInstances/' + linkTrackedEntityInstance;
                                        apiServices.putAPI(putURL,linkContactJson)
                                        .then(linkResponse => {
                                            this.setState({loading: false})
                                            
                                        })
                                    })
    
                                    
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
                        })
                        .catch(error => {
                            this.setState({                                
                                loading: false
                            });
                            swal({
                                title: "Error",
                                text: "No records found",
                                icon: "error",
                                button: "Close",
                              });
                        })
                    } else {
                        this.setState({showSearchAlert: true, searchResponse: searchResponse.data.rows, searchHeader: searchResponse.data.headers, formValues: data})
                    }
                })
            }
            
            
            

            
        }  
            
        
            

        
    
    }

    postSearchSubmit = (UserBo, metaData, programData, initialValues, linkContactFlag) => {
        
        let fieldValueWithAttribute = []
        const data = this.state.formValues
        const orgUnit =  UserBo.organisationUnits[0].id  
        const trackedEntityType = programData.trackedEntityType.id
        const programId = programData.id
        Object.keys(data).map(function(objectKey, index) {
            var obj = {
                "attribute": objectKey,
                "value": data[objectKey]
            }
            fieldValueWithAttribute.push(obj)
        });

        const saveCaseInput = {
            "trackedEntityType": trackedEntityType,
            "orgUnit":orgUnit,
            "attributes":fieldValueWithAttribute
        }

        apiServices.postAPI('trackedEntityInstances', saveCaseInput)
        .then(res => {
            
            const trackedEntityInstance = res.data.response.importSummaries[0].reference
            
            const enrollmentInputJson = {
                "trackedEntityInstance":trackedEntityInstance,
                "program":programId,
                "status":"ACTIVE",
                "orgUnit":orgUnit,
                "enrollmentDate":moment().format("YYYY-MM-DD"),
                "incidentDate":moment().format("YYYY-MM-DD")
            }
            apiServices.postAPI('enrollments',enrollmentInputJson)
            .then(enrollmentRes => {
                
                const enroll = enrollmentRes.data.response.importSummaries[0].reference
                this.setState({
                    onSubmitStatus: true,
                    loading: false
                })
                localStorage.setItem('trackedEntityInstance', trackedEntityInstance)
                localStorage.setItem('enrollmentId', enroll)
                this.props.onRegistrationSubmit(true)
                const linkTrackedEntityInstance = localStorage.getItem('linkTrackedEntityInstance')
                // const linkContactJson =  linkContactFlag == true ? {} : {}

                
                if(linkContactFlag == true) {
                    
                    const getURL = 'trackedEntityInstances/' + linkTrackedEntityInstance + '.json?program='+ programId +'&fields=*?'

                    apiServices.getAPI(getURL)
                    .then(getParentData => {
                        const parentAttributeRaw = this.MassageInitailValue(getParentData.data);
                        const parentAttribute = []

                        getParentData.data.attributes.map(attributes => {
                            const obj = {
                                'attribute': attributes.attribute, 
                                'value' : attributes.value
                            }

                            parentAttribute.push(obj)
                        })
                        
                        

                        const linkContactJson = {
                            "created":moment().format("YYYY-MM-DD"),
                            "orgUnit":orgUnit,
                            "createdAtClient":moment().format("YYYY-MM-DD"),
                            "trackedEntityInstance":linkTrackedEntityInstance,
                            "lastUpdated":moment().format("YYYY-MM-DD"),
                            "trackedEntityType":trackedEntityType,
                            "lastUpdatedAtClient":moment().format("YYYY-MM-DD"),
                            "inactive":false,
                            "deleted":false,
                            "featureType":"NONE",
                            "programOwners":[
                                {"ownerOrgUnit":orgUnit,
                                "program": programId,
                                "trackedEntityInstance":linkTrackedEntityInstance
                            }],
                            "relationships":[
                                {"from":
                                    {"trackedEntityInstance":
                                        {"trackedEntityInstance":linkTrackedEntityInstance}
                                    },
                                "to":
                                    {"trackedEntityInstance":
                                        {"trackedEntityInstance": trackedEntityInstance}
                                    },
                                "relationshipType":"k9pSaAFPrCk"}
                            ],
                            "attributes":parentAttribute
                        }

                        const putURL = 'trackedEntityInstances/' + linkTrackedEntityInstance;
                        apiServices.putAPI(putURL,linkContactJson)
                        .then(linkResponse => {
                            this.setState({loading: false})
                            
                        })
                    })

                    
                }
                // this.setState({loading: false})
            })
        })
    }

    resetForm = (form, values) => {
        let uniqueField = []
        let newInitalValues = {}
        const metaData = JSON.parse(localStorage.getItem('metaData'))
        

        this.props.registrationFormObject.map(fields => {
            if(fields.trackedEntityAttribute.unique == true) {
                
                uniqueField.push(fields.trackedEntityAttribute.id)
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
            
            if(condition != undefined) {
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
                    
                    

                    if(parentId != undefined && conditionValue != undefined) {
                        
                        
                        let childId = []
                        rules.programRuleActions.map(actions => {
                            if(actions.dataElement != undefined) {
                                childId.push(actions.dataElement.id)
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
            }
            
        })
        
        this.setState({resetFields: resetField})
    }


    render() {
        
        const registrationFormObject = this.props.registrationFormObject
        const linkContactFlag = this.props.linkContactFlag
        const UserBo = this.props.UserBo
        const metaData = this.props.metaData
        const programData = this.props.programData
        const iconsList = this.props.icons
        
        
        let initialValues =
            this.state.resetInitialValue != null
        ?
            this.state.resetInitialValue
        :
            this.props.initialValues && linkContactFlag != true 
        ?   
            this.MassageInitailValue(this.props.initialValues) 
        : 
            this.props.newInitialValue
            
        const onSubmit = async values => {
            const submit = this.massageDataForPostCall(values, UserBo, metaData, programData, initialValues, linkContactFlag)            
            
        }
        const hideButtonFlag = localStorage.getItem('hideButton')
        const hideButtons = hideButtonFlag == 'true' ? true : false

          const decorator = createDecorator(
              // Calculations:
                {
                    field: 'KqnuYsJcc01', // when the value of foo changes...
                    updates: {
                    // ...set field "doubleFoo" to twice the value of foo
                    I5T44W38KhD: (birthValue, allValues) =>  moment().diff(birthValue, 'years')
                    }
                }
          )

          let alertStructure = 
            <div className="modaloverlay">
                <div className="modalcardholder">
                    <Card className="modalcard">
                        <CardHeader
                            className="modalheader"
                            action={
                            <IconButton aria-label="close">
                                <CloseIcon onClick={() => this.setState({searchResponse: null, loading: false})}/>
                            </IconButton>
                            }
                            title="Match found"
                        />
                        <CardContent className="modalbodycontent">
                            {/* <Typography className="modaltext" gutterBottom>
                                Click Continue to register new client
                            </Typography> */}
                            <Grid container spacing={3}>
                            {this.state.searchResponse != null ? this.state.searchResponse.map(row => {
                                return (<Grid item xs={12} sm={6} md={6}>
                                    <Customcasescard row={row} searchHeader={this.state.searchHeader} hideOptions={'true'}></Customcasescard>
                                </Grid> )
                            }) : <> </>}
                            </Grid>
                            <Typography className="modaltext modalinfo" gutterBottom>
                                Click <span>Continue</span> to register new client
                            </Typography>
                        </CardContent>
                        
                        <CardActions className="modalfooter">
                            <Button className="regSearchCancelButton" onClick={() => this.setState({searchResponse: null, loading: false})}>Cancel</Button>
                            <Button className="modalactionbtn" onClick={() => this.postSearchSubmit(UserBo, metaData, programData, initialValues, linkContactFlag)}>Continue</Button>
                        </CardActions>
                        
                    </Card>
                </div>
            </div>
        
        return (

            <>
            {this.state.searchResponse != null ? alertStructure : <> </>}
            { this.state.loading ?
                                <CenteredContent dataTest="dhis2-uicore-centeredcontent" position="middle">
                                    <CircularLoader large dataTest="dhis2-uicore-circularloader" />
                                </CenteredContent>
                                :""
                        }
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                // subscription={{ submitting: true}}
                // decorators={[decorator]}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                    
                        
                    <form className="fullWidth" onSubmit={handleSubmit}>
                       {/* {
                    <Grid container spacing={3}>
                        {registrationFormObject != null ? registrationFormObject.map(fieldsObject => {
                            
                                return this.renderCreateField(fieldsObject, values, form, this.props.programRules, this.props.icons)
                            
                        }) : null}
                    </Grid>
                    {hideButtons == false ?
                        <div className="buttons">
                        <button className="regformsubmitbtn" type="submit" disabled={submitting}>
                        Submit
                        </button>
                        <button
                        className="regformresetbtn"
                        type="button"
                        onClick={() => this.resetForm(form, values)}
                        disabled={submitting || pristine}
                        >
                        Reset
                        </button>
                    </div>
                    : null
                    }
                    {/* <>{submitting || pristine ? values = [] : null} </> */}
                    <>{this.state.resetFields.map(item => {
                        return values[item.parent] != item.value ? item.child.forEach(e => delete values[e]) : undefined
                    })}</>
                    
                    {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                    
                    
                    </form>

                    
                            // </>
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

export default connect(mapStateToProps, {AssignValueValidation})(RegistrationForm);