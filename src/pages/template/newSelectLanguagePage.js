import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import imgUrl from '../../assets/images/imageUrl';
function NewSelectLanguage() {


    return (
        <div className="new_select_lang_sec">
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    <Grid container item xs={6} spacing={3}>
                        <div className="headerMenu">
                            <h2>UNDP</h2>
                        </div>
                    </Grid>
                    <Grid container item xs={6} spacing={3}>
                        <div className="headerMenu iconSide" style={{ width: "100%" }}>
                            <div className="iconsDiv">
                                <div className="iconsWrap">
                                    <div>
                                        <img
                                            className="img-fluid"
                                            src={imgUrl.pdf}

                                        />
                                    </div>
                                    <p>PDF Tutorial</p>
                                </div>
                                <div className="iconsWrap">
                                    <div>
                                        <img
                                            className="img-fluid"
                                            src={imgUrl.guide}

                                        />
                                    </div>
                                    <p>Guided Tutorial</p>
                                </div>
                                <div className="iconsWrap">
                                    <div>
                                        <img
                                            className="img-fluid"
                                            src={imgUrl.video_tutorial}

                                        />
                                    </div>
                                    <p>Video Tutorial</p>
                                </div>
                                <div className="iconsWrap">
                                    <div>
                                        <img
                                            className="img-fluid"
                                            src={imgUrl.chatbot}

                                        />
                                    </div>
                                    <p>Chatbot</p>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>

                    <Grid container item xs={6} spacing={3}>
                        {/* <img
                            className="img-fluid"
                            alt="Login Page image"
                            src={imgUrl.loginPageImage}
                            style={{ width: "79%" }}
                        /> */}
                    </Grid>
                    <Grid container item xs={6} spacing={3}>
                        <div className="formDiv_template">
                            <form style={{ width: "100%" }}>
                                <div className="form_heading">
                                    <h3>Select Language</h3>
                                    {/* <span className="borderBottomSpan"></span> */}
                                </div>
                                <div className="loginPageForm">
                                    <div className="formComponent">
                                        <FormControl component="fieldset">
                                            
                                            <RadioGroup aria-label="gender" name="gender1">
                                                <FormControlLabel value="english" control={<Radio />} label="English" />
                                                <FormControlLabel value="persian" control={<Radio />} label="Persian" />
                                                <FormControlLabel value="italic" control={<Radio />} label="Italic" />
                                                
                                            </RadioGroup>
                                        </FormControl>
                                    </div>

                                    <div className="formComponent" style={{ marginTop: "8%" }}>
                                        <Button variant="contained" className="loginButton">Submit</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Grid>
                    {/* <Grid container item xs={12} spacing={3}>
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
                    </Grid> */}
                </Grid>
            </Container>
        </div>

    )
}



export default NewSelectLanguage;

