import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Services from "../../api/api";
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import { setLangID, setCommunityId } from "../../redux/actions/appActions";
import Loader from "../loaders/loader";
import OffileDb from '../../config/pouchDB';
import imgUrl from "../../assets/images/imageUrl";
import Grid from "@material-ui/core/Grid";
import { logError } from "../../helpers/auth";
import { setEncryptedItem,getDecryptedItem } from '../../../config/validationutils'

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

class Programlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 1,
      langlist: [],
      isLoading: true,
      defaultVal: 1,
      Russian: "Russian",
      Kyrgyz: "Kyrgyz",
      English: "English",
      imgSrc: imgUrl.stoptblogo
    };
    this.handleChange = this.handleChange.bind(this);
    //this.loadOfflineData = this.loadOfflineData.bind(this)
  }

  handleChange = (event) => {
    this.setState({ selected: event.target.value });
    if(event.target.value != 1){

   // localStorage.setItem("CommunityId", event.target.value);
    setEncryptedItem('CommunityId', event.target.value);
      this.props.setCommunityId(event.target.value);
      this.props.onPrgramChange(event.target.value)
    }
  };

  componentDidMount() {
    OffileDb.setDatabase()
    this.getProgramlist()
  }



  getProgramlist() {
    var param = {
      id: 2,
      isactive: true
    }
    console.log(param)
    Services.getProgramDataById(param).then((res) => {
      console.log(res)
      try {
        if (res.data.status == 200) {
          let childCommunities = res.data.data[0].communityList
          this.setState({
            langlist: childCommunities,
            isLoading: false,
          });
          this.props.setCommunityId(childCommunities[0]['communityId']);
        }
      } catch (err) {
        console.log("err::", err)
        var errorObj = {
          component: 'Programlist',
          method: 'getProgramlist',
          error: err
        }
        logError(errorObj);
      }
    })
  }


  getFlagUrl(value) {
    var url = imgUrl.globe;
    if(value == "b78ff1610e1bd04a0e2358970060373b") {
      return imgUrl.Uganda_flag
    } else if (value == "ace9bd89c0133c2d9a77cea2ea45c54d") {
      return imgUrl.nigeria_flag
    } else if (value == "1b60698ac49f220e96ce69062be4f3e7") {
      return imgUrl.vietnam_flag
    }
    return url
  }

  render() {
    const { t } = this.props;
    let list = this.state.langlist;
    let value = this.state.selected;
    var loginButton = [];

   var flgurl =   this.getFlagUrl(value)

    if (!this.state.isLoading) {
 
      loginButton.push(
        <Grid container spacing={3} className="gridcontainer">
          <p className="animate__animated animate__zoomIn animate__faster">
            <Trans> {t("Please select your country")} </Trans>
          </p>
          <div className="selectlanginputdivholder" style={{width: '100%'}}>
            <Grid item xs={3}>
              <p className="zero vertical-align-center">
                <img className="img-fluid" src={flgurl} />
              </p>
            </Grid>
            <Grid item xs={9}  className="selectlanginput">
              <FormControl className="">
                <Select labelId="demo-simple-select-label" id="demo-simple-select"
                  value={value}
                  onChange={this.handleChange}
                >
                <MenuItem  value={1}>{t("Please select")}</MenuItem>
                  {list.length > 0 && list.map((name) => (
                    <MenuItem key={name.communityId} value={name.communityId} >{name.country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </div>
        </Grid>
      )
    }
    return (
      <>
        <div className="getstarted-form">
          <Loader isLoading={this.state.isLoading} />
          {loginButton}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

export default withStyles(useStyles)(connect(mapStateToProps, { setLangID, setCommunityId })(withTranslation()(Programlist)));