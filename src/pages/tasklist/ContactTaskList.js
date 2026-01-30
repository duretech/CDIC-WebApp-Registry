import React, { useState,useEffect } from 'react'
import classes from '../../App.module.css'
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation, Trans , useTranslation } from 'react-i18next';
import swal from 'sweetalert'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FooterMenu from '../../component/layout/FooterMenu';
import PeopleIcon from "@material-ui/icons/People";
import imgUrl from "../../assets/images/imageUrl.js";

function ContactTaskList(){
    const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
    const [progarmData,setProgarmData] = useState(null)
    const {t} = useTranslation()
    const history = useHistory();
    
    //once user bco is set call getContactList function
    
    return (
        <div className="certi-patientpage">
          <FooterMenu></FooterMenu>
          <Grid container className='certi-patientpagediv'>
            <br/>
            <Grid container className='journeyDiv'>
            <Grid xs="12" md="6" className='journeyDivinner'>
            <div className='journeyItems' 
               onClick={()=>history.push('/layout/waitingIn')}
            >
            <div className="clientBox">
                            <img src={imgUrl.clientImg} className="clientImg" />
                          </div>
               
                <Typography variant='h6'>
                    {t("Patients waiting for Lab values")}
                </Typography>
             </div>
            </Grid>
            <Grid xs="12" md="6" className='journeyDivinner'>
            <div className='journeyItems' 
               onClick={()=>history.push('/layout/waitingOut')}
            >
            <div className="clientBox">
                            <img src={imgUrl.clientImg} className="clientImg" />
                          </div>
                <Typography variant='h6'>
                  {t("Patients awaiting initiation of Medical Theory")}
                </Typography>
             </div>
            </Grid>
            
            </Grid>
          </Grid>
        </div>
      );
}
export default ContactTaskList;