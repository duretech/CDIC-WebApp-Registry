import React, {useState,useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Customcasescard from './NewThemeCustomcasescard.js';
import {useTranslation } from 'react-i18next';
import '../../assets/css/customstyles.css'


export default function CaseList(res) {
    const {t} = useTranslation()
    const [searchHeader] = useState(res.searchResult[0])
    //const [searchResultNew] = useState(res.searchResult[1])
    const [searchResultNew,setSearchResultNew] = useState([])
    useEffect(()=>{
        setSearchResultNew(res.searchResult[1])
    },[])

    const [expanded2, setExpanded2] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded2(isExpanded ? panel : false);
    };
    
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