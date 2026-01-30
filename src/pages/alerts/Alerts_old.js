import React, { Component } from 'react'
import i18n from '@dhis2/d2-i18n'
import { apiServices } from '../../services/apiServices'
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import swal from 'sweetalert'
import Alerttabs from './AlertTabs';
import '../../assets/css/customstyles.css'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };


class AlertsPage extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            sessionUserBoValue: JSON.parse(sessionStorage.getItem('userBO')) || JSON.parse(localStorage.getItem('userBO')),
            progarmData: JSON.parse(localStorage.getItem('metaData')) || '',
            loading:false,
            tabValue:0,
        }
    }

    componentDidMount() {
        //this.getAlertList();
    }
    
    getAlertList = (param) => {
        
        this.setState({loading: true})
        // return;
        let { sessionUserBoValue } = {...this.state}
                
        let orgID = sessionUserBoValue.organisationUnits[0].id, //`UuYrI1twhmN`,
            programID = sessionUserBoValue.programs[0], //`nSy7PFqQykt`, 
            searchQuery = ``
        
        for (var i in param) {
            searchQuery += `&attribute=${i}:LIKE:${param[i]}`
        }
        
        //
        
        let subURL = 'trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&program='+ programID +'&pageSize=50&page=1&totalPages=true'
                   //'trackedEntityInstances/query.json?ou='+ orgID +'&ouMode=SELECTED&&order=created:desc&program='+ programID +'&pageSize=50&page=1&totalPages=false'
        
        apiServices.getAPI(subURL).then(res => {
            
            
            this.setState({
                loading: false
            });
                            
        }).catch(error => {
            this.setState({                
                loading: false
            });
            swal({
                title: "Error",
                text: "",
                icon: "error",
                button: "Close",
              });
        })
        
    }
    a11yProps = (index)=> {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
        };
    }
     handleChange = (event, newValue) => {
        
        this.setState({
            tabValue:newValue
        })
    }
    render () {
        return (            
            <section
                className="tutorialbg"
                style={{
                    backgroundColor: "#3f4e63",
                    flexGrow: 1,
                    padding: 0,
                }}
            >
                <Grid container spacing={3} className="mt-30px mb-30px">
                    <Grid item xs={12} sm={12} md={12} className="registration-page">
                        {/* <Alerttabs></Alerttabs> */}
                        <AppBar position="static" color="default" className="registrationtabs layouttabs">
                            <Tabs
                            value={this.tabValue}
                            onChange={this.handleChange}
                            variant="scrollable"
                            scrollButtons="on"
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="scrollable force tabs example"
                            >
                            <Tab label="HTC Service Pending" icon={<TimelapseIcon />} {...this.a11yProps(0)} />
                            <Tab label="Eligible for Retesting" icon={<InvertColorsIcon />} {...this.a11yProps(1)} />
                            
                            
                            </Tabs>
                        </AppBar>
                        <TabPanel value={this.tabValue} index={0} className="regscrolltabs layoutscrolltabs">
                            <Grid container spacing={3}>
                        
                            <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
                            {/* <Alertslist></Alertslist> */}
                            <p>first</p>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
                            {/* <Alertslist></Alertslist> */}
                            <p>second</p>
                            </Grid>
                            
                            </Grid>

                        </TabPanel>

                        <TabPanel value={this.tabValue} index={1} className="regscrolltabs layoutscrolltabs">
                        <Grid container spacing={3}>
                        
                            <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
                            {/* <Alertslist></Alertslist> */}
                            <p>third</p>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} className="knowkedgelistcontainer">
                            {/* <Alertslist></Alertslist> */}
                            <p>fourth</p>
                            </Grid>
                            
                            </Grid>
                        </TabPanel>
                    </Grid>
                </Grid>
            </section>
        )
    }
}
export default AlertsPage