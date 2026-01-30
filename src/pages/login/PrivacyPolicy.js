import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Button,
  Grid,
} from "@material-ui/core";
import {

  ButtonStrip,
  InputFieldFF,
  SingleSelectFieldFF,
  ReactFinalForm,
  SwitchFieldFF,
  hasValue,
  TextAreaFieldFF,
  composeValidators,
  dhis2Username,
  FieldGroupFF,
  CheckboxFieldFF,
  FileInputFieldFF
} from '@dhis2/ui';
import ArrowBack from "@material-ui/icons/ArrowBack";
import { makeStyles } from "@material-ui/core/styles";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns"; // date-fns utilities
import axios from "axios";
import InputLabel from '@material-ui/core/InputLabel';
// import "../../assets/css/customstyles.css";
// import "../../assets/css/theme_blue.css";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  appBarSpacer: {
    ...theme.mixins.toolbar, 
  },
  content: {
    padding: theme.spacing(3),
    marginTop: theme.mixins.toolbar.minHeight + 10, 
    flexGrow: 1,
  },
  formContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(3), 
    marginTop: theme.spacing(4),
  },
  inputLabel: {
    marginBottom: '5px',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  formControl: {
    width: '100%',
    fontSize: '16px',
    '& .MuiOutlinedInput-input': {
      padding: '10px 15px', // Padding for the dropdown text
    },
    '& .MuiSelect-icon': {
      right: '10px', // Adjusting the arrow position in the dropdown
    },
  },
  formControl_: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  datePicker: {
    width: '100%',
    '& input': {
      padding: '10px 15px', // Adding padding for the date picker input
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      color: '#0d47a1',
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#0d47a1',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
}));

const PrivacyPolicy = () => {
  const history = useHistory();
  const classes = useStyles();

  const [selectionType, setSelectionType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);


  const handleBack = () => {
    history.goBack();
  };

 
  const handleSelectionChange = (event) => {
    setSelectionType(event.target.value);
    setSelectedDate(null); 
  };


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Format date as "YYYY-MM-DD"
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle form submission for downloading audit data
  const handleDownloadAudit = async () => {
    let fromDate, toDate;
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    // Handle day, week, and month selections
    if (selectionType === "Day") {
      fromDate = formatDate(selectedDate);
      toDate = formatDate(selectedDate);
    } else if (selectionType === "Week") {
      const startOfWeek = new Date(selectedDate);
      const endOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()); // Start of week
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week

      fromDate = formatDate(startOfWeek);
      toDate = formatDate(endOfWeek);
    } else if (selectionType === "Month") {
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      fromDate = formatDate(startOfMonth);
      toDate = formatDate(endOfMonth);
    }

    // API call to download audit data
    try {
      const response = await axios.post(
        "https://your-server-url/api/audit/downloadaudit",
        {
          programId: "eAHvg6zuxvK", 
          fromDate: fromDate,
          toDate: toDate,
        },
        {
          responseType: "blob", 
          headers: {
             
            'Cache-Control': 'no-cache'
          }
        }
      );

      // Download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const currentTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `audit_data_${currentTimestamp}.xlsx`;
      link.setAttribute("download", filename); // Filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading audit data", error);
    }

    
  };


  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* AppBar and Toolbar for the header */}
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="go back"
              onClick={handleBack}
            >
              <ArrowBack />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Audit Data
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Add some spacing after the AppBar */}
        <div className={classes.appBarSpacer}></div>

        {/* Form layout using CSS Grid for alignment */}
        <Grid container justifyContent="center">
          <Grid item xs={10}>
            <div className={classes.formContainer}>
              <div>
                <div className={classes.inputLabel}>Select Type</div>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                >
                  <Select
                    value={selectionType}
                    onChange={handleSelectionChange}
                    component={SingleSelectFieldFF}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Type
                    </MenuItem>
                    <MenuItem value="Day">Day</MenuItem>
                    <MenuItem value="Week">Week</MenuItem>
                    <MenuItem value="Month">Month</MenuItem>
                  </Select>
                </FormControl>
              </div>
              

              <div>
                <div className={classes.inputLabel}>
                  {selectionType === "Day"
                    ? "Select Day"
                    : selectionType === "Week"
                    ? "Select Week Start Date"
                    : "Select Month"}
                </div>

                {/* Conditionally render DatePicker */}
                <DatePicker
                  label={selectionType === "Day" ? "Select Day" : selectionType === "Week" ? "Select Week" : "Select Month"}
                  inputVariant="outlined"
                  format={selectionType === "Day" || selectionType === "Week" ? "yyyy-MM-dd" : "MMMM yyyy"}
                  value={selectedDate}
                  views={selectionType === "Month" ? ["month", "year"] : ["date"]}
                  onChange={handleDateChange}
                  className={classes.datePicker}
                />
              </div>
            </div>

            <div className={classes.buttonContainer}>
              <Button className={classes.submitButton} onClick={handleDownloadAudit}>
                Download Audit Data
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </MuiPickersUtilsProvider>
  );
};

export default PrivacyPolicy;
