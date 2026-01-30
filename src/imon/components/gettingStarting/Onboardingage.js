import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function RadioButtonsGroup() {
  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
        <FormControlLabel value="female" control={<Radio />} label="17 to 30" />
        <FormControlLabel value="male" control={<Radio />} label="31 to 45" />
        <FormControlLabel value="other" control={<Radio />} label="46 to 65" />
        <FormControlLabel value="disabled" control={<Radio />} label="65 Or Older" />
      </RadioGroup>
    </FormControl>
  );
}
