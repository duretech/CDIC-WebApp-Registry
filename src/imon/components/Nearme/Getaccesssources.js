import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function RadioButtonsGroup() {
  const [value, setValue] = React.useState('imonitorplus');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      
      <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
        <FormControlLabel value="imonitorplus" control={<Radio />} label="iMonitor+" />
        <FormControlLabel value="google" control={<Radio />} label="Google" />
        <FormControlLabel value="gisgraphy" control={<Radio />} label="Gisgraphy" />
      </RadioGroup>
    </FormControl>
  );
}
