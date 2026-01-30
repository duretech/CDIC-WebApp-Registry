import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PdfComponent from "../pdfComponent/PdfComponent";
import { downloadStagePDF } from "../pdfStageWiseUtil";
import { downloadStagePDFIOS } from "../pdfStageWiseUtilIOS";
import PouchDB from 'pouchdb';
import "../../../src/assets/css/customstyles.css";

const PdfPreviewPage = () => {
  const [props, setProps] = useState(null);
 
  const history = useHistory();

  useEffect(() => {
    const fetchPayloadFromPouchDB = async () => {
      try {
        const db = new PouchDB('myDatabase');
        const doc = await db.get("pdf_payload");
        setProps(doc);
      } catch (err) {
        console.error("Error fetching PDF payload from PouchDB:", err);
      }
    };

    fetchPayloadFromPouchDB();
  }, []);

  useEffect(() => {
    if (!props) return;
requestAnimationFrame(() => {
    const timer = setTimeout(() => {
      downloadStagePDFIOS(
        () => {},
        props.APP_LOCALE === "CC011" ? "prescriptionPdfG" : "prescriptionPdf",
        "prescriptionHeaderDiv",props.medIconUrl
      );
    //  setTimeout(() => history.goBack(), 1500); // go back after download
    }, 500);
     return () => clearTimeout(timer);
    });

   
  }, [props]);

  if (!props) return <div>Preparing PDF...</div>;

  return (
   

   <div
                                id="prescriptionPdf"
                                style={{
                                  // display: "none",
                                  position: "fixed",
                                  top: 0,
                                  left: 0,
                                  width: "1324px", // Ensure fixed width
                                  height: "1123px", // Ensure fixed height
                                  transform: "scale(1)",
                                  transformOrigin: "top left",
                                  background: "white",
                                  boxSizing: "border-box",
                                  zIndex: 9999, // Push it behind everything
                                }}
                              >
  {/* <div id={props.APP_LOCALE === "CC011" ? "prescriptionPdfG" : "prescriptionPdf"}> */}
      <PdfComponent
        GroupArr={props.GroupArr}
        data={props.data}
        allStages={props.allStages}
        groupStages={props.groupStages}
        insulinTable={props.insulinTable}
        radRows={props.radRows}
        labRows={props.labRows}
        uicIdattribute={props.uicIdattribute}
        managementStage={props.managementStage}
        labId={props.labId}
        radId={props.radId}
        programData={props.programData}
        dataElementGroup={props.dataElementGroup}
        medIconUrl={props.medIconUrl}
        logoReady={props.logoReady}
      />
    </div>
    //  </>
  );
};

export default PdfPreviewPage;

// const PdfPreviewPage = () => {
//   const location = useLocation();
//   const history = useHistory();
//   const props = location.state?.data || {};

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       downloadStagePDF(
//         () => {},
//         props.APP_LOCALE === "CC011" ? "prescriptionPdfG" : "prescriptionPdf",
//         "prescriptionHeaderDiv"
//       );
//       setTimeout(() => history.goBack(), 1500); // go back after download
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div id={props.APP_LOCALE === "CC011" ? "prescriptionPdfG" : "prescriptionPdf"}>
//       <PdfComponent
//         GroupArr={props.GroupArr}
//         data={props.sorted_obj}
//         allStages={props.allStages}
//         groupStages={props.groupStages}
//         insulinTable={props.insulinTable}
//         getTranslatedLabels={props.getTranslatedLabels}
//         GetInsulinTableDetail={props.GetInsulinTableDetail}
//         getEntityData={props.getEntityData}
//         radRows={props.radRows}
//         labRows={props.labRows}
//         uicIdattribute={props.uicId}
//         managementStage={props.managementStage}
//         labId={props.labId}
//         radId={props.radId}
//         programData={props.programData}
//         dataElementGroup={props.dataElementGroup}
//         medIconUrl_={props.medIconUrl}
//         logoReady={props.logoReady}
//       />
//     </div>
//   );
// };

// export default PdfPreviewPage;
