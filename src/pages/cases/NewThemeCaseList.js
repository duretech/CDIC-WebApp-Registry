import React, {useState,useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Customcasescard from './NewThemeCustomcasescard.js';
import {useTranslation } from 'react-i18next';
import '../../assets/css/customstyles.css'
import { APP_LOCALE } from '../../assets/data/config.js';


export default function CaseList(res) {
    const {t} = useTranslation()
    const [searchHeader] = useState(res.searchResult[0])
    //const [searchResultNew] = useState(res.searchResult[1])
    const [searchResultNew,setSearchResultNew] = useState([])
    useEffect(()=>{
        //If res.searchResult[1] is undefined or null, the state will be set to that undefined or null value.
       // setSearchResultNew(res.searchResult[1])

       //This code uses a ternary operator to check if res.searchResult[1] exists and is truthy. 
       //If it is, it sets the state to res.searchResult[1].
       //This approach is safer when the state is expected to be used as an array in subsequent operations, 
       //as it guarantees that the state will at least be an empty array and not undefined or null, 
       //preventing runtime errors such as trying to access properties or methods of undefined.
       setSearchResultNew(res.searchResult[1]?res.searchResult[1]: [])
    },[])

    const [expanded2, setExpanded2] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded2(isExpanded ? panel : false);
    };

    function convertOutputToInput(outputRow, searchHeader) {
        // create array with same length as searchHeader
        const rowArray = new Array(searchHeader.length).fill("");
        //console.log(outputRow,searchHeader)
        searchHeader.forEach((header, index) => {
            // Check if header.column exists in outputRow
            if (outputRow.hasOwnProperty(header.column)) {
            rowArray[index] = outputRow[header.column];
            }
            // Special case: instanceuid maps to "Instance"
            if (header.column === "Instance" && outputRow.instanceuid) {
            rowArray[index] = outputRow.instanceuid;
            }
        });
        //console.log("rowArray",rowArray)
        return rowArray;
    }
    
    return (
        <Grid container spacing={3} className="">
            {/* {(searchResultNew.length > 0) ? searchResultNew.map((row,i) => {
                return (<Customcasescard row={row} searchHeader={searchHeader} key={i} viewType={res.viewType} metaData={res.metaData}></Customcasescard>)
            }): <span style={{marginLeft:"20px",marginTop:"20px"}}>No data found</span>} */}

            {
            (searchResultNew.length > 0) ? 
                searchResultNew
                    .slice((res.page - 1) * res.itemsPerPage, res.page * res.itemsPerPage)
                    .map((row,i) => {
                        row = APP_LOCALE === "PRODUCT" ? convertOutputToInput(row,searchHeader) : row
                        //console.log("rowN ",row)
                        return <Customcasescard 
                            index={i+"_"+row[0]} row={row} 
                            searchHeader={searchHeader} key={i+"_"+row[0]} 
                            viewType={res.viewType} metaData={res.metaData}
                            expanded={expanded2}
                            handleChange={(panel) => handleChange(panel)}
                        ></Customcasescard>
                    })
            :<span style={{marginLeft:"20px",marginTop:"20px"}}>{t('No data found')}</span>
            }
        </Grid> 
    )
}