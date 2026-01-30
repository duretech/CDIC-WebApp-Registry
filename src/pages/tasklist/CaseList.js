import React, {useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Customcasescard from './Customcasescard.js';
import '../../assets/css/customstyles.css'


export default function CaseList(res) {
    const [searchHeader] = useState(res.searchResult[0])
    const [searchResultNew] = useState(res.searchResult[1])
    
    return (
        <Grid container spacing={3} className="mt-30px mb-30px">
            {(searchResultNew.length > 0) ?searchResultNew.map((row,i) => {
                return (<Customcasescard row={row} searchHeader={searchHeader} key={i} viewType={res.viewType} metaData={res.metaData}></Customcasescard>)
            }): null}
        </Grid> 
    )
}