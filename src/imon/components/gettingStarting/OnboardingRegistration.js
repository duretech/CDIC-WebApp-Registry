import React from "react";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Checkbox from "@material-ui/core/Checkbox";
import ApiServices from "../../api/api";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import CheckboxQues from "./checkbox";
import Input from "@material-ui/core/Input";
import Popper from "@material-ui/core/Popper";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Autocomplete from "@material-ui/lab/Autocomplete"
import { logError } from "../../helpers/auth";
import { apiServices } from '../../../services/apiServices';
import { ButtonStrip, InputFieldFF, SingleSelectFieldFF, ReactFinalForm, hasValue, AlertBar, CircularLoader, CenteredContent } from '@dhis2/ui';
import moment from 'moment'

const { Form, Field, FormSpy } = ReactFinalForm
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

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionlist: [],
      selectedCity: null,
      barangayId: null,
      baragayValue: null,
      barangay: [],
      isLoading: false,
      values: this.props.values || null,
      phoneno:this.props.phoneno || null,
      userage:this.props.userage || null,
      showSlider: true,
      temp: false,
      animCssClasses: 'animate__animated animate__zoomIn animate__faster',
      value: '',
      coords: ''
    };
    this.inputChangevent = this.inputChangevent.bind(this);
    var OUJSON;
  }

  componentDidMount() {
    var that = this
    if (this.props.question.trackedEntityAttribute.displayName.includes("OneUHC ID")) {
      let param = `/trackedEntityAttributes/zHlz09wk0T0/generate?-`
      apiServices.getAPI(param)
        .then(response => {
          that.setState({ value: response.data.value })
          that.inputChangevent(that.props.question.trackedEntityAttribute.displayName, response.data.value)
        })
    }
  }

  componentDidUpdate(prevProps) {
    
    if (prevProps.values != this.props.values || prevProps.userage != this.props.userage) {
      this.setState({ value: this.props.values ,
      userage:this.props.userage})
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      animCssClasses: nextProps.animCssClasses,
      showSlider: nextProps.showSlider
    }
  }


  renderQuestion() {
    var element = this.props.question;
    const { templateID } = this.props;
    var quslist = [];
    // var name = element.displayName.split("Referral ")[1]
    var name = element.trackedEntityAttribute.displayName
    if(name == 'Barangay' && !this.state.barangayId){
      this.setState({barangayId : element.trackedEntityAttribute.id}) //ugShESgFegI
    }
    return (
      <>
        {name != "Barangay" ?
        <>
          <p className="text-left fw-500" >{name} {element.trackedEntityAttribute.displayName.includes("First Name") || element.trackedEntityAttribute.displayName.includes("Last Name") || element.trackedEntityAttribute.displayName.includes("Phone number") || element.trackedEntityAttribute.displayName.includes("Municipality/City") || element.trackedEntityAttribute.displayName.includes("Barangay")? <span style={{ color: 'red' }}>*</span> : ""}</p>
          <FormControl component="fieldset">
            {this.getQuestionType(element)}
          </FormControl>
        </>
         : '' }
      </>
    );
  }

  getQuestionType(element) {
    //console.log("question",element)
    switch (element.trackedEntityAttribute.valueType.toLowerCase()) {
      case "number":
        return this.getTextType(element);
      case "age":
        return this.getTextType(element);
      case "integer_zero_or_positive":
        return this.getTextType(element);
      case "date":
        return this.getDateType(element);
      case "datetime":
        return this.getTimeType(element);
      case "freetext":
        return this.getTextType(element);
      case "text":
        return this.getTextType(element);
      case "dropdown":
        return this.getSelectType(element);
      case "radio":
        return this.getRadioType(element);
      case "checkbox":
        return this.getCheckboxType(element);
      case "coordinate":
        return this.getCoordinateType(element)
      case 'organisation_unit':
        return this.getOrganisationUnitType(element)

    }
  }

  inputChangevent(id, value) {
    this.setState({ value: value })
    this.props.getValue(id, value)
    if(id.toLowerCase().includes('birth')){
      this.props.calcAge(value)
    }
  }

  getTextType(element) {
    let name = element.trackedEntityAttribute.displayName.toLowerCase()
    
    let qtype = element.trackedEntityAttribute.displayName.toLowerCase()
    let maxLength = qtype == 'age' ? 3 : (qtype.includes('phone number') ? 10 : 1000);
    let type = name == 'age' ? 'number' : (name.includes('phone number') ? 'tel' : 'text')
    var that = this;
    console.log("name",name,this.state,)
    if(element.trackedEntityAttribute.optionSet != undefined){
      return this.getSelectType(element)
    }else{
      return (
        <TextField
          type={type}
          value={(this.state.phoneno && name.includes('phone number'))? this.state.phoneno:((this.state.userage && name.includes('age'))?this.state.userage:(this.state.value ? this.state.value : ''))}
          disabled={(this.state.phoneno && name.includes('phone number'))||(name.includes('age'))||(this.state.value && element.trackedEntityAttribute.displayName == "OneUHC ID") ? true : false}
          name={element.trackedEntityAttribute.id}
          inputProps={{ maxLength: maxLength }}
          // required={element.displayName.includes("First Name")||element.displayName.includes("Last Name")||element.displayName.includes("Phone number")?true:false}
          onChange={(evt) => this.inputChangevent(element.trackedEntityAttribute.displayName, evt.target.value)}
        />
      );
    }
    
  }

  getOrganisationUnitType(element) {
    let userFacilities = []
    
    let OUMOptions = []
       
        let autocompleteData = []
        if(element.trackedEntityAttribute.displayName == 'Municipality/City') {
           OUMOptions = this.props.OUJSON.filter(obj => (obj.level == 4))
        } else {
           OUMOptions = this.props.OUJSON.filter(obj => (obj.level == 5))
        }
        OUMOptions = OUMOptions.filter(obj => 
          (obj))
            if(OUMOptions.length > 0) {
              OUMOptions.map(items => {
                    let obj = {
                        'label': items.name, 
                        'value': items.id
                    }
                    autocompleteData.push(obj)
                })
            }

            if(element.trackedEntityAttribute.displayName == 'Municipality/City') {
              userFacilities = autocompleteData

              return (
                <>
                <Autocomplete
                name={element.trackedEntityAttribute.id}
                placeholder="Municipality/City*"
                key={element.trackedEntityAttribute.id}
                options={userFacilities != null ? userFacilities : [ {"label": "Select", "value": "-" }]}
                getOptionValue={x => x.value}
                getOptionLabel={x => x.label}
                onChange={this.getBarangayList}
                className="custom-box"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Municipality/City*"
                  />
                )}
            />
            {this.state.selectedCity ? (
                  <>
                  <p className="text-left fw-500" style={{marginLeft:"0px"}}>Barangay  <span style={{ color: 'red' }}>*</span></p>
                  <Autocomplete
                      name={this.state.barangayId}
                      placeholder="Barangay*"
                      key={this.state.barangayId}
                      options={this.state.barangay}
                      getOptionValue={x => x.value}
                      getOptionLabel={x => x.label}
                      onChange={this.setBarangay}
                      className="custom-box"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Barangay*"
                        />
                      )}
                  />
                  </>)
            : (
              <>
              <p className="text-left fw-500" style={{marginLeft:"0px"}}>Barangay  <span style={{ color: 'red' }}>*</span></p>
              <Autocomplete
                  name={this.state.barangayId}
                  placeholder="Barangay*"
                  key={this.state.barangayId}
                  options={[ {"label": "Select", "value": "-" }]}
                  getOptionValue={x => x.value}
                  getOptionLabel={x => x.label}
                  className="custom-box"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Barangay*"
                    />
                  )}
              />
              </>) }
            </>
            )
           } 
           //else {
            // if(!this.state.barangay)
            // this.state.barangay = autocompleteData

            //   return (
            //     <Autocomplete
            //     name={element.trackedEntityAttribute.id}
            //     placeholder="Barangay*"
            //     key={element.trackedEntityAttribute.id}
            //      options={this.state.barangay != null ? this.state.barangay : [ {"label": "Select", "value": "-" }]}
            //     getOptionValue={x => x.value}
            //     getOptionLabel={x => x.label}
            //     className="custom-box"
            //     renderInput={(params) => (
            //       <TextField
            //         {...params}
            //         placeholder="Barangay*"
            //             />
            //           )}
            //       />
            //       )
           //}            
  }

  getCoordinateType(element) {
    var that = this;
    // navigator.geolocation.getCurrentPosition(function(position) {   

    //   that.setState({coords:position.coords.latitude.toFixed(2)+","+position.coords.longitude.toFixed(2)})
    // })

    return (
      <TextField
        type="text"
        value={that.state.coords}
        name={element.trackedEntityAttribute.id}
        disabled={true}
      />
    );
  }

  getDropDownType(element) {
    let options = Object.keys(element.optionMap);

    return (
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={this.state.selecval}
        onChange={this.handleselectChange}
        name={element.trackedEntityAttribute.id}
      >
        {
          options.map((o, i) => {
            return <MenuItem value={o}>{element.optionMap[o]}</MenuItem>
          })
        }
      </Select>
    )
  }

  getDateType(element) {
    return (
      <TextField
        type="date"
        name={element.trackedEntityAttribute.id}
        inputProps={{max:new Date().toLocaleDateString('en-CA')}}
        onChange={(evt) => this.inputChangevent(element.trackedEntityAttribute.displayName, evt.target.value)}
      />
    );
  }

  getTimeType(element) {
    return (
      <TextField
        type="time"
        name={element.trackedEntityAttribute.id}
        onBlur={(evt) => this.inputChangevent(element.displayName, evt.target.value)}
      />
    );
  }

  getSelectType(element) {
    const { t } = this.props;
    var radiobuttons = [];
    let options = Object.values(element.trackedEntityAttribute.optionSet.options);
    options.map((o) => (
          console.log(options,o.code,o.displayName)
        ))
    return <div className="Regselect"><Select
      id="demo-mutiple-name"
      name={element.trackedEntityAttribute.id}
      value={this.state.value}
      input={<Input className="Regiinput" />}
      displayEmpty
      onChange={(evt) => this.inputChangevent(element.trackedEntityAttribute.id, evt.target.value)}
    >
      <MenuItem value="">
        <em style={{ fontStyle: 'normal' }}>{t('Please select an option')}</em>
      </MenuItem>
      {
        options.map((o,i) => (
          <MenuItem key={o} value={options[i].code}>
            {options[i].displayName}
          </MenuItem>
        ))
      }
    </Select></div>

  }
  getRadioType(element) {
    var radiobuttons = [];
    Object.entries(element.optionMap).forEach(entry => {
      const [key, value] = entry;
      radiobuttons.push(
        <FormControlLabel
          key={key}
          id={key}
          value={key}
          control={<Radio name={element.questionId} />}
          label={value}
          onClick={(evt) => this.inputChangevent(element.questionId, evt)}
        />
      );
    })
    return <RadioGroup value={this.state.value} name={element.name}>{radiobuttons}</RadioGroup>;
  }

  // getSelectType(element) {
  //   const { t } = this.props;
  //   var radiobuttons = [];
  //   let options = Object.keys(element.optionMap);
  //   console.log("options::", options)
  //   let valuee = options.map((o) => element.optionMap[o])
  //   let optionss = options.map((o) => (
  //     <MenuItem key={o} value={o}>
  //       {element.optionMap[o]}
  //     </MenuItem>
  //   ))
  //   console.log("valuee::", valuee)
  //   console.log("optionss::", optionss)
  //   return (
  //     <div className="Regselect">
  //       <Select
  //         id="demo-mutiple-name"
  //         name={element.questionId}
  //         value={this.state.value}
  //         input={<Input />}
  //         displayEmpty
  //         onChange={(evt) => this.inputChangevent(element.questionId, evt)}
  //       >
  //         <MenuItem value="">
  //           <em style={{ fontStyle: 'normal' }}>{t("Please select an option")}</em>
  //         </MenuItem>
  //         {
  //           options.map((o) => (
  //             <MenuItem key={o} value={o}>
  //               {element.optionMap[o]}
  //             </MenuItem>
  //           ))
  //         }
  //       </Select>
  //     </div>
  //   )
  // }

  getCheckboxType(element) {
    var radiobuttons = [];
    Object.entries(element.optionMap).forEach(entry => {
      const [key, value] = entry;
      let checked = element.response && element.response.includes(key) ? true : false;
      radiobuttons.push(
        <CheckboxQues
          key={key}
          value={key}
          checkedFalg={checked}
          name={element.questionId}
          label={value}
          element={element}
          inputChangevent={this.inputChangevent}
        >
        </CheckboxQues>
      );
    })
    return <FormGroup>{radiobuttons}</FormGroup>;
  }

  setBarangay = (event, value) =>{
    this.setState({ baragayValue: value.value })
    localStorage.setItem("selfregbarangay",value.value)
    // this.setState({ value: value.value  })
    // this.props.getValue("Barangay", value.value )
    console.log("val ",this.state.barangayId,value.value,this.state.barangay.find((option) => option.value === value.value) ? this.state.barangay.find((option) => option.value === value.value).value : '')
  }

  getBarangayList= (event, value) =>{
    console.log("event ",event,value)
    let autocompleteData = []
    let OUMOptions = []
  OUMOptions = this.props.OUJSON.filter(obj => (obj.level == 4))
   
   OUMOptions = OUMOptions.filter(obj => 
     (obj.id == value.value))
       if(OUMOptions.length > 0) {
      
        OUMOptions[0].children.map(childOptions => {
            const filterChildDetails = this.props.OUJSON.filter(obj => obj.id == childOptions.id && obj.comment == "")
            if(filterChildDetails.length > 0) {
                let obj = {
                    'label': filterChildDetails[0].name,
                    'value': filterChildDetails[0].id,
                }
                autocompleteData.push(obj)
            }
        })
        this.setState({ selectedCity: value.value })
        this.setState({ barangay: autocompleteData })
        localStorage.setItem("selfregcity",value.value)
        // this.setState({ value: value.value  })
        // this.props.getValue("City", value.value )
         //  this.state.barangay = autocompleteData
       }
  }

  render() {
    const { classes } = this.props;
    const { t } = this.props;
    if (this.props.question) {
      return (
        <>
          {this.renderQuestion()}
        </>
      );
    }
    return null;
  }
}

const mapStateToProps = state => {
  let { storeState } = state;
  return {
    templateID: JSON.parse(localStorage.getItem('templateID')) != null ? JSON.parse(localStorage.getItem('templateID')) : storeState.templateID,
    communityuid: storeState.communityId,
    langId: storeState.langId,
  };
}

export default withStyles(useStyles)(connect(mapStateToProps, {})(withTranslation()(Registration)))
//export default withStyles(useStyles)(withTranslation()(Registration));