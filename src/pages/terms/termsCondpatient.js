import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import classes from '../../App.module.css'
import Grid from '@material-ui/core/Grid';
//import '../../assets/css/custom.css'
import Typography from '@material-ui/core/Typography';

import {
    Button,
} from '@dhis2/ui';

function Termspatient() {
    const history = useHistory();

    function agreeclick() {
        console.log("enters")
        history.push('/guestselectlanguage', { "userlist": history.location.state.userlist })
    }

    function dagreeclick() {
        history.push(' /onboarding')
    }

    return (
        <div className='termscond'>
            <Grid container className='termsgrid'>
                <Grid item xs={12} className='termstitlegrid'>
                    <div className='termstitle'>
                        <Typography variant='h5' className='oneuhcfont'>Terms and Conditions - Beneficiary</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} className='termscontentgrid'>
                    <div className='termscontent'>
                        <Typography variant='h6'>Disclaimer</Typography>
                        <Typography variant='body1'>You must agree to this disclaimer to use the OneUHC APP. </Typography>
                        <Typography variant='body1'> You MAY NOT upload any image which violates ANY copyright law, international or otherwise, nor may you upload any images which depict/s pornography, or any material deemed illegal by governing authorities. The OneUHC APP and the owner(s) thereof expressly reserve the right to delete, without warning or notice, any image deemed to be offensive or in violation of the above text, or any image or text which the owner(s) find offensive.</Typography>
                        <Typography variant='body1'>Upon signing up, you agree that the webmaster, administrator, and moderators of One UHC APP have the right to remove, edit, move, or delete any content at any time should they see fit. As a user you agree to any information you have entered above being stored in a database. While this information will not be disclosed to any third party without your consent the webmaster, administrator and moderators cannot be held responsible for any hacking attempt that may lead to the data being compromised.</Typography>

                        <Typography variant='body1'> To use One UHC APP, you must be 18 years old or above. You acknowledge that all data uploaded or entered on this server express the views and opinions of the author and not the administrators, moderators, or webmaster (except for posts by these people) and hence will not be held liable. One UHC APP and the owner(s) thereof will hold no liability (legal or otherwise) for violations or infringements of this disclaimer, or national and international laws.  </Typography>
                        <Typography variant='body1'>Violation of this disclaimer, henceforth known as a Terms of Service (TOS) will result in the removal of your account and all images or text associated with said account without any warning or notice. In addition, violation of the TOS may result in legal or civil action, wherein One UHC APP or the owner(s) thereof may be required or asked to provide certain documents and data pertaining to the account in question. </Typography>
                        <Typography variant='body1'>Abuse of this service in any way, shape, or form will not be tolerated. OneUHC APP and the owner(s) therefore have sole authority in determining abuse of the service and will not be held responsible for destruction of images or text which violate this TOS. Please note, by using One UHC APP you agree to its Terms of Service. </Typography>


                    </div>
                </Grid>
                <Grid item xs={12} className='termsbtnsgrid'>
                    <div className='termsbtns'>
                        <Button className='termbtn agree oneuhcfont' onClick={() => agreeclick()}>I AGREE</Button>
                        <Button className='termbtn disagree oneuhcfont' onClick={() => dagreeclick()}>I DON'T AGREE</Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Termspatient