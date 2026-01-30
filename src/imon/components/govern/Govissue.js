import React, { useState, useEffect } from 'react'
import { apiServices } from '../../../services/apiServices'
import Grid from '@material-ui/core/Grid';
import swal from 'sweetalert'
import OfflineDb from '../../../db'
import { useGlobalSpinnerActionsContext } from '../../../context/GlobalSpinnerContext'
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useHistory } from "react-router";
import Typography from '@material-ui/core/Typography';
import imgUrl from "../../assets/images/imageUrl";

import FooterMenu from '../../../component/layout/FooterMenu'
import Feedback from '../Feedback';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";

function Governissuancepro(props) {
    const location = useLocation();
    const history = useHistory();
    const [sessionUserBoValue, setSessionUserBoValue] = useState(null)
    const [meatadata, setMetaData] = useState(null)
    const [completeMetadata, setCompleteMetaData] = useState(null)
    const [searchResult, setSearchResult] = useState([])
    //const [trackedEntityInstance] = useState(location.state.trackedEntityInstance);
    const [eventsData, setEventsData] = useState(null);
    const setGlobalSpinner = useGlobalSpinnerActionsContext()
    const [viewType, setViweType] = useState('card')
    const { t } = useTranslation()

    async function getMetaData() {
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)

        let metadata = await OfflineDb.getDataFromPouchDB('metadata')
        setMetaData(metadata.data)

        let completeMetadata = await OfflineDb.getDataFromPouchDB('completeMetadata')
        setCompleteMetaData(completeMetadata.data)
    }
    useEffect(() => {
        getMetaData()
        gaLogEvent("Government Issuances", '', '');
        gaLogScreen("Government Issuances");
    }, [])




    function handleBack() {
        window.history.back();
    }

    function redirectToNext() {
        history.push('/layout/diseaseadvpro')
    }

    const handleViewChange = (event) => {
        setViweType(event.target.value);
    };

    return (
        <div className={window.cordova ? "govissuepage govissueben" : 'govissuepage govissueben windowdesktop'}>

            <Grid container className='govissuepagediv'>
                {(localStorage.getItem('userrole') == "Patient" || localStorage.getItem('userrole') == "GuestUser") && <Grid container xs={12} className="certinav">
                    <Grid xs={2} className="backimg">
                        <img src={imgUrl.whiteback} className="backsvg" onClick={() => handleBack()} />
                    </Grid>
                    <Grid xs={8}>
                        <Typography variant="subtitle1" className="regname oneuhcfont">
                            Disease Advisories
                        </Typography>
                    </Grid>
                    <Grid xs={2}>
                    <Typography variant='body2' className='stepname'><Feedback></Feedback></Typography>
                    </Grid>
                </Grid>}
                <Grid item xs={12} className='govissuepagedivGrid'>
                    <div className='text-center'>
                        <img src={imgUrl.govissue} />
                        <Typography variant='h6' className='oneuhcfont'>Government Issuances</Typography>
                    </div>

                </Grid>
                <Grid item xs={12} className='govdiseasegrid' onClick={() => { redirectToNext() }}>
                    <div className='govdiseasegriddiv'>
                        <div className='govdiseaseinner'>
                            <img src={imgUrl.diseaseadvi} />
                            <Typography variant='h6' className='oneuhcfont'>DISEASE ADVISORIES</Typography>
                        </div>
                    </div>
                </Grid>
                {(localStorage.getItem('userrole') == "Patient" || localStorage.getItem('userrole') == "GuestUser") ? 
              <Grid container xs={12} className="homebottomnav">
              {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="home-svg"  onClick={()=>(!window.location.pathname.includes('imonhome')?history.push('/layout/imonhome'):'')}>
                  <img src={imgUrl.homesvg} />
                  <Typography variant="caption" display="block">
                    Home
                  </Typography>
                </Grid>:<Grid xs={4} className="home-svg" onClick={()=>(!window.location.pathname.includes('imonhome')?history.push('/layout/imonhome'):'')}>
                  <img src={imgUrl.homesvg} />
                  <Typography variant="caption" display="block">
                    Home
                  </Typography>
                </Grid>}
                {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="journey-svg" onClick={()=>(!window.location.pathname.includes('myjourney')?history.push('/myjourney'):'')}>
                  <img src={imgUrl.journeysvg} />
                  <Typography variant="caption" display="block">
                    My Journey
                  </Typography>
                </Grid>:''}
                {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?history.push('/layout/nearme'):'')}>
                  <img src={imgUrl.nearsvg} />
                  <Typography variant="caption" display="block">
                    Near Me
                  </Typography>
                </Grid>:<Grid xs={4} className="near-svg" onClick={()=>(!window.location.pathname.includes('nearme')?history.push('/layout/nearme'):'')}>
                  <img src={imgUrl.nearsvg} />
                  <Typography variant="caption" display="block">
                    Near Me
                  </Typography>
                </Grid>}
                {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?history.push('/layout/getknowledgeable'):'')}>
                  <img src={imgUrl.guidesvg} />
                  <Typography variant="caption" display="block">
                    Guide
                  </Typography>
                </Grid>:<Grid xs={4} className="guide-svg" onClick={()=>(!window.location.pathname.includes('getknowledgeable')?history.push('/layout/getknowledgeable'):'')}>
                  <img src={imgUrl.guidesvg} />
                  <Typography variant="caption" display="block">
                    Guide
                  </Typography>
                </Grid>}
                {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="connect-svg" onClick={()=>(!window.location.pathname.includes('peerchat')?history.push('/layout/peerchat'):'')}>
                  <img src={imgUrl.connectsvg} />
                  <Typography variant="caption" display="block">
                    Connect
                  </Typography>
                </Grid>:''}
                {localStorage.getItem("userrole")!="GuestUser"?<Grid xs={2} className="screen-svg" onClick={()=>(!window.location.pathname.includes('aisurvey')?history.push('/layout/AiSurvey'):'')}>
                  <img src={imgUrl.screensvg} />
                  <Typography variant="caption" display="block">
                    Survey
                  </Typography>
                </Grid>:""}
              </Grid>
                :
                    <FooterMenu></FooterMenu>}
            </Grid>
        </div>
    )
}

export default Governissuancepro;