import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function RadioButtonsGroup() {
  const [value, setValue] = React.useState('four');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
     
      <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
        <FormControlLabel value="four" control={<Radio />} label="4" />
        <FormControlLabel value="three" control={<Radio />} label="3" />
        <FormControlLabel value="two" control={<Radio />} label="2" />
        <FormControlLabel value="one" control={<Radio />} label="1" />
      </RadioGroup>
    </FormControl>
  );
}
