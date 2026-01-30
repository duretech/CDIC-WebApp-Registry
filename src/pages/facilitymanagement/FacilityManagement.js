import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { connect } from "react-redux";
// import API from "../../services";

import {
  Container,
  Button,
  Breadcrumb,
  Modal,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";

import Table from "./DataTable";

import * as Yup from "yup";
import { ErrorMessage, Field, useField, Formik, Form as FForm } from "formik";
import TextError from "../../component/ErrorText";

import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import swal from "sweetalert";

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { apiServices } from "../../services/apiServices";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Grid } from "@material-ui/core";

const FacilityManagement = ({ props }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState();

  const [modalHeader, setModalHeader] = useState();
  const [modalContent, setModalContent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [UICID, setUICID] = useState();
  const [appProgramID, setAppProgramID] = useState(null);

  const [facilityData, setFacilityData] = useState([]);
  const [facilityKey, setFacilityKey] = useState(0);

  const [orgStructure, setOrgStructure] = useState({});

  const formRefOrg = useRef(null);
  const [facilityAddVariable, setFacilityAddVariable] = useState(false);
  const [facilityEditVariable, setFacilityEditVariable] = useState(false);

  // Code for org add
  const [orgAddVariable, setOrgAddVariable] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const handleCloseModal = () => setShowModal(false);

  const onChange = (currentNode, selectedNodes) => {
    // console.log('onChange::', currentNode, selectedNodes)
    //formRef.current.values.orgUnit = selectedNodes;
    // setSelectedOrg(selectedNodes)
    if (formRef && formRef.current && formRef.current.values) {
      formRef.current.values.orgUnit = selectedNodes;
    }
    if (formRefOrg && formRefOrg.current && formRefOrg.current.values) {
      formRefOrg.current.values.orgName = selectedNodes;
    }
  };

  // For Facility Creation
  const center = {
    lat: 51.505,
    lng: -0.09,
  };
  const [position, setPosition] = useState(center);
  function DraggableMarker() {
    const [draggable, setDraggable] = useState(false);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition(marker.getLatLng());
            console.log(marker.getLatLng());
          }
        },
      }),
      []
    );
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d);
    }, []);

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      >
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {true
              ? "Lat " +
                position.lat.toFixed(4) +
                " : Long " +
                position.lng.toFixed(4)
              : "Click here to make marker draggable"}
          </span>
        </Popup>
      </Marker>
    );
  }
  const [initialValuesObject, setInitialValuesObject] = useState({
    code: "",
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
  });
  const facilityObjectSchema = Yup.object().shape({
    code: Yup.string(),
    name: Yup.string().required("Facility name is required"),
    state: Yup.string().required("State is required"),
    address: Yup.string().required("Facility address is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().min(10, "Minimum length 10"),
  });
  const orgSchema = Yup.object().shape({
    name: Yup.string().required("Organization  name is required"),
    parent: Yup.string(),
  });

  const [filterFlag, setFilterFlag] = useState(false);

  const [defaultOrg, setDefaultOrg] = useState([
    { id: "YUv0ube9634", displayName: "Zimbabwe" },
  ]);
  const [periodName, setPeriodName] = useState();

  const [breadcrumbOrg, setBreadcrumbOrg] = useState();
  const [orgID, setOrgID] = useState("YUv0ube9634");
  // const [orgID, setOrgID] = useState();
  const date = new Date();
  const latestPeriod =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10 ? "0" : "") +
    (date.getMonth() + 1);
  //console.log(latestPeriod);
  const [currentPeriod, setCurrentPeriod] = useState(
    date.getFullYear().toString()
  );

  const [isSidebarOpen, setSidebar] = useState(false);

  const onSetSidebarOpen = () => {
    if (isSidebarOpen === true) {
      setSidebar(false);
    } else {
      setSidebar(true);
    }
  };

  const closeSidebar = () => {
    setSidebar(false);
  };

  const applyFilter = (org, period, periodname) => {
    console.log(org);
    setOrgID(org[org.length - 1].id);
    console.log(period);
    setCurrentPeriod(period);
    setPeriodName(periodname);
    setBreadcrumbOrg(org);
    setFilterFlag(true);
    closeSidebar();
  };

  const resetFilter = () => {
    setOrgID(defaultOrg[0].id);
    setCurrentPeriod(currentPeriod);
    setBreadcrumbOrg(defaultOrg);
    closeSidebar();
  };

  const getOrgStructure = () => {
    let dataHolder = {
      label: defaultOrg[0].displayName,
      value: defaultOrg[0].id,
      children: [],
    };
    apiServices
      .getAPI(
        `organisationUnits?fields=id%2Cpath%2CdisplayName%2Cchildren%3A%3AisNotEmpty&paging=false`
      )
      .then((res) => {
        dataHolder.children = res.data.organisationUnits.map((org, idx) => {
          return { value: org.id, label: org.displayName };
        });
        console.log(dataHolder, "dataHolder");
        setOrgStructure(dataHolder);
        // console.log(res.data.organisationUnits)
      });
  };

  const getFacilityList = () => {
    setLoading(true);
    // apiServices.getAPI(`users?fields=:all&pageSize=10000000&filter=organisationUnits.id:in:[`+userStoreState.userDetails.organisationUnits[0].id + `]&includeChildren=true`).then((res) => {
    // apiServices.getAPI(`users?fields=:all&ou=` + orgID + `&includeChildren=true&paging=false`).then((res) => {
    apiServices
      .getAPI(
        // https://ncderegistry.imonitorplus.com/service/api/organisationUnits/YUv0ube9634?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]
        "organisationUnits?filter=comment:eq:Facility&paging=false&fields=[id,name,description,address,phoneNumber,email,programs,shortName,openingDate]"
        // "organisationUnits/YUv0ube9634?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]&filter=comment:eq:Facility"
      )
      .then((res) => {
        console.log(res.data, "res.data");
        setLoading(false);
        setFacilityData(res.data.organisationUnits);
        setFacilityKey(Math.random());
      });
  };

  useEffect(() => {
    if (orgID == "zRzmF39GKjp") {
      // for philipnes
      setAppProgramID("zEcXs9CsP4a");
    } else if (orgID == "cPp4Njup8ps") {
      // for egypt
      setAppProgramID("t0vE0JNKagy");
    } else if (orgID == "xSIboJSOyJK") {
      // for jordan
      setAppProgramID("TMF8Tah3HFU");
    }
    // else{
    //   // for generic
    //   setAppProgramID('TMF8Tah3HFU')
    // }
    setDefaultOrg([{ id: "YUv0ube9634", displayName: "Zimbabwe" }]);
    if (true) {
      getFacilityList();
      getOrgStructure();
      getStateList();
    }
  }, [orgID, currentPeriod, appProgramID, categoryFilter]);

  const getStateList = () => {
    apiServices
      .getAPI(
        "organisationUnits/" +
          "YUv0ube9634" +
          "?paging=false&fields=children[id,name,displayName,children[id,name,displayName,children[id,name,displayName]]]"
      )
      .then((res) => {
        console.log(res.data);
        setStateList(res.data.children);
      });
  };

  const editUser = (userData) => {
    setInitialValuesObject(userData);
    setFacilityEditVariable(true);
    userData.firstname = userData.firstName;
    userData.lastname = userData.surname;
    // setUserEditObject(userData)
    // setUserEditVariable(true)
    // setUserAddVariable(false)
  };

  return (
    <section
      className="searchcustombg searchtabmaindiv  "
      style={{ flexGrow: 1 }}
    >
      <div className="mainContainer facilty-section">
        <div className="container-fluid mt-110px pl-1 pr-1">
          <div className="mt-3 table-linelist mb-3 ml-3 mr-3">
            <Row>
              <Col lg={12}>
                <div className="row mb-2">
                  <div className="col-12">
                    <Button
                      className="onboardBtn addbtn mr-2"
                      onClick={(e) => {
                        setFacilityAddVariable(true);
                        setOrgAddVariable(false);
                      }}
                    >
                      Create New Facility{" "}
                    </Button>
                    <Button
                      className="onboardBtn addbtn "
                      onClick={(e) => {
                        setFacilityAddVariable(false);
                        setOrgAddVariable(true);
                      }}
                      type="button"
                      title="Add Organization "
                      style={{ marginRight: "1%" }}
                    >
                      {" "}
                      Create New Organization{" "}
                    </Button>
                  </div>
                </div>
                {facilityAddVariable ? (
                  <Formik
                    innerRef={formRef}
                    initialValues={{
                      code: "",
                      name: "",
                      address: "",
                      email: "",
                      phoneNumber: "",
                    }}
                    validationSchema={facilityObjectSchema}
                    onSubmit={(values) => {
                      let instanct = {
                        ...values,
                        shortName: values.name,
                        openingDate: new Date().toISOString(),
                        geometry: {
                          type: "Point",
                          coordinates: [position.lng, position.lat],
                        },
                        comment: "Facility",
                        parent: {
                          id: values.state,
                        },
                      };
                      console.log(instanct, values);

                      // https://uathsrc.imonitorplus.com/service/api/users?filter=userCredentials.username:eq:TestUsermanag&fields=id
                      apiServices
                        .postAPI("/organisationUnits", instanct)
                        .then((response) => {
                          console.log(response);

                          let elem = document.createElement("div");
                          if (response.data.status == "OK") {
                            elem.innerHTML = "Facility created sucessfully.";
                            swal({
                              title: "Success",
                              content: elem,
                              icon: "success",
                              button: "Close",
                            }).then(function () {
                              getFacilityList();
                              setFacilityAddVariable(false);
                            });
                          } else {
                            let elem = document.createElement("div");
                            elem.innerHTML = "Someting went wrong.";
                            swal({
                              title: "Error",
                              content: elem,
                              icon: "error",
                              button: "Close",
                            });
                          }
                        });
                    }}
                  >
                    {({ errors, touched }) => (
                      <FForm className="userAddForm">
                        <Card className="">
                          <Card.Header className="regcardheader">
                            <h4>Add Facility</h4>
                            <span>
                              <FontAwesomeIcon
                                icon={faTimes}
                                onClick={(e) => {
                                  setFacilityAddVariable(false);
                                }}
                              />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <Grid container>
                              <Grid item lg={8}>
                                <Row>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicCode">
                                      <Field name="code">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Code
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Code"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="code"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="name">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Name
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Name"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="name"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicAddress">
                                      <Field name="address">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Address
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <textarea
                                                    rows="4"
                                                    placeholder="Facility Address"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="address"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicEmail">
                                      <Field name="email">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Email
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Email"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="email"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicNumber">
                                      <Field name="phoneNumber">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Phone Number
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Phone Number"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="phoneNumber"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6"></Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicState">
                                      <Field
                                        name="state"
                                        onChange={(e) => {
                                          console.log(e);
                                        }}
                                      >
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                State
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <select
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  >
                                                    <option>--Select--</option>
                                                    {stateList.map(
                                                      (state, id) => {
                                                        return (
                                                          <option
                                                            key={id}
                                                            value={state.id}
                                                          >
                                                            {" "}
                                                            {state.name}
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                  </select>
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="state"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="district">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                District
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <select
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  >
                                                    <option>--Select--</option>
                                                    {/* {userRoles.map((role, id) => {
                                                                      return <option key={id} value={role.value}> {role.label}</option>
                                                                  })} */}
                                                  </select>
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="district"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="city">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                City
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <select
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  >
                                                    <option>--Select--</option>
                                                    {/* {userRoles.map((role, id) => {
                                                                      return <option key={id} value={role.value}> {role.label}</option>
                                                                  })} */}
                                                  </select>
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="city"
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Grid>
                              <Grid item lg={4}>
                                <MapContainer
                                  style={{ height: "100%" }}
                                  center={[51.505, -0.09]}
                                  zoom={13}
                                  scrollWheelZoom={true}
                                >
                                  <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  />
                                  <DraggableMarker />
                                </MapContainer>
                              </Grid>
                            </Grid>

                            <Button className="btn addbtn mt-2" type="submit">
                              Add
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}

                {facilityEditVariable ? (
                  <Formik
                    innerRef={formRef}
                    initialValues={initialValuesObject}
                    enableReinitialize="true"
                    // validationSchema={facilityObjectSchema}
                    onSubmit={(values) => {
                      // console.log(values)
                      apiServices
                        .putAPI(
                          "organisationUnits/" +
                            values.id +
                            "?mergeMode=REPLACE",
                          values
                        )
                        .then((res) => {
                          // console.log(res)
                          let elem = document.createElement("div");
                          if (res.data.status == "OK") {
                            elem.innerHTML = "Facility updated sucessfully.";
                            swal({
                              title: "Success",
                              content: elem,
                              icon: "success",
                              button: "Close",
                            }).then(function () {
                              getFacilityList();
                              setFacilityEditVariable(false);
                            });
                          }
                        });
                    }}
                  >
                    {({ errors, touched }) => (
                      <FForm className="userAddForm">
                        <Card>
                          <Card.Header className="regcardheader">
                            Edit Facility
                            <span
                              className="closesign"
                              onClick={(e) => {
                                setFacilityEditVariable(false);
                              }}
                            >
                              <i aria-hidden="true" className="fa fa-times"></i>
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <Row>
                              <Col lg="8">
                                <Row>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicCode">
                                      <Field name="code">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Code
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Code"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="code"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicName">
                                      <Field name="name">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Name
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Name"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="name"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicAddress">
                                      <Field name="address">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Address
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <textarea
                                                    rows="4"
                                                    placeholder="Facility Address"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="address"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicEmail">
                                      <Field name="email">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Email
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Email"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="email"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col lg="6">
                                    <Form.Group controlId="formBasicNumber">
                                      <Field name="phoneNumber">
                                        {({ field, meta }) => {
                                          return (
                                            <>
                                              <Form.Label className="label">
                                                Facility Phone Number
                                              </Form.Label>
                                              <div className="formgroup">
                                                <span className="formInput">
                                                  <input
                                                    placeholder="Facility Phone Number"
                                                    type="text"
                                                    className="form-control"
                                                    {...field}
                                                  />
                                                </span>
                                              </div>
                                            </>
                                          );
                                        }}
                                      </Field>
                                      <ErrorMessage
                                        component={TextError}
                                        name="phoneNumber"
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Button className="btn addbtn mt-2" type="submit">
                              Update
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}

                {orgAddVariable ? (
                  <Formik
                    innerRef={formRefOrg}
                    initialValues={{
                      name: "",
                    }}
                    validationSchema={orgSchema}
                    onSubmit={(values) => {
                      // console.log(values)
                      let instanct = {
                        ...values,
                        shortName: values.name,
                        openingDate: new Date().toISOString(),
                        parent: {
                          id: values.parent,
                        },
                      };
                      console.log(instanct);

                      // https://uathsrc.imonitorplus.com/service/api/users?filter=userCredentials.username:eq:TestUsermanag&fields=id
                      apiServices
                        .postAPI("/organisationUnits", instanct)
                        .then((response) => {
                          console.log(response);

                          let elem = document.createElement("div");
                          if (response.data.status == "OK") {
                            elem.innerHTML =
                              "Organization  created sucessfully.";
                            swal({
                              title: "Success",
                              content: elem,
                              icon: "success",
                              button: "Close",
                            }).then(function () {
                              getFacilityList();
                              setOrgAddVariable(false);
                            });
                          } else {
                            let elem = document.createElement("div");
                            elem.innerHTML = "Someting went wrong.";
                            swal({
                              title: "Error",
                              content: elem,
                              icon: "error",
                              button: "Close",
                            });
                          }
                        });
                    }}
                  >
                    {({ errors, touched }) => (
                      <FForm className="orgAddForm mb-15px">
                        <Card>
                          <Card.Header className="regcardheader">
                            <h4>Add Organization</h4>
                            <span>
                              <FontAwesomeIcon
                                icon={faTimes}
                                onClick={(e) => {
                                  setOrgAddVariable(false);
                                }}
                              />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <Grid item lg="6">
                              <Form.Group controlId="formBasicName">
                                <Field name="name">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Organization Name
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Organization  Name"
                                              type="text"
                                              className="form-control"
                                              {...field}
                                            />
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }}
                                </Field>
                                <ErrorMessage
                                  component={TextError}
                                  name="name"
                                />
                              </Form.Group>
                            </Grid>
                            <Grid className="mt-15px">
                              <Grid item lg="6">
                                <Form.Label className="label">
                                  Organization Parent
                                </Form.Label>
                                <DropdownTreeSelect
                                  texts={{
                                    placeholder: "Select Organization ",
                                  }}
                                  className="customSelect mt-10px"
                                  data={orgStructure}
                                  mode="radioSelect"
                                  onChange={onChange}
                                  name="orgName"
                                />
                              </Grid>
                            </Grid>

                            <Button className="btn addbtn mt-2" type="submit">
                              Add
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}
              </Col>
            </Row>
            <Row className="mt-10px">
              <Col lg={12}>
                <Table
                  key={facilityKey}
                  // columns={linelistColumns}
                  userData={facilityData}
                  edituser={editUser}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </section>
  );
};
const mapStateToProps = ({ storeState }) => {
  // console.log(storeState)
  return { props: storeState };
};

export default connect(mapStateToProps, null)(FacilityManagement);
