import React, {Component} from 'react';
import { connect } from "react-redux";
import { OnChange } from 'react-final-form-listeners'

import HideShowCondition from "../validation/HideShowCondition";

import AssignCondition from "../validation/Assign";

import ShowError from "../validation/showError/ShowError";

import {
    Button, 
    ButtonStrip, 
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm,
    SwitchFieldFF,
    hasValue
} from '@dhis2/ui';

import {
    TextField,
    Checkboxes,
    Radios,
    Select,
    TimePicker,
    Switches,
    KeyboardDatePicker,
    DatePicker,
    
    Autocomplete,
    
  } from 'mui-rff';

  import Grid from '@material-ui/core/Grid';

  import { Checkbox as MuiCheckbox } from '@material-ui/core';
import {
    getChildDropdownOption
} from '../../redux/actions/action';

import {apiServices} from '../../services/apiServices'
import OUMapping from '../../assets/data/registerOU'

const {Form, Field, FormSpy } = ReactFinalForm
const ValidatorComponent = (
    fieldId,
    attribute,
    values,
    form,
    rules,
    field,
    defaultOption,
    dataElementGroup
  ) => {
    let programRules = rules.programRule;
    let programRulesVariables = rules.programRuleVariable;
  
    let filteringRuleWithField = null;
    let Flag = null;
    let val = null;
    let conditionArray = [];
    let programRuleActionType = null;
    let hideShow 
    let assign
    programRules.map((rules) => {
      filteringRuleWithField = rules.programRuleActions.filter((obj) =>
        obj.dataElement ? fieldId == obj.dataElement.id : undefined
      );
  
      if (filteringRuleWithField.length > 0) {
        switch (filteringRuleWithField[0].programRuleActionType) {
          case "HIDEFIELD":
            hideShow = HideShowCondition(
              rules,
              programRulesVariables,
              values,
              dataElementGroup,
              fieldId,
              
            );
            break;
  
          case "ASSIGN":
            assign = AssignCondition(
              rules,
              programRulesVariables,
              values,
              fieldId,
              attribute,
              filteringRuleWithField
                // fieldId={fieldId}
                // rules={rules}
                // attribute={attribute}
                // programRulesVariables={programRulesVariables}
                // values={values}
                // field={field}
                // filteringRuleWithField={filteringRuleWithField}
                // defaultOption={defaultOption}
              
            );
            break;
  
          // case 'DISPLAYTEXT':
          //
          //     programRuleActionType = DisplayText(rules, programRulesVariables, values, field, fieldId)
          // break;
  
          case "SHOWERROR":
            programRuleActionType = ShowError(
              rules,
              programRulesVariables,
              values,
              field,
              fieldId,
              attribute
            );
            break;
  
          // case 'HIDEOPTION':
          //     programRuleActionType = HideStageFieldsOptions(rules, programRulesVariables, values, field, fieldId, attribute)
          // break;
        }
      }
    });
    
    return ({
      'hideShow': hideShow == undefined || hideShow  ? true : false,
      'assign': assign
    })
  };

  const getTranslatedLabels = (dataElement) => {
    if (localStorage.getItem("locale") == "en") {
      return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
  } else if (dataElement.translations && dataElement.translations.length > 0) {
      let label = dataElement.translations.filter(
          (tanslation) =>
              tanslation.property == "NAME" &&
              tanslation.locale == localStorage.getItem("locale")
      );
      if (label.length > 0) {
          return label[0].value;
      } else {
          return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
      }
  }
  return dataElement.formName ? dataElement.formName : dataElement.displayName ? dataElement.displayName : dataElement.description;
  };

class OUStageFieldConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            regionLocation: [],
            locations: []
        };
    }

    

    componentDidMount() {
        
      // const fetchOUOptions = this.props.programData.organisationUnits || []
      //   const OUOptions = fetchOUOptions.filter(obj => obj.level == 3)
      //   let autocompleteData = []

      //   if(OUOptions.length > 0) {
      //       OUOptions.map(items => {
      //           let obj = {
      //               'id': items.id , 
      //               'label': items.displayName, 
      //               'value': items.id
      //           }
      //           autocompleteData.push(obj)
      //       })
      //   }

      //   this.setState({
      //       regionLocation : autocompleteData,
      //       locations: autocompleteData
      //   }) 

        // apiServices.getAPI('organisationUnits/'+ 'F5jEGSZiKNe' +'?paging=false&fields=children[id,displayName,children::isNotEmpty,path]')
        // .then(OUResponse => { 
        //     const locationList = []
        //     OUResponse.data.children.map(locations => {
        //         let obj = {
        //             'id': locations.id , 
        //             'label': locations.displayName, 
        //             'value': locations.id
        //         }
        //         locationList.push(obj)
        //     })
        //     this.setState({
        //         regionLocation : locationList
        //     }) 
        // })
    }
      

    handleChange = (event, value, currentFieldVal) => {
       
        if(currentFieldVal.id == "WlF4ogImXAx" || currentFieldVal.id == "cRuxx0UEunD"){ //this condition added temprory need to remove
            return;
        }
        var self = this;

        let formValues = this.props.values
        let fieldValue = value
        if(formValues[currentFieldVal.id]) {
          formValues[currentFieldVal.id] = fieldValue ? fieldValue.value : ''
      } else {
          formValues[currentFieldVal.id] = fieldValue ? fieldValue.value : ''
      }
        
        // really this should be this.state.newState or something
        // for the sake of keeping it simple i'll leave it as this.state.default
        if(value != null ){
            self.setState({ 
                default: value.value
            });
        
        

    
            //if(self.props && self.props.getChildDropdownOption) {
                const locationList = []
                let OUMappingList = OUMapping(formValues)
                const obj = {'parentId': currentFieldVal.id,'fieldId': OUMappingList[currentFieldVal.id] ? OUMappingList[currentFieldVal.id].child : "", 'value': value.value}

                const valuesArray = Object.keys(this.props.values)
                let findLocalStorageItem = localStorage.getItem('childDropDown')
                
                if(findLocalStorageItem == null) {
                    let childArray = []
                    childArray.push(obj)
                    localStorage.setItem('childDropDown', JSON.stringify(childArray))
                } else {
                    let temp = JSON.parse(localStorage.getItem('childDropDown'))
                    const filterStoredData = temp.filter(obj => obj.parentId == currentFieldVal.id)
                    if(filterStoredData.length > 0) {
                        temp = temp.filter(obj => obj.parentId != currentFieldVal.id)
                        temp.push(obj)
                        localStorage.setItem('childDropDown', JSON.stringify(temp))
                    } else {
                        temp.push(obj)
                        localStorage.setItem('childDropDown', JSON.stringify(temp))
                    }
                }
                
                
            //}
        }    
    };

    render() {
        let attribute = this.props.data
        let OUMappingList = OUMapping(this.props.values)
        const defaultValue = this.state.regionLocation.find(o => o.value == this.props.values[attribute.dataElement.id]);

        

        const autocompleteData =
            this.props.options 
        ? 
            this.props.options
        : 
            OUMappingList[attribute.dataElement.id] ?
                OUMappingList[attribute.dataElement.id].type ? 
                    this.state.regionLocation ?
                        this.state.regionLocation 
                    : []
                : [] 
            : []

        let field = <Grid item xs={12} sm={4} md={4} >

            <Autocomplete
                name={attribute.dataElement.id}
                label={getTranslatedLabels(attribute.dataElement)}
                options={autocompleteData}
                values={''}
                getOptionSelected={(option, value) => option.id === value.id}
                defaultValue={this.props.defaultOption != undefined ? this.props.defaultOption : {}}
                getOptionValue={x => x.value}
                getOptionLabel={x => x.label}
                onChange={(event,value) => this.handleChange(event,value,attribute.dataElement)}
            />

        </Grid>

        let a = ValidatorComponent(attribute.dataElement.id,attribute,this.props.values,this.props.form,this.props.rules, field, this.props.defaultOption, this.props.dataElementGroup)

        return (
          <Grid item xs={12} sm={4} md={4} className={a.hideShow == true ? '' : 'hide'}>

          <Autocomplete
              name={attribute.dataElement.id}
              label={getTranslatedLabels(attribute.dataElement)}
              options={a.assign && a.assign.length>0 ? a.assign : autocompleteData}
              values={''}
              getOptionSelected={(option, value) => option.id === value.id}
              defaultValue={this.props.defaultOption != undefined ? this.props.defaultOption : {}}
              getOptionValue={x => x.value}
              getOptionLabel={x => x.label}
              onChange={(event,value) => this.handleChange(event,value,attribute.dataElement)}
              className={this.props.customClassName}
          />

      </Grid>
        )
    }
}
export default connect(null, {getChildDropdownOption})(OUStageFieldConfig);

//export default OUFieldConfig ;