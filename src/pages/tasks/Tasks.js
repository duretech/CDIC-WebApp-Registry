import React, { Component } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { apiServices } from '../../services/apiServices'
import {
    //ReactFinalForm,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell
} from '@dhis2/ui';

//const {Form, Field } = ReactFinalForm

class Search extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            allCases: [],
        }
        
    }

    componentDidMount() {

        let orgID = `UuYrI1twhmN`, programID = `nSy7PFqQykt`, 
            searchQuery = ``
        
        let subURL = `trackedEntityInstances/query.json?ou=${orgID}&ouMode=SELECTED&&order=created:descassignedUser=undefined&program=${programID}&pageSize=50&page=1&totalPages=false`
        
        apiServices.getAPI(subURL).then((res => {
           
            
            this.setState({
                allCases: res.rows
            });
                            
        }))

    }
    
    render () {
        return (
            <div style={{paddingLeft:'50px', width:'100%'}}>                
                {
                    this.state.allCases.length > 0 ?
                        <>
                        <h2>COVID Kaya - Cases List</h2>
                        <Table dataTest="dhis2-uicore-table">
                            <TableHead dataTest="dhis2-uicore-tablehead">
                                <TableRowHead dataTest="dhis2-uicore-tablerowhead">
                                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">First name</TableCellHead>
                                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">Last name</TableCellHead>
                                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">Date of Birth</TableCellHead>
                                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">C-House No./Lot/Bldg. Street</TableCellHead>
                                    <TableCellHead dataTest="dhis2-uicore-tablecellhead">Last Updated</TableCellHead>
                                </TableRowHead>
                            </TableHead>
                            <TableBody dataTest="dhis2-uicore-tablebody">
                                {
                                    this.state.allCases.map(row => {
                                        return <TableRow dataTest="dhis2-uicore-tablerow">
                                            <TableCell dataTest="dhis2-uicore-tablecell">{row[8]}</TableCell>
                                            <TableCell dataTest="dhis2-uicore-tablecell">{row[7]}</TableCell>
                                            <TableCell dataTest="dhis2-uicore-tablecell">{row[11]}</TableCell>
                                            <TableCell dataTest="dhis2-uicore-tablecell">{row[16]}</TableCell>
                                            <TableCell dataTest="dhis2-uicore-tablecell">{row[2]}</TableCell>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table></> : null
                }                
                                
            </div>
        )
    }
}

export default Search