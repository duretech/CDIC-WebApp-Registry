import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import imgUrl from "../../assets/images/imageUrl";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useMediaQuery } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function TreatmentRegime() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Use MUI useMediaQuery hook to check for iPad resolution
  const isiPad = useMediaQuery("(max-width: 1024px)");

  // Set the orientation based on the screen size
  const orientation = isiPad ? "horizontal" : "vertical";

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
      }}
      className="treatment-tabs"
    >
      <Tabs
        orientation={orientation}
        variant="scrollable"
        scrollButtons="auto"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        // sx={{ borderRight: 1, borderColor: "divider"  }}
        sx={{ height: 330 }}
        className="treatmentregime-tabs"
      >
        <Tab label="24.08.2023" {...a11yProps(0)} />
        <Tab label="04.07.2023" {...a11yProps(1)} />
        <Tab label="14.06.2023" {...a11yProps(2)} />
        <Tab label="22.04.2023" {...a11yProps(3)} />
        <Tab label="02.03.2023" {...a11yProps(4)} />
        <Tab label="03.03.2023" {...a11yProps(4)} />
      </Tabs>

      <div className="mx-24px w-80 treatmentregime-right-tab">
        <TabPanel value={value} index={0}>
          <div>
            <Grid
              container
              spacing={2}
              className="d-flex justify-content-center align-items-center"
            >
              <Grid item xs={12} md={2} className="img-left-section">
                <img src={imgUrl.adp_logo} className="logo-adp"></img>
                {/* <div className="logo-adp"></div> */}
              </Grid>
              <Grid
                item
                xs={12}
                md={10}
                className="flex-direction-column text-center"
              >
                <h6 className="mb-0 mt-15px tab-head">
                  DIABETES ASSOCIATION OF CAMEROON
                </h6>
                <p className="tab-subhead">
                  Dr. Jean Claude Mbanya, MD, Endocrinology, Harvard University
                </p>
              </Grid>
            </Grid>
            <div>
              <h6 className="mb-25px">Date: 24/08/2023</h6>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <h6 className="treatment-head">INVESTIGATION:</h6>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>
                            T1 diabetes with complications such of CDK and DKA
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={12} sm={3}>
                    <h6 className="treatment-head">PRESCRIPTION : </h6>
                  </Grid>
                  <Grid item xs={12} sm={9} className="flex-direction-column">
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" className="mt-10px">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={12} sm={3}>
                    <h6 className="treatment-head">NOTES:</h6>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Please take medication at given timings.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={12} sm={3}>
                    <h6 className="treatment-head">REFERRAL:</h6>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Test for Gluse Random, Glucose Fasting, HbA1C</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div>
              <h6 className="mb-0 treatment-head">Dr. Jean Claude Mbanya, </h6>
              <p className="mb-0">MD, Endocrinology, </p>
              <p>Harvard University</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>
            <Grid
              container
              spacing={2}
              className="d-flex justify-content-center align-items-center"
            >
              <Grid item xs={12} md={2} className="img-left-section">
                <img src={imgUrl.adp_logo} className="logo-adp"></img>
              </Grid>
              <Grid
                item
                xs={12}
                md={10}
                className="flex-direction-column text-center"
              >
                <h6 className="mb-0 mt-15px tab-head">
                  DIABETES ASSOCIATION OF CAMEROON
                </h6>
                <p className="tab-subhead">
                  Dr. Jean Claude Mbanya, MD, Endocrinology, Harvard University
                </p>
              </Grid>
            </Grid>
            <div>
              <h6 className="mb-25px">Date: 04/07/2023</h6>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <h6 className="treatment-head">INVESTIGATION:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>
                            T1 diabetes with complications such of CDK and DKA
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">PRESCRIPTION : </h6>
                  </Grid>
                  <Grid item xs={9} className="flex-direction-column">
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" className="mt-10px">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">NOTES:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Please take medication at given timings.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">REFERRAL:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Test for Gluse Random, Glucose Fasting, HbA1C</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div>
              <h6 className="mb-0 treatment-head">Dr. Jean Claude Mbanya, </h6>
              <p className="mb-0">MD, Endocrinology, </p>
              <p>Harvard University</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div>
            <Grid
              container
              spacing={2}
              className="d-flex justify-content-center align-items-center"
            >
              <Grid item xs={12} md={2} className="img-left-section">
                <img src={imgUrl.adp_logo} className="logo-adp"></img>
              </Grid>
              <Grid
                item
                xs={12}
                md={10}
                className="flex-direction-column text-center"
              >
                <h6 className="mb-0 mt-15px tab-head">
                  DIABETES ASSOCIATION OF CAMEROON
                </h6>
                <p className="tab-subhead">
                  Dr. Jean Claude Mbanya, MD, Endocrinology, Harvard University
                </p>
              </Grid>
            </Grid>
            <div>
              <h6 className="mb-25px">Date: 14/06/2023</h6>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <h6 className="treatment-head">INVESTIGATION:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>
                            T1 diabetes with complications such of CDK and DKA
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">PRESCRIPTION : </h6>
                  </Grid>
                  <Grid item xs={9} className="flex-direction-column">
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" className="mt-10px">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">NOTES:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Please take medication at given timings.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">REFERRAL:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Test for Gluse Random, Glucose Fasting, HbA1C</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div>
              <h6 className="mb-0 treatment-head">Dr. Jean Claude Mbanya, </h6>
              <p className="mb-0">MD, Endocrinology, </p>
              <p>Harvard University</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div>
            <Grid
              container
              spacing={2}
              className="d-flex justify-content-center align-items-center"
            >
              <Grid item xs={12} md={2} className="img-left-section">
                <img src={imgUrl.adp_logo} className="logo-adp"></img>
              </Grid>
              <Grid
                item
                xs={12}
                md={10}
                className="flex-direction-column text-center"
              >
                <h6 className="mb-0 mt-15px tab-head">
                  DIABETES ASSOCIATION OF CAMEROON
                </h6>
                <p className="tab-subhead">
                  Dr. Jean Claude Mbanya, MD, Endocrinology, Harvard University
                </p>
              </Grid>
            </Grid>
            <div>
              <h6 className="mb-25px">Date: 22/04/2023</h6>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <h6 className="treatment-head">INVESTIGATION:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>
                            T1 diabetes with complications such of CDK and DKA
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">PRESCRIPTION : </h6>
                  </Grid>
                  <Grid item xs={9} className="flex-direction-column">
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" className="mt-10px">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">NOTES:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Please take medication at given timings.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">REFERRAL:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Test for Gluse Random, Glucose Fasting, HbA1C</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div>
              <h6 className="mb-0 treatment-head">Dr. Jean Claude Mbanya, </h6>
              <p className="mb-0">MD, Endocrinology, </p>
              <p>Harvard University</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <div>
            <Grid
              container
              spacing={2}
              className="d-flex justify-content-center align-items-center"
            >
              <Grid item xs={12} md={2} className="img-left-section">
                <img src={imgUrl.adp_logo} className="logo-adp"></img>
              </Grid>
              <Grid
                item
                xs={12}
                md={10}
                className="flex-direction-column text-center"
              >
                <h6 className="mb-0 mt-15px tab-head">
                  DIABETES ASSOCIATION OF CAMEROON
                </h6>
                <p className="tab-subhead">
                  Dr. Jean Claude Mbanya, MD, Endocrinology, Harvard University
                </p>
              </Grid>
            </Grid>
            <div>
              <h6 className="mb-25px">Date: 02/03/2023</h6>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <h6 className="treatment-head">INVESTIGATION:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>
                            T1 diabetes with complications such of CDK and DKA
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">PRESCRIPTION : </h6>
                  </Grid>
                  <Grid item xs={9} className="flex-direction-column">
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" className="mt-10px">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">NOTES:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Please take medication at given timings.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">REFERRAL:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Test for Gluse Random, Glucose Fasting, HbA1C</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div>
              <h6 className="mb-0 treatment-head">Dr. Jean Claude Mbanya, </h6>
              <p className="mb-0">MD, Endocrinology, </p>
              <p>Harvard University</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <div>
            <Grid
              container
              spacing={2}
              className="d-flex justify-content-center align-items-center"
            >
              <Grid item xs={12} md={2} className="img-left-section">
                <img src={imgUrl.adp_logo} className="logo-adp"></img>
              </Grid>
              <Grid
                item
                xs={12}
                md={10}
                className="flex-direction-column text-center"
              >
                <h6 className="mb-0 mt-15px tab-head">
                  DIABETES ASSOCIATION OF CAMEROON
                </h6>
                <p className="tab-subhead">
                  Dr. Jean Claude Mbanya, MD, Endocrinology, Harvard University
                </p>
              </Grid>
            </Grid>
            <div>
              <h6 className="mb-25px">Date: 03/03/2023</h6>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <h6 className="treatment-head">INVESTIGATION:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>
                            T1 diabetes with complications such of CDK and DKA
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">PRESCRIPTION : </h6>
                  </Grid>
                  <Grid item xs={9} className="flex-direction-column">
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" className="mt-10px">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Mediation: Actrapid (Novo Nordisk)</p>
                          <p>Units: 32</p>
                          <p>Duration: 30 days</p>
                          <p>Frequency: 1 per day</p>
                          <p>Dosage: NA</p>
                          <p>Times in a day: Anytime</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">NOTES:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Please take medication at given timings.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2} className="mt-10px">
                  <Grid item xs={3}>
                    <h6 className="treatment-head">REFERRAL:</h6>
                  </Grid>
                  <Grid item xs={9}>
                    <Card variant="outlined" className="">
                      <CardContent className="pb-5px">
                        <div>
                          <p>Test for Gluse Random, Glucose Fasting, HbA1C</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div>
              <h6 className="mb-0 treatment-head">Dr. Jean Claude Mbanya, </h6>
              <p className="mb-0">MD, Endocrinology, </p>
              <p>Harvard University</p>
            </div>
          </div>
        </TabPanel>
      </div>
    </Box>
  );
}
