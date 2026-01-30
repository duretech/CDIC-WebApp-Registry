import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import OfflineDb from '../../db'
import { Trans, useTranslation } from 'react-i18next';
import '../../assets/css/custom.css'
import Typography from '@material-ui/core/Typography';
import imgUrl from '../../assets/images/imageUrl.js';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
    Button,
} from '@dhis2/ui';
import FooterMenu from '../../component/layout/FooterMenu';

function Certificates() {
    const history = useHistory();
    const [expanded, setExpanded] = React.useState('knowledge');
    const [sessionUserBoValue, setSessionUserBoValue] = useState(null)
    async function getMetaData() {
        let loginDetails = await OfflineDb.getDataFromPouchDB('loginDetails')
        setSessionUserBoValue(loginDetails.data)
    }
    useEffect(() => {
        getMetaData()
    }, [])
    const openMyTrainings = () => {
        history.push('/layout/trainings')
    }

    const openOmnibusGuidlines = () => {
        history.push('/layout/selfscreen')
    }

    const openGovernmentIssuances = () => {
        history.push('/layout/diseaseadvpro')
    }
    function handleBack() {
        window.history.back();
    }

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <div className={window.cordova ? "certificatePage" : 'certificatePage windowdesktop'}>
            <FooterMenu></FooterMenu>
            <Grid container className='certificatePagediv'>
                <Grid container xs={12} className="eduandknowmenudiv">
                    <Grid item xs={12} lg={4} className='govdiseasegrid'>
                        <div className='govdiseasegriddiv'>
                            <div className='govdiseaseinner train-img' onClick={() => openMyTrainings()}>
                                <img src={imgUrl.mytraining} />
                                <Typography variant='h6' className='oneuhcfont'>My Trainings</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4} className='govdiseasegrid'>
                        <div className='govdiseasegriddiv'>
                            <div className='govdiseaseinner omni-img' onClick={() => openOmnibusGuidlines()}>
                                <img src={imgUrl.omnibus} />
                                <Typography variant='h6' className='oneuhcfont'>Omnibus Guidelines</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={4} className='govdiseasegrid'>
                        <div className='govdiseasegriddiv'>
                            <div className='govdiseaseinner' onClick={() => openGovernmentIssuances()}>
                                <img src={imgUrl.govissue} className="govImg" />
                                <Typography variant='h6' className='oneuhcfont'>Government Issuances</Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                {/* <Grid xs={12} className='userflows' style={{overflowY:"scroll"}} expanded={expanded === 'general'} onChange={handleChange('general')}>
                    <Accordion className='general hide'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel1a-content"
                            id="general"
                        >
                            <Typography variant='subtitle1'>GENERAL SETTINGS</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='general-content'>
                            <Typography>
                                
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='notify hide' expanded={expanded === 'notify'} onChange={handleChange('notify')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel2a-content"
                            id="notify"
                        >
                            <Typography variant='subtitle1'>NOTIFICATIONS</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='notify-content'>
                            <Typography>
                                
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='alarms hide' expanded={expanded === 'alarms'} onChange={handleChange('alarms')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel2a-content"
                            id="alarms"
                        >
                            <Typography variant='subtitle1'>ALARMS/SOUNDS</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='alarms-content'>
                            <Typography>
                               
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='feedback hide' expanded={expanded === 'feedback'} onChange={handleChange('feedback')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel2a-content"
                            id="feedback"
                        >
                            <Typography variant='subtitle1'>FEEDBACK</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='feedback-content'>
                            <Typography>
                                
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='knowledge' expanded={expanded === 'knowledge'} onChange={handleChange('knowledge')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className='expandicon' />}
                            aria-controls="panel2a-content"
                            id="knowledge"
                        >
                            <Typography variant='subtitle1'>EDUCATION AND KNOWLEDGE</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='knowledgegroups'>
                                <div className='mytraining'><img src={imgUrl.mytraining} onClick={()=>openMyTrainings()}/>
                                    <Typography variant='caption'>My Trainings</Typography>
                                </div>
                                <div className='omiguide'><img src={imgUrl.omiguide} onClick={()=>openOmnibusGuidlines()} />
                                    <Typography variant='caption'>Omnibus Guidelines</Typography>
                                </div>
                                <div className='govissue'><img src={imgUrl.govissue} onClick={()=>openGovernmentIssuances()} />
                                    <Typography variant='caption'>Government Issuances</Typography>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                </Grid> */}

            </Grid>
        </div>
    );
}

export default Certificates