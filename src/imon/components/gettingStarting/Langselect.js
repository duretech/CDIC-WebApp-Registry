import React from "react";
import { connect } from "react-redux";
import {
  useHistory,
  withRouter,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { withTranslation, Trans } from "react-i18next";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import classnames from "classnames";
//import Services from '../../config/services';
import Services from "../../api/api";

import Zoom from "@material-ui/core/Zoom";
import Slide from "@material-ui/core/Slide";
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
      selected: "",
      langlist: [],
      isLoading: false,
      Russian: "Russian",
      Kyrgyz: "Kyrgyz",
      English: "English",
      checked: true,
    };
  }

  handleChange = (event) => {
    console.log(event.target.value);
    this.setState({ selected: event.target.value });
    var param = {
      communityId: localStorage.getItem("CommunityId"),
      languageId: event.target.value,
    };
    console.log(event.target.value);
    // Services.getCommunitywiseLabels(param).then(data => {
    //   console.log(data.data)
    // })

    this.props.getTranlation(event.target.value);
    //setAge(event.target.value);
  };

  componentDidMount() {
    var param = {
      communityId: localStorage.getItem("CommunityId"),
    };
    Services.getLangList(param).then((data) => {
      try{
        console.log(data);
        this.setState({
          langlist: data.data.masterLangList.filter(
            (obj) => obj.id == 1 || obj.id == 82
          ),
        });
      }catch(err){
        console.log("err::", err)
        var errorObj = {
          component: 'Langselect',
          method: 'getLangList',
          error: err
        }
        logError(errorObj);
      }
    });

    setTimeout(function () {
      this.setState({
        checked: false,
      });
    }, 0);
  }

  render() {
    const { classes } = this.props;
    const { t } = this.props;
    let list = this.state.langlist;
    return (
      <div className="getstarted-form">
        <FormControl className={classes.formControl}>
          <InputLabel
            shrink
            id="demo-simple-select-placeholder-label-label"
            className="inputlabel"
          >
            {/* <Trans> {t("pleaseSelectlang")}  </Trans> */}
            <Trans> Please Select Language </Trans>
          </InputLabel>
          <Select
            labelId="demo-simple-select-placeholder-label-label"
            id="demo-simple-select-placeholder-label"
            onChange={this.handleChange}
            displayEmpty
            className={classes.selectEmpty}
            value={this.state.selected || ""}
          >
            <MenuItem value="">
              <Trans> {t("pleaseSelectlang")} </Trans>
            </MenuItem>
            {list.map((name) => (
              <MenuItem
                key={name.id}
                value={name.id}
                className="animate__animated animate__bounce"
              >
                {name.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}

// export default withStyles(useStyles)(withTranslation()(SimpleSelect));
const mapStateToProps = (state) => {
  let { storeState } = state;
  return {
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
};

const TranslationSimpleSelect = withTranslation()(SimpleSelect);
const StyleSimpleSelect = withStyles(useStyles)(TranslationSimpleSelect);
const FinalSimpleSelect = withRouter(StyleSimpleSelect);

export default connect(mapStateToProps)(FinalSimpleSelect);
