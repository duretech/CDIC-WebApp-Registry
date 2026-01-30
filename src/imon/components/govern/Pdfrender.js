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
import Iframe from 'react-iframe'
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Services from "../../api/api";
import Button from "@material-ui/core/Button";

import Loader from "../loaders/loader";
import FooterMenu from '../../../component/layout/FooterMenu'
import Pdfrenderchild from './Pdfrenderchild';
import Feedback from '../Feedback';

function Pdfrender(props) {
    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation()
    const [pdfArr, setPdfArr] = useState([])
    const [id, setId] = useState('')
    const [loading, setLoading] = useState(true)
    var Pdflist
    useEffect(() => {
        console.log(props, history)
        setId(history.location.state.id)
        getApiData(history.location.state.id)
    }, [])

    function openPdf(url) {
        console.log(url)
        window.open(url, '_system', 'location=no');
    }

    function getApiData(id) {
        let params = {
            communityId: localStorage.getItem("CommunityId"),
            contentId: id,
            languageId: localStorage.getItem("langId"),
            roleId: JSON.parse(localStorage.getItem("obj")).roleId,
            userId: JSON.parse(localStorage.getItem("obj")).userId,
        };
        Services.getRoleWiseContent(params).then((res) => {
            try {
                if (res.data.status == 200) {

                    console.log("child", res.data.data)
                    setPdfArr(res.data.data.childs)
                    setLoading(false)
                }
            } catch (err) {
                console.log("err::", err)


            }
        });
    }

    function getPdf() {
        console.log("entered")
        return pdfArr.map((p) => {
            console.log(p)
            var pdf = p && p.contentList && p.contentList[0] && p.contentList[0].infographics.pdf ? p.contentList[0].infographics.pdf[0] : '' //p.contentList[0].infographics.pdf[0]
            return (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography >{p.contentName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {/* <Iframe url={p}
                          width={"100%"}
                          height="450px"
                          className="myClassname"
                          display="initial"
                          position="relative" /> */}

                            <Button variant="contained" onClick={() => openPdf(pdf)}>{t('Download')}<i class="far fa-arrow-to-bottom"></i></Button>
                        </Typography>
                    </AccordionDetails>
                </Accordion>


            )
        })
    }

    function handleBack() {
        window.history.back();
    }

    return (
        <div className={window.cordova ? "govissuepage govissueben" : 'govissuepage govissueben windowdesktop'}>
            <FooterMenu></FooterMenu>
            <Grid container className='govissuepagediv pdfpage'>
                    <Grid xs={12} className='omniimggrid'>
                        <div className='omniimgdiv'>
                            <img src={imgUrl.govissue} className='omni' />
                        </div>
                    </Grid>
                {loading ? (
                    <Grid xs={12} className="pdfrenderdiv">
                        <Loader isLoading={loading} />
                    </Grid>
                ) : (
                    <Grid xs={12} className="pdfrenderdiv">
                        {
                            pdfArr.map((p) => {
                                console.log("p",p,p.contentId,p.contentName)
                                var pdf = p && p.contentList && p.contentList[0] && p.contentList[0].infographics.pdf ? p.contentList[0].infographics.pdf[0] : ''
                                var content;
                                if(p.hasChild){
                                    content=<Pdfrenderchild id={p.contentId}></Pdfrenderchild>
                                }
                                else{
                                    // content=<Button className='pdfopenbtn' variant="contained" onClick={() => openPdf(pdf)}>{t('Open Pdf')}</Button>
                                    content=''
                                }
                                return (
                                    <Accordion className='diadverse'>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography >{p.contentName}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails className='diadinner'>
                                            <Typography>
                                                {/* <Iframe url={p}
                                      width={"100%"}
                                      height="450px"
                                      className="myClassname"
                                      display="initial"
                                      position="relative" /> */}
                                      {content}                                  

                                                
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>


                                )
                            })

                        }
                    </Grid>
                )}

            

                

            </Grid>
        </div>
    )
}

export default Pdfrender


