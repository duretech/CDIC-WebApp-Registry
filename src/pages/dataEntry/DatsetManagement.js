import React, { useEffect, useState } from "react";
import {
  Button,
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
import OfflineDb from '../../db';
import moment from "moment";
import { useGlobalSpinnerActionsContext } from "../../context/GlobalSpinnerContext";
import CreateField from '../../component/fields/CreateSurveyField';
import _ from "lodash";
import FooterMenu from "../../component/layout/FooterMenu";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CloseIcon from '@material-ui/icons/Close';
import DataTable from 'react-data-table-component';
const { Form, Field, FormSpy } = ReactFinalForm;

const DatasetManagement = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const [years, setYears] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [mfgName, setMFGName] = useState("");
  const [mfgDate, setMFGDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [units, setUnits] = useState("");
  const [currentYear, setCurrentYear] = useState(null);
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
  const [sessionUserBoValue, setSessionUserBoValue] = React.useState(null)
  const [activeCaseDetails, setActiveCaseDetails] = useState(null)
  const [surveyFormData, setSurveyFormData] = useState(null);
  const [Configuration, setConfiguration] = React.useState(null);
  const [offlineSurveyEditData, setofflineSurveyEdit] = useState(null);
  const [surveyDataSet, setSurveyDataSet] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [categoryComboId, setCategoryComboId] = useState("");
  const [itemsListUpdated, setItemsListUpdated] = useState(false);
  const [deUID, setDEUID] = useState("");
  const [stockInVlaue, setStockInVlaue] = useState("");
  const [stockOutVlaue, setStockOutVlaue] = useState("");

  async function getDataFromDatabase() {
    let metadata = await OfflineDb.getDataFromPouchDB('metaData')
    setProgarmData(metadata.data)

    let surveyFormData = await OfflineDb.getDataFromPouchDB("surveyFormData");
    setSurveyFormData(surveyFormData);

    let progRule = await OfflineDb.getDataFromPouchDB('programRules')
    setProgramRules(progRule.data)

    let progRuleVariable = await OfflineDb.getDataFromPouchDB('programRulesVariables')
    setProgramRulesVariables(progRuleVariable.data)

    let datasetRules = await OfflineDb.getDataFromPouchDB('datasetRules')
    setDatasetRules(datasetRules.data)

    let offlineSurveyDetails = await OfflineDb.getDataFromPouchDB('activeCaseDetails')
    setActiveCaseDetails(offlineSurveyDetails)

    let loginDetails = await OfflineDb.getDataFromPouchDB("loginDetails");
    setSessionUserBoValue(loginDetails.data);

    let dataSetId = await OfflineDb.getDataFromPouchDB("currentDataSet");
    setSurveyDataSet('LpGDba6fUGg');

    let configurations = await OfflineDb.getDataFromPouchDB("configurations");
    setConfiguration(configurations.data.configuration);

    let offlineSurveyEdit = await OfflineDb.getDataFromPouchDB(
      "activeCaseFormData"
    );
    setofflineSurveyEdit(offlineSurveyEdit);
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
  }

  const submit = (values) => {
    let saveObj = {
      "dataSet": surveyDataSet,
      dataValues: [],
    };


    const data = values;
    Object.keys(values).map(function (objectKey, index) {
      const obj = {
        dataElement: objectKey,
        period: yearValue || monthValue ? yearValue.toString() + monthValue.toString() : '202306', //values[weekID],//moment(selectedDate).format('YYYYMMDD'),
        orgUnit: sessionUserBoValue && sessionUserBoValue.organisationUnits && sessionUserBoValue.organisationUnits[0] ? sessionUserBoValue.organisationUnits[0].id : "fNfswLkiSd4",
        value: values[objectKey],
        categoryOptionCombo: "HllvX50cXC0",
      };
      saveObj.dataValues.push(obj);
    })
    if (navigator.onLine) {
      setGlobalSpinner(true);
      apiServices
        .postAPI("dataValueSets.json", saveObj)
        .then((response) => {
          setGlobalSpinner(false);
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
      setDataSetElementList(res.data.dataSetElements)
    })
  }
  const getStockData = () => {
    apiServices.getAPI('stockmanagment/getStockInData?datasetuid=' + surveyDataSet).then(res => {
      let comboOptionMeta = {}
      let comboOption = {}
      apiServices.getAPI("categoryOptionCombos").then(response => {
        const uniqueColumns = response.data.categoryOptionCombos
          .filter(col => col.displayName !== 'default')
          .reduce((acc, current) => {
            const x = acc.find(item => item.displayName === current.displayName);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

        const columnDefinitions = uniqueColumns.map(col => {
          if (col.displayName === 'Item Name') {
            return {
              name: col.displayName,
              selector: row => row.itemName,
            };
          } else {
            return {
              name: col.displayName,
              selector: row => row[col.displayName],
              cell: (row) => <input onBlur={(e) => { e.preventDefault(); onTableInputChange(row.id, col.displayName, e, col.id) }} value={row[col.displayName]} type="text" />,
            };
          }
        });

        const itemNameColumn = columnDefinitions.find(col => col.name === 'Item Name');
        const otherColumns = columnDefinitions.filter(col => col.name !== 'Item Name');

        // setColumns([itemNameColumn, ...otherColumns]);

        response.data.categoryOptionCombos.map(el => {
          comboOptionMeta[el.id] = el.displayName
          comboOption[el.displayName] = ""
        })
        apiServices.getAPI('dataValueSets.json?period=' + (yearValue || monthValue ? yearValue.toString() + monthValue.toString() : '202306') + '&dataSet=' + surveyDataSet + '&orgUnit=MeVQF12CV0L&multiOrganisationUnit=false').then(datavalue => {
          const transformedData = res.data.data.map(item => ({
            id: item.dataelementuid,
            itemName: item.dataelement,
            ...comboOption,
          }));
          if (datavalue.data.dataValues && datavalue.data.dataValues.length > 0) {
            transformedData.map(el => {
              datavalue.data.dataValues.map(values => {
                if (el.id == values.dataElement)
                  el[comboOptionMeta[values.categoryOptionCombo]] = values.value
              })
            })
            setStockData(transformedData);
          } else {
            setStockData(transformedData);
          }
          // setDataSetElementList(res.data.dataSetElements)
        })
      })
      // setDataSetElementList(res.data.dataSetElements)

    })
  }


  useEffect(() => {
    //getDataset("ChUwGRH0ppv")
    getDataFromDatabase()
    let currentYear = (new Date()).getFullYear();
    let currentMonth = (new Date()).getMonth() + 1;
    let currYear = {
      value: JSON.stringify(currentYear),
      label: JSON.stringify(currentYear)
    }
    let currMonth = {
      value: JSON.stringify(currentMonth),
      label: JSON.stringify(currentMonth)
    }

    setCurrentYear(currYear)
    setYearValue(currYear.value)
    setMonthValue("0" + currMonth.value)
    const currentMonthLabel = months.find(month => month.value === "0" + currMonth.value)?.label;
    setCurrentMonth({ value: monthValue, label: currentMonthLabel })

    let allYears = Array.from(new Array(20), (val, index) => {
      let year = currentYear - index;
      return { value: year.toString(), label: year.toString() };
    });
    setYears(allYears);
    // addYear()
  }, [surveyDataSet])

  const onStockUpdate = (id, row) => {
    let openBalance = parseInt(row["Opening Balance"]) ? Number(parseInt(row["Opening Balance"])) : 0;
    let stockIn = parseInt(row["stockIn"]) ? Number(parseInt(row["stockIn"])) : 0;
    let stockOut = parseInt(row["stockOut"]) ? Number(parseInt(row["stockOut"])) : 0;
    let limit = 30;
    let stock = Number(openBalance + stockIn) - Number(stockOut);
    console.log("stock::>>", stock, limit, stockIn, stockOut, openBalance)
    // if stockout is more than balance 
    if (stockOut >= openBalance && stockOut !== 0) {
      row["stockIn"] = "";
      row["stockOut"] = "";
      swal({
        title: t("Can't dispense the whole stock!"),
        icon: "error",
        button: "Ok",
      })
      return;
    }
    // if newBalance is less than or equal to 30 or stockIn is not equal to 0
    if (stock <= limit && stockIn == 0) {
      row["stockIn"] = "";
      row["stockOut"] = "";
      swal({
        title: t("Stock out is exceeding the allowed threshold!"),
        icon: "warning",
        button: "Ok",
      })
      return;
    }

    setStockData(prevStockData => {
      const updatedData = prevStockData.map(item => {
        if (item.id === id) {
          return { ...item, ["Opening Balance"]: Number(stock) };
        }
        return item;
      });
      return updatedData;
    });

    const formData = new FormData();
    formData.append('de', id);
    formData.append('pe', yearValue || monthValue ? yearValue.toString() + monthValue.toString() : '202306');
    formData.append('ou', sessionUserBoValue && sessionUserBoValue.organisationUnits && sessionUserBoValue.organisationUnits[0] ? sessionUserBoValue.organisationUnits[0].id : "fNfswLkiSd4");
    formData.append('value', stock);
    formData.append('co', "nmtNHvdCnbW");
    formData.append('ds', surveyDataSet);

    apiServices.postAPI('dataValues', formData).then(res => {
      swal({
        title: t("Stock updated successfully"),
        icon: "success",
        button: "Ok",
      })

    });
    row["stockIn"] = "";
    row["stockOut"] = "";
    // nmtNHvdCnbW -- update balance
  }
  const onStockChange = (id, fieldName, e, row) => {
    const newValue = e.target.value;
    setStockData(prevStockData => {
      const updatedData = prevStockData.map(item => {
        if (item.id === id) {
          return { ...item, [fieldName]: newValue };
        }
        return item;
      });
      return updatedData;
    });
  }

  const onTableInputChange = (id, fieldName, e, fieldId) => {
    const newValue = e.target.value;

    setStockData(prevStockData => {
      const updatedData = prevStockData.map(item => {
        if (item.id === id) {
          return { ...item, [fieldName]: newValue };
        }
        return item;
      });

      const formData = new FormData();
      formData.append('de', id);
      formData.append('pe', yearValue || monthValue ? yearValue.toString() + monthValue.toString() : '202306');
      formData.append('ou', sessionUserBoValue && sessionUserBoValue.organisationUnits && sessionUserBoValue.organisationUnits[0] ? sessionUserBoValue.organisationUnits[0].id : "fNfswLkiSd4");
      formData.append('value', newValue);
      formData.append('co', fieldId ? fieldId : "HllvX50cXC0");
      formData.append('ds', surveyDataSet);

      apiServices.postAPI('dataValues', formData).then(res => {
      });

      return updatedData;
    });
  };

  //   useEffect(() => {
  //     if(progarmData != null && programRules != null && programRulesVariables != null && datasetRules != null){
  //       getDataset("ChUwGRH0ppv")
  //     }
  //   }, [progarmData,programRules,programRulesVariables,datasetRules])
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

    if (yearValue == null || monthValue == null)
      return
    if (sessionUserBoValue != null && surveyDataSet != null) {
      let orgUnit = sessionUserBoValue && sessionUserBoValue.organisationUnits && sessionUserBoValue.organisationUnits[0] ? sessionUserBoValue.organisationUnits[0].id : "fNfswLkiSd4"
      apiServices.getAPI('dataValueSets.json?period=' + yearValue.toString() + monthValue.toString() + '&dataSet=' + surveyDataSet + '&orgUnit=' + orgUnit + '&multiOrganisationUnit=false').then((res) => {
        let tempObject = {}
        res.data.dataValues && res.data.dataValues.map(values => {
          tempObject[values.dataElement] = values.value == 'NaN' ? 0 : values;
        })

        getStockMetaData()
        // getStockData()
        // setInitialSurveyValue(tempObject)
      }).catch((err) => {

      });
    }
  }, [yearValue, monthValue, surveyDataSet, sessionUserBoValue, itemsListUpdated])

  const getStockMetaData = async () => {
    setGlobalSpinner(true);
    setColumnsHeader([]);
    setStockData([]);

    const datavalue = await apiServices.getAPI(`dataValueSets.json?period=${yearValue || monthValue ? yearValue.toString() + monthValue.toString() : '202306'}&dataSet=${surveyDataSet}&orgUnit=MeVQF12CV0L&multiOrganisationUnit=false`);
    const res = await apiServices.getAPI(`dataSets/${surveyDataSet}?fields=id,name,periodType,description,dataSetElements[dataElement[id,name]]`);

    const transformedData = await Promise.all(res.data.dataSetElements.map(async de => {
      let tempObj = {};
      tempObj['id'] = de.dataElement.id;
      tempObj['itemName'] = de.dataElement.name;

      tempObj['stockOut'] = 0;
      tempObj['stockIn'] = 0;

      const deDetails = await apiServices.getAPI(`dataElements/${de.dataElement.id}?fields=id,name,valueType,categoryCombo`);
      if (deDetails.data.categoryCombo.id) {
        setCategoryComboId(deDetails.data.categoryCombo.id);
        const comboData = await apiServices.getAPI(`categoryCombos/${deDetails.data.categoryCombo.id}?fields=id,name,categories,categoryOptionCombos[id,name]`);

        const columnsMeta = [{
          name: 'Item Name',
          selector: row => row.itemName,
          width: "100px",
        }];
        comboData.data.categoryOptionCombos.forEach(options => {
          columnsMeta.push({
            name: options.name,
            selector: row => row[options.name],
            cell: (row) => (<input
              disabled={options.name == "Opening Balance" || options.name == "Units" ? true : false}
              onChange={(e) => onTableInputChange(row.id, options.name, e, options.id)}
              value={row[options.name] || ''}
              type="text" />),
          });

          let matched = false;
          if (datavalue.data.dataValues && datavalue.data.dataValues.length > 0) {
            datavalue.data.dataValues.forEach(values => {
              if (de.dataElement.id === values.dataElement && options.id === values.categoryOptionCombo) {
                matched = true;
                tempObj[options.name] = values.value == 'NaN' ? 0 : values.value;
              }
            });
          }

          if (!matched) {
            tempObj[options.name] = "";
          }
        });
        columnsMeta.push({
          name: 'Stock In',
          selector: row => row['stockIn'],
          cell: (row) => <input onChange={(e) => onStockChange(row.id, "stockIn", e, row)} value={row["stockIn"] || ''} type="text" />,
        });
        columnsMeta.push({
          name: 'Stock Out',
          selector: row => row['stockOut'],
          cell: (row) => <input onChange={(e) => onStockChange(row.id, "stockOut", e, row)} value={row["stockOut"] || ''} type="text" />,
        });
        columnsMeta.push({
          name: 'Update Stock',
          selector: row => row['update'],
          cell: (row) => <Button onClick={(e) => onStockUpdate(row.id, row)} className="btn-sm modalactionbtn stock-update-btn" style={{width: '10px', maxHeight: '30px', minWidth: '10px', minHeight: '10px'}}>Update</Button>,
          // <Button onClick={(e) => onTableInputChange(row)} value={row["update"] || ''} />,
        });
        setColumnsHeader(prevCols => [...prevCols, ...columnsMeta.filter(col => !prevCols.some(prevCol => prevCol.name === col.name))]);
      }

      return tempObj;
    }));
    setStockData(transformedData);
    setGlobalSpinner(false);

  };
  const addItem = (e) => {
    let deUID = "";
    console.log("Item Info::", mfgName, openingBalance, units, itemName)
    let oRequest = {
      "aggregationType": "NONE",
      "domainType": "AGGREGATE",
      "description": itemName,
      "valueType": "TEXT",
      "formName": itemName,
      "name": itemName,
      "shortName": itemName,
      "categoryCombo": {
        "id": categoryComboId
      },
      "legendSets": []
    }
    apiServices
      .postAPI("dataElements", oRequest)
      .then((response) => {
        deUID = response.data.response.uid;
        apiServices.getAPI('dataSets/' + `${surveyDataSet}`).then(res => {
          handleAddItem(res.data, deUID, openingBalance)
        })
      }).catch(err => {
        setOpenModal(false)
        swal({
          title: t("Something Went Wrong, Please Contact Administrator!"),
          icon: "error",
          button: "Ok",
        })

      })

  }

  function handleStockUpdate(e) {
    console.log("handleStockUpdate", stockInVlaue, stockOutVlaue, e)
  }

  function handleAddItem(req, deUID, stock) {
    let payload = req;
    let arr = payload.dataSetElements;
    arr.push({
      "dataSet": {
        "id": surveyDataSet
      },
      "dataElement": {
        "id": deUID
      }
    })
    payload.dataSetElements = arr;
    let newPayload = {};
    let dataSets = [];
    dataSets.push(payload)
    newPayload = { dataSets }
    apiServices
      .postAPI("metadata", newPayload)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          //API CALL for Assigning the opening balance to the newly created element
          const formData = new FormData();
          formData.append('de', deUID);
          formData.append('pe', yearValue || monthValue ? yearValue.toString() + monthValue.toString() : '202306');
          formData.append('ou', sessionUserBoValue && sessionUserBoValue.organisationUnits && sessionUserBoValue.organisationUnits[0] ? sessionUserBoValue.organisationUnits[0].id : "fNfswLkiSd4");
          formData.append('value', stock);
          formData.append('co', "nmtNHvdCnbW");
          formData.append('ds', surveyDataSet);
      
          apiServices.postAPI('dataValues', formData).then(res => {
            swal({
              title: t("New Item Added Successfully"),
              icon: "success",
              button: "Ok",
            })
          });
        }
        else {
          swal({
            title: t("Something Went Wrong, Please Contact Administrator!"),
            icon: "error",
            button: "Ok",
          })
        }
      })
    setItemName("")
    setOpenModal(false)
    setItemsListUpdated(true)
  }
  function onSubmit(values) {
    console.log(values)
  }

  function renderField(registrationFields, values) {
    return (
      <CreateField fieldData={registrationFields} values={values} programRules={programRules} programRulesVariables={programRulesVariables} datasetRules={datasetRules} programData={progarmData} activeCaseDetails={activeCaseDetails} />
    )
  }
  return (
    <>
      <section
        className="surveyform regcustombg customregistrationtabs regcasetabs1 surveyformholder feedbackformholder"
        style={{
          flexGrow: 1,
          padding: 0,
          width: "100%"
        }}
      >
        <FooterMenu></FooterMenu>
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
                    >{currentYear && (
                      <Field
                        id="years"
                        name="years"
                        label={t("Select Year")}
                        placeholder={currentYear.label}
                        component={SingleSelectFieldFF}
                        key="years"
                        selected={currentYear.value}
                        options={years != null ? years : []}
                      />)}
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
                        placeholder={currentMonth.label}
                        options={months != null ? months : []}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        ></Form>
        {
          openModal ?
            <div className="modaloverlay">
              <div className="modalcardholder">
                <Card className="modalcard">
                  <CardHeader
                    className="modalheader"
                    action={
                      <IconButton aria-label="close">
                        <CloseIcon onClick={() => setOpenModal(false)} />
                      </IconButton>
                    }
                    title={"Add New Item"}
                  />
                  <CardContent className="modalbodycontent">
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Form
                          onSubmit={(e) => { addItem(e) }}
                          render={({
                            handleSubmit,
                            form,
                            submitting,
                            pristine,
                            values,
                          }) => (
                            <>
                              <form onSubmit={handleSubmit} >
                                <Grid className="mt-15px d-flex justify-content-center align-items-center">
                                  {/* <Grid container xs={6} className="p-10px" > */}
                                    <TextField
                                      id="standard-helperText"
                                      className="mr-10px"
                                      label={t('Enter Item Name')}
                                      onChange={(e) => { setItemName(e.target.value) }}
                                    />
                                    <TextField
                                      id="standard-helperText"
                                      label={t('Opening Balance')}
                                      value={openingBalance}
                                      onChange={(e) => { setOpeningBalance(e.target.value) }}
                                    />
                                    
                                  {/* </Grid> */}
                                  {/* <Grid container xs={6} className="p-10px" >
                                  <TextField
                                      id="standard-helperText"
                                      label={t('Primary Supplier name')}
                                      onChange={(e) => { setMFGName(e.target.value) }}
                                    />
                                    <TextField
                                      id="standard-helperText"
                                      label={t('Units')}
                                      onChange={(e) => { setUnits(e.target.value) }}
                                    />
                                  </Grid> */}
                                </Grid>

                                <Grid container xs={12} className="mt-15px d-flex justify-content-end">
                                  <Button type="submit" className="modalactionbtn">Add Item</Button>
                                </Grid>
                              </form>
                            </>
                          )}></Form>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </div>
            </div>

            : <></>
        }
        {
          <Grid
            container
            spacing={0} xs={12} lg={12}
            className="sureyform_bottomfieldholder dataSet_managementSection"
          >
            {yearValue && monthValue ?
              <div className="buttons customregistrationtabs">
                <button
                  className="regformsubmitbtn"
                  type="submit"
                  onClick={() => { setOpenModal(true) }}
                >
                  {t("Add New Item")}
                </button>
              </div>
              :
              <></>}
          </Grid>
        }
        {
          // surveyFormData != null &&
          //   surveyFormData.data &&
          //   programRules != null &&
          //   programRulesVariables != null &&
          //   sessionUserBoValue != null &&
          stockData != null ? (
            <Form
              onSubmit={(values) => submit(values, null, 2)}
              initialValues={initialSurveyValue}
              render={({ handleSubmit, form, submitting, pristine, values }) => (
                <>
                  <form className="stock-management fullWidth pl-pr-20" onSubmit={handleSubmit}>
                    <div
                      className="innertabdivreg surveyformoptionsholder"
                    // style={{ "margin-top": "20px" }}
                    >

                      <Grid
                        container
                        spacing={3}
                        className="sureyform_bottomfieldholder"
                      >
                      </Grid>
                      {
                        yearValue && monthValue ?
                          <DataTable
                            columns={columnsHeader}
                            data={stockData}
                          /> : <h5>Please Select Year & Month first.</h5>
                      }
                      {/* <Form
                      onSubmit={(e)=>handleStockUpdate(e)}
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
                                >{currentYear && (
                                  <Field
                                    id="years"
                                    name="stockin"
                                    label={t("Stock In")}
                                    type={"number"}
                                    component={InputFieldFF}
                                    key="stockin"
                                    onChange={(e)=>setStockInVlaue(e.target.value)}
                                  />)}
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
                                    name="stockout"
                                    type={"number"}
                                    label={t("Stock Out")}
                                    value="number"
                                    component={InputFieldFF}
                                    key="stockout"
                                    onChange={(e)=>setStockOutVlaue(e.target.value)}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={6}
                                  sm={6}
                                  md={3}
                                  lg={3}>
                        
                                </Grid>
                              </Grid>
                            </Grid>
                          </form>
                          <Button type="submit">Submit</Button>
                        </>
                      )}
                    ></Form> */}
                      <br />
                    </div>
                  </form>
                </>
              )}
            />)
            : <></>
        }
      </section>
    </>
  );
};

export default DatasetManagement;