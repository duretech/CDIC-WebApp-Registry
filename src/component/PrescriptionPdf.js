import { jsPDF } from "jspdf";
import html2canvas from "html-to-image";



export const generatePrescriptionPDF = (formData) => {
  console.log('xcalled')

  const doc = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4 size

  // **Step 1: Add Background Image**
  const backgroundImage = "data:image/png;base64,..."; // Base64 string of the background image
  doc.addImage(backgroundImage, "PNG", 0, 0, 210, 297); // Full-page background


  const logo = "data:image/png;base64,..."; // Base64 string of the doctor's logo
  doc.addImage(logo, "PNG", 10, 10, 30, 30); // Logo at the top left corner
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40); // Dark gray
  doc.text("My Hospital", 105, 20, null, null, "center"); // Centered hospital name
  doc.setFontSize(10);
  doc.text("1234 Street Name, City, Country", 105, 26, null, null, "center");


  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Black text
  doc.text("Prescription for:", 10, 50);
  doc.setFont("times", "italic");
  doc.text(`Name: ${formData.patientName}`, 10, 60);
  doc.text(`Age: ${formData.age}`, 10, 70);
  doc.text(`Diagnosis: ${formData.diagnosis}`, 10, 80);


  doc.setFont("times", "normal");
  const paragraph = `
    ${formData.patientName} is diagnosed with ${formData.diagnosis}. 
    The prescribed medications are listed below. Please follow the dosage as instructed.
  `;
  doc.text(paragraph, 10, 90, { maxWidth: 190 });

  // **Rx Section**
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Rx:", 10, 130);

  formData.medications.forEach((medication, index) => {
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`- ${medication}`, 15, 140 + index * 10);
  });

  // **Step 4: Add Footer**
  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.text(`Doctor: ${formData.doctorName}`, 10, 270);

  const signature = "data:image/png;base64,..."; 
  doc.addImage(signature, "PNG", 150, 250, 50, 20); // Place signature

  // Save the PDF
  doc.save("Prescription.pdf");
};
