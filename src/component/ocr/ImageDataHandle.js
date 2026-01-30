import React, { useState, useEffect } from 'react'
import { ReactSortable, Sortable, MultiDrag, Swap } from "react-sortablejs"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation, Trans } from 'react-i18next';



function ImageDataHandle(props) {
    var regQFields = ["Form 1a - Presumptive TB Masterlist single entry","(1) Date of Consult","MM/DD/YYYY","(2) Patient's Full Name","SURNAME","Given Names Name Extension and Middle Name","(3) Age","(4) Sex","M/F","(5) Complete Address and Contact Number","(6) Name of Referring Facility/ Unit/ Physician/ Health","(7) Mode of","(8) PRESUMPTIVE TB?","Screening","Check [v] one","P/A/I/E","Presumptive","DS-TB","DR-TB","[ ]","worker","Check [V] one","Form la - Presumptive TB Masterlist single entry","Check [/] one"];
    const programData = props.programData
    const regFields = programData.programs[0].programTrackedEntityAttributes
    const imageResult = props.imageResult[0].lines
    const { t, i18n } = useTranslation();
    const [state, setState] = useState([])
    const [textFieldData, setTextFieldData] = useState({})
    const [imageText, setImageText] = useState([])
    const [showPop, setShowPop] = useState(false)
    


    useEffect(() => {
        var newRegArray = []
        var newImageTextArray = []
        regFields.map(item => {
            newRegArray.push({ "id": item.trackedEntityAttribute.id, "name": item.trackedEntityAttribute.displayName })
        })

        imageResult.map((item,index) => {
            if(!regQFields.includes(item.text)) {
                newImageTextArray.push({"id": index, "name": item.text})
            }
            
        })
        setState(newRegArray)
        setImageText(newImageTextArray)
        setShowPop(true)
    }, [])

    useEffect(() => {

        if(imageText.length > 0) {

            Sortable.create(document.getElementById("sort1"), {
                group: " groupName",
                sort: true,
                onEnd: function (evt) {
                    // console.log("***** From Hand Written Textboxes to Form Labels ****");
                    // console.log(evt.item);
                    if (evt && evt.item && evt.item.previousElementSibling && evt.item.previousElementSibling.firstElementChild) {
                        // console.log("Label Name: " + evt.item.previousElementSibling.firstElementChild.textContent);
                        // console.log("Label Value: " + evt.item.value);
                        // console.log("Label ID: " + evt.item.previousElementSibling.firstElementChild.getAttribute('data-id'));

                        evt.item.setAttribute('name', evt.item.previousElementSibling.firstElementChild.getAttribute('data-id'));
                    }
                },
            });

            Sortable.create(document.getElementById("sort2"), {
                group: " groupName",
                sort: true,
                onEnd: function (/**Event*/evt) {
                    //console.log("**** Sorting within Form Labels ****");
                    //console.log(evt.item);
                    if (evt && evt.item && evt.item.previousElementSibling && evt.item.previousElementSibling.firstElementChild) {
                        /*console.log("Label Name: "+ evt.item.previousElementSibling.firstElementChild.textContent);
                        console.log("Label Value: "+ evt.item.value);
                        console.log("Label ID: "+ evt.item.previousElementSibling.firstElementChild.getAttribute('data-id'));*/

                        evt.item.setAttribute('name', evt.item.previousElementSibling.firstElementChild.getAttribute('data-id'));
                    }
                },
            });
        }
    }, [imageText])

    

    function onChangeHandler(e, itemId) {
        setTextFieldData(Object.assign(textFieldData, { [itemId]: e.target.value }));        
    }

    function onOCRSubmit() {
        const FormElement = document.querySelector('.sort2')
        const input = FormElement.querySelectorAll('.imageTestValue')
        const inputFieldArray = Array.from(input)
        const outputObject = {}
        inputFieldArray.map(fields => {
            outputObject[fields.name] = fields.value
        })
        props.updateOCRData(outputObject)
        setShowPop(false)
        setImageText([])
    }



    return (
        <>
        {imageText.length > 0 ?
        <div className="modaloverlay">
                <div className="modalcardholder">
                    <Card className="modalcard">
                        <CardHeader
                            className="modalheader"
                            action={
                                <IconButton aria-label="close">
                                    <CloseIcon />
                                </IconButton>
                            }
                            title={''}
                        />
                        <CardContent className="modalbodycontent">
                            <div id={'sort1'}>

                                {
                                    imageText.map((item, index) => {
                                        return <input className={'imageTestValue'} value={textFieldData[item.id] ? textFieldData[item.id] : item.name} type="text" onChange={(e) => onChangeHandler(e, item.id)} /> // //
                                    })
                                }




                            </div>

                            <div className={'sort2'} id={'sort2'} style={{ height: '200px', overflow: 'scroll' }}>
                                {state.map((item) => (
                                    <div key={item.id} ><span data-id={item.id}>{item.name}</span></div>
                                ))}

                            </div>
                        </CardContent>

                        <CardActions className="modalfooter">
                            <Button className="regSearchCancelButton" onClick={() => setImageText([])}>{t('Cancel')}</Button>
                            <Button className="modalactionbtn"  onClick={() => onOCRSubmit()}>{t('Continue')}</Button>
                        </CardActions>

                    </Card>
                </div>
            </div>
        : 
            <> </>}



        </>
    )
}



export default ImageDataHandle