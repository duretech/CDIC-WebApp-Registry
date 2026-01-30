import React, {Component} from 'react';
import { connect } from "react-redux";
import {
    AssignValueValidation
} from '../../redux/actions/action';
import { apiServices } from '../../services/apiServices';
import Grid from '@material-ui/core/Grid';
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

  import {OUMapping} from '../../assets/data/registerOU'



const getTranslatedLabels = (dataElement) => {
    
    if (localStorage.getItem("locale") == "en") {
      return dataElement.displayName;
    } else if (dataElement.translations && dataElement.translations.length > 0) {
      let label = dataElement.translations.filter(
        (tanslation) =>
          tanslation.property == "NAME" &&
          tanslation.locale == localStorage.getItem("locale")
      );
      if (label.length > 0) {
        return label[0].value;
      } else {
        return dataElement.displayName;
      }
    }
    return dataElement.displayName;
  };

  

function Assign(rules, programRulesVariables, values, fieldId, attribute, filteringRuleWithField) {
    const setingInitialValue = (rules, programRulesVariables, values, fieldId, filteringRuleWithField) => {
        const condition = rules.condition
        let returnOutput
        const preDefinedVariables = ['d2:inOrgUnitGroup'];
        let expression = condition
        let variablesHash = programRulesVariables
        
       
        const splitConditions = condition.split("&&")
        const operators = ['==', '!=']
        let Flag = null
        let val = null
        let assigningValue = null
        let conditionArray = []
        
        
        let assigningValueData = filteringRuleWithField ? filteringRuleWithField[0].data: ""
        if(assigningValueData != undefined && assigningValueData != "") {
            let assignValueNameExtract = assigningValueData.match(/\{(.*?)\}/)[1]
            let assignValueVariableIdFilter = programRulesVariables.filter(obj => obj.displayName == assignValueNameExtract)
            let assignValueVariableId = assignValueVariableIdFilter.length > 0 ? assignValueVariableIdFilter[0].dataElement.id : undefined
    
            splitConditions.map(splitCondition => {
                const variableName = splitCondition.match(/\{(.*?)\}/)[1]
                
                const parentRaw = programRulesVariables.filter(obj => obj.displayName == splitCondition.match(/\{(.*?)\}/)[1]) //[0] .dataElement.id
                
                const parentNameFromFilter = parentRaw.length > 0 ? parentRaw[0].displayName : undefined
    
                
                
                const parentId = parentRaw.length > 0 ? parentRaw[0].dataElement ? parentRaw[0].dataElement.id : parentRaw[0].trackedEntityAttribute ? parentRaw[0].trackedEntityAttribute.id : undefined : undefined
                
                const parentNameFromFilterStart = splitCondition.search(parentNameFromFilter)
                const parentNameLength = parentNameFromFilter ? parentNameFromFilter.length : undefined
        
                const operatorInitLength = parentNameFromFilterStart + parentNameLength + 2
        
                const operator = splitCondition.substring(operatorInitLength, operatorInitLength+2)
                
                const alternateOperatorFinding = operators.map(ops => {
                    
                    if(splitCondition.search(ops) > -1) {
                        
                        const a = {
                            'operator': ops,
                            'operatorLength': splitCondition.search(ops)
                        }
                        return a
                    }
        
                     
                    
                })
                
                const stringLength = splitCondition.length
        
                if(parentNameFromFilter) {
                    
                    const filteredOperator = alternateOperatorFinding.filter(obj => obj != undefined)
                    
                    const conditionValueRaw = filteredOperator.length > 0 ? splitCondition.substring(filteredOperator[0].operatorLength + 3, splitCondition.length) : undefined
                    
                    const removeEmptySpace = conditionValueRaw != undefined ? conditionValueRaw.replace(/\s/g,'') : undefined
                    
                    const conditionValue = removeEmptySpace != undefined ? removeEmptySpace.replace(/['"]+/g, '') : undefined
                    
                    const conditionalOperator = filteredOperator.length > 0 ? filteredOperator[0].operator : undefined
                    
                    
    
                    let revisedValue = null
                    switch(conditionValue) {
                        case ('true') :
                            revisedValue = true
                        break;
    
                        case ('false') :
                            revisedValue = false
                        break;
    
                        default :revisedValue = conditionValue
                    }
    
                    
    
                    let conditionForValidation = null
    
                if(conditionalOperator != undefined) {
                    
                    val = conditionValue
                    switch (conditionalOperator) {
                        case '==' :
                            if(values != undefined) {
                                conditionForValidation = values[parentId] != undefined ?  values[parentId] == revisedValue ? true : false : false
                            }
                            
                            
                        break;
    
                        case '>=' :
                            
                            conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) >= Number(conditionValue) ? false : true : false
                            
                        break;
    
                        case '<=' :
                            
                            conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) <= Number(conditionValue) ? false : true : false
                            
                        break;
    
                        case '<' :
                            
                            conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) < Number(conditionValue) ? false : true : false
                            
                        break;
    
                        case '<' :
                            
                            conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) > Number(conditionValue) ? false : true : false
                            
                        break;
                    }
                    
                    
                } else {
                    if(values != undefined) {
                        conditionForValidation = values[parentId] != undefined ? values[parentId] != '' : false
                    }
                    
                    
                }
                conditionArray.push({
                    'conditionValue': conditionValue,
                    'flag': conditionForValidation,
                    
                })
                
                if(conditionForValidation == false) {
                    Flag = false
                }
    
                    
        
                    
                }
                
            })
    
            if(Flag != false) {
                if(values != undefined) {  
                    values[fieldId] = values[assignValueVariableId] != undefined ? values[assignValueVariableId] : ''
                    this.props.AssignValueValidation(values)
                    
                }
            } else {
                
                delete values[fieldId]
                this.props.AssignValueValidation(values)
               
            }
        } else {
            let textToCheckInRule = ''
            let getOUGroup = JSON.parse(localStorage.getItem('organisationUnitGroups'))
            let OUGroup = getOUGroup != null && getOUGroup.organisationUnitGroups != undefined ? getOUGroup.organisationUnitGroups : []
            let currentOuGroup
            preDefinedVariables.forEach((variables) => {
                if(variables == 'd2:inOrgUnitGroup') {
                    const re = /\((.*)\)/i
                    const textToCheckInRule = expression.match(re)[1].slice(1, -1)
                    currentOuGroup = OUGroup.filter(obj => obj.code == textToCheckInRule)
                    if(currentOuGroup.length > 0) {
                        const apiCallId = currentOuGroup[0].id
                        apiServices.getAPI('organisationUnitGroups/'+apiCallId+'?fields=%3Aall%2CattributeValues%5B%3Aall%2Cattribute%5Bid%2Cname%2CdisplayName%5D%5D%2CorganisationUnits%5Bid%2Cpath%2CdisplayName%5D')
                        .then(filteredOUList => {
                            let autocompleteData = []
                            
                            if(filteredOUList.data.organisationUnits.length > 0) {
                                filteredOUList.data.organisationUnits.map(items => {
                                    let obj = {
                                        'id': items.id , 
                                        'label': items.displayName, 
                                        'value': items.id
                                    }
                                    autocompleteData.push(obj)
                                })
    
                                localStorage.setItem(fieldId, JSON.stringify(autocompleteData))
                                // this.setState({autocomplete: autocompleteData})
                                
                            }
                        })
                    }
                    
                }
            });
            
        }
       
        
    }
// class Assign extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             autocomplete: []
            
//         }
//     }
    
    

    // handleChange = (event, value, currentFieldVal) => {
    //     var self = this;
        
    //     // really this should be this.state.newState or something
    //     // for the sake of keeping it simple i'll leave it as this.state.default
    //     if(value != null ){
            
        
        

    
            
    //             const locationList = []
    //             const obj = {'parentId': currentFieldVal.id,'fieldId': '', 'value': value.value}

    //             const valuesArray = Object.keys(this.props.values)
    //             let findLocalStorageItem = localStorage.getItem('childDropDown')
                
    //             if(findLocalStorageItem == null) {
    //                 let childArray = []
    //                 childArray.push(obj)
    //                 localStorage.setItem('childDropDown', JSON.stringify(childArray))
    //             } else {
    //                 let temp = JSON.parse(localStorage.getItem('childDropDown'))
    //                 const filterStoredData = temp.filter(obj => obj.parentId == currentFieldVal.id)
    //                 if(filterStoredData.length > 0) {
    //                     temp = temp.filter(obj => obj.parentId != currentFieldVal.id)
    //                     temp.push(obj)
    //                     localStorage.setItem('childDropDown', JSON.stringify(temp))
    //                 } else {
    //                     temp.push(obj)
    //                     localStorage.setItem('childDropDown', JSON.stringify(temp))
    //                 }
    //             }
                
                
            
    //     }    
    // };

    
    
        // let attribute = this.props.attribute
        // let rules = this.props.rules
        // let programRulesVariables = this.props.programRulesVariables
        // let values = this.props.values
        // let field = this.props.field
        // let fieldId = this.props.fieldId
        //let filteringRuleWithField = this.props.filteringRuleWithField
        let setInitialValue = setingInitialValue(rules, programRulesVariables, values, fieldId, filteringRuleWithField)
        
        let findFieldsOptions = localStorage.getItem(fieldId)
        let fieldOptions = []
        if(findFieldsOptions != null) {
            fieldOptions = JSON.parse(findFieldsOptions)
        }
        if(fieldOptions.length> 0) {
            
            return fieldOptions
        } else {
            return []
        }
        
    
}    


export default Assign;
// export default Assign