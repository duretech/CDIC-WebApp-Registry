import React, {Component} from 'react'

import {
    Button, 
    ButtonStrip, 
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm,
    SwitchFieldFF,
    hasValue,
    TextAreaFieldFF,
    composeValidators,
    dhis2Username
} from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';

const {Form, Field, FormSpy } = ReactFinalForm
// import Operator from '../validation/Operator'
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
function ShowErrorRegistration(rules, programRulesVariables, values, fieldId, attribute) {
    
    let validationRegex = undefined
    let returnOutput = null
    const condition = rules.condition
    const splitConditions = condition.split("&&")
    const conditionalSigns = ['&&', '||']

    const operators = ['==', '!=', '>=', '<=']
    let Flag = null
    let showNoError = false
    let val = null
    let parentId
    let conditionValue
    let conditionArray = []
    
    
    let expression = condition
    let variablesHash = programRulesVariables

    let dhisVariableToFind = ['!d2:validatePattern','d2:length'];
    dhisVariableToFind.forEach((funcName) => {
        const rex = new RegExp(`${funcName}\\( *([A#CV]\\{[\\w -_.]+})( *, *(([\\d/\\*\\+\\-%. ]+)|[^']*))* *\\)`, 'g');
        const callsToThisFunction = expression.match(rex);
        
        const matchConditionString = callsToThisFunction != null ? callsToThisFunction[0].match(/\((.*?)\)/) : undefined
        
        const splitCondition = matchConditionString != undefined ? matchConditionString[1].split(',') : undefined
        
        if(splitCondition != undefined) {
            validationRegex = new RegExp(splitCondition[1])



        }
    })
    
    //returnOutput
    splitConditions.map(splitCondition => {
        
        const variableName = splitCondition.match(/\{(.*?)\}/)[1]
        
        const parentRaw = programRulesVariables.filter(obj => obj.displayName == splitCondition.match(/\{(.*?)\}/)[1]) //[0] .trackedEntityAttribute.id
        const parentNameFromFilter = parentRaw.length > 0 ? parentRaw[0].displayName : undefined        
        const parentId = parentRaw.length > 0 ? parentRaw[0].trackedEntityAttribute ? parentRaw[0].trackedEntityAttribute.id : parentRaw[0].dataElement ? parentRaw[0].dataElement.id : undefined : undefined
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
            
            const removeEmptySpace = 
                conditionValueRaw != undefined 
            ?   
                    conditionValueRaw.substring(conditionValueRaw.length - 1, conditionValueRaw.length) == ' '
                ?   
                conditionValueRaw.substring(0, conditionValueRaw.length - 1)
                :
                conditionValueRaw
            : 
                undefined
            
            const conditionValue = removeEmptySpace != undefined ? removeEmptySpace.substring(1, removeEmptySpace.length-1) ? removeEmptySpace.substring(1, removeEmptySpace.length-1) :  removeEmptySpace : undefined
            
            const conditionalOperator = filteredOperator.length > 0 ? filteredOperator[0].operator : undefined
            
            let conditionForValidation = false;
            
            if(conditionalOperator != undefined) {
                
                val = conditionValue
                let lengthCondition = splitCondition != null ? splitCondition.split('(') : undefined
                switch (conditionalOperator) {
                    case '==' :
                        if(values != undefined) {
                            if(lengthCondition && (lengthCondition.includes("d2:length") || lengthCondition.includes(" d2:length"))){
                                conditionForValidation = values[parentId] != undefined && values ?  String(values[parentId]) == String(conditionValue) ? false : true : false
                                return Flag = conditionForValidation
                            }
                        }
                        
                        
                    break;

                    case '>=' :
                        if(lengthCondition && (lengthCondition.includes("d2:length") || lengthCondition.includes(" d2:length"))){
                            conditionForValidation = values[parentId] != undefined ?  values[parentId].length >= Number(conditionValue) ? false : true : false
                            
                            return Flag = conditionForValidation
                            
                        }else{
                            conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) >= Number(conditionValue) ? true : false : false
                            
                        }
                        
                        
                    break;

                    case '<=' :                            
                        if(lengthCondition && (lengthCondition.includes("d2:length") || lengthCondition.includes(" d2:length"))){
                            conditionForValidation = values[parentId] != undefined ?  values[parentId].length <= Number(conditionValue) ? false : true : false
                            
                            return Flag = conditionForValidation
                        }else{
                            
                        }
                    break;

                    case '<' :
                        if(lengthCondition && (lengthCondition.includes("d2:length") || lengthCondition.includes(" d2:length"))){
                            conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) < Number(conditionValue) ? false : true : false
                            return Flag = conditionForValidation
                        }
                        
                    break;

                    case '>' :
                        if(lengthCondition && (lengthCondition.includes("d2:length") || lengthCondition.includes(" d2:length"))){
                            conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) > Number(conditionValue) ? false : true : false
                            return Flag = conditionForValidation
                        }
                        
                    break;
                }
                
                
            } else {
                /*if(values != undefined) {
                    conditionForValidation = values[parentId] != undefined && values ? values[parentId] != '' : false
                }*/
                
                
            }
            /*conditionArray.push({
                'conditionValue': conditionValue,
                'flag': conditionForValidation,
                
            })*/
            
            if(conditionForValidation == false) {
                Flag = false
            }
        }
        
    })

    if(Flag != false) {
        let erorrMsg = true;
        if(rules.programRuleActions){
            rules.programRuleActions.map(condition=>{
                if(condition.programRuleActionType == "SHOWERROR"){
                    erorrMsg = condition.content
                }
            })
        }
        return erorrMsg;
    } else {
        
        return false
    }
    

}

export default ShowErrorRegistration