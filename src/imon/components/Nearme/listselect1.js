import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect(props) {
  const classes = useStyles();
  const [value, setvalue] = React.useState('');

  const handleChange = (event) => {
    setvalue(event.target.value);
    props.onOptionChange(event.target.value)
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
       
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleChange}
        >
          <MenuItem value={''}>Please Select</MenuItem>
          {
            props.options && props.options.length > 0 && props.options.map( obj => {
              return  <MenuItem value={obj}>{obj}</MenuItem>
            })
          }
        </Select>
      </FormControl>  
    </div>
  );
}
