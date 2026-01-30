import React, {Component} from 'react'
// import { useDataQuery } from '@dhis2/app-runtime'
import progarmData from '../../program';
import RegistrationForm from './RegistrationForm'
import StageForm from './StagesForm'

class FormTemplate extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            registrationFieldObject: null,
            stageFieldObject: null
        }
    }
    componentDidMount() {
        
        const RegistrationData = progarmData.programs[0].programTrackedEntityAttributes
        const StageFormData = progarmData.programs[0].programStages
        
        this.setState({
            registrationFieldObject: RegistrationData,
            stageFieldObject: StageFormData
        })
    }

    render() {
        const registrationFormComponent = this.state.registrationFieldObject != null ?
            <> 
                <RegistrationForm 
                    registrationFormObject = {this.state.registrationFieldObject}
                /> 
            </> : <> </>

        const stageFormComponent = this.state.stageFieldObject != null ?
            <> 
                <StageForm 
                    stageFormObject = {this.state.stageFieldObject}
                /> 
            </> : <> </>
        return (
            <>
            {/* {registrationFormComponent} */}
            {stageFormComponent}
            </>

        )
    }

    


   
}

export default FormTemplate;