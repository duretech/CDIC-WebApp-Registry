import React, { useState,useEffect } from 'react'
import { useHistory } from "react-router-dom";
import i18n from '@dhis2/d2-i18n'
import classes from '../../App.module.css'
import { makeStyles } from '@material-ui/core/styles';
import { apiServices } from '../../services/apiServices'
//import SearchBar from '../../component/searchbar/SearchBar';
//import CaseList from './NewThemeCaseList'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import DataTable from 'react-data-table-component';
import Pagination from "@material-ui/lab/Pagination";
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
//import PersonOffIcon from '@material-ui/icons/PersonOff';
import PersonIcon from '@material-ui/icons/Person';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import _ from "lodash";
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
import swal from 'sweetalert'
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
//import {Configuration} from '../../assets/data/config'
import '../../assets/css/customstyles.css'
// import '../../assets/css/theme_grey.css'
// import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'
import SearchBar from 'material-ui-search-bar';
import FooterMenu from '../../component/layout/FooterMenu'
import imgUrl from '../../assets/images/imageUrl'
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from '@material-ui/core/TextField';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import CloseIcon from "@material-ui/icons/Close";

import Box from "@material-ui/core/Box"
import moment from 'moment';

const {Form, Field } = ReactFinalForm

function DeactivatedCases(){
    const history = useHistory();
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [programData,setprogramData] = useState(null)
    const [customSearch,setCustomSearch] = useState([])
    const [UICSearch,setUICSearch] = useState([])
    const [input, setInput] = useState('');
    const [searchResult,setSearchResult] = useState([])
    const [searchAllResult,setSearchAllResult] = useState([])
    const [value,setValue] = useState([])
    // const [loading,setGlobalSpinner] = useState(false)
    const {t} = useTranslation()
    const [viewType, setViweType] = useState('list')
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [casesData, setCasesData] = useState([])
    const [searchInputValue, setSearchInputValue] = useState('')
    const [casesAllData, setAllCasesData] = useState(null)
    const [openFilter, setOpenFilter] = useState(null)
    const [provinceList ,setProvinceList] = useState(null)
    const [districtList ,setDistrictList] = useState(null)
    const [facilityList ,setFacilityList] = useState(null)
    const [OUJSON,setOUJSON] = useState(null)
    // const columns = [
    //     {
    //         name: 'Name',
    //         selector: row => row[" Name"] ? row[" Name"] : row["Name"] ? row["Name"] : "-",
    //     },
    //     {
    //         name: 'Age',
    //         selector: row => row["Age (completed years)"] ? row["Age (completed years)"] : '-',
    //     },
    //     {
    //         name: 'Gender',
    //         selector: row => row["Gender"] ? row["Gender"] : '-',
    //     },
    //     {
    //         name: 'TB Registration Number',
    //         selector: row => row["TB Registration Number"] ? row["TB Registration Number"] : '-',
    //     },
    //     // {
    //     //   name: 'Edit',
    //     //   selector: row => row.edit,
    //     // },
    //     {
    //       name: 'Activate',
    //       selector: row => row.status,
    //     },
    // ];

    const columns = [
        {
            name: t('Name'),
            selector: row => row["Contact Fullname"],
            width: "200px",
        },
        {
            name: t('Age'),
            selector: row => row["Ages"] ? row["Ages"] : '-',
        },
        {
            name: t('Gender'),
            selector: row => row["Gender"] ? row["Gender"] : '-',
        },
        {
            name: t('Phone Number'),
            selector: row => row["Phone Number"] ? row["Phone Number"] : '-',
            width: "200px",
        },
        {
            name: t('UIC'),
            selector: row => row["UIC"] ? row["UIC"] : '-',
            width: "200px",
        },
        {
            name: t('Client Type'),
            selector: row => row["ClientType"] ? row["ClientType"] : '-',
        },
        {
            name: t('Index Name'),
            selector: row => row["index Fullname"] ? row["index Fullname"] : '-',
            width: "150px",
        },
        // {
        //     name: 'District',
        //     selector: row => row["District"] ? row["District"] : '-',
        // },
        // {
        //     name: 'Facility Name',
        //     selector: row => row["Facility Name"] ? row["Facility Name"] : '-',
        // },
        {
            name: t('Date Of Reg.'),
            selector: row => row["DATEOFREGISTERATION"] ? moment(row["DATEOFREGISTERATION"]).format('MM/DD/YYYY') : '-',
        },
        {
          name: 'Activate',
          selector: row => row.status,
          width: "100px",
        },
    ];
    const [values, setValues] = React.useState({
        fromDate: '',
        toDate: '',
        province: '',
        district: '',
        facility: ''
      });

    //pagination code
    //const itemsPerPage = Configuration.pagination.itemsPerPage
    const [page, setPage] = useState(1);
    const [noOfPages,setNoOfPages] = useState(0)
    const [Configuration,setConfiguration] = useState(null);
    async function getMetaData(){
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setprogramData(metadata.data)
        
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let configurations = await OfflineDb.getDataFromPouchDB('configurations')
        console.log("configurations && configurations.data",configurations , configurations.data);
        if(configurations && configurations.data)
        setConfiguration(configurations.data.configuration)

        let OU = await OfflineDb.getDataFromPouchDB('OUStructureJSON')
        setOUJSON(OU.data)
    }
    useEffect(()=>{
        getMetaData()      
        OfflineDb.removeDataFromPouchDB('activeCaseDetails')
        OfflineDb.removeDataFromPouchDB('activeCaseFormData')
        OfflineDb.removeDataFromPouchDB('linkContactFlag')
        OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
    },[])
    
    //once user bco is set call getContactList function
    useEffect(()=>{
        if(sessionUserBoValue != null){
            getCasesList()
        }
    },[sessionUserBoValue])

    useEffect(()=>{
        try{
            if(searchResult && searchResult.length > 0){
                //setNoOfPages(Math.ceil(searchResult[1].length / 10))
            }
        }catch(e){

        }
    },[searchResult])

    useEffect(()=>{
        if(OUJSON != null){
            getOrgUnits()
        }
    },[OUJSON])

    function resetSearch(){
        setSearchInputValue('');
        setCasesData(casesAllData)
    }
    
    function getCasesList(param)  {
        //localStorage.removeItem('trackedEntityInstance')
        setGlobalSpinner(true)        
        let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
            programID = sessionUserBoValue.programs[0]
        
        let subURL = 'adminmodule/getdeactivatepatientdata'
        let params = {puid: programID}
        apiServices.postAPI(subURL,params).then(res => { 
            console.log("res ",res,res.data.data,res.data.Data);
            let headers = ["Instance","Name","Surname","Phone Number","Age (completed months)"]
            if(res && res.data && res.data.Data){
                res.data.Data.map((obj,i) => {
                    //res.data.data[i]["edit"] =  <div onClick={()=>editCase(obj["instanceuid"])}><EditIcon/></div>
                    res.data.Data[i]["status"] =  <div className="table-action" onClick={()=>changeStatus(obj,res.data.Data[i])}><CheckCircleIcon/></div>
                })
                res.data.Data = _.sortBy(res.data.Data, 
                    [function(o) { return o["Contact Fullname"]; }]);
                setSearchResult(res.data.Data)
                setSearchAllResult(res.data.Data)
                setCasesData(res.data.Data)
                setAllCasesData(res.data.Data)
                console.log("res.data.data ",res.data.Data);
            }else{
                setCasesData([])
                setAllCasesData([])
            }
            setGlobalSpinner(false)
        }).catch(error => {
            setGlobalSpinner(false)
            swal({
                title: "Error",
                text: t("Sorry, something went wrong"),
                icon: "error",
                button: "Close",
              });
        })
        
    }
    
const editCase = (instancetId) => {
    console.log("instancetId",instancetId);
    setGlobalSpinner(true)
    const activeCaseDetails = {
    'trackedEntityInstance': instancetId,
    'enrollmentId': "",
    }
    const activeCaseFormData = {
    'formFormat': null, //formDataMassaged,
    'dhisFormat': null
    }
    const linkContact = {
    "enabled": false,
    "linkTrackedEntityInstance": instancetId
    }
    OfflineDb.setDataIntoPouchDB('activeCaseDetails', activeCaseDetails)
    OfflineDb.setDataIntoPouchDB('linkContactFlag', linkContact)
    history.push('/layout/registration')
}
const changeStatus = (clientData,data) => {
        //console.log("instancetId",instancetId,casesData,searchAllResult,data);
        let instancetId = clientData["instanceuid"]
        let clientType = clientData["ClientType"]
       // return;
        // let filterCasesData = _.cloneDeep(searchAllResult)
        // const index = filterCasesData.findIndex(prop => prop.instanceuid === instancetId)
        // console.log("filterCasesData ",filterCasesData,index);

        swal({
            title: "Are you sure?",
            text: t("Do you want to activate this client?"),
            icon: "warning",
            buttons: ["No","Yes"],
          }).then(alertRes =>{
            if(alertRes){
                setGlobalSpinner(true)
                let clientStatusURL = 'adminmodule/actdeactpatientcheck'
                apiServices.postAPI(clientStatusURL,{"uic":instancetId}).then(res => { 
                    if(res && res.data && res.data.Status){
                        if(res.data.Status == "Active" || clientType != "Contact"){
                            let subURL = 'adminmodule/actdeactpatient'
                            let params = {
                                "status":"activate",
                                "instanceuid":instancetId,
                                "puid":sessionUserBoValue.programs[0],
                                "uic":data["UIC"]
                                //userby: sessionUserBoValue.userCredentials.username
                            }
                            apiServices.postAPI(subURL,params).then(res => { 
                                console.log("res ",res);
                                if(res && res.data && res.data.Status && res.data.Status[0] == "Success"){
                                    swal({
                                        title: "Success",
                                        text: t("Client successfully activated."),
                                        icon: "success",
                                        button: "Close",
                                    });
                                    //console.log("casesData ",casesData,data);
                                    // let filterCasesData = _.cloneDeep(data)
                                    // const index = filterCasesData.findIndex(prop => prop.instanceuid === instancetId)
                                    // if(index != -1){
                                    //     filterCasesData.splice(index,1)
                                    //     setCasesData(filterCasesData)   
                                    // }      
                                    getCasesList()             
                                }else{
                                    swal({
                                        title: "Error",
                                        text: t("Sorry, something went wrong"),
                                        icon: "error",
                                        button: "Close",
                                    });
                                }
                                setGlobalSpinner(false)
                            }).catch(error => {
                                setGlobalSpinner(false)
                                swal({
                                    title: "Error",
                                    text: t("Sorry, something went wrong"),
                                    icon: "error",
                                    button: "Close",
                                });
                            })
                        }else{
                            setGlobalSpinner(false)
                            swal({
                                title: "Alert",
                                text: t("The Linked Index for this contact is deactivated. To proceed, activate linked Index."),
                                icon: "warning",
                                button: "Close",
                            });
                        }
                    }else{
                        setGlobalSpinner(false)
                        swal({
                            title: "Error",
                            text: t("Sorry, something went wrong"),
                            icon: "error",
                            button: "Close",
                        });
                    }
                }).catch(error => {
                    setGlobalSpinner(false)
                    swal({
                        title: "Error",
                        text: t("Sorry, something went wrong"),
                        icon: "error",
                        button: "Close",
                    });
                })
            }
          });
        
    }
    const handleViewChange = (event,newValue) => {
        setGlobalSpinner(true)
    };
    
    const updateInput = (input) => {
        setInput(input);
        let filteredList = []
        setGlobalSpinner(true)
        if(input && input.length > 3){
            searchAllResult[1].map(function(objectKey, index) {
                objectKey.map(function(data, j) {
                    if(data.toLowerCase().indexOf(input.toLowerCase()) > -1){
                        filteredList.push(objectKey)
                    }
                })
            })
            let headerEle = searchAllResult[0]
            let filterSearchArray = [];
            filterSearchArray.push(headerEle)
            filterSearchArray.push(filteredList)
            setSearchResult([]);
            setTimeout(function(){
                setGlobalSpinner(false)
                setSearchResult(filterSearchArray)
            },500)
        }else{
            if(input.length == 0){
                let headerEle = searchAllResult[0]
                let filterSearchArray = [];
                filterSearchArray.push(headerEle)
                filterSearchArray.push(searchAllResult[1])
                setSearchResult([]);
                setTimeout(function(){
                    setGlobalSpinner(false)
                    setSearchResult(filterSearchArray)
                },1000)
            }else{
                setGlobalSpinner(false)
            }
        }

        //if(filteredList.length > 0){
            
        
        
    }
   
    
    const handlePageChange = (event, value) => {
        setPage(value);
    }

    const loadFilter = () => {
        setOpenFilter(true)
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const resetFilter = () =>{
        console.log("Reset filter");
        setValues({
            fromDate: '',
            toDate: '',
            province: '',
            district: '',
            facility: ''
        })
        setCasesData(casesAllData)
        setOpenFilter(false)
    }
    const getFilterValues = () => {
        //console.log("vall ",values);
        if(!values.province && !values.district && !values.facility && !values.toDate && !values.fromDate){
         setCasesData(casesAllData)
         setOpenFilter(false)
         return;
        }
        let filterData = _.cloneDeep(casesAllData)
        if(values.province){
        filterData = _.filter(filterData, { 'Province': values.province})
        }
        if(values.district){
         filterData = _.filter(filterData, { 'District': values.district})
        }
        if(values.facility){
         filterData = _.filter(filterData, { 'Facility Name': values.facility})
        }
        if(values.fromDate && values.toDate){
         filterData = _.filter(filterData, function(o) {
             let selectedDate = o["DATEOFREGISTERATION"] ? moment(o["DATEOFREGISTERATION"]).format("MM/DD/YYY") : null
             return selectedDate && selectedDate >= moment(values.fromDate).format("MM/DD/YYY") && selectedDate <=  moment(values.toDate).format("MM/DD/YYY");
         })
        }
        if(values.fromDate && !values.toDate){
         filterData = _.filter(filterData, function(o) {
             let selectedDate = o["DATEOFREGISTERATION"] ? moment(o["DATEOFREGISTERATION"]).format("MM/DD/YYY") : null
             return selectedDate == moment(values.fromDate).format("MM/DD/YYY")
         })
        }
        if(!values.fromDate && values.toDate){
         filterData = _.filter(filterData, function(o) {
             let selectedDate = o["DATEOFREGISTERATION"] ? moment(o["DATEOFREGISTERATION"]).format("MM/DD/YYY") : null
             return selectedDate ==  moment(values.toDate).format("MM/DD/YYY");
         })
        }
        if(filterData && filterData.length > 0){
         setCasesData(filterData)
        }else{
         setCasesData([])
        }
        setOpenFilter(false)
     };

    const getOrgUnits = () => {
        if(OUJSON.organisationUnits){
            let OUMOptions = []
            let autocompleteData = []
            OUMOptions = OUJSON.organisationUnits.filter(obj => (obj.level == 3));
            if(OUMOptions.length > 0) {
            OUMOptions.map(items => {
                    let obj = {
                        'label': items.name, 
                        'value': items.name
                    }
                    autocompleteData.push(obj)
                })
            }
            console.log("autocompleteData ",autocompleteData,OUMOptions);
            setProvinceList(autocompleteData)
        }
    }

    const getDistrictList = (event, value) =>{
        setValues({ ...values, ["province"]: value ? value.value : '',["district"]:"",["facility"]: "" });


        let autocompleteData = []
        let OUMOptions = []
        OUMOptions = OUJSON.organisationUnits.filter(obj => (obj.level == 3))
        OUMOptions = OUMOptions.filter(obj => 
            (value && obj.name == value.value))
            if(OUMOptions.length > 0) {
            OUMOptions[0].children.map(childOptions => {
                const filterChildDetails = OUJSON.organisationUnits.filter(obj => obj.id == childOptions.id)
                if(filterChildDetails.length > 0) {
                    let obj = {
                        'label': filterChildDetails[0].name,
                        'value': filterChildDetails[0].name,
                    }
                    autocompleteData.push(obj)
                }
            })
            console.log("autocompleteData ",autocompleteData);
                setDistrictList(autocompleteData)
            }else{
                setDistrictList(null)
                //setValues({ ...values, ["facility"]: "" });
            }
    }

    const getFacilityList = (event, value) =>{
        //setValues({ ...values, ["district"]: value.value });
        setValues({ ...values, ["district"]: value ? value.value : '',["facility"]: "" });
        
        let autocompleteData = []
        let OUMOptions = []
        OUMOptions = OUJSON.organisationUnits.filter(obj => (obj.level == 4))
        OUMOptions = OUMOptions.filter(obj => 
            (value && obj.name == value.value))
            if(OUMOptions.length > 0) {
            OUMOptions[0].children.map(childOptions => {
                const filterChildDetails = OUJSON.organisationUnits.filter(obj => obj.id == childOptions.id && obj.comment == "Facility")
                if(filterChildDetails.length > 0) {
                    let obj = {
                        'label': filterChildDetails[0].name,
                        'value': filterChildDetails[0].name,
                    }
                    autocompleteData.push(obj)
                }
            })
            console.log("autocompleteData ",autocompleteData);
                setFacilityList(autocompleteData)
            }else{
                setFacilityList(null)
                //setValues({ ...values, ["facility"]: "" });
            }
    }
    const setFacilityValue = (event, value) =>{
        setValues({ ...values, ["facility"]: value.value });
    }
    return (    
        <section
        className="searchcustombg searchtabmaindiv"
        style={{
            // backgroundColor: '#fff',
            flexGrow: 1,
            padding: 0,
        }}
        >
            <FooterMenu></FooterMenu>
            <Grid container>
                <Grid item xs={4} sm={4} md={4}>
                    <div className="table-header">
                        <h3 className="text-uppercase zero">
                            <Trans>Deactivated Clients</Trans>
                        </h3>
                    </div>
                </Grid>
                <Grid item xs={8} sm={8} md={8}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                        <SearchBar
                        value={searchInputValue}
                        onChange={(newValue) =>setSearchInputValue(newValue)}
                        className="searchbar-block"
                        onCancelSearch={() => resetSearch()}
                        />
                    </Grid>
                    {/* <Grid item xs={1} sm={1} md={1}>
                        <div onClick={()=>loadFilter()}><img src={imgUrl.filter} width="30"/></div>
                    </Grid> */}
                </Grid>
                </Grid>
            </Grid>
            {casesData && casesData.length > 0 ?      
            <>
                {/* {console.log("casesData ",casesData)} */}
                <Grid className='datatable-block'>
                <DataTable
                //title="Desserts - Cell Styling"
                striped="true"
                responsive="true"
                pagination
                fixedHeader="true"
                columns={columns}
                //data={casesData}
                data={casesData.filter((item) => {
                    if (searchInputValue === "") {
                      return item;
                    } else if (
                        (item["Contact Fullname"] && item["Contact Fullname"].toLowerCase().includes(searchInputValue.toLowerCase())) ||
                        (item["index Fullname"] && item["index Fullname"].toLowerCase().includes(searchInputValue.toLowerCase())) ||
                        (item["DATEOFREGISTERATION"] && moment(item["DATEOFREGISTERATION"]).format("MM/DD/YYYY").includes(searchInputValue.toLowerCase())) ||
                        (item["Ages"] && item["Ages"].toLowerCase().includes(searchInputValue.toLowerCase())) ||
                        (item["Gender"] && item["Gender"].toLowerCase().includes(searchInputValue.toLowerCase())) ||
                        (item["Phone Number"] && item["Phone Number"].toLowerCase().includes(searchInputValue.toLowerCase())) ||
                        (item["UIC"] && item["UIC"].toLowerCase().includes(searchInputValue.toLowerCase()))
                    ) {
                      return item;
                    }
                  })}
                />
                </Grid>
                </> 
            : casesData && casesData.length == 0 ?<div className='no-records-block'>No records</div>
            :<></>}
            {openFilter && OUJSON != null? 
                <div className="modaloverlay">
                <div className="modalcardholder">
                    <Card className="modalcard">
                    <CardHeader
                        className="modalheader"
                        action={
                        <IconButton aria-label="close">
                            <CloseIcon onClick={() => setOpenFilter(null)} />
                        </IconButton>
                        }
                        title="Filter"
                    />
                    <CardContent className="modalbodycontent">
                        {/* <Grid container spacing={3}></Grid> */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <TextField
                                type="date"
                                id="fromDate"
                                label="From date"
                                value={values.fromDate ? values.fromDate : null}
                                onChange={handleChange('fromDate')}
                                focused
                                />
                                <TextField
                                type="date"
                                id="toDate"
                                label="To date"
                                value={values.toDate ? values.toDate : null}
                                onChange={handleChange('toDate')}
                                className="mT-20"
                                focused
                                />
                                <Autocomplete
                                    id="province"
                                    name="province"
                                    placeholder="Province"
                                    key="province"
                                    options={provinceList != null ? provinceList : [ {"label": "Select", "value": "-" }]}
                                    getOptionValue={x => x.value}
                                    getOptionLabel={x => x.label}
                                    onChange={getDistrictList}
                                    className="custom-box"
                                    style={{width:"100%"}}
                                    //inputValue={values.district ? values.district : ''}
                                    //value={values.district ? values.district : ''}
                                    defaultValue={values.province ? {"label":values.province,"value":values.province} : null}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Province"
                                        id="province"
                                        label="Province"
                                        value={values.province ? values.province : null}
                                        className="mT-20"
                                        onChange={handleChange('province')}
                                        focused
                                    />
                                    )}
                                />
                                <Autocomplete
                                    id="district"
                                    name="district"
                                    placeholder="District"
                                    key="district"
                                    options={districtList != null ? districtList : [ {"label": "Select", "value": "-" }]}
                                    getOptionValue={x => x.value}
                                    getOptionLabel={x => x.label}
                                    onChange={getFacilityList}
                                    className="custom-box"
                                    style={{width:"100%"}}
                                    defaultValue={values.district ? {"label":values.district,"value":values.district} : null}
                                    inputValue={values.district ? values.district : ''}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="District"
                                        id="district"
                                        label="District"
                                        value={values.district ? values.district : null}
                                        className="mT-20"
                                        onChange={handleChange('district')}
                                        focused
                                    />
                                    )}
                                />
                                <Autocomplete
                                    id="facility"
                                    name="facility"
                                    placeholder="Facility"
                                    key="facility"
                                    options={facilityList != null ? facilityList : [ {"label": "Select", "value": "-" }]}
                                    getOptionValue={x => x.value}
                                    getOptionLabel={x => x.label}
                                    className="custom-box"
                                    style={{width:"100%"}}
                                    onChange={setFacilityValue}
                                    defaultValue={values.facility ? {"label":values.facility,"value":values.facility} : null}
                                    inputValue={values.facility ? values.facility : ''}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Facility"
                                        id="facility"
                                        label="Facility"
                                        value={values.facility ? values.facility : null}
                                        className="mT-20"
                                        onChange={handleChange('facility')}
                                        focused
                                    />
                                    )}
                                />
                        </Box>
                    </CardContent>

                    <CardActions className="modalfooter">
                        <Button
                        className="regSearchCancelButton"
                        onClick={() => resetFilter()}
                        >
                        {!values.province && !values.district && !values.facility && !values.toDate && !values.fromDate ? t("Cancel") : t("Reset")}
                        </Button>
                        <Button
                        className="modalactionbtn"
                        onClick={() => getFilterValues()}
                        >
                        {t("Ok")}
                        </Button>
                    </CardActions>
                    </Card>
                </div>
                </div>
             : 
                <> </>
            }
         </section>
    )
    
}
export default DeactivatedCases;