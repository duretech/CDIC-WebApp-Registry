import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(0),
  },
}));

export default function CheckboxesGroup() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    hospitals: true,
    bloodbanks: false
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const { hospitals, bloodbanks } = state;
  const error = [hospitals, bloodbanks].filter((v) => v).length !== 2;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={hospitals} onChange={handleChange} name="hospitals" />}
            label="Hospitals"
          />
          <FormControlLabel
            control={<Checkbox checked={bloodbanks} onChange={handleChange} name="bloodbanks" />}
            label="Blood Banks"
          />
        </FormGroup>
      </FormControl>
    
    </div>
  );
}
