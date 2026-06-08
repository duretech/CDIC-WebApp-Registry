import React, {Component} from 'react'

import Grid from '@material-ui/core/Grid';

function HideShowConditionRegistration(rules, programRulesVariables, values, field,fieldData) {
    const condition = rules.condition
    const splitConditions = condition.split("&&")
    

    const operators = ['==', '!=']
    let Flag = null
    let val = null
    let conditionArray = []
    
    splitConditions.map(splitCondition => {
        
        const variableName = splitCondition.match(/\{(.*?)\}/)[1]
        
        let parentRaw = programRulesVariables.filter(obj => {
            if(obj.displayName.includes("_"))
            return obj.displayName.split("_")[1] == (splitCondition.match(/\{(.*?)\}/)[1]).split("_")[1]
            else
            return obj.displayName == splitCondition.match(/\{(.*?)\}/)[1]
            // obj.displayName == splitCondition.match(/\{(.*?)\}/)[1]
        }) //[0] .trackedEntityAttribute.id
        try{
            if(parentRaw.length > 1 && variableName && parentRaw.filter(ele => ele.displayName == variableName)?.length > 0){
                parentRaw = parentRaw.filter(ele => ele.displayName == variableName)
            }
        }catch(e){ console.log(e)}
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
            
            const conditionValue = removeEmptySpace != undefined ? removeEmptySpace.substring(1, removeEmptySpace.length-1) : undefined
            
            const conditionalOperator = filteredOperator.length > 0 ? filteredOperator[0].operator : undefined
            
            let conditionForValidation = null
            
            if(conditionalOperator != undefined) {
                
                val = conditionValue
                switch (conditionalOperator) {
                    case '==' :
                        if(values != undefined) {
                            
                            conditionForValidation = values[parentId] != undefined && values ?  String(values[parentId]) == String(conditionValue) ? false : true : false
                        }
                        
                        
                    break;

                    case '!=' :
                        if(values != undefined) {
                            
                            conditionForValidation = values[parentId] != undefined && values ?  String(values[parentId]) != String(conditionValue) ? false : true : false
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

                    case '>' :
                        
                        conditionForValidation = values[parentId] != undefined ?  Number(values[parentId]) > Number(conditionValue) ? false : true : false
                        
                    break;
                }
                
                
            } else {
                if(values != undefined) {
                    conditionForValidation = values[parentId] != undefined && values ? values[parentId] != '' : false
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
        return true
    } else {
        return false
    }
}

export default HideShowConditionRegistration