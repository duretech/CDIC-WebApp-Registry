import React, { useState, useEffect } from "react";
import OfflineDb from '../../db'

export default function useConfigurations() {
    const [configuration, setConfiguration] = useState(null);
    
    useEffect(async() => {
        let data = await OfflineDb.getDataFromPouchDB('configurations')
        setConfiguration(data.data.configuration)
    },[]);
  
    return configuration;
  }