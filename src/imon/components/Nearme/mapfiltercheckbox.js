import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation, Trans } from "react-i18next";
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import imgUrl from "../../assets/images/imageUrl";
import { gaLogEvent } from "../../helpers/analytics";

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
      checkArr: [],
      checked: this.props.checked
    };
  }

  componentDidMount() {
    gaLogEvent("Map filter", '', '');
  }
  handleCheck = (event, isInputChecked) => {
    this.props.onChange(event, isInputChecked, this.props.category);
    this.setState({ checked: isInputChecked })
  }


  render() {
    const { t } = this.props;
    const { element } = this.props;

    var iurl = element.iconUrl != "" ? element.iconUrl : imgUrl.mapdefult;
    return (
      <FormControlLabel
        control={<Checkbox checked={this.state.checked} value={this.props.category} onChange={this.handleCheck} name="gilad" />}
        label={
          <>
            <img src={iurl} key={this.props.key} className="profile-img" width="20px" height="20px" style={{ marginRight: "5px" }} />
            {t(this.props.category)}
          </>
        } />
    )
  }
}

export default withTranslation()(CheckboxesGroup);
