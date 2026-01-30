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
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import imgUrl from '../../assets/images/imageUrl';
import HeaderNew from "../../component/layout/HeaderNew"
import SidebarNew from "../../component/layout/SidebarNew"
import GroupIcon from '@material-ui/icons/Group';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FlagIcon from '@material-ui/icons/Flag';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import EmailIcon from '@material-ui/icons/Email';
import ShareIcon from '@material-ui/icons/Share';
function NewHomePage() {
    const [state, setState] = React.useState({
        drawerOpen: false,
        isClicked: false,
    });

    const toggleDrawer = (isClicked, isOpen) => {
        setState({
            drawerOpen: isOpen,
            isClicked: isClicked,
        });
    };

    const closeDrawer = (close) => {
        setState({
            drawerOpen: close,
            isClicked: false,
        });
    };

    return (

        <div className="new_home_page">
            <HeaderNew
                toggleDrawer={(isClicked, isOpen) => toggleDrawer(isClicked, isOpen)}
            ></HeaderNew>
            <SidebarNew className="new_homePage_sidebar"
                customClass="new-theme-sidebar"
                drawerOpen={state["drawerOpen"]}
                isClicked={state["isClicked"]}
                closeDrawer={() => closeDrawer(false)}
                style={{
                    backgroundColor: "#fff",
                    flexGrow: 1,
                    padding: 20,
                    borderLeft: "1px solid white",
                }}
            />
            <Container maxWidth="lg">
                <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={3}>
                        <Card className="cardtopBanner">
                            <CardContent className="cardtopBannerContent">
                                <div className="sharedButtons">
                                    <div className="sharedBtnWrap">
                                        <Button variant="contained" className="iconBtns">
                                            <EmailIcon />
                                        </Button>
                                        <Button variant="contained" className="iconBtns">
                                            <ShareIcon />
                                        </Button>
                                    </div>
                                </div>
                                <Typography variant="h5" component="h2" className="bannerText">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet luctus lorem. Nulla sed erat scelerisque, tristique tortor ac, sollicitudin arcu. In molestie nibh lectus,
                                </Typography>

                                <div className="bottomStickyDiv">
                                    <div className="stickyDivWrap">
                                        <div className="contentWrap">
                                            <p className="pWrap">
                                                <GroupIcon />
                                                <span>My Clients 1,23,41</span>
                                            </p>
                                            <p className="pWrap">
                                                <VisibilityIcon />
                                                <span>All Clients 1,702,4</span>
                                            </p>
                                            <p className="pWrap">
                                                <FlagIcon />
                                                <span>Aug 21, 2021</span>
                                            </p>
                                            <p className="pWrap">
                                                <SubscriptionsIcon />
                                                <span>12 videos</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </CardContent>

                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={1} className="cardGridDivStart">



                    <Grid container item xs={3} spacing={3}>
                        <Card className="homePageCardBlock">
                            <CardHeader
                                className="homePageCardHeader lightbg"
                                title="Auto Alert"
                                
                            />
                            <CardContent className="homePageCardContent darkbg">
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
                            <CardHeader
                                className="homePageCardHeader darkbg"
                                title="Achived Goals"
                                
                            />
                            <CardContent className="homePageCardContent lightbg">
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
                            <CardHeader
                                className="homePageCardHeader lightbg"
                                title="My Client"
                                
                            />
                            <CardContent className="homePageCardContent darkbg">
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
                            <CardHeader
                                className="homePageCardHeader darkbg"
                                title="Referral Cases"
                                
                            />
                            <CardContent className="homePageCardContent lightbg">
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



export default NewHomePage;

