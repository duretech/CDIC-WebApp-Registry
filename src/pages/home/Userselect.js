import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";

import classes from '../../App.module.css'
import Grid from '@material-ui/core/Grid';
//import '../../assets/css/custom.css'
import Typography from '@material-ui/core/Typography';
// import dohlogo from '../../assets/images/dpcb-images/doh.png'
// import groupuser from '../../assets/images/dpcb-images/Groupuser.png'
// import beneficiary from '../../assets/images/dpcb-images/Beneficiary.png'
// import provider from '../../assets/images/dpcb-images/Provider.png'
import { Button } from '@material-ui/core';


export default function Userselection() {

    return (
        <div>
            <Grid>
                <Grid item xs={12} className='userbg'>
                    <div className='usermain'>
                        {/* <img src={dohlogo} className='dohimg' /> */}
                        <div>
                            <Typography variant="h5" className='dohtext  oneuhcfont' component="div">
                                OneUHC
                            </Typography>
                            <Typography variant="h5" className='dohtext oneuhcfont' component="div">
                                App
                            </Typography>
                        </div>

                    </div>
                    <div>
                        <Typography variant='subtitle1' component='h2' className='welcometitle oneuhcfont'>
                            Welcome to OneUHC App!
                        </Typography>
                        <Typography variant='subtitle1' component='h2' className='welcomedes'>
                            Maligayang pagdating sa OneUHC App!
                        </Typography>
                    </div>
                    <div>
                        {/* <img src={groupuser} className='groupuser' /> */}
                    </div>
                </Grid>
                <Grid item xs={12} className='userselect'>
                    <Grid item xs={12} className='patientsection'>
                        <div>
                            <Typography variant='subtitle1' component='h2' className='bentitle'>
                                BENEFICIARY
                            </Typography>
                            <Typography variant='subtitle1' component='h2' className='bendes'>
                                BENEPISYARYO
                            </Typography>
                            <div>
                                {/* <img src={beneficiary} className='benimg' /> */}
                            </div>

                        </div>
                    </Grid>
                    <Grid item xs={12} className='providersection'>
                        <div>
                            <Typography variant='subtitle1' component='h2' className='provtitle'>
                                HEALTH CARE PROVIDER
                            </Typography>
                            <Typography variant='subtitle1' component='h2' className='provdes'>
                                PROVIDER NG PANGANGALAGANG PANGKALUSUGAN
                            </Typography>
                            <div>
                                {/* <img src={provider} className='providerimg' /> */}
                            </div>

                        </div>
                    </Grid>
                    <Grid item xs={12} className='guestbtn'>
                        <Button variant="contained" className='guestlogin'>
                            <div>
                                <Typography variant='subtitle1' component="h2" className='login'>LOGIN AS A GUEST</Typography>
                                <Typography variant='subtitle1' component="h2" className='guestdes'>GAMITIN BILANG PANAUHIN</Typography>
                            </div>

                        </Button>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );
}