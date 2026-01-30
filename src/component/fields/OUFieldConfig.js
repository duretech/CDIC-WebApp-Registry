import React, {Component} from 'react';
import { connect } from "react-redux";
import { OnChange } from 'react-final-form-listeners'
import _ from 'lodash';
import HideShowCondition from '../validation/HideShowConditionRegistration'
import AssignCondition from '../validation/AssignRegistration'
import ShowErrorRegistration from '../validation/showError/ShowErrorRegistration'

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

const getTranslatedLabels = (attribute) => {
    if(localStorage.getItem("locale") == "en") {
        return attribute.displayName;
    }else if (attribute.translations && attribute.translations.length > 0){
        //debugger;
        let label = attribute.translations.filter(tanslation => tanslation.property == "NAME" && tanslation.locale == localStorage.getItem("locale")) 
        if(label.length > 0){
            return label[0].value;
        }else{
            return attribute.displayName;
        }
    }
    return attribute.displayName;
};
const ValidatorComponent = (
    fieldId,
    attribute,
    values,
    form,
    rules,
    field,
    defaultOption
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
        obj.trackedEntityAttribute ? fieldId == obj.trackedEntityAttribute.id : undefined
      );
  
      if (filteringRuleWithField.length > 0) {
          
        switch (filteringRuleWithField[0].programRuleActionType) {
          case "HIDEFIELD":
            hideShow = HideShowCondition(
              rules,
              programRulesVariables,
              values,
              field,
              fieldId
            );
            break;
  
          case "ASSIGN":
            assign = AssignCondition (
                rules,
                programRulesVariables,
                values,
                field,
                fieldId,
                attribute,
                filteringRuleWithField
            )
            break;
  
          // case 'DISPLAYTEXT':
          //
          //     programRuleActionType = DisplayText(rules, programRulesVariables, values, field, fieldId)
          // break;
  
        //   case "SHOWERROR":
        //     programRuleActionType = ShowErrorRegistration(
        //       rules,
        //       programRulesVariables,
        //       values,
        //       field,
        //       fieldId,
        //       attribute
        //     );
        //     break;
  
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
        // const OUOptions = fetchOUOptions.filter(obj => obj.level == 3)
        // let autocompleteData = []

        // if(OUOptions.length > 0) {
        //     OUOptions.map(items => {
        //         let obj = {
        //             'id': items.id , 
        //             'label': items.displayName, 
        //             'value': items.id
        //         }
        //         autocompleteData.push(obj)
        //     })
        // }

        // this.setState({
        //     regionLocation : autocompleteData,
        //     locations: autocompleteData
        // }) 
    }
      

    handleChange = (event, value, currentFieldVal) => {
        if(currentFieldVal.id == "Kdk1Sfm48Rc"){ //this condition added temprory need to remove
            return;
        }
        let formValues = this.props.values
        let fieldValue = value

        if(formValues[currentFieldVal.id]) {
            formValues[currentFieldVal.id] = fieldValue ? fieldValue.value : ''
        } else {
            formValues[currentFieldVal.id] = fieldValue ? fieldValue.value : ''
        }
        var self = this;
        
        // really this should be this.state.newState or something
        // for the sake of keeping it simple i'll leave it as this.state.default
        if(value != null ){
            self.setState({ 
                default: value.value
            });
        
        

            
            // if(self.props && self.props.getChildDropdownOption) {
                const locationList = []
                let OUMappingList = OUMapping(formValues)
                
                const obj = {'parentId': currentFieldVal.id,'fieldId': OUMappingList[currentFieldVal.id].child, 'value': value.value}

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
                
                
            // }
        }    
    };

    render() {
        if(this.props.data) {
            
        }
        let attribute = this.props.data
        let OUMappingList = OUMapping(this.props.values)
        
        //const defaultValue = this.state.regionLocation.find(o => o.value == this.props.values[attribute.trackedEntityAttribute.id]);

        

        const autocompleteData = 
        //this.state.regionLocation

            this.props.options 
        ? 
            this.props.options
        : 
        OUMappingList[attribute.trackedEntityAttribute.id] ?
        OUMappingList[attribute.trackedEntityAttribute.id].type ? 
                    this.state.regionLocation ?
                        this.state.regionLocation 
                    : []
                : [] 
            : []

        let field = <> </>

        let a = ValidatorComponent(attribute.trackedEntityAttribute.id,attribute,this.props.values,this.props.form,this.props.rules, field, this.props.defaultOption)

        return (
            <Grid item xs={12} sm={4} md={4} className={a.hideShow == true ? '' : 'hide'}>
                
                <Autocomplete
                    name={attribute.trackedEntityAttribute.id}
                    label={getTranslatedLabels(attribute.trackedEntityAttribute)}
                    options={a.assign && a.assign.length>0 ? a.assign : autocompleteData}
                    // values={''}
                    // getOptionSelected={(option, value) => option.id === value.id}
                    defaultValue={this.props.defaultOption != undefined ? this.props.defaultOption : {}}
                    getOptionValue={x => x.value}
                    getOptionLabel={x => x.label}
                    onChange={(event,value) => this.handleChange(event,value,attribute.trackedEntityAttribute)}
                    className={this.props.customClassName}
                />

            </Grid>
        )
    }
}
export default connect(null, {getChildDropdownOption})(OUStageFieldConfig);

//export default OUFieldConfig ;