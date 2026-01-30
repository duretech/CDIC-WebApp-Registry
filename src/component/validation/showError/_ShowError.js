import React, {Component} from 'react'
import isDefined from 'd2-utilizr/lib/isDefined';

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
    //console.log('123',attribute);
    if(localStorage.getItem("locale") == "en") {
        return attribute.displayName;
    }else if (attribute.translations && attribute.translations.length > 0){
        //debugger;
        let label = attribute.translations.filter(tanslation => tanslation.property == "NAME" && tanslation.locale == localStorage.getItem("locale")) 
        if(label.length > 0){
            //console.log("130",attribute);
            //console.log('132',label)
            return label[0].value;
        }else{
            return attribute.displayName;
        }
    }
    return attribute.displayName;
};
function ShowError(rules, programRulesVariables, values, field, fieldId, attribute) {
    
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

    let dhisVariableToFind = ['!d2:validatePattern'];
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

    if(validationRegex != undefined) {
        
        const reg = /^[a-zA-Z]*$/
        const required = value =>  (attribute.mandatory ? value ? undefined : 'Required' : undefined)
        
        const matchRegex = value => (validationRegex != undefined ? validationRegex.test(value) ? undefined : rules.description : undefined)

        const composeValidators = (...validators) => value =>
        validators.reduce((error, validator) => error || validator(value), undefined)

        returnOutput = <Grid item xs={12} sm={4}> <Field
            name={attribute.dataElement.id}
            label={getTranslatedLabels(attribute.dataElement)}
            type={attribute.dataElement.valueType}
            component={InputFieldFF}
            key={attribute.dataElement.id}
            required = {attribute.mandatory ? true: false}
            validate= {composeValidators(required, matchRegex)}
            value=''
            /></Grid>
    } else {
        
        splitConditions.map(splitCondition => {
            const variableName = splitCondition.match(/\{(.*?)\}/)[1]
            
            const parentRaw = programRulesVariables.filter(obj => obj.displayName == splitCondition.match(/\{(.*?)\}/)[1]) //[0] .dataElement.id
            const parentNameFromFilter = parentRaw.length > 0 ? parentRaw[0].displayName : undefined        
            parentId = parentRaw.length > 0 ? parentRaw[0].dataElement ? parentRaw[0].dataElement.id : parentRaw[0].dataElement ? parentRaw[0].dataElement.id : undefined : undefined
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
                
                conditionValue = removeEmptySpace != undefined ? removeEmptySpace.substring(1, removeEmptySpace.length-1) : undefined
                
                const conditionalOperator = filteredOperator.length > 0 ? filteredOperator[0].operator : undefined
                
                
                let conditionForValidation = null
                
               
                if(conditionalOperator != undefined) {
                    
                    val = conditionValue
                    
                    switch (conditionalOperator) {
                        case '==' :
                            if(values != undefined) {
                                
                                const matchRegex = value => (value != undefined ? value == conditionValue ? rules.description : '' : "") 

                                const composeValidators = (...validators) => value =>
                                validators.reduce((error, validator) => error || validator(value), undefined)

                                    returnOutput = <Grid item xs={12} sm={4}> <Field
                                    name={attribute.dataElement.id}
                                    label={getTranslatedLabels(attribute.dataElement)}
                                    type={attribute.dataElement.valueType}
                                    component={InputFieldFF}
                                    key={attribute.dataElement.id}
                                    required = {attribute.mandatory ? true: false}
                                    validate= {composeValidators(matchRegex)}
                                    value=''
                                    /></Grid>
                                
                                // conditionForValidation = values[parentId] != undefined && values ?  values[parentId] == conditionValue ? false : true : false
                            }
                            
                            
                        break;
    
                        case '>=' :
                            const matchRegex1 = value => (value != undefined ? value >= conditionValue ? rules.description : '' : "") 

                            const composeValidators1 = (...validators) => value =>
                            validators.reduce((error, validator) => error || validator(value), undefined)
                            
                                

                                returnOutput = <Grid item xs={12} sm={4}> <Field
                                name={attribute.dataElement.id}
                                label={getTranslatedLabels(attribute.dataElement)}
                                type={attribute.dataElement.valueType}
                                component={InputFieldFF}
                                key={attribute.dataElement.id}
                                required = {attribute.mandatory ? true: false}
                                validate= {composeValidators1(matchRegex1)}
                                value=''
                                /></Grid>

                            
                            // conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) >= Number(conditionValue) ? false : true : false
                            
                        break;
    
                        case '<=' :
                            const matchRegex2 = value => (value != undefined ? value <= conditionValue ? rules.description : '' : "") 

                            const composeValidators2 = (...validators) => value =>
                            validators.reduce((error, validator) => error || validator(value), undefined)

                            returnOutput = <Grid item xs={12} sm={4}> <Field
                                name={attribute.dataElement.id}
                                label={getTranslatedLabels(attribute.dataElement)}
                                type={attribute.dataElement.valueType}
                                component={InputFieldFF}
                                key={attribute.dataElement.id}
                                required = {attribute.mandatory ? true: false}
                                validate= {composeValidators2(matchRegex2)}
                                value=''
                                /></Grid>
                            // conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) <= Number(conditionValue) ? false : true : false
                            
                        break;
    
                        case '<' :
                            const matchRegex3 = value => (value != undefined ? value < conditionValue ? rules.description : '' : "") 

                            const composeValidators3 = (...validators) => value =>
                            validators.reduce((error, validator) => error || validator(value), undefined)

                            returnOutput = <Grid item xs={12} sm={4}> <Field
                                name={attribute.dataElement.id}
                                label={getTranslatedLabels(attribute.dataElement)}
                                type={attribute.dataElement.valueType}
                                component={InputFieldFF}
                                key={attribute.dataElement.id}
                                required = {attribute.mandatory ? true: false}
                                validate= {composeValidators3(matchRegex3)}
                                value=''
                                /></Grid>
                            
                            // conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) < Number(conditionValue) ? false : true : false
                            
                        break;
    
                        case '>' :
                            const matchRegex4 = value => (value != undefined ? value > conditionValue ? rules.description : '' : "") 

                            const composeValidators4 = (...validators) => value =>
                            validators.reduce((error, validator) => error || validator(value), undefined)

                            returnOutput = <Grid item xs={12} sm={4}> <Field
                                name={attribute.dataElement.id}
                                label={getTranslatedLabels(attribute.dataElement)}
                                type={attribute.dataElement.valueType}
                                component={InputFieldFF}
                                key={attribute.dataElement.id}
                                required = {attribute.mandatory ? true: false}
                                validate= {composeValidators4(matchRegex4)}
                                value=''
                                /></Grid>
                            // conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) > Number(conditionValue) ? false : true : false
                            
                        break;
                    }
                    
                    
                } else {
                    if(values != undefined) {
                        conditionForValidation = values[parentId] != undefined && values ? values[parentId] != '' : false
                        showNoError = true
                    } else {
                        showNoError = false
                    }
                    
                    
                }
                
                if(conditionForValidation == false) {
                    Flag = false
                }
                
            }
            
        })
        
            
        
    }

    
    
    return returnOutput


}

export default ShowError