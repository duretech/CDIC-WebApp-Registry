import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export const printprescription = async (setGlobalSpinner, id) => {
  setGlobalSpinner(true);
  let originalDisplay = '';

  try {
  
    const element = document.getElementById(id);
    originalDisplay = element.style.display;
    element.style.display = 'block';

    if (!element) {
      console.error("Element not found");
      setGlobalSpinner(false);
      return;
    }

  
    const elementWidth = element.scrollWidth;
    const elementHeight = element.scrollHeight;

    const pixelRatio = 3; 


    const imgData = await htmlToImage.toPng(element, {
      backgroundColor: "#FFFFFF",
      pixelRatio,
      width: elementWidth,
      height: elementHeight,
    });

   
    const pdfWidth = 210; 
    const pdfHeight = 297; 
    const imgWidth = pdfWidth; 
    const imgHeight = (elementHeight * pdfWidth) / elementWidth;

    // Create jsPDF instance
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    

    if (imgHeight <= pdfHeight) {
    
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
     
      let currentHeight = 0;

      while (currentHeight < imgHeight) {
        doc.addImage(
          imgData,
          "PNG",
          0,
          -currentHeight,
          imgWidth,
          imgHeight
        );

        currentHeight += pdfHeight;

        if (currentHeight < imgHeight) {
          doc.addPage();
        }
      }
    }
    if(id == "prescriptionPdf") {
      const pdfBlobUrl = doc.output("bloburl");  // Convert to Blob URL
      // window.open(pdfBlobUrl, "_blank"); 
      const printWindow = window.open(pdfBlobUrl, "_blank");

         // Close the window after printing or canceling
    if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
  
          // Listen for print dialog close event
          printWindow.onafterprint = () => {
            printWindow.close();
            URL.revokeObjectURL(pdfBlobUrl); // Cleanup blob URL
          };
  
          // Fallback: If `onafterprint` doesn't work, auto-close after a delay
          // setTimeout(() => {
          //   if (!printWindow.closed) {
          //     printWindow.close();
          //     URL.revokeObjectURL(pdfBlobUrl); // Cleanup blob URL
          //   }
          // }, 9000); // Closes after 5 seconds if print dialog doesn't trigger `onafterprint`
        };
      }
      // Trigger print preview after PDF loads
    //   setTimeout(() => {
    //     printWindow.focus();
    //     printWindow.print();
    //   }, 3000); 
   
    } else {
    // doc.save("patient_summary.pdf");
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    setGlobalSpinner(false);
    let ele = document.getElementById(id)
   // ele.style.display = "none"
   ele.style.display = originalDisplay;
  }
};




