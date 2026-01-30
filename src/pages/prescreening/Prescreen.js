import React from 'react';
import {useHistory} from "react-router-dom";
import { useTranslation, Trans } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import OfflineDb from '../../db'
import _ from 'lodash'
import {
    SingleSelectFieldFF, 
    ReactFinalForm,
    FieldGroupFF,
    CheckboxFieldFF
} from '@dhis2/ui';
import swal from 'sweetalert'

export default  function Preescreen() {
   
    const {Form, Field } = ReactFinalForm
    const {t} = useTranslation()
    const history = useHistory();
    OfflineDb.setDataIntoPouchDB('transferFlag', {type:null})
    function getFieldDetails(checkbox) {
        return (
            <Field
                type="checkbox"
                component={CheckboxFieldFF}
                name={'pre1'}
                label={checkbox.label}
                value={checkbox.value}
            />
        );
    };

    function createForm () {
        let optionSet =[{ 'value': "YES", 'label': t("Yes") },{ 'value': "NO", 'label': t("No") }]
        let checkboxData = [{
                "label": t('A productive cough for more than 2 weeks'),
                "value": 1
            },{
                "label": t('Hemoptysis(coughing up blood)'),
                "value": 2
            },{
                "label": t('Unexplained weight loss'),
                "value": 3
            },{
                "label": t('Fever'),
                "value": 4
            },{
                "label": t('Chills'),
                "value": 5
            },{
                "label": t('Night sweats for no known reason'),
                "value": 6
            },{
                "label": t('Persistent shortness of breath'),
                "value": 7
            },{
                "label": t('Unexplained fatigue'),
                "value": 8
            },
            {
                "label": t('Chest Pain'),
                "value": 9
            }
        ]
        return (
            <Form
                onSubmit={values => submit(values)}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <form className="fullWidth" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4} md={4} className={'customLoc'}>
                                <FieldGroupFF
                                    label={t('Have you experienced any of the following symptoms in the past year')}
                                    //required={true}
                                    name={'pre1'}
                                >
                                    {checkboxData.map((checkbox) => {
                                        return getFieldDetails(checkbox);
                                    })}
                                </FieldGroupFF>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} >
                                <Field
                                    id={"pre2"}
                                    name={"pre2"}
                                    label={t('Presently on anti-TB medication?')}
                                    component={SingleSelectFieldFF}
                                    key={"pre2"}
                                    //required={true}
                                    options={optionSet}
                                />
                            </Grid>
                            
                        </Grid>
                    
                        <div className="buttons">
                            <button className="regformsubmitbtn" type="submit" disabled={submitting}>
                                <Trans>Submit</Trans>
                            </button>
                        </div>
                    </form>
                )}
            />
        )
    } 

    function submit(param) {
        
        if(!_.isEmpty(param)){
            
            //debugger;
            if((param.pre1 && !_.isEmpty(param.pre1)) && (param.pre2 && !_.isEmpty(param.pre2))){
                history.push('/layout/registration',{"newclient":true})
            }else if(param.pre2 == 'YES'){
                swal({
                    text: t("Thank you for your input"),
                    icon: "success",
                    button: t("Close"),
                  }).then(res=>{
                    history.push('/layout/home')
                  });
                
            }else if(param.pre2 == 'NO'){
                swal({
                    text: t("Thank you for your input"),
                    icon: "success",
                    button: t("Close"),
                  }).then(res=>{
                    history.push('/layout/home')
                  });
                
            }else if((param.pre1 && !_.isEmpty(param.pre1)) && !param.hasOwnProperty('pre2')){
                history.push('/layout/registration')
            }
        }else{
            swal({
                title: t('Error'),
                text: t("Please select at least one field"),
                icon: "error",
                button: t("Close"),
              })
        }
    }

    return (
        <section className="searchcustombg" style={{flexGrow: 1,padding: 20,}}>
            <div className="searchformcontainer">
                <p className="searchformheading" style={{marginBottom:'25px'}}>
                    <Trans>PRE REGISTRATION SCREENING</Trans>
                </p>
                <div className="searchtabscontainer customregistrationtabs">
                    {createForm()}
                </div>
            </div>        
        </section>
    )
}

