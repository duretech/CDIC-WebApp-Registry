import React, { Component, useState, useEffect } from 'react'
import { withTranslation, Trans , useTranslation} from 'react-i18next';
import OfflineDb from '../../db'
import { styled } from "@material-ui/styles";
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classes from '../../App.module.css'
import { apiServices } from '../../services/apiServices';
import {useHistory} from "react-router-dom";
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import _ from 'lodash';

import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FooterMenu from '../../component/layout/FooterMenu'

import FormLabel from '@material-ui/core/FormLabel';

import {
    Button,
    ReactFinalForm
  } from "@dhis2/ui";
import swal from "sweetalert";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';

const { Form, Field, FormSpy } = ReactFinalForm;

const Item = styled(Paper)(({ theme }) => ({
// backgroundColor: theme?.palette?.mode === 'dark' ? '#1A2027' : '#fff',
// ...theme?.typography?.body2,
// padding: theme?.spacing(1),
// textAlign: 'center',
// color: theme?.palette?.text.secondary,
}));

function DataEntry() {
    const [dataSets, setDataSets] = useState(null)
    const [surveyMetaData, setSurveyMetaData] = useState(null)
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const history = useHistory();
    const [value, setValue] = useState(0)
    const {t} = useTranslation()

    const [openModal, setOpenModal] = useState(false);
    const [itemName, setItemName] = useState("");

    async function fetchDataFromDataBase() {
        let dataset = await OfflineDb.getDataFromPouchDB('dataEntrySet')
        setDataSets(dataset.data.dataSets)
        if(dataset.data && dataset.data.dataSets && dataset.data.dataSets.length > 0){
            setValue(dataset.data.dataSets[0].id)
        }
        
    }

    useEffect(() => {
        fetchDataFromDataBase()
        OfflineDb.removeDataFromPouchDB("activeCaseDetails");
        OfflineDb.removeDataFromPouchDB("activeCaseFormData");
    }, [])


    const getTranslatedLabels = (dataElement) => {
        if (localStorage.getItem("locale") == "en") {
            return dataElement.displayName;
        } else if (dataElement.translations && dataElement.translations.length > 0) {
            let label = dataElement.translations.filter(
                (tanslation) =>
                    tanslation.property == "NAME" &&
                    tanslation.locale == localStorage.getItem("locale")
            );
            if (label.length > 0) {
                return label[0].value;
            } else {
                return dataElement.displayName;
            }
        }
        return dataElement.displayName;
    };

    function onDataSetClick(dataSetId) {
        //optionSet[id,options[id,code,displayName,translations[*],style]]
        //console.log("dataSets", dataSets,dataSetId,dataSets.data);
        //return;
        if(dataSets){
            let selectedDataSet = _.find(dataSets,{"id":dataSetId})
            console.log("selectedDataSet",selectedDataSet);
            OfflineDb.setDataIntoPouchDB('surveyFormData', selectedDataSet)
            OfflineDb.setDataIntoPouchDB('currentDataSet', dataSetId)
            .then(res => {
                setGlobalSpinner(false)
                history.push('/layout/datasetmanagement')
            })
        }else{
            const getDataOfSurveyApi = 'dataSets/'+dataSetId+'?fields=all,attributeValues[:all,attribute[id,name,displayName]],dataSetElements[id,dataSet[id],dataElement[:all,id,displayName,categoryCombo[id,displayName],optionSet[id,options[id,code,displayName]]],categoryCombo[id,displayName],optionSet[id,options[id,code,displayName]]],indicators[id,displayName,categoryCombo[id,displayName]],organisationUnits[id,path],sections[:all,dataElements[id,displayName],categoryCombos[id,displayName],,greyedFields[categoryOptionCombo[id,displayName],dataElement[id,displayName]]]'
            setGlobalSpinner(true)
            apiServices.getAPI(getDataOfSurveyApi)
            .then(getDataOfSurvey => {
                console.log("getDataOfSurvey",getDataOfSurvey,getDataOfSurvey.data);
                OfflineDb.setDataIntoPouchDB('surveyFormData', getDataOfSurvey.data)
                OfflineDb.setDataIntoPouchDB('currentDataSet', dataSetId)
                .then(res => {
                    setGlobalSpinner(false)
                    history.push('/layout/survey')
                })
            })
            .catch(err => {
                setGlobalSpinner(false)
            })
        }
    }

    function handleChange(event) {
        console.log("event",event.target.value);
        setValue(event.target.value)
        //onDataSetClick(event.target.value)
    }

    function handleAddItem(req, deUID) {
        let payload = req;
        let arr = payload.dataSetElements;
        arr.push({
          "dataSet": {
            "id": "LpGDba6fUGg"
          },
          "dataElement": {
            "id": deUID
          }
        })
        payload.dataSetElements = arr;
        let newPayload = {};
        let dataSets = [];
        dataSets.push(payload)
        newPayload = { dataSets }
        apiServices
          .postAPI("metadata", newPayload)
          .then((response) => {
            if(response.status == 200 || response.status == 201){
              swal({
                title: t("New Item Added Successfully"),
                icon: "success",
                button: "Ok",
              })
            }
            else{
              swal({
                title: t("Something Went Wrong, Please Contact Administrator!"),
                icon: "error",
                button: "Ok",
              })
            }
          })
        setItemName("")
        setOpenModal(false)
      }
    const addItem = (e) => {
        let deUID = "";
        let oRequest = {
          "aggregationType": "NONE",
          "domainType": "AGGREGATE",
          "description": itemName,
          "valueType": "TEXT",
          "formName": itemName,
          "name": itemName,
          "shortName": itemName+"shortName",
          "categoryCombo": {
            "id": "YFoRd6XEbId"
          },
          "legendSets": []
        }
        apiServices
          .postAPI("dataElements", oRequest)
          .then((response) => {
              deUID = response.data.response.uid;
              apiServices.getAPI('dataSets/' + `${"LpGDba6fUGg"}`).then(res => {
                handleAddItem(res.data, deUID)
              })
          }).catch(err => {
              setOpenModal(false)
              swal({
                title: t("Something Went Wrong, Please Contact Administrator!"),
                icon: "error",
                button: "Ok",
              })
    
          })
        
      }

    function createGrids() {
        console.log("dataSets",dataSets);
        /*if(dataSets.length != 1){
            OfflineDb.setDataIntoPouchDB('surveyFormData', dataSets[0])
            OfflineDb.setDataIntoPouchDB('currentDataSet',dataSets[0].id)
            history.push('/layout/survey')
        }else{*/
            return (
                dataSets && dataSets.length > 0 ?
                <div className="homemenudivcontainer1 regformsubmitbtn1 survey-module" style={{"width":"100%"}}>
                    <Grid container spacing={2} columns={12}>
                    {
                    dataSets.map((dataSet, index) => {
                            //return <div class="flex-item" onClick={() => onDataSetClick(dataSet.id)}>{getTranslatedLabels(dataSet)}</div>
                           return (
    
                                <Grid item xs={12} sm={2} md={3} onClick={() => onDataSetClick(dataSet.id)} style={{cursor:"pointer"}}>
                                    <Item className='highlighted-box'>{getTranslatedLabels(dataSet)}</Item>
                                </Grid>
                            //  <div className="highlighted-box" onClick={() => onDataSetClick(dataSet.id)}>
                            //     <i className="fas fa-star"></i>
                            //     <p>{getTranslatedLabels(dataSet)}</p>
                            // </div>
                            )
                        })
                    }
                    <Grid item xs={12} sm={2} md={3} onClick={() => setOpenModal(true)} style={{cursor:"pointer"}}>
                        <Item className='highlighted-box'>{"Add Item"}</Item>
                    </Grid>
                    </Grid>
                    {/* <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="select-form" value={value} onChange={handleChange}>
                            {dataSets.map((dataSet, index) => {
                                return (
                                    <FormControlLabel className={dataSet.displayName == "Tues_21_6_001"? 'hide' :''} style={{"textAlign":"left"}} value={dataSet.id} control={<Radio />} label={getTranslatedLabels(dataSet)} />    
                                )
                            })}
                        </RadioGroup>
                    </FormControl> 
                    <div className="buttons" style={{"textAlign":"left","marginTop":"10px"}}>
                        <button style={{"width":"","maxWidth":""}} className="regformsubmitbtn" type="submit" onClick={() => onDataSetClick(value)}>
                            {t('Submit')}
                        </button>
                    </div>*/}
                </div>
                :<>{t("No datasets found")}</>
            )
        //}
        
    }

    return (
        <div className={classes.container}>
            <FooterMenu></FooterMenu>
            <main style={{ display: 'flex', height: '100%', width: '100%' }}>
                <section className="homepagebgsection dataentrypage rightsectiontoppart"
                    style={{
                        flexGrow: 1,
                        padding: 20,
                        //background: '#f4f4f4'
                    }}
                >
                    <Grid container spacing={3} className="mt-56px">
                        <Grid item xs={12}>
                            <Grid container sm={12} md={12} lg={12} spacing={3} className="progresscontainer homemenuholder1">
                                {dataSets != null 
                                ? 
                                    createGrids()
                                :
                                    <> </>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    {
          openModal ?
            <div className="modaloverlay">
              <div className="modalcardholder">
                <Card className="modalcard">
                  <CardHeader
                    className="modalheader"
                    action={
                      <IconButton aria-label="close">
                        <CloseIcon onClick={() => setOpenModal(false)} />
                      </IconButton>
                    }
                    title={"Add New Item"}
                  />
                  <CardContent className="modalbodycontent">
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Form
                          onSubmit={(e) => { addItem(e) }}
                          render={({
                            handleSubmit,
                            form,
                            submitting,
                            pristine,
                            values,
                          }) => (
                            <>
                              <form onSubmit={handleSubmit}>
                                <TextField
                                  id="standard-helperText"
                                  label={t('Enter Item Name')}
                                  onChange={(e) => { setItemName(e.target.value) }}
                                />
                                <Grid container xs={12} className="mt-15px d-flex justify-content-end">
                                  <Button type="submit" className="modalactionbtn">Add Item</Button>
                                </Grid>
                              </form>
                            </>
                          )}></Form>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            </div>

            : <></>
        }
                </section>
            </main>
        </div>
    )
}

export default DataEntry