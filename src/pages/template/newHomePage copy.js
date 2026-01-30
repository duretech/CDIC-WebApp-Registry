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
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import imgUrl from '../../assets/images/imageUrl';
function SelectLanguage() {


    return (
        <div className="new_home_page">
            <Container maxWidth="lg">
                <Grid container spacing={1}>


                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.addUser}

                                />
                                <Typography variant="h5" component="h2">
                                Add New Client
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.search}

                                />
                                <Typography variant="h5" component="h2">
                                Search
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.alert}

                                />
                                <Typography variant="h5" component="h2">
                                Alerts
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.records}

                                />
                                <Typography variant="h5" component="h2">
                                My Clients
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.referral}

                                />
                                <Typography variant="h5" component="h2">
                                Referral Cases
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.file_download}

                                />
                                <Typography variant="h5" component="h2">
                                Transfer In
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.file_upload}

                                />
                                <Typography variant="h5" component="h2">
                                Transfer Out
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardContent className="homePageCardContent">
                                <img
                                    className="img-fluid cardImgDiv"
                                    alt="Company Logo"
                                    src={imgUrl.addUser}

                                />
                                <Typography variant="h5" component="h2">
                                Add New Client
                                </Typography>

                            </CardContent>

                        </Card>
                    </Grid>


                </Grid>
            </Container>
        </div>

    )
}



export default SelectLanguage;

