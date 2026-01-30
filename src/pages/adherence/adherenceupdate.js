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
import _ from "lodash";
import SearchBar from 'material-ui-search-bar';
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
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import CloseIcon from "@material-ui/icons/Close";

import Box from "@material-ui/core/Box"
//import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
//import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

//import {Configuration} from '../../assets/data/config'
import '../../assets/css/customstyles.css'
//import '../../assets/css/theme_grey.css'
import '../../assets/css/theme_blue.css'
// import '../../assets/css/theme_green.css'
// import '../../assets/css/theme_red.css'

import FooterMenu from '../../component/layout/FooterMenu'
import imgUrl from '../../assets/images/imageUrl'
import moment from 'moment';
import Autocomplete from "@material-ui/lab/Autocomplete"

const {Form, Field } = ReactFinalForm

function AdherenceUpdate(){
    const history = useHistory();
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [progarmData,setProgarmData] = useState(null)
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
    const [casesData, setCasesData] = useState(null)
    const [casesAllData, setAllCasesData] = useState(null)
    
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
    //const [Configuration,setConfiguration] = useState(null);
    const [OUJSON,setOUJSON] = useState(null)
    
    const [searchInputValue, setSearchInputValue] = useState('')
    async function getMetaData(){
        let metadata = await OfflineDb.getDataFromPouchDB('metaData')
        setProgarmData(metadata.data)
        
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let OU = await OfflineDb.getDataFromPouchDB('OUStructureJSON')
        setOUJSON(OU.data)
        // let configurations = await OfflineDb.getDataFromPouchDB('configurations')
        // console.log("configurations && configurations.data",configurations , configurations.data);
        // if(configurations && configurations.data)
        // setConfiguration(configurations.data.configuration)
    }
    useEffect(()=>{
        getMetaData()  
        try{    
            OfflineDb.removeDataFromPouchDB('activeCaseDetails')
            OfflineDb.removeDataFromPouchDB('activeCaseFormData')
            OfflineDb.removeDataFromPouchDB('linkContactFlag')
            OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
        }catch(e){

        }
    },[])
    
    //once user bco is set call getContactList function
    
    const handlePageChange = (event, value) => {
        setPage(value);
    }
    const loadFilter = () => {
        setOpenFilter(true)
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    return (    
        <section
        className="searchcustombg searchtabmaindiv"
        style={{
            // backgroundColor: '#fff',
            flexGrow: 1,
            padding: "0px !important",
        }}>
            <FooterMenu></FooterMenu>
            <Grid container>
                <Grid item xs={4} sm={4} md={4}>
                    <div className="table-header">
                        <h3 className="text-uppercase zero">
                            <Trans>Adherence</Trans>
                        </h3>
                    </div>
                </Grid>
            </Grid>
            </section>
            
    )
    
}
export default AdherenceUpdate;