import React, {Component} from 'react';

import {apiServices} from '../../services/apiServices'
import Grid from '@material-ui/core/Grid';
import Customcasescard from '../../pages/cases/Customcasescard';
import classes from '../../App.module.css'

class ReferedCase extends Component { 

    constructor(props){
        super(props);
        this.state = {
            referedCaseResponse: null
        }
        
    }

    componentDidMount () {
        const sessionUserBoValue = JSON.parse(sessionStorage.getItem('userBO')) || JSON.parse(localStorage.getItem('userBO'))
        const sessionMetaData = JSON.parse(localStorage.getItem('metaData')) || ''
        const programId = sessionUserBoValue.programs[0]
        const OU = sessionUserBoValue.organisationUnits[0].id
        const program = sessionUserBoValue.programs[0]
        const URL = 'trackedEntityInstances/query.json?ou='+ OU +'&ouMode=SELECTED&&order=created:desc&program='+program+'&programStatus=ACTIVE&eventStatus=SCHEDULE&eventStartDate=2019-05-10&eventEndDate=2022-02-03&assignedUser=&pageSize=50&page=1&totalPages=false'

        // trackedEntityInstances/query.json?ou=M9xpKnQXD0Q&ouMode=SELECTED&&order=created:desc&program=SEr4UhjTJ2c&programStatus=ACTIVE&eventStatus=SCHEDULE&eventStartDate=2020-10-12&eventEndDate=2021-01-20&programStage=ZZcqCX95AmO&assignedUser=&pageSize=50&page=1&totalPages=false
        
        apiServices.getAPIFacility(URL)
        .then(response => {
            this.setState({referedCaseResponse: response.data})
            
        })
    }

    createStructure = () => {
        
        const searchHeader = this.state.referedCaseResponse.headers
        return (
            <section className={classes.mainsection}
                    style={{
                        backgroundColor: '#fff',
                        flexGrow: 1,
                        padding: 20,
                        borderLeft: '1px solid white',
                    }}
            >
                <div className={classes.searchformcontainer}>
                    <p className={classes.searchformheading}>Referred Cases</p>
                    <Grid container spacing={3} className="mt-30px mb-30px">
                        {this.state.referedCaseResponse.rows.map(row => {
                            
                                return (
                                    
                                    <Grid key={row[0][0]} item xs={12} sm={6} md={3}>
                                        <Customcasescard row={row} searchHeader={searchHeader}></Customcasescard>
                                    </Grid>
                                    
                                )
                            
                                
                        })}
                    </Grid>
                                     
                </div>               
            </section>

            
        )
    }

    render () {
        const output = this.state.referedCaseResponse != null ?
            this.createStructure() 
        : <> </>    
        return (
            <> {output} </>
        )
    }
}

export default ReferedCase