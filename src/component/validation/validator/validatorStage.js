import React, { Component, useState, useEffect } from 'react'
import HideShowCondition from '../HideShowCondition'
import AssignCondition from '../Assign'

function Validator(fieldId, fieldData, values, programRules, programRulesVariables, dataElementGroup) {
    

    let filteringRuleWithField = null
    let hideShow = true
    let assign

    programRules.map(rules => {
        filteringRuleWithField = rules.programRuleActions.filter(obj => obj.dataElement ? fieldId == obj.dataElement.id : undefined)
        if (filteringRuleWithField.length > 0) { 
            switch (filteringRuleWithField[0].programRuleActionType) {
                case 'HIDEFIELD':
                    
                    hideShow = HideShowCondition(rules, programRulesVariables, values,dataElementGroup)
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
            }
        }
    })

    return ({
        'hideShow': hideShow,
        'assign': assign
    })
}

export default Validator