import React, {Component} from 'react'



function HideShowCondition(rules, programRulesVariables, values, dataElementGroup, field) {
    
    const condition = rules.condition
    
    const splitConditions = condition.split("&&")
    const conditionalSigns = ['&&', '||']
    
    
    let expression = condition
    let variablesHash = programRulesVariables
    const avoidReplacementFunctions = ['d2:hasValue', 'd2:lastEventDate', 'd2:count', 'd2:countIfZeroPos', 'd2:countIfValue'];

    const operators = ['==', '!=', '>=', '<=']
    let Flag = null
    let otherField = true
    let showCheckBoxChild = null
    let val = null
    let conditionArray = []

    splitConditions.map(splitCondition => {
        let parentIsCheckBox = false
        const variableName = splitCondition.match(/\{(.*?)\}/)[1]
        // console.log(programRulesVariables,splitCondition.match(/\{(.*?)\}/)[1],"splitCondition")
        const parentRaw = programRulesVariables.filter(obj => {
            if(obj.displayName.includes("_"))
                return obj.displayName == (splitCondition.match(/\{(.*?)\}/)[1])
            // return obj.displayName.split("_")[1] == (splitCondition.match(/\{(.*?)\}/)[1]).split("_")[1]
            else
            return obj.displayName == splitCondition.match(/\{(.*?)\}/)[1]
            }) //[0] .dataElement.id
        const parentNameFromFilter = parentRaw.length > 0 ? parentRaw[0].displayName : undefined
        // const parentNameFromFilter = parentRaw.length > 0 ? (parentRaw[0].displayName.includes("_") ? parentRaw[0].displayName.split("_")[1] : parentRaw[0].displayName) : undefined
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
                    if(dataElementGroup){
                        dataElementGroup.map(DEG => {
                            let DEGarray = DEG.dataElements
                            let findParentInDEG = DEGarray.find(obj => obj.id == parentId)
                            if(findParentInDEG != undefined) {
                                parentIsCheckBox = true
                                otherField = false
                            }
                        })
                    }
                    
                
                
                
                switch (conditionalOperator) {
                    case '==' :
                        
                        conditionForValidation = values[parentId] != undefined ?  String(values[parentId]) == String(conditionValue) ? false : true : false
                        
                    break;

                    case '!=' :
                        
                    conditionForValidation = values[parentId] != undefined ?  String(values[parentId]) != String(conditionValue) ? false : true : false
                    
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
                
                conditionForValidation = values[parentId] != ''
            }
            conditionArray.push({
                'conditionValue': conditionValue,
                'flag': conditionForValidation,
                
            })

            if(parentIsCheckBox == true) {
                if(conditionForValidation == true) {
                    Flag = true 
                    showCheckBoxChild = true
                    otherField = false
                }
            }

            if( parentIsCheckBox == false) {
                if(conditionForValidation == false) {
                    Flag = false
                   
                }
            }
            
            // if(conditionForValidation == false && parentIsCheckBox == false) {
            //     Flag = false
            //     otherField = true
            // } else {
            //     otherField = true
            //     if(parentIsCheckBox == true && conditionForValidation == true) {
            //         Flag = true
            //         showCheckBoxChild = true
            //         otherField = false
            //     }
            // }
            
            
        }
        
    })
    

    if(showCheckBoxChild == false && otherField == false) {
        return false
    }

    if(showCheckBoxChild == null && otherField == false) {
        return false 
    }

    if(showCheckBoxChild == true && otherField == false) {
        return true
    }

    if(showCheckBoxChild == null && otherField == true && Flag == true) {
        return true 
    }

    if(showCheckBoxChild == null && otherField == true && Flag == null) {
        return true 
    }

    if(showCheckBoxChild == null && otherField == true && Flag == false) {
        return false 
    }





    // if(Flag != false) {
        
    //     return true
       
        
    // } else {
    //     return false
    // }
}

export default HideShowCondition


// avoidReplacementFunctions.forEach((funcName) => {
    //     const rex = new RegExp(`${funcName}\\( *([A#CV]\\{[\\w -_.]+})( *, *(([\\d/\\*\\+\\-%. ]+)|'[^']*'))* *\\)`, 'g');
    //     
    //     const callsToThisFunction = expression.match(rex);

    //     

    //     if (Array.isArray(callsToThisFunction)) {
    //         callsToThisFunction
    //             .filter(call => call.includes(funcName))
    //             .forEach((call) => {
    //                 const newCall = call
    //                     .replace('#{', "'")
    //                     .replace('A{', "'")
    //                     .replace('C{', "'")
    //                     .replace('V{', "'")
    //                     .replace('}', "'");
    //                 expression = expression.replace(call, newCall);
    //             });
    //     }
    // });

    // if (expression.indexOf('{') !== -1) {
    //     // Find every variable name in the expression;
    //     const variablesPresent = expression.match(/[A#CV]\{[\w -_.]+}/g);
    //     // Replace each matched variable:
    //     variablesPresent && variablesPresent.forEach((variablePresent) => {
    //         // First strip away any prefix and postfix signs from the variable name:
    //         variablePresent = variablePresent
    //             .replace('#{', '')
    //             .replace('A{', '')
    //             .replace('C{', '')
    //             .replace('V{', '')
    //             .replace('}', '');

    //         if (isDefined(variablesHash[variablePresent])) {
    //             // Replace all occurrences of the variable name(hence using regex replacement):
    //             expression = expression
    //                 .replace(
    //                     new RegExp(`${variablesHash[variablePresent].variablePrefix}\\{${variablePresent}\\}`, 'g'),
    //                     variablesHash[variablePresent].variableValue,
    //                 );
    //         } else {
    //             
    //         }
    //         
    //     });
    // }