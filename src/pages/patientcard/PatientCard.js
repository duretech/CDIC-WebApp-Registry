import React, {useEffect, useState} from 'react'
import {apiServices} from '../../services/apiServices'
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import swal from 'sweetalert'
import _ from 'lodash'
import QRCode from 'qrcode.react';
import { useHistory } from "react-router";
import '../../assets/css/customstyles.css'
import { useLocation } from "react-router-dom";
import OfflineDb from '../../db'
import {useGlobalSpinnerActionsContext} from '../../context/GlobalSpinnerContext'
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import AccountCircleIcon from '@material-ui/icons/Person';
import CircularProgress from '@material-ui/core/CircularProgress';
import { APP_LOCALE } from '../../assets/data/config';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      //maxWidth: 500,
      //backgroundColor: "#ccc",
    },
  }));

function PatientCard(props){
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation();
    const [trackedEntityInstance] = useState(props.trackedEntityInstance);
    const [sessionUserBoValue, setSessionUserBoValue] = useState(null);
    const [programMetaData, setProgramMetaData] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [listOfFields, setListOfFields] = useState(null);
    const [fieldsToDisplay, setFieldsToDisplay] = useState([]);
    const [rows,setRows] = useState(null);
    const [qrCodeText,setQrCodeText] = useState(null);
    const [uic,setUic] = useState(null);
    const [patientName,setPatientName] = useState(null);
    const [patientSurname,setPatientSurname] = useState(null);
    const [patientMiddlename,setPatientMiddlename] = useState(null);
    const [uicId,setUicId] = useState(null);
    const [qrId,setQRId] = useState(null);
    const [programDetails,setProgramDetails] = useState(null);
    const [profileImageUid,setProfileImageUid] = useState(null);
    const [profileimageValue, setProfileimageValue] = useState(null);
    const [dataUrl, setDataUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    
    async function getUserMeta() {
        let userdata = await OfflineDb.getDataFromPouchDB('loginDetails');
        setSessionUserBoValue(userdata.data)

        let metadata = await OfflineDb.getDataFromPouchDB('metaData');
        setProgramMetaData(metadata.data)

        let programBo = await OfflineDb.getDataFromPouchDB('programBoDetails');
        setProgramDetails(programBo.data)
    
        if (metadata.data != undefined) {
            setListOfFields(
                metadata.data.programs[0].programTrackedEntityAttributes
            );
        }
    }

    useEffect(() => {
        getUserMeta();
        setGlobalSpinner(false)
    }, [])

    useEffect(() => {
        if (listOfFields != null && programDetails != null && programDetails.showInQrCard) {
            let list = []
            programDetails.showInQrCard.map(field=>{
                let filtteredFields = listOfFields.find(
                    (obj) => obj.trackedEntityAttribute.id == field.value
                );
                if(filtteredFields)
                    list.push(filtteredFields)
            })
            setFieldsToDisplay(list);
        }
    }, [programDetails,listOfFields]);

    useEffect(()=>{
        if(sessionUserBoValue != null && programMetaData != null){
            getDetails();
        }
    },[sessionUserBoValue,programMetaData])

    useEffect(()=>{
        if(profileImageUid != null && profileimageValue != null){
            if(profileimageValue.includes("res.cloudinary.com")){
                setDataUrl(profileimageValue);
            }else{
                setGlobalSpinner(true)
                const getURL = 'trackedEntityInstances/'+trackedEntityInstance+'/'+profileImageUid+'/image'
                apiServices.getBlobAPI(getURL)
                .then(res => {
                    console.log("res ",res,res.data)
                    setGlobalSpinner(false)
                    var blob = new Blob([res.data]);
                    const imageObjectURL = URL.createObjectURL(blob);
                    console.log("imageObjectURL",imageObjectURL)
                    setDataUrl(imageObjectURL);
                }).catch(err => {
                    setGlobalSpinner(false)
                })
            }
        }
    },[profileImageUid,profileimageValue])

    const getTranslatedLabels = (attribute) => {
        if (localStorage.getItem("locale") == "en") {
            return attribute.formName ? attribute.formName : attribute.displayName ;
        } else if (attribute.translations && attribute.translations.length > 0) {
            //debugger;
            let label = attribute.translations.filter(tanslation => tanslation.property == "NAME" && tanslation.locale == localStorage.getItem("locale"))
            if (label.length > 0) {            
                return label[0].value;
            } else {
                return attribute.formName ? attribute.formName : attribute.displayName ;
            }
        }
        return attribute.formName ? attribute.formName : attribute.displayName ;
    };

    const getDetails = async () =>{
        setLoading(true);
        setGlobalSpinner(true)
        try {
            const programId = sessionUserBoValue.programs[0]
            const getURL = 'trackedEntityInstances/' + trackedEntityInstance + '.json?program='+ programId +'&fields=*?';
            const response = await apiServices.getAPI(getURL);
            // console.log("trackedEntityInstances",response)
        if (response.data && response.data.attributes) {
            setPatientData(response.data.attributes);
            setRows(response.data.attributes)
            let programAttributes = programMetaData.programs[0].programTrackedEntityAttributes
                programAttributes.map(regField => {
                    let regFieldName = regField.trackedEntityAttribute.description ? regField.trackedEntityAttribute.description : regField.trackedEntityAttribute.displayName;
                    if (
                        regFieldName
                          .trim()
                          .toLocaleLowerCase() == "uic"
                      ) {
                        setUicId(regField.trackedEntityAttribute.id);
                        let uicVal = _.find(response.data.attributes,{"attribute":regField.trackedEntityAttribute.id})
                        if(uicVal){
                            setUic(uicVal.value)
                        }
                      }
        
                      if (
                        regFieldName
                          .trim()
                          .toLocaleLowerCase() == "qr code"
                      ) {
                        setQRId(regField.trackedEntityAttribute.id);
                        let qrVal = _.find(response.data.attributes,{"attribute":regField.trackedEntityAttribute.id})
                        if(qrVal){
                            setQrCodeText(qrVal.value)
                        }
                      }
                      if (
                        regFieldName
                          .trim()
                          .toLocaleLowerCase() == "first name"
                      ) {
                        
                        let firstName = _.find(response.data.attributes,{"attribute":regField.trackedEntityAttribute.id})
                        if(firstName){
                            setPatientName(firstName.value)
                        }
                      }
                      if (
                        regFieldName
                          .trim()
                          .toLocaleLowerCase() == "middle name"
                      ) {
                        
                        let middleName = _.find(response.data.attributes,{"attribute":regField.trackedEntityAttribute.id})
                        if(middleName){
                            setPatientMiddlename(middleName.value)
                        }
                      }
                      if (
                        regFieldName
                          .trim()
                          .toLocaleLowerCase() == "last name"
                      ) {
                        
                        let surName = _.find(response.data.attributes,{"attribute":regField.trackedEntityAttribute.id})
                        if(surName){
                            setPatientSurname(surName.value)
                        }
                      }
                        if (
                        regFieldName
                          .trim()
                          .toLocaleLowerCase() == "fathers name" && APP_LOCALE == "CC004" || APP_LOCALE == "ETHIOPIA"
                      ) {
                        
                        let surName = _.find(response.data.attributes,{"attribute":regField.trackedEntityAttribute.id})
                        if(surName){
                            setPatientMiddlename(surName.value)
                        }
                      }
                      if (
                        regFieldName
                          .trim()
                          .toLocaleLowerCase() == "profileimage"
                      ) {
                        setProfileImageUid(regField.trackedEntityAttribute.id)
                        let profileimage = _.find(response.data.attributes,{"attribute":regField.trackedEntityAttribute.id})
                        if(profileimage){
                            setProfileimageValue(profileimage.value)
                        }
                      
        }
    }
)
}}catch (error) {
        console.error("Error fetching details: ", error);
        swal({
            title: t("Error"),
            text: t("Something went wrong."),
            icon: "error",
            button: t("Close"),
        });
    } finally {
        setLoading(false);
        setGlobalSpinner(false);
    } 
    }

   

    function printQRCards() {
        var contents = document.getElementById("printQRDiv").innerHTML;
        var frame1 = document.createElement('iframe');
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        // frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
        frameDoc.document.open();
        frameDoc.document.write(`<html><head><title>Patient Card</title>`);
        frameDoc.document.write(`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
        </head><body>`);
        //frameDoc.document.write('<link href="../assets/css/card.css" rel="stylesheet" type="print" />');
        frameDoc.document.write(contents);
        frameDoc.document.write(`</body>
        <style>
            @media print {
                .makeStyles-root-38 {
                    width: 100%;
                    max-width: 500px;
                }

                .MuiCard-root{
                    border: 1px solid #ccc; !important;
                }

                .MuiGrid-container{
                    display: flex;
                    flex-wrap: wrap;
                    box-sizing: border-box;
                }

                .MuiCardHeader-root {
                    display: flex;
                    padding: 16px;
                    align-items: center;
                }

                .MuiCardHeader-avatar {
                    flex: 0 0 auto;
                    margin-right: 16px;
                }
                .patient-card .MuiCardHeader-content span {
                    color: #000;
                    font-size: 20px;
                    font-weight: bold;
                }

                .patient-card .logobg {
                    background-image: url(/static/media/dohlogo.248b5396.png);
                    width: 50px;
                    height: 50px;
                    background-repeat: no-repeat;
                    background-size: contain;
                }
                .alerts_description_fields {
                    padding-left: 5px;
                }
                .MuiTypography-displayBlock {
                    display: block;
                }
                .MuiTypography-body2 {
                    
                    // font-family: IBM Plex Sans;
                    
                    line-height: 1.43;
                }

                .patient-card .MuiCardHeader-subheader {
                    font-size: 14px !important;
                    color: gray !important;
                }
                .MuiCardContent-root {
                    padding: 16px;
                }

                .MuiCardContent-root:last-child {
                    padding-bottom: 24px;
                }

                .pT0 {
                    padding-top: 0px !important;
                }

                .patient-card .alerts_description_fields{
                    font-size: 20px;
                }

                .alerts_description_fields {
                    font-size: 0.875rem;
                    // font-family: IBM Plex Sans;
                    font-weight: 400;
                    line-height: 1.43;
                    color: #212529;
                    margin: 10px 0px;
                }

                .patient-card .alerts_description_fields{
                    font-size: 20px;
                }
                // body, .MuiTypography, button, .MuiTypography-body1 {
                //     font-family: 'Open Sans', sans-serif !important;
                // }

                .MuiGrid-spacing-xs-3 {
                    width: calc(100% + 24px);
                    margin: -12px;
                }

                .MuiGrid-container {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    box-sizing: border-box;
                }

                .MuiGrid-spacing-xs-3 > .MuiGrid-item {
                    padding: 12px;
                }

                .MuiGrid-grid-sm-8 {
                    flex-grow: 0;
                    max-width: 66.666667%;
                    flex-basis: 66.666667%;
                }

                .MuiGrid-grid-xs-8 {
                    flex-grow: 0;
                    max-width: 66.666667%;
                    flex-basis: 66.666667%;
                }

                .MuiGrid-grid-md-4 {
                    flex-grow: 0;
                    max-width: 33.333333%;
                    flex-basis: 33.333333%;
                }
                
                .MuiAvatar-root{
                    border-radius: 50% !important;
                    width: 80px;
                    height: 80px;
                    margin-right: 20px;
                    background-color: #ccc !important;
                }
                
                .MuiAvatar-root.MuiAvatar-circular.MuiAvatar-colorDefault{
                    background-color: #ccc !important;
                }
                .MuiAvatar-root svg{
                    font-size: 35px;
                }
                <style>
                
            }
    </style>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script></html>`);
        frameDoc.document.close();
        console.log(frameDoc)
        setTimeout(function () {
          window.frames["frame1"].focus();
          window.frames["frame1"].print();
          document.body.removeChild(frame1);
        }, 1000);
        return false;
    }

    function shareQRCards(){
        html2canvas(document.querySelector('#printQRDiv'), {
            allowTaint: true,
            useCORS: true,
          }).then(canvas => {
            const imageScreen = new Image();
            imageScreen.src = canvas.toDataURL();
            console.log("canvas ",canvas,canvas.toDataURL());
            //imageScreen.onload = () => setiscreenshotContinue(imageScreen)
            window.plugins.socialsharing.share(null, null, canvas.toDataURL(), null)
          });
    }

    const downloadQRCode = (qrValue) => {
      // Generate download with use canvas and stream
      const canvas = document.getElementById("printQRDiv");
      const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
      
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";//`${qrValue}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
       
    const lsitView = () => {
        return (
          <>
            {fieldsToDisplay.length > 0
              ? fieldsToDisplay.map((eachFields, i) => {
                let field = eachFields;
                let fieldName = eachFields.trackedEntityAttribute.description ? eachFields.trackedEntityAttribute.description : eachFields.trackedEntityAttribute.formName ? eachFields.trackedEntityAttribute.formName : eachFields.trackedEntityAttribute.displayName
                let fieldDisplayName = eachFields.trackedEntityAttribute.displayName
                //let fieldValue = rows[header.findIndex(x => x.column.toLowerCase() == fieldName.toLowerCase())] ? rows[header.findIndex(x =>  x.column.toLowerCase() == fieldName.toLowerCase())] : 'N/A'
                let fieldValue = _.find(rows,{"attribute":eachFields.trackedEntityAttribute.id}) ? _.find(rows,{"attribute":eachFields.trackedEntityAttribute.id}).value : '' 
                if(eachFields && eachFields.trackedEntityAttribute && eachFields.trackedEntityAttribute.valueType == "DATE"){
                  fieldValue = moment(fieldValue).format('MM-DD-YYYY')
                  fieldValue = (fieldValue === "Invalid date") ? "N/A" : fieldValue;
                }
                if(field && field.trackedEntityAttribute && field.trackedEntityAttribute.optionSet){
                  field.trackedEntityAttribute.optionSet.options.map(option => {
                    if(option.code == fieldValue){
                      fieldValue = getTranslatedLabels(option)
                    }
                  })
                }
              return (
                <p className="alerts_description_fields" key={i}>
                  {getTranslatedLabels(eachFields.trackedEntityAttribute)} : 
                  {
                  fieldValue
                    ? " "+fieldValue
                    : "N/A"
                    }
                </p>
              );
            })
              : null}
          </>
        );
    };

    if (loading) {
        return <CircularProgress style={{ display: 'block', margin: 'auto' }} />;
    }

    return (
        <>
            <div className="searchformcontainer patient-card" id="printQRDiv" >
                <Card>
                    <CardHeader
                        avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {dataUrl != null ?
                                <img alt={t("Loading...")} src={dataUrl} width="100"/>
                            :
                                <AccountCircleIcon></AccountCircleIcon>
                            }
                        </Avatar>
                        }
                        title={ patientName && patientSurname ? patientMiddlename ? patientName +" "+ patientMiddlename + " " + patientSurname : patientName + " " + patientSurname : patientName ? patientName : "N/A"}
                        subheader={uic ? "UIC : "+ uic : "UIC : N/A"}
                    />
                    <CardContent className="pT0">
                        <Grid container spacing={3}>
                            <Grid item xs={7} sm={8} md={8} style={{paddingLeft:"0px"}}>
                                {rows ? lsitView() : <></>}
                            </Grid>
                            <Grid item xs={5} sm={4} md={4}>
                                {qrCodeText ?
                                <QRCode
                                    id="qr-gen"
                                    value={qrCodeText}
                                    size={window.cordova ? 100 : 150}
                                    level={"H"}
                                    includeMargin={true}
                                    renderAs="svg" 
                                    />
                                    :"N/A"
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

               
            </div>
        </>
    )
}
export default PatientCard;


