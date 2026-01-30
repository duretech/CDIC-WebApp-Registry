import React, {Component} from 'react'
import { withTranslation, Trans } from 'react-i18next';
import {
    Button, 
    ButtonStrip, 
    InputFieldFF, 
    SingleSelectFieldFF, 
    ReactFinalForm, 
    hasValue
} from '@dhis2/ui';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';

import CloseIcon from '@material-ui/icons/Close';

import {Checkboxes, CheckboxData} from 'mui-rff';

const {Form, Field } = ReactFinalForm

class ReferalForm extends Component { 
    constructor(props){
        super(props);
        this.state = {
            
        }
        // this.handleChange = this.handleChange.bind(this)
    }

    render () {

        const checkboxData = [
            {label: 'Item 1', value: 'item1'},
            {label: 'Item 2', value: 'item2'}
          ];

        return (
            <>
            <div className="modaloverlay">
                <div className="modalcardholder">
                    <Form
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form className="fullWidth" onSubmit={handleSubmit}>

                                <Checkboxes
                                    label="Check at least one..."
                                    name="best"
                                    required={true}
                                    data={checkboxData}
                                />

                                <div className="buttons">
                                    <Button className="regformsubmitbtn" type="submit" disabled={submitting || pristine}>
                                        Submit
                                    </Button>
                                        
                                    <Button
                                        className="regformsubmitbtn regformresetbtn"
                                        type="button"
                                        onClick={form.reset}
                                        disabled={submitting || pristine}
                                    >
                                        <Trans>Reset</Trans>
                                    </Button>
                                </div>                        
                            </form>
                        
                        )}
                    />
                </div>
            </div>
            </>
        ) 
    }
}


export default ReferalForm