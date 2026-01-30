import React, { useState, useEffect } from 'react';
import { getOUMapping, checkConfign } from '../../config/validationutils';

export default function OUMapping(props) {
    const validate = checkConfign("OUMapping");
    let OUMappingObject;

    if (validate) {
        OUMappingObject = getOUMapping("OUMapping");
        sessionStorage.removeItem('OUMapping');
        sessionStorage.setItem('OUMapping', JSON.stringify(OUMappingObject));
    } else {
        OUMappingObject = JSON.parse(sessionStorage.getItem('OUMapping'));

        // If data is stored under "settings", adjust the reference
        if (OUMappingObject && OUMappingObject.settings) {
            OUMappingObject = OUMappingObject.settings;
        }
    }
    return OUMappingObject;
}
