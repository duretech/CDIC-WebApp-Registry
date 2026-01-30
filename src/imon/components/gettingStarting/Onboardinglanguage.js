import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Services from "../../api/api";
import { setLangID } from "../../redux/actions/appActions";
import Loader from "../loaders/loader";
import OffileDb from '../../config/pouchDB';
// import Picker from 'react-mobile-picker';
import imgUrl from '../../assets/images/imageUrl.js';
import Programlist from "./Programlist";
import { logError } from "../../helpers/auth";

const useStyles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "-webkit-fill-available",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    backgroundColor: "rgba(0, 0, 0, .02)",
  },
});

class SimpleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: localStorage.getItem('langId') || 1,
      langlist: [],
      isLoading: true,
      defaultVal: 1,
      Russian: "Russian",
      Kyrgyz: "Kyrgyz",
      English: "English",
      pickerSelectedvalue: { langlist: null },
      valueGroups: {
        title: 'Mr.'
      },
      optionGroups: {
        title: ['English', 'French', 'Spanish', 'Russian', 'Hindi', 'Swahili']
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.loadOfflineData = this.loadOfflineData.bind(this)
  }

  handleChange = (event) => {
    this.setState({ selected: event.target.value });
    this.getTranslation(event.target.value);
  };

  componentDidMount() {
    OffileDb.setDatabase()
    
    if (navigator.onLine) {
      this.getTranslation(localStorage.getItem("langId"));
      this.getLangList(localStorage.getItem("CommunityId"))
    }
    else{
      this.loadOfflineData()
    }
  }

  getLangList(communitid){
    var param = {
      communityId: communitid,
    };
    Services.getLangList(param).then((res) => {
      try {
        if (res.data.status == 200) {
          this.setState({
            langlist: res.data.data
          });
          this.genrateLangArray(res.data.data)
          OffileDb.setData('langlist', res.data.data)
        }
        this.setState({ isLoading: false });
      } catch (err) {
        console.log("err::", err)
        var errorObj = {
          component: 'Onboardinglanguage',
          method: 'getLangList',
          error: err
        }
        logError(errorObj);
      }
    });
  }

  loadOfflineData() {
    var that = this
    OffileDb.getData('langlist').then(function (result) {
      if (result && !result.error) {
        that.setState({
          langlist: result.data,
          isLoading: false
        });
        that.genrateLangArray(result.data)
      }
    });
  }

  genrateLangArray(data) {
    //console.log(data)
    this.setState({ optionGroups: { title: data.map(obj => obj.languageName) } })
  }

  getTranslation(id) {
    if (navigator.onLine) {
      var params = {
        communityId: localStorage.getItem("CommunityId"),
        labelType: 'Mobile',
        languageId: id,
      };
      console.log("getCommunitywiseLabelsparams::",params)
      Services.getCommunitywiseLabels(params).then((res) => {
        try {
          if (res.data.status == 200) {
            let lan = res.data.data.locale;
            let tran = res.data.data.label;
            document.getElementsByTagName("body")[0].setAttribute("lag", lan);
            i18next.addResourceBundle(lan, "translations", tran, true, true);
            i18next.changeLanguage(lan);
            localStorage.setItem('langId', id)
            this.props.setLangID(id);
            OffileDb.setData("tranlation-"+id, res.data.data)
          }
        } catch (err) {
          console.log("err::", err)
          var errorObj = {
            component: 'Onboardinglanguage',
            method: 'getTranslation',
            error: err
          }
          logError(errorObj);
        }
      });
    }
  }

  handlePickerChange = (name, value) => {
    this.setState(({ valueGroups }) => ({
      valueGroups: {
        ...valueGroups,
        [name]: value
      }
    }));
    var list = this.state.langlist.filter(obj => obj.languageName == value)
    if (list.length > 0) {
      this.getTranslation(list[0].languageId);
    }
  };

  render() {
    const { t } = this.props;
    let list = this.state.langlist;
    let value = parseInt(this.state.selected);
    const { templateID } = this.props;

    //console.log(this.state.langlistOption)

    var loginButton = [];
    if (!this.state.isLoading && list.length > 0) {
      if (templateID == 1 || templateID == 2) {
        loginButton.push(
          <Grid container spacing={3} className="gridcontainer">
            <div className="selectlanginputdivholder">
              <Grid item xs={3} >
                <p className="zero vertical-align-center">
                  <img className="img-fluid"     width= "1000px" height="32px" src={imgUrl.langicon} />
                </p>
              </Grid>
              <Grid item xs={9} className="selectlanginput">
                <FormControl className="">
                  <Select labelId="demo-simple-select-label" id="demo-simple-select"
                    value={value}
                    onChange={this.handleChange}
                  >
                    {list.length > 0 && list.map((name) => (
                      <MenuItem key={name.languageId} value={name.languageId} >{t(name.languageName.split('(')[0])}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </div>
          </Grid>
        )
      } else {
        loginButton.push(
          <FormControl component="fieldset" key="1">
            <p className="animate__animated animate__zoomIn animate__faster">
              <Trans> {t("Please Select Language")} </Trans>
              {/* <Trans> Please Select Language </Trans> */}
            </p>
            <RadioGroup name="gender1" value={value} >
              {list.length > 0 && list.map((name) => (
                <FormControlLabel
                  className="animate__animated animate__zoomIn animate__faster"
                  key={name.languageId}
                  value={name.languageId}
                  control={<Radio />}
                  label={name.languageName.split('(')[0]}
                  onChange={this.handleChange}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      }

    }
    return (
      <div className="getstarted-form">
        <Loader isLoading={this.state.isLoading} />
        {loginButton}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

export default withStyles(useStyles)(
  connect(mapStateToProps, { setLangID })(withTranslation()(SimpleSelect))
);
