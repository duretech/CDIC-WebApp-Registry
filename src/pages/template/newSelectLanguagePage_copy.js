import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import imgUrl from '../../assets/images/imageUrl';
function SelectLanguage() {


    return (
        <div className="new_temp_select_language_page">
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={3}>
                        <div className="headerMenu">
                            <h2>UNDP</h2>
                        </div>
                    </Grid>
                    <Grid container item xs={7} spacing={3}>
                        {/* <img
                            className="img-fluid"
                            alt="Login Page image"
                            src={imgUrl.loginPageImage}
                            style={{ width: "79%" }}
                        /> */}
                    </Grid>
                    <Grid container item xs={5} spacing={3}>
                        <div className="formDiv_template">
                            <form style={{ width: "100%" }}>
                                <div className="form_heading">
                                    <h3>Language Preference</h3>
                                    <span className="borderBottomSpan"></span>
                                </div>
                                <div className="loginPageForm">
                                    <div className="formComponent">
                                        <FormControl component="fieldset">

                                            <RadioGroup aria-label="gender" name="gender1">
                                                <FormControlLabel value="female" control={<Radio />} label="English"/>
                                                <FormControlLabel value="male" control={<Radio />} label="Persian" />
                                                
                                                
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    
                                    <div className="formComponent">
                                        <Button variant="contained" className="loginButton">Submit</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Grid>
                    <Grid container item xs={12} spacing={3}>
                        <div className="footerSectionTemp">

                            <div className="footerDivWrap">
                                <p>Powered By</p>
                                <img
                                    className="img-fluid"
                                    alt="Company Logo"
                                    src={imgUrl.durelogowhite}

                                />
                            </div>

                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>

    )
}



export default SelectLanguage;

