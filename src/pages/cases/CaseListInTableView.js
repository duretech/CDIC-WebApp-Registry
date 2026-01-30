import React from 'react';
import _ from 'lodash';
import DataTable from 'react-data-table-component';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next
import PatientListMobileUI from './PatientListMobileUI';

function CaseListInTableView(props) {
  const { t } = useTranslation(); // Get the t function
  const isMobile = window.document.body.clientWidth < 800 || window.cordova;
  // Custom component for empty state
  const NoDataComponent = () => (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      {t("There Are No Records To Display")}
    </div>
  );
  //console.log("props ",props)
  return (
    <div>
      {
        isMobile ? (
          <Grid container spacing={3} className="">
            <PatientListMobileUI columns={props.columns}
                data={props.data.filter((item) => {
                  return item;
                })} itemsPerPage={props.itemsPerPage}/>
          </Grid>
      ) : (
        <Grid className={"datatable-block "} container spacing={3}>
          <DataTable
            striped="true"
            responsive="true"
            pagination
            fixedHeader="true"
            columns={props.columns}
            data={props.data.filter((item) => {
              return item;
            })}
            className='patientTableList'
            noDataComponent={<NoDataComponent />} // Use the custom component here
          />
        </Grid>
          )
      }
    </div>
  );
}

export default CaseListInTableView;