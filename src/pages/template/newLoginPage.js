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
function Login() {


    return (
        <div className="new_temp_login_page">
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={3}>
                        <div className="headerMenu">
                            <h2>UNDP</h2>
                        </div>
                    </Grid>
                    <Grid container item xs={7} spacing={3}>
                        <img
                            className="img-fluid"
                            alt="Login Page image"
                            src={imgUrl.loginPageImage}
                            style={{ width: "79%" }}
                        />
                    </Grid>
                    <Grid container item xs={5} spacing={3}>
                        <div className="formDiv_template">
                            <form style={{ width: "100%" }}>
                                <div className="form_heading">
                                    <h3>Login Form</h3>
                                    <span className="borderBottomSpan"></span>
                                </div>
                                <div className="loginPageForm">
                                    <div className="formComponent">
                                        <lable>Username</lable>
                                        <TextField type="text"

                                        />
                                    </div>
                                    <div className="formComponent">
                                        <lable>Password</lable>
                                        <TextField
                                            id="standard-password-input"
                                            type="password"


                                        />
                                    </div>
                                    <div className="formComponent">
                                        <Button variant="contained" className="loginButton">Log me in</Button>
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



export default Login;

