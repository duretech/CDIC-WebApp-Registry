import React, { Component } from 'react';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Popper from "@material-ui/core/Popper";
import {setRegionStateValue,setFacilityStateValue } from "../../redux/actions/appActions";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { withTranslation, Trans } from "react-i18next";
import { connect } from "react-redux";
import ApiServices from "../../api/api";
import { logError } from '../../helpers/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

class FacilityType extends Component {

  constructor(props) {
    super(props);
    this.state = {
      regionvalue: null,
      getHospitalname: [],
      getRegionName: [],
      hospitalId: 0,
      hospitalname: "",
      selecval: "",
      value: "",
      hospitaladdress: "",
      values: this.props.values || null,
    };
    this.handlechange = this.handlechange.bind(this);
    this.updatebottomsheet = this.updatebottomsheet.bind(this);
    this.getFacilityList = this.getFacilityList.bind(this);
    this.getRegionList = this.getRegionList.bind(this);
  }

  handlechange(id, event, value) {
    var values = value;
    try {
      this.setState({ values: value });
      // if (this.props.question.dependentQuestionsList && this.props.question.dependentQuestionsList.length > 0) {
      //   var dependList = this.props.question.dependentQuestionsList.filter(o => o.selectedOption.includes(values))
      //   this.setState({ dependantquestionlist: dependList })
      // }
      console.log("selectedHospitaldetails::", value);
      if (value) {
        localStorage.setItem("hospitalname", value.name ? value.name : "");
        localStorage.setItem("hospitalid", value.id ? value.id : 0);
        localStorage.setItem(
          "hospitaladdress",
          value.address ? value.address : ""
        );
      }
      if (this.props.nearmeflag == false) {
        this.props.updatebottomsheet(true);
        this.props.nearmeDet(value);
      }
      if (id && value && event.target) {
        this.props.updateCompletionPer(id, event, value);
      }
    } catch (err) {
      console.log(err);
      var errorObj = {
        component: 'RegistrationFacilityType',
        method: 'handlechange',
        error: err
      }
      logError(errorObj);
    }
  }

    //api call to fetch regionlist
    getRegionList() {
      let { communityuid } = { ...this.props };
      var param = {
        communityId: communityuid,
      };
      console.log("regionlistparams>>", param);
      if (navigator.onLine) {
        ApiServices.getRegionListForNearmeByCommunityId(param).then((res) => {
          try {
            console.log("getRegionListForNearmeByCommunityId", res);
            if (res.data && res.data != "null" && res.data.status == 200) {
              console.log();
              this.setState({
                getRegionName: res.data.data,
              });
            }
          } catch (err) {
            console.log("err::", err);
            var errorObj = {
              component: 'RegistrationFacilityType',
              method: 'getRegionList',
              error: err
            }
            logError(errorObj);
          }
        });
      }
    }
  
    //api call to fetch hospitallist
    getFacilityList() {
      let { communityuid } = { ...this.props };
      let self = this;
      let arr = [];
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          console.log("position:", position);
          arr = [position.coords.latitude, position.coords.longitude];
          console.log("arr::", arr);
          var param = {
            communityId: communityuid,
            region: self.state.regionvalue,
          };
          console.log("nearmesearchparams::", param);
          if (navigator.onLine) {
            ApiServices.getNearmeByCommunityId(param).then((res) => {
              try {
                console.log("getNearmeByCommunityId", res);
                if (res.data && res.data != "null" && res.data.status == 200) {
                  console.log();
                  // self.setState({
                  //   getHospitalname: res.data.data,
                  // });
                  self.props.setFacilityStateValue(res.data.data);
                  console.log("state>>>", self.state);
                }
              } catch (err) {
                console.log("err::", err);
                var errorObj = {
                  component: 'RegistrationFacilityType',
                  method: 'getFacilityList',
                  error: err
                }
                logError(errorObj);
              }
            });
          }
        });
      }
    }


  updatebottomsheet() {
    console.log("opem");
    this.props.updatebottomsheet(false);
  }

  render() {
    const PopperMy = function (props) {
      return (
        <Popper {...props} style={styles.popper} placement="bottom-start" />
      );
    };
    const styles = (theme) => ({
      popper: {
        width: "fit-content",
      },
    });
    let hospitaldetails = [];
    if (this.props.FacilityStateValue) {
      hospitaldetails = this.props.FacilityStateValue;
    }
    console.log("hospitalList::", hospitaldetails);
    let hospitalname = hospitaldetails.name;
    const { t } = this.props;
    let element = this.props.element;
    return (
      <div className="textboxholder .MuiFormControl-root">
      <FormControl>
        <Autocomplete
          // labelId="demo-simple-select-label"
          // id="demo-simple-select"
          PopperComponent={PopperMy}
          options={this.props.FacilityStateValue}
          value={this.state.values}
          name={element.questionId}
          onChange={(event, value) => {
            this.handlechange(element.questionId, event, value);
          }}
          getOptionLabel={(option) => 
            option.name ? option.name : this.state.values
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("Please select an option")}
              value={this.state.values}
              name={element.questionId}
              onClick={() => this.updatebottomsheet()}
            ></TextField>
          )}
        />
      </FormControl>
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID:
      JSON.parse(localStorage.getItem("templateID")) != null
        ? JSON.parse(localStorage.getItem("templateID"))
        : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
    componentbgcolor: storeState.componentbgcolor,
    FacilityStateValue: storeState.FacilityStateValue,
    RegionStateValue: storeState.RegionStateValue,
  };
};


// export default FacilityType;
let FacilityQues = withStyles(useStyles)(withTranslation()(FacilityType));
export default connect(mapStateToProps, {setRegionStateValue,setFacilityStateValue})(FacilityQues);
