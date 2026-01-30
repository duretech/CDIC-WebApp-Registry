import React, { Component } from 'react';
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
    margin: theme.spacing(3),
  },
}));

class CheckboxesGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkArr:[],
      checked: this.props.checkedFalg
    };
  }


  componentDidUpdate(prevProps) {
    if(prevProps.checkedFalg != this.props.checkedFalg) {
      this.setState({checked: this.props.checkedFalg})
    }
  }

  handleCheck = (event, isInputChecked) => {
    console.log(this.props)
    this.setState({checked: isInputChecked})
    this.props.inputChangevent(this.props.element.questionId, event)
  }

  render() {
    
    return (
      <FormControlLabel
        value={this.props.value}
        name={this.props.name}
        checked={this.state.checked}
        control={<Checkbox  name={this.props.name} onChange={this.handleCheck}/>}
        label={this.props.label} 
        
        />
    )
  }
}

export default CheckboxesGroup;
