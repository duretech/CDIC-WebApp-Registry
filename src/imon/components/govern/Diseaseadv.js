import React, { useState, useEffect } from 'react'
import { apiServices } from '../../../services/apiServices'
import Grid from '@material-ui/core/Grid';
import swal from 'sweetalert'
import Globalclasses from "../../../App.module.css";
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
import Services from "../../api/api";

import FooterMenu from '../../../component/layout/FooterMenu'
import Feedback from '../Feedback';
import { gaLogEvent, gaLogScreen } from "../../helpers/analytics";

function Diseaseadvpro(props) {
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
    const [currentID, setCurrentID] = useState('')
    const [modlist, setmodlist] = useState([])
    const [HIVid, setHIVid] = useState([])
    const [MALARIAid, setMALARIAid] = useState([])
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
        gaLogEvent("Disease Advisories", '', '');
        gaLogScreen("Disease Advisories");
        var infocontent = JSON.parse(localStorage.getItem("menuList")).filter(obj => obj.path == "information")
        console.log(infocontent)
        infocontent[0].childs.map((i) => {
            console.log(i)
            if (i.name == 'Get Information') {
                setCurrentID(i.componentId)
                getApiData(i.componentId)
            }
        })
    }, [])



    function getApiData(id) {
        let params = {
            communityId: "a67b773bfcdc175781c2f30bcb550636",
            contentId: id,
            languageId: localStorage.getItem("langId"),
            roleId: JSON.parse(localStorage.getItem("obj")).roleId,
            userId: JSON.parse(localStorage.getItem("obj")).userId,
        };
        console.log("params role",params);
        Services.getRoleWiseContent(params).then((res) => {
            try {
                if (res.data.status == 200) {

                    // res.data.data.childs.map((c) => {

                    //     if (c.contentName == 'HIV') {
                    //         console.log(c)
                    //         setHIVid(c.contentId)
                    //     } else if (c.contentName == 'Malaria') {
                    //         console.log(c)
                    //         setMALARIAid(c.contentId)
                    //     }
                    // })
                    setmodlist(res.data.data.childs)
                }
            } catch (err) {
                console.log("err::", err)


            }
        });

    }

    function handleClick(id) {
        console.log(id)
        // history.push('/layout/pdfrender',{componentId:id})
        history.push({
            pathname: '/layout/pdfrender',
            state: {
                id: id
            }
        })
    }

    function handleBack() {
        window.history.back();
    }

    const handleViewChange = (event) => {
        setViweType(event.target.value);
    };

    return (
      <div className={Globalclasses.container}>
      <main
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
        }}
      >
        <section
          className=" searchcustombg searchtabmaindiv searchformcontainer alertspage treatmentStatusPage"
          style={{
            // backgroundColor: "#fff",
            flexGrow: 1,
            padding: 0,
          }}
        >
        <div className={window.cordova ? "govissuepage govben" : 'govissuepage govben windowdesktop'}>
            <FooterMenu></FooterMenu>
            <Grid container className='govissuepagediv'>
               
                <Grid item xs={12} className='govissuepagedivGrid'>
                    <div className='text-center disease-img'>
                        
                        <Typography>{t("Education And Knowledge")}</Typography>
                    </div>

                </Grid>
                <Grid item xs={12} className='govdiseasegrid'>
                    <div className='govdiseasegriddiv'>
                        {
                            modlist.map((m) => {
                                return <div className='govdiseaseinner disease-img' onClick={() => handleClick(m.contentId)}>
                                    
                                    <Typography className="content-block">{t(m.contentName)}</Typography>
                                </div>
                            })
                        }

                    </div>
                </Grid>
                {/* {(localStorage.getItem('userrole') == "Patient" || localStorage.getItem('userrole') == "GuestUser") ?
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
                    <FooterMenu></FooterMenu>} */}
            </Grid>
        </div>
        </section>
    </main>
    </div>
    )
}

export default Diseaseadvpro;