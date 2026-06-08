import React, { Component, useState, useEffect } from 'react'
import HideShowCondition from '../HideShowConditionRegistration'
import AssignCondition from '../AssignRegistration'
import ShowErrorRegistration from '../showError/ShowErrorRegistration'


function Validator(fieldId, fieldData, values, programRules, programRulesVariables) {

    let filteringRuleWithField = null
    let hideShow = true
    let assign    
    let showError

    programRules.map(rules => {
        filteringRuleWithField = rules.programRuleActions.filter(obj => obj.trackedEntityAttribute ? fieldId == obj.trackedEntityAttribute.id : undefined)
        
        if (filteringRuleWithField.length > 0) { 
            switch (filteringRuleWithField[0].programRuleActionType) {
                case 'HIDEFIELD':
                    hideShow = HideShowCondition(rules, programRulesVariables, values,fieldId, fieldData)
                    break;

                case 'ASSIGN':
                    assign = AssignCondition(
                        rules,
                        programRulesVariables,
                        values,
                        fieldId,
                        fieldData,
                        filteringRuleWithField
                    );
                    
                    break;
                case 'SHOWERROR':
                    showError = ShowErrorRegistration(rules, programRulesVariables, values, fieldId, fieldData)
                break;
            }
        }
    })
    return ({
        'hideShow': hideShow,
        'assign': assign,        
        'showError': showError
    })
}

export default Validator