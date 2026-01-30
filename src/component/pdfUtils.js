import React, { useState } from 'react';
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { useGlobalSpinnerActionsContext } from "../context/GlobalSpinnerContext";




export const downloadSurveyPDF = async (setGlobalSpinner) => {
  setGlobalSpinner(true)
  const doc = new jsPDF("p", "px", "a4");
  let elements = ['form']

  const requestPermissions = (callback) => {
    console.log("Requesting permissions...");
    if (window.cordova?.plugins?.permissions) {
      var permissions = window.cordova.plugins.permissions;
      permissions.requestPermission(
        permissions.WRITE_EXTERNAL_STORAGE,
        function (status) {
          if (status.hasPermission) {
            console.log("Permission granted");
            callback();
          } else {
            console.error("Permission deniedwriting");
            setGlobalSpinner(false);
          }
        },
        function (error) {
          console.error("Permission request failed:", error);
          setGlobalSpinner(false);
        }
      );
    } else {
      console.log("Cordova permissions plugin not available, proceeding...");
      callback();
    }
  };

  const downloadForMobile = async (pdfBlob, name) => {
    console.log("Initiating mobile download for:", name);
    requestPermissions(() => {
      if (window.cordova?.file) {
        // let filePath = window.cordova.file.externalDataDirectory || window.cordova.file.dataDirectory;
        let filePath = window.cordova.file.dataDirectory;
        console.log("Resolved file path:", filePath);

        window.resolveLocalFileSystemURL(filePath, function (directoryEntry) {
          console.log("File system URL resolved");

          directoryEntry.getFile(name, { create: true }, function (fileEntry) {
            console.log("File entry created:", fileEntry.fullPath);

            fileEntry.createWriter(function (fileWriter) {
              console.log("File writer created");

              fileWriter.onwriteend = function () {
                console.log("Successful file write...", fileEntry.nativeURL);
                window.cordova.plugins.fileOpener2.open(
                  fileEntry.nativeURL,
                  "application/pdf",
                  {
                    error: function (e) {
                      console.error("Error opening file:", e);
                    },
                    success: function () {
                      console.log("File opened successfully");
                    }
                  }
                );
              };

              fileWriter.onerror = function (e) {
                console.error("Failed file write:", e);
              };

              // fileWriter.write(pdfBlob);
              console.log("Writing to file...");
              fileWriter.write(new Blob([pdfBlob], { type: "application/pdf" }));
            });
          }, function (error) {
            console.error("Failed to create file:", error.code);
          });
        }, function (error) {
          console.error("Failed to resolve file system URL:", error.code);
        });
      } else {
        console.error("Cordova file plugin not available");
      }
    });
  };

  await creatPdf({ doc, elements, setGlobalSpinner })
  if (window.cordova) {
    console.log('called')
    const pdfBlob = await doc.output("blob");
    downloadForMobile(pdfBlob, "patient_summary.pdf")
  } else {

    doc.save(`patient_summary.pdf`);
  }
  setGlobalSpinner(false)
}






async function creatPdf({ doc, elements }) {
  let top = 15;
  const padding = 10;
  let margin = "20";
  // const urls = localStorage.getItem("stringDataUrl")
  let dataUrlArr = [];
  let header = document.querySelector('.summary-header');
  if (header.classList.contains('hide')) {
    header.classList.remove("hide");
  }

  // dataUrlArr.unshift(firstPage)
  let retArray = [...elements];
  for (let i = 0; i < retArray.length; i++) {
    // el.style.backgroundColor = "White"
    let el = document.getElementById(retArray[i]);

    let imgData = await htmlToImage.toJpeg(el, {
      backgroundColor: "#FFFFFF",
      quality: 3,
    });

    // let imgData = retArray[i]
    let elHeight = el.offsetHeight;
    let elWidth = el.offsetWidth; // hardcoding this value to get perfect preview for screen width 100% 
    const pageWidth = doc.internal.pageSize.getWidth();
    if (elWidth > pageWidth) {
      const ratio = pageWidth / elWidth;
      elHeight = elHeight * ratio - padding;
      elWidth = elWidth * ratio - padding;
    }
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, "JPEG", padding, top, elWidth, elHeight, `image${i}`);
    top += elHeight;
    let heightLeft = elHeight - pageHeight;
    let calCulatedHeight;
    let testHight = 0;
    let repeatedHeight = 0;
    while (heightLeft >= 0) {
      testHight += pageHeight;
      repeatedHeight += 40; // if image cut adjust this value
      let maniPulatedHeight = testHight - repeatedHeight; //
      calCulatedHeight = elHeight - testHight;
      const whiteDiv = document.createElement("div");
      whiteDiv.style.backgroundColor = "#FFFFFF"; // Use white color
      whiteDiv.style.width = "200px"; // Adjust to your desired width
      whiteDiv.style.height = "100px"; // Adjust to your desired height
      // let position = heightLeft - elHeight;
      doc.addPage();
      document.body.appendChild(whiteDiv);
      const whiteDataUrl = await htmlToImage.toJpeg(
        whiteDiv,
        "JPEG",
        padding,
        40,
        elWidth,
        elHeight,
        `image${i}`
      );
      // Add the white space to the PDF using doc.addImage

      doc.addImage(
        imgData,
        "JPEG",
        padding,
        -maniPulatedHeight,
        elWidth,
        elHeight,
        `image${i}`
      );
      doc.addImage(whiteDataUrl, "JPEG", 0, 0, elWidth, 15, `image`); // Adjust the coordinates and size as
      heightLeft -= pageHeight - 100;
      // elHeight = elHeight - pageHeight
    }
  }

  // header.classList.add("hide");
}