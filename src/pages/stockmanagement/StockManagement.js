import React, { useEffect, useState } from "react";
import {
  ButtonStrip,
  InputFieldFF,
  SingleSelectFieldFF,
  ReactFinalForm,
  hasValue,
  AlertBar,
  CircularLoader,
  CenteredContent,
} from "@dhis2/ui";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { apiServices } from "../../services/apiServices";
import OfflineDb from '../../db'
import moment from "moment";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import CreateField from '../../component/fields/CreateSurveyField'
const { Form, Field, FormSpy } = ReactFinalForm;

const StockManagement = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const [years, setYears] = useState([
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
  ]);
  const [yearValue, setYearValue] = React.useState(null);

  const [months, setMonths] = useState([]);
  const [monthValue, setMonthValue] = React.useState(null);

  const [dataSetElementList, setDataSetElementList] = useState([])

  const setGlobalSpinner = useGlobalSpinnerActionsContext();

  const [initialSurveyFilterValue, setInitialSurveyFilterValue] = React.useState(null);
  const [initialSurveyValue, setInitialSurveyValue] = React.useState(null);
  const [progarmData, setProgarmData] = useState(null)
  const [programRules, setProgramRules] = useState(null)
  const [programRulesVariables, setProgramRulesVariables] = useState(null)
  const [datasetRules, setDatasetRules] = useState(null)
  const [sessionUserBoValue,setSessionUserBoValue] = React.useState(null)
  const [activeCaseDetails, setActiveCaseDetails] = useState(null)

  async function getDataFromDatabase() {
    let metadata = await OfflineDb.getDataFromPouchDB('metaData')
    setProgarmData(metadata.data)

    let progRule = await OfflineDb.getDataFromPouchDB('programRules')
    setProgramRules(progRule.data)

    let progRuleVariable = await OfflineDb.getDataFromPouchDB('programRulesVariables')
    setProgramRulesVariables(progRuleVariable.data)

    let datasetRules = await OfflineDb.getDataFromPouchDB('datasetRules')
    setDatasetRules(datasetRules.data)

    let offlineSurveyDetails = await OfflineDb.getDataFromPouchDB('activeCaseDetails')
    setActiveCaseDetails(offlineSurveyDetails)
  }
  const onChange = () => {
    console.log('onChange')
  }

  function addYear() {
    let currentYear = moment().year();
    if (currentYear != "2021" && currentYear != "2022") {
      currentYear = currentYear.toString();
      years.push({ value: currentYear, label: currentYear });
      setYears(years);
    }
    //console.log("years",currentYear,years);
  }

  const submit = (values) => {
    console.log('submit', values)
    console.log(yearValue, monthValue)
    let saveObj = {
      "dataSet": "ChUwGRH0ppv",
      dataValues: [],
    };
    const data = values;
    Object.keys(values).map(function (objectKey, index) {
      const obj = {
        dataElement: objectKey,
        period: yearValue.toString() + monthValue.toString(), //values[weekID],//moment(selectedDate).format('YYYYMMDD'),
        orgUnit: "fNfswLkiSd4",
        value: values[objectKey],
        categoryOptionCombo: "HllvX50cXC0",
      };
      saveObj.dataValues.push(obj);
    })
    console.log(saveObj)
    if (navigator.onLine) {
      setGlobalSpinner(true);
      apiServices
        .postAPI("dataValueSets.json", saveObj)
        .then((response) => {
          setGlobalSpinner(false);
          console.log("response", response)
          swal({
            title: t("Data submitted successfully"),
            text: "",
            icon: "success",
            button: t("Ok"),
          }).then(userResponse => {
            history.push("layout/home");
          });
        })
    }
  }

  const getDataset = (datasetid) => {
    setDataSetElementList([])
    apiServices.getAPI('dataSets/' + datasetid + '?fields=dataSetElements[id,dataSet[id],dataElement[*,all]').then(res => {
      console.log(res)
      setDataSetElementList(res.data.dataSetElements)
    })
  }
  useEffect(() => {
    getDataset("ChUwGRH0ppv")
    getDataFromDatabase()
    addYear()
  }, [])
  useEffect(() => {
    if(progarmData != null && programRules != null && programRulesVariables != null && datasetRules != null){
      getDataset("ChUwGRH0ppv")
    }
  }, [progarmData,programRules,programRulesVariables,datasetRules])
  useEffect(() => {
    if (yearValue) {
      setMonths([
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
      ]);
    }
  }, [yearValue]);
  useEffect(() => {
    if(yearValue == null || monthValue == null)
    return
    apiServices.getAPI('dataValueSets.json?period=' + yearValue.toString() + monthValue.toString() + '&dataSet=ChUwGRH0ppv&orgUnit=fNfswLkiSd4&multiOrganisationUnit=false').then((res) => {
      console.log(res)
      let tempObject = {}
      res.data.dataValues && res.data.dataValues.map(values => {
        tempObject[values.dataElement] = values.value
      })
      setInitialSurveyValue(tempObject)
    }).catch((err) => {

    });
  }, [yearValue, monthValue])

  function onSubmit(values) {
    console.log(values)
  }

  function renderField(registrationFields, values) {
    return (
        <CreateField fieldData={registrationFields} values={values} programRules={programRules} programRulesVariables={programRulesVariables} datasetRules={datasetRules} programData={progarmData} activeCaseDetails={activeCaseDetails}/>
    )
}
  return (
    <>
      <section
        className="surveyform regcustombg customregistrationtabs regcasetabs1 surveyformholder feedbackformholder bg-light-grey"
        style={{
          flexGrow: 1,
          padding: 0,
          width: "100%"
        }}
      >
        <Form
          onSubmit={onSubmit}
          initialValues={initialSurveyFilterValue}
          render={({
            handleSubmit,
            form,
            submitting,
            pristine,
            values,
          }) => (
            <>
              <form
                className="fullWidth pl-pr-20"
                onSubmit={handleSubmit}
                style={{ padding: "0px 40px" }}
              >
                {values && values["years"] && values["years"] != yearValue
                  ? setYearValue(values["years"])
                  : ""}
                {values && values["month"] && values["month"] != monthValue
                  ? setMonthValue(values["month"])
                  : ""}
                <Grid container className="">
                  <Grid container spacing={0} xs={12} lg={12}>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={3}
                      lg={3}
                      className="yearly-block"
                      id="yearly"
                      style={{ paddingLeft: "5px", paddingRight: "5px" }}
                    >
                      <Field
                        id="years"
                        name="years"
                        label={t("Select Year")}
                        component={SingleSelectFieldFF}
                        key="years"
                        options={years != null ? years : []}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={3}
                      lg={3}
                      id="monthly"
                      style={{ paddingLeft: "5px", paddingRight: "5px" }}
                    >
                      <Field
                        id="month"
                        name="month"
                        label={t("Select Month")}
                        component={SingleSelectFieldFF}
                        key="month"
                        options={months != null ? months : []}
                      //onChange={function(){ console.log("ww")}}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        ></Form>
        <Form
          onSubmit={(values) => submit(values, null, 2)}
          initialValues={initialSurveyValue}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="stock-management fullWidth pl-pr-20" onSubmit={handleSubmit}>
              {/* <div className="innertabdivreg subclass4">
            <Field
              name={"Name"}
              label={"Name"}
              type={'text'}
              component={InputFieldFF}
            />
          </div> */}
              <Grid container spacing={0} xs={12} lg={12}>
                {dataSetElementList && dataSetElementList.length > 0 ? dataSetElementList.map(element => {
                  // return (
                  //   <>
                  //     <Grid item xs={12} sm={12} md={6} className="mb-10px">
                  //       <Field
                  //         onChange={e => { console.log(e) }}
                  //         name={t(element.dataElement.id)}
                  //         label={t(element.dataElement.name)}
                  //         type="text"
                  //         component={InputFieldFF}
                  //         key={t(element.dataElement.id)}
                  //       />
                  //     </Grid>
                  //   </>
                  // )
                  // let requiredFields = surveyFormData.data && surveyFormData.data.compulsoryDataElementOperands ? _.find(surveyFormData.data.compulsoryDataElementOperands,{id:fieldsObject.dataElement.id}) : null
                  // if(requiredFields){
                  //     fieldsObject.compulsory = true
                  // }
                  return renderField(element, values != null ? values : {})
                }) : null}
              </Grid>

              <div className="buttons customregistrationtabs">
                <button
                  className="regformsubmitbtn"
                  type="submit"
                // disabled={submitting || pristine}
                >
                  {t("Submit")}
                </button>
              </div>
            </form>
          )}
        />
      </section>
    </>
  );
};

export default StockManagement;
