import React, { useState,useEffect } from 'react'
import { apiServices } from '../../services/apiServices'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SyncIcon from '@material-ui/icons/Sync';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import {
    Button, 
    ButtonStrip,
    Divider,
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm,
    hasValue,
    InputField,
    CircularLoader,
    CenteredContent
} from '@dhis2/ui';
import { withTranslation, Trans , useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert'
import moment from 'moment';
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import _ from 'lodash';
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
//import '../../assets/css/theme_green.css'
//import '../../assets/css/theme_red.css'

const {Form, Field } = ReactFinalForm

function Cases(){
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [progarmData,setProgarmData] = useState(null)
    const [offlineRecords, setOfflineRecords] = useState([])
    const [listOfFields,setListOfFields] = useState(null)
    const [fieldsToDisplay,setFieldsToDisplay] = useState([])
    const [fileUploadFieldsIdsList,setFileUploadFieldsIdsList] = useState([])
    const history = useHistory();
    const {t} = useTranslation()
    const [viewType, setViweType] = useState('card')
    const setGlobalSpinner = useGlobalSpinnerActionsContext()

    async function getMetaData(){
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setProgarmData(metadata.data)
        setListOfFields(metadata.data.programs[0].programTrackedEntityAttributes)
        
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let allOfflineRecords = await OfflineDb.getAllEntities()
        setOfflineRecords(allOfflineRecords.rows)
        //setSessionUserBoValue(loginDetails.data)    
    }
    useEffect(()=>{
        getMetaData()   
    },[])
    useEffect(()=>{ 
        if(progarmData!=null){
            getFileUploadFieldsIds();
        }
    },[progarmData])

    useEffect(()=>{
        if(listOfFields != null){
          let filtteredFields= listOfFields.filter(obj => obj.displayInList == true);
          setFieldsToDisplay(filtteredFields)
        }    
    },[listOfFields])

    function getFileUploadFieldsIds() {
        
        progarmData.programs[0].programTrackedEntityAttributes.map(regField => {
            if (regField.trackedEntityAttribute.valueType.trim() == "IMAGE" || regField.trackedEntityAttribute.valueType.trim() == "FILE_RESOURCE") {
                fileUploadFieldsIdsList.push(regField.trackedEntityAttribute.id)
                setFileUploadFieldsIdsList(fileUploadFieldsIdsList)
            }
        })

        progarmData.programs[0].programStages.map((stage) => {
           
            stage.programStageDataElements.map(de => {
                if(de.dataElement.valueType == "IMAGE" || de.dataElement.valueType == "FILE_RESOURCE"){
                    fileUploadFieldsIdsList.push(de.dataElement.id)
                    setFileUploadFieldsIdsList(fileUploadFieldsIdsList)
                }
            })
        })
    }

    const handleViewChange = (event) => {
        setViweType(event.target.value);
    };
    const loadViewToggleButtons = ()=>{
        return(
            <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                    <FormControlLabel
                        value="card"
                        control={<Radio
                            checked={viewType === 'card'}
                            onChange={handleViewChange}
                            value="card"
                            name="radio-button-layout"
                        />}
                        label={t('Card View')}
                        
                    />
                    <FormControlLabel
                        value="list"
                        control={<Radio
                            checked={viewType === 'list'}
                            onChange={handleViewChange}
                            value="list"
                            name="radio-button-layout"
                        />}
                        label={t('List View')}
                        
                    />
                </RadioGroup>
            </FormControl>
        )
    }
    const lsitView = (entityObj)=>{
        return(
          <>
          {(fieldsToDisplay.length > 0) ? fieldsToDisplay.map((eachFields,i) => {
              return (
                <p className="alerts_description_fields" key={i}>
                  {eachFields.trackedEntityAttribute.displayName} : 
                  {entityObj[eachFields.trackedEntityAttribute.id] ? entityObj[eachFields.trackedEntityAttribute.id] : 'N/A'}
                </p>  
              )
            }): null}
          </>
        )
    }
    const caseListView = (entityObj) => {
        return (
            <Grid item xs={12} sm={6} md={6} className="knowkedgelistcontainer">
                <div className="alertsdetailholder">
                    {lsitView(entityObj.doc.data)}
                    {/* <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList hide1">
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn mr-10px">
                            <VisibilityIcon /><span className="ml-10px">{t('See Individual Record')}</span>
                        </Button>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn mr-10px">
                            <EditIcon /> <span className="ml-10px">{t('New/Update Individual Record')}</span>
                        </Button> */}
                    <p className="alerts_profilebtn_holder caselistviewbtnholder myClientsCaseList">
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={()=>UpdateRecord(entityObj.id)}>
                            <EditIcon />
                        </Button>
                        <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={()=>SyncSingleRecord(entityObj.id)}>
                            <SyncIcon /> 
                        </Button>
                        {(entityObj.doc.formVersion != progarmData.programs[0].version) ?
                            <Button variant="contained" disableElevation className="infoviewmorebtn float-right">
                                Outdated Record
                            </Button>
                        :""}
                        
                    </p>
                </div>
            </Grid>
        )
    }
    const SyncSingleRecord = (id)=>{
        if(navigator.onLine){
            setGlobalSpinner(true)
            OfflineDb.getSingleEntity(id).then(async res=>{
                let finalObj = {'trackedEntityInstances' : []};
                let finalBO = await getProcessedTEAttributeData(res)
                finalObj.trackedEntityInstances.push(finalBO)
                apiServices.postAPI('trackedEntityInstances', finalObj)
                .then(response => {
                    OfflineDb.deleteEntity(id);
                    let pendingRecords = _.reject(offlineRecords.rows, { 'id': id})
                    setOfflineRecords(pendingRecords);
                    setGlobalSpinner(false)
                    swal({
                        title: t("Sync"),
                        text: t("Data sync success"),
                        icon: "success",
                        button: t("Close")
                    })
                }).catch(err=>setGlobalSpinner(false))
            }).catch(err=>{
                setGlobalSpinner(false)
                swal({
                    title: t("Sync"),
                    text: err,
                    icon: "error",
                    button: t("Close")
                })
            })
        }else{
            swal({
                title: t("Network connection issue"),
                text: t("Please make sure your internet connection is working"),
                icon: "info",
                button: t("Close")
            })
        }        
    }
    const SyncRecords = () => {
        if(navigator.onLine){
            setGlobalSpinner(true)
            //let finalObj = {'trackedEntityInstances' : []};
            const allRecords = [...offlineRecords]  
            const tempRecords = [...offlineRecords]  
            allRecords.map( async (row,idx) =>{
                // check from verion and offline data form version
                //console.log(row.doc.formVersion,progarmData.programs[0].version)
                if(row.doc.formVersion == progarmData.programs[0].version){
                    //finalObj.trackedEntityInstances.push(getProcessedTEAttributeData(row.doc))
                    //return
                    let finalBO = await getProcessedTEAttributeData(row.doc);
                    //console.log("finalBO",finalBO)
                    await apiServices.postAPI('trackedEntityInstances', {'trackedEntityInstances' : [finalBO]})
                    .then(response => {
                        OfflineDb.deleteEntity(row.doc._id);
                        let indexToRemove = _.findIndex(tempRecords, { 'id': row.doc._id})
                        tempRecords.splice(indexToRemove, 1);
                        setOfflineRecords(tempRecords);
                        if(tempRecords.length == 0){
                            setOfflineRecords([]);
                            swal({
                                title: t("Sync"),
                                text: t("Data sync success"),
                                icon: "success",
                                button: t("Close")
                            })
                            setGlobalSpinner(false)
                        }
                        
                    }).catch((err)=>{
                        setGlobalSpinner(false)
                        swal({
                            title: t("Sync Error"),
                            text: t("Data sync Fail"),
                            icon: "error",
                            button: t("Close")
                        })
                    })
                }else{
                    setGlobalSpinner(false)
                    swal({
                        title: t("Sync Error"),
                        text: t("Offline stored data is out dated, kindly update the data and try again"),
                        icon: "error",
                        button: t("Close")
                    })
                }
                
            })
        }else{
            swal({
                title: t("Network connection issue"),
                text: t("Please make sure your internet connection is working"),
                icon: "info",
                button: t("Close")
            })
        }
    }
    const removeFile = (path) =>{
        return new Promise((resolve, reject) => {
          const filePath = path.substr(0, path.lastIndexOf('/'));
        
          window.resolveLocalFileSystemURL(filePath, (dir) => {
            const fileName = path.substr(path.lastIndexOf('/') + 1);
            dir.getFile(fileName, { create: false }, (fileEntry) => {
              fileEntry.remove(() => {
                resolve('file removed!');
              }, (error) => reject('error occurred: ' + error.code),
                () => reject('file does not exist'));
            }, (error) => reject(error));
          }, (error) => reject(error));
        });
    }
    const getFileResourceId = (fileURI)=>{
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = async function(e) {
                        console.log("e",file.type)
                        var imgBlob = new Blob([this.result], {type:file.type});
                        formData.append('file', imgBlob);
                        //post formData here
                        console.log("formData",formData)
                        await apiServices.postAPI('fileResources', formData)
                            .then(res => {
                                if (res.data) {
                                    resolve(res.data.response.fileResource.id);
                                }else{
                                    resolve(res)
                                }
                                removeFile(fileURI).then(res=>console.log(res)).catch(err=>console.log(err))
                            })
                    };
                    reader.readAsArrayBuffer(file);
                },function(err){
                    console.log("err",JSON.stringify(err))
                    reject(err)
                });
            },function(err){
                console.log("err",JSON.stringify(err))
                reject(err)
            });

        });

    }
    const getProcessedTEAttributeData = (doc) =>{
        return new Promise(async (resolve, reject) => {
            //console.log(fileUploadFieldsIdsList)
            if(window.cordova){        
                for (let objectKey of Object.keys(doc.data)) {
                
                    if(fileUploadFieldsIdsList.indexOf(objectKey) !=-1 && doc.data[objectKey]){
                        //console.log("doc.data[objectKey]",doc.data[objectKey])
                        
                        //upload file and get the resource id
                        let resid = await getFileResourceId(doc.data[objectKey])
                        //console.log("resid",resid)

                        //update registration object
                        doc.registration.attributes.map((attr,idx)=>{
                            if(attr.attribute == objectKey){
                                doc.registration.attributes[idx]['value'] = resid;
                            }
                        })
                        //update service object
                        if(doc.services.length > 0){
                            doc.services.map((servicearr,serviceIndex)=>{
                                servicearr.events.map((eventObj,eventIndex)=>{
                                    eventObj.dataValues.map((de,deIndex)=>{
                                        if(de.dataElement == objectKey){
                                            doc.services[serviceIndex]['events'][eventIndex]['dataValues'][deIndex]['value'] = resid;
                                        }
                                    })
                                })
                            })
                        }
                    }
                
                }
                //console.log("doc",doc)

                let instanceBO = doc.registration;
                if(doc.services.length > 0){
                    instanceBO.enrollments[0]['events'] = [];
                    doc.services.map(servicearr=>{
                        servicearr.events.map(eventObj=>{
                            instanceBO.enrollments[0]['events'].push(_.omit(eventObj, ['enrollment', 'trackedEntityInstance']))
                        })
                    })
                }
                resolve(instanceBO);
            }else{
                
                let instanceBO = doc.registration;
                if(doc.services.length > 0){
                    instanceBO.enrollments[0]['events'] = [];
                    doc.services.map(servicearr=>{
                        servicearr.events.map(eventObj=>{
                            instanceBO.enrollments[0]['events'].push(_.omit(eventObj, ['enrollment', 'trackedEntityInstance']))
                        })
                    })
                }
               resolve(instanceBO);   
            }
        })
        
    }
    const UpdateRecord = (id)=> {
        if(!navigator.onLine){
            setGlobalSpinner(true)
            OfflineDb.getSingleEntity(id).then(res=>{
                const activeCaseDetails = {
                    'trackedEntityInstance': id,
                    'enrollmentId': "",
                }
                const activeCaseFormData = {
                    'formFormat': res.data,
                    'dhisFormat': null
                }
                const linkContact = {
                    "enabled": false,
                    "linkTrackedEntityInstance": id
                }
                OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
                OfflineDb.setDataIntoPouchDB('activeCaseFormData', activeCaseFormData)
                OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
                setGlobalSpinner(false)
                history.push('/layout/registration')

            }).catch(err=>{
                setGlobalSpinner(false)
                swal({
                    title: t("Edit"),
                    text: err,
                    icon: "error",
                    button: t("Close")
                })
            })
        }else{
            swal({
                title: t("Operation not permitted"),
                text: t("Offline stored data is not possible to edit in online mode"),
                icon: "info",
                button: t("Close")
            })
        }
        
    }

    return (            
        <section className="searchcustombg"
            style={{
                backgroundColor: '#fff',
                flexGrow: 1,
                padding: 20,
                
            }}
        >
            <div className="searchformcontainer">
                <p className="searchformheading">
                    <span><Trans>Offline Clients</Trans></span>
                    {console.log('offlineRecords',offlineRecords)}
                    {   offlineRecords.length > 0 
                        ?
                        <span className="ml-10px">
                            <Button variant="contained" color="primary" disableElevation className="infoviewmorebtn" onClick={SyncRecords}>
                            <SyncIcon /><span className="ml-10px">{t('Sync Data')}</span>
                            </Button>
                        </span>
                        : null
                    }
                </p>
                {   progarmData && offlineRecords.length > 0 
                    ?
                     offlineRecords.map(row=>{ return caseListView(row)}) 
                    : null
                }
            </div>               
        </section>
    )
    
}
export default Cases;