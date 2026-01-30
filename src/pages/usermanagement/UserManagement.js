import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { apiServices } from "../../services/apiServices";

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Grid } from "@material-ui/core";

const UserManagement = ({ props }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState();

  const [modalHeader, setModalHeader] = useState();
  const [modalContent, setModalContent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [UICID, setUICID] = useState();
  const [appProgramID, setAppProgramID] = useState(null);

  const [userData, setUserData] = useState([]);
  const [userTableKey, setUserTableKey] = useState(0);
  const [userAddVariable, setUserAddVariable] = useState(false);
  const [userEditVariable, setUserEditVariable] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [orgStructure, setOrgStructure] = useState({});
  const [userEditObject, setUserEditObject] = useState({});
  const [userCheck, setUserCheck] = useState();

  const handleCloseModal = () => setShowModal(false);

  const onChange = (currentNode, selectedNodes) => {
    // console.log('onChange::', currentNode, selectedNodes)
    formRef.current.values.orgUnit = selectedNodes;
    // setSelectedOrg(selectedNodes)
  };

  // For User Creation
  const userObjectSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email"),
    mobile: Yup.string().min(10, "Minimum length 10"),

    role: Yup.string().required("Role is required"),
    orgUnit: Yup.array(),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/,
        "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol character"
      ),
  });

  const userEditSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    surname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email"),
    phoneNumber: Yup.string().min(10, "Minimum length 10"),
    status: Yup.boolean(),
    // password: Yup.string().min(6, 'Minimum length 6 character').required('Password is required')
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

  const fetchLineListData = () => {
    setLoading(true);
    if (!filterFlag) {
      console.log(defaultOrg[0].id);
      setOrgID(defaultOrg[0].id);
      setBreadcrumbOrg(defaultOrg);
      console.log(defaultOrg);
    }
    let period = currentPeriod.includes("-")
      ? currentPeriod.replace("-", "")
      : currentPeriod;
    console.log(defaultOrg[0].id);
    let columnUrl = "userRoles?fields=:all";
    let url = "";

    apiServices
      .getAPI(columnUrl)
      .then((res) => {
        setUserRoles(
          res.data.userRoles.map((role, idx) => {
            return { value: role.id, label: role.displayName };
          })
        );
        setLoading(false);
        getOrgStructure();
        getUserList();
      })
      .catch((error) => {
        console.log(error);
      });
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

  const getUserList = () => {
    setLoading(true);
    // apiServices.getAPI(`users?fields=:all&pageSize=10000000&filter=organisationUnits.id:in:[`+userStoreState.userDetails.organisationUnits[0].id + `]&includeChildren=true`).then((res) => {
    apiServices
      .getAPI(
        `users?fields=:all&ou=` + orgID + `&includeChildren=true&paging=false`
      )
      .then((res) => {
        setLoading(false);
        setUserData(res.data.users);
        setUserTableKey(Math.random());
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
    if (true) fetchLineListData();
  }, [orgID, currentPeriod, appProgramID, categoryFilter]);

  const editUser = (userData) => {
    console.log(userData);
    if (userData.userCredentials.disabled) userData.status = false;
    else userData.status = true;
    setUserCheck(userData.status);
    // userData.firstName = userData.firstName
    // userData.lastname = userData.surname
    setUserEditObject(userData);
    setUserEditVariable(true);
    setUserAddVariable(false);
  };

  return (
    <section
      className="searchcustombg searchtabmaindiv  "
      style={{ flexGrow: 1 }}
    >
      <div className="mainContainer facilty-section">
        <div className="container-fluid mt-110px pl-1 pr-1">
          <div className="mt-3 table-linelist mb-3 ml-3 mr-3">
            <Grid container>
              <Grid item lg={8}>
                <Table
                  key={userTableKey}
                  // columns={linelistColumns}
                  userData={userData}
                  edituser={editUser}
                />
              </Grid>
              <Grid item lg={4}>
                <div className="row mb-2">
                  <div className="col-12">
                    <button
                      onClick={(e) => {
                        setUserAddVariable(true);
                        setUserEditVariable(false);
                      }}
                      type="button"
                      title="Add User"
                      className="btn btn-blue mt-2 mb-2 addbtn"
                    >
                      {" "}
                      Add User{" "}
                    </button>
                  </div>
                </div>
                {userAddVariable ? (
                  <Formik
                    innerRef={formRef}
                    initialValues={{
                      firstname: "",
                      lastname: "",
                      email: "",
                      mobile: "",
                      password: "",
                      role: "",
                    }}
                    validationSchema={userObjectSchema}
                    onSubmit={(values) => {
                      let instanct = {
                        userCredentials: {
                          cogsDimensionConstraints: [],
                          catDimensionConstraints: [],
                          username: values.username,
                          password: values.password,
                          userRoles: [
                            {
                              id: values.role,
                            },
                          ],
                        },
                        email: values.email,
                        phoneNumber: values.mobile,
                        surname: values.lastname,
                        firstName: values.firstname,
                        organisationUnits: [
                          {
                            id: values.orgUnit[0].value,
                          },
                        ],
                        dataViewOrganisationUnits: [
                          {
                            id: values.orgUnit[0].value,
                          },
                        ],
                        teiSearchOrganisationUnits: [
                          {
                            id: values.orgUnit[0].value,
                          },
                        ],
                        attributeValues: [],
                      };
                      console.log(instanct, "instance");
                      apiServices
                        .getAPI(
                          "users?filter=userCredentials.username:eq:" +
                            values.username +
                            "&fields=id"
                        )
                        .then((response) => {
                          if (response.data.users.length == 0) {
                            apiServices
                              .postAPI("users", instanct)
                              .then((res) => {
                                // console.log(res)
                                let elem = document.createElement("div");
                                if (res.data.status == "OK") {
                                  elem.innerHTML = "User created sucessfully.";
                                  swal({
                                    title: "Success",
                                    content: elem,
                                    icon: "success",
                                    button: "Close",
                                  }).then(function () {
                                    getUserList();
                                    setUserAddVariable(false);
                                  });
                                } else {
                                  elem.innerHTML =
                                    res.data.typeReports[0].objectReports[0].errorReports[0].message;
                                  swal({
                                    title: "Error",
                                    content: elem,
                                    icon: "error",
                                    button: "Close",
                                  });
                                }
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          } else {
                            let elem = document.createElement("div");
                            elem.innerHTML =
                              "Username / Email already exist in the system.";
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
                      <FForm className="userAddForm AddUserSection mt-20px">
                        <Card>
                          <Card.Header className="regcardheader">
                            <h4>Add User</h4>
                            <span>
                              <FontAwesomeIcon
                                icon={faTimes}
                                onClick={(e) => {
                                  setUserAddVariable(false);
                                }}
                              />
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicEmail">
                                <Field name="firstname">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          First Name
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="First Name"
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
                                  name="firstname"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicPassword">
                                <Field name="lastname">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Last Name
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Last Name"
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
                                  name="lastname"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicUsername">
                                <Field name="username">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Username
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Username"
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
                                  name="username"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formYourMobileNumber">
                                <Field name="mobile">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Mobile Number
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Mobile Number"
                                              type="number"
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
                                  name="mobile"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formRole">
                                <Field name="role">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Role
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <select
                                              type="text"
                                              className="form-control"
                                              {...field}
                                            >
                                              <option>--Select--</option>
                                              {userRoles.map((role, id) => {
                                                return (
                                                  <option
                                                    key={id}
                                                    value={role.value}
                                                  >
                                                    {" "}
                                                    {role.label}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }}
                                </Field>
                                <ErrorMessage
                                  component={TextError}
                                  name="role"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicEmailAddress">
                                <Field name="email">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Email Address
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Email"
                                              type="email"
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
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formYourPassword">
                                <Field name="password">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Password
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Password"
                                              type="password"
                                              className="form-control"
                                              {...field}
                                              autoComplete="new-password"
                                            />
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }}
                                </Field>
                                <ErrorMessage
                                  component={TextError}
                                  name="password"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px organisation-select">
                              <Form.Group controlId="formOrg">
                                <Form.Label className="label">
                                  Organisation
                                </Form.Label>
                                <DropdownTreeSelect
                                  texts={{ placeholder: "Select Organisation" }}
                                  className="customSelect mt-10px"
                                  data={orgStructure}
                                  mode="radioSelect"
                                  onChange={onChange}
                                />
                              </Form.Group>
                            </div>
                            <Button className="btn addbtn mt-2" type="submit">
                              Add
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}
                {userEditVariable ? (
                  <Formik
                    innerRef={formRef}
                    initialValues={userEditObject}
                    validationSchema={userEditSchema}
                    onSubmit={(values) => {
                      console.log(values, formRef);
                      if (userCheck) values.userCredentials.disabled = false;
                      else values.userCredentials.disabled = true;
                      // return
                      apiServices
                        .putAPI("users/" + values.id, values)
                        .then((res) => {
                          let elem = document.createElement("div");
                          if (res.data.status == "OK") {
                            elem.innerHTML = "User updated sucessfully.";
                            swal({
                              title: "Success",
                              content: elem,
                              icon: "success",
                              button: "Close",
                            }).then(function () {
                              getUserList();
                              setUserEditVariable(false);
                            });
                          } else {
                            elem.innerHTML =
                              res.data.typeReports[0].objectReports[0].errorReports[0].message;
                            swal({
                              title: "Error",
                              content: elem,
                              icon: "error",
                              button: "Close",
                            });
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }}
                  >
                    {({ errors, touched }) => (
                      <FForm className="userAddForm AddUserSection">
                        <Card>
                          <Card.Header className="regcardheader">
                            Edit User
                            <span
                              className="closesign"
                              onClick={(e) => {
                                setUserEditVariable(false);
                              }}
                            >
                              <i aria-hidden="true" className="fa fa-times"></i>
                            </span>
                          </Card.Header>
                          <Card.Body className="regtabbody">
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicEmail">
                                <Field name="firstName">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          First Name
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="First Name"
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
                                  name="firstName"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicPassword">
                                <Field name="surname">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Last Name
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Last Name"
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
                                  name="surname"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formYourMobileNumber">
                                <Field name="phoneNumber">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Mobile Number
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Mobile Number"
                                              type="number"
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
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicEmailAddress">
                                <Field name="email">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Email Address
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              // disabled={true}
                                              placeholder="Email"
                                              type="email"
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
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formYourPassword">
                                <Field name="password">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          New Password
                                        </Form.Label>
                                        <div className="formgroup">
                                          <span className="formInput">
                                            <input
                                              placeholder="Password"
                                              type="password"
                                              className="form-control"
                                              {...field}
                                              autoComplete="new-password"
                                            />
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }}
                                </Field>
                                <ErrorMessage
                                  component={TextError}
                                  name="password"
                                />
                              </Form.Group>
                            </div>
                            <div className="mb-15px">
                              <Form.Group controlId="formBasicEmail">
                                <Field name="status">
                                  {({ field, meta }) => {
                                    return (
                                      <>
                                        <Form.Label className="label">
                                          Status
                                        </Form.Label>
                                        <div className="formgroup">
                                          <Form.Check
                                            {...field}
                                            type="switch"
                                            id="custom-switch"
                                            checked={userCheck}
                                            onChange={(e) =>
                                              setUserCheck(e.target.checked)
                                            }
                                            // checked={formRef.current?.values?.status}
                                            // label="Check this switch"
                                          />
                                          {/* <span className="formInput">
                                          <input
                                            placeholder='First Name'
                                            type='text'
                                            className='form-control'
                                            {...field}

                                          />
                                        </span> */}
                                        </div>
                                      </>
                                    );
                                  }}
                                </Field>
                                <ErrorMessage
                                  component={TextError}
                                  name="status"
                                />
                              </Form.Group>
                            </div>
                            <Button className="btn addbtn mt-2" type="submit">
                              Update
                            </Button>
                          </Card.Body>
                        </Card>
                      </FForm>
                    )}
                  </Formik>
                ) : null}
              </Grid>
            </Grid>
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

export default connect(mapStateToProps, null)(UserManagement);
