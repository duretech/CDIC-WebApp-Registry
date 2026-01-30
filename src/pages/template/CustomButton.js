import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    marginLeft:'0px',
    marginBottom:'20px',
    backgroundColor: '#1a7798 !important',
    color: '#fff',
  },
  searchbtn:{
  	backgroundColor:'#fff',
  	padding: '2px 16px',
    margin: '8px',
    borderRadius: '4px',
    marginBottom:'20px',
  },
  filterbtn:{
  	backgroundColor:'#fff',
  }
}));

export default function IconLabelButtons() {
  const classes = useStyles();

  return (
    <div>
       <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
           <Button
        variant="contained"
        className={classes.filterbtn}
        color="default"
        className={classes.button}
        startIcon={<FilterListIcon />}
      >
        Filter
      </Button>
        </Grid>
        <Grid item xs={12} md={3}>
           <TextField
        className={classes.searchbtn}
        id="input-with-icon-textfield"
        label=""
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
        </Grid>
        </Grid>
      
     
     
    </div>
  );
}