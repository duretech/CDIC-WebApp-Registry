import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ProfileFormSection from './ProfileFormSection';
import FolderOpen from '@material-ui/icons/FolderOpen';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from "react-i18next";

export default function TabProfileFormSectionDrawer({ initialValues,trackentityInstanceDetails,historyStageId,programData,managementStage,examinationStageId,labvaluesStageId,dataElementGroup, activeCaseFormData, eventsData_, uicId, uicIdattribute, glucometerFieldMap, userrolename }) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => (event) => {
    // console.log("AllData",initialValues,trackentityInstanceDetails,historyStageId,programData,managementStage,examinationStageId,labvaluesStageId,dataElementGroup, activeCaseFormData, eventsData_, uicId, uicIdattribute );
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(newOpen);
  };

  const handleClickInside = (event) => {
    event.stopPropagation(); // Prevent closing the drawer if clicking inside
  };

  const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState(
      window.innerWidth <= 600 ? "mobile" : window.innerWidth <= 1024 ? "tablet" : "desktop"
    );
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 600) {
          setDeviceType("mobile");
        } else if (window.innerWidth <= 1024) {
          setDeviceType("tablet");
        } else {
          setDeviceType("desktop");
        }
      };
  
      window.addEventListener("resize", handleResize);
      
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return deviceType;
  };

  const deviceType = useDeviceType();
  const { t } = useTranslation();
  const DrawerList = (
    <Box 
      sx={{ width: 436 }} 
      role="presentation" 
      onMouseDown={handleClickInside}  // Prevent closing if clicking inside the drawer
      className="newProfileSection"
    >
      <ProfileFormSection initialValues={initialValues} trackentityInstanceDetails={
                              trackentityInstanceDetails //trackentityInstanceDetails
                            } historyStageId={historyStageId} programData={programData} managementStage={managementStage} onClose={() => setOpen(false)} examinationStageId={examinationStageId} labvaluesStageId={labvaluesStageId} dataElementGroup={dataElementGroup}  activeCaseFormData={activeCaseFormData} eventsData={eventsData_} uicId={uicId} uicIdattribute={uicIdattribute} glucometerFieldMap={glucometerFieldMap} userrolename={userrolename}/>
    </Box>
  );

  return (
    
    <div>
    <>
          {(deviceType === "tablet" || deviceType === "desktop")  && (
      <Button 
        variant="outlined" 
        color="primary" 
        className="viewButton" 
        size="small" 
        onClick={toggleDrawer(true)}
      >
        {t("Open Quick View")}
      </Button>
   )}
       {deviceType === "mobile" && (
      <IconButton  color="inherit" aria-label="">
      <FolderOpen sx={{ color: "inherit" }} onClick={toggleDrawer(true)}/>
      </IconButton>
      )}
  </>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)} // Close the drawer when clicking outside
        className="profileDrawer"
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
