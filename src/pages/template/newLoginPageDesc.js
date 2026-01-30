import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import imgUrl from '../../assets/images/imageUrl';
function NewLogin() {


    return (
        <div className="new_temp_login_page_third">
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
                                    <h3>Login</h3>
                                    {/* <span className="borderBottomSpan"></span> */}
                                </div>
                                <div className="loginPageForm">
                                    <div className="formComponent">
                                        {/* <lable>Username</lable> */}
                                        <TextField type="text"
                                            label="Username"
                                        />
                                    </div>
                                    <div className="formComponent">
                                        {/* <lable>Password</lable> */}
                                        <TextField
                                            id="standard-password-input"
                                            type="password"
                                            label="Password"

                                        />
                                    </div>
                                    <div className="formComponent" style={{ marginTop: "8%" }}>
                                        <Button variant="contained" className="loginButton">Sign In</Button>
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



export default NewLogin;

