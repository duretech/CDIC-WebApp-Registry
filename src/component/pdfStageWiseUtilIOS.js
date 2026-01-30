// downloadStagePDF.js
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";
import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";
//import './nativeNavigation'; 

export const downloadStagePDFIOS = async (setGlobalSpinner, id, headerId, medIconBase64) => {

  setGlobalSpinner(true);
  let originalDisplay = "";

  const getPlatformConfig = () => {
    const isIOS = window.cordova?.platformId === 'ios';

    return {
      isIOS,
      primaryStoragePath: isIOS ? window.cordova.file.documentsDirectory : window.cordova.file.externalDataDirectory,
      fallbackPaths: isIOS
        ? [
          window.cordova.file.documentsDirectory,
          window.cordova.file.dataDirectory,
          window.cordova.file.cacheDirectory,
          window.cordova.file.tempDirectory
        ]
        : [
          window.cordova.file.externalRootDirectory + 'Download/',
          window.cordova.file.externalDataDirectory,
          window.cordova.file.dataDirectory,
          window.cordova.file.cacheDirectory,
          window.cordova.file.tempDirectory
        ]
    };
  };

  const waitForImageLoadInsidePDFContainer = async (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const imgElements = container.getElementsByTagName("img");
    const loadPromises = [];

    for (let img of imgElements) {
      if (!img.complete || img.naturalWidth === 0) {
        loadPromises.push(
          new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        );
      }
    }

    await Promise.all(loadPromises);
  };

  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const element = document.getElementById(id);
    if (!element) {
      console.error("Element not found");
      setGlobalSpinner(false);
      return;
    }

    originalDisplay = element.style.display;
    element.style.display = "block";
    await waitForImageLoadInsidePDFContainer(id);

    const elementWidth = element.scrollWidth;
    const elementHeight = element.scrollHeight;

    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => setTimeout(resolve, 1000));

    // const imgData = await domtoimage.toPng(element, {
    const imgData = await htmlToImage.toPng(element, {
      pixelRatio:0.75,
      cacheBust: true,
      useCORS: true,
      allowTaint: true,
      height: elementHeight,
      width: elementWidth,
      bgcolor: "#FFFFFF"
    });

    console.log("✅ Image base64 size:", imgData?.length);

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (elementHeight * pdfWidth) / elementWidth;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
    // Calculate logo dimensions and position
    const logoWidth = 28;  // Adjust as needed
    const logoHeight = 16; // Adjust as needed
    const logoX = 10;      // Left margin
    const logoY = 1;      // Top margin

    if (imgHeight <= pdfHeight) {
       await new Promise(resolve => setTimeout(resolve, 1000));
      // Single page - add content first, then overlay logo
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      
      // Overlay logo on top of content
      if (medIconBase64 && medIconBase64.startsWith("data:image")) {
        try {
           await new Promise(resolve => setTimeout(resolve, 2000));
          doc.addImage(medIconBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
        } catch (err) {
          console.warn("⚠️ Failed to inject logo", err);
        }
      }
    } else {
      // Multiple pages
      let currentHeight = 0;
      let pageIndex = 0;

      while (currentHeight < imgHeight) {
        // Add content first
         await new Promise(resolve => setTimeout(resolve, 2000));
        doc.addImage(imgData, "PNG", 0, -currentHeight, imgWidth, imgHeight);
        
        // Add logo only on the first page, overlaying on top
        if (pageIndex === 0 && medIconBase64 && medIconBase64.startsWith("data:image")) {
          try {
             await new Promise(resolve => setTimeout(resolve, 2000));
            doc.addImage(medIconBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
          } catch (err) {
            console.warn("⚠️ Logo injection failed on page 1", err);
          }
        }

        currentHeight += pdfHeight;
        pageIndex++;

        if (currentHeight < imgHeight) {
          doc.addPage();
        }
      }
    }

    const savePdfToStorage = (blob, filename) => {
    const config = getPlatformConfig();
    console.log(`Saving PDF for ${config.isIOS ? 'iOS' : 'Android'} to:`, config.primaryStoragePath);

    window.resolveLocalFileSystemURL(
      config.primaryStoragePath,
      function (dirEntry) {
        console.log("Directory entry resolved successfully");
        dirEntry.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {
          fileEntry.createWriter(function (writer) {
            writer.onwriteend = function () {
              console.log("PDF saved successfully to:", fileEntry.nativeURL);
              openPDFFile(fileEntry, config.isIOS);
            };
            writer.onerror = function (err) {
              tryAlternativeStorageLocations(blob, filename);
            };
            writer.write(blob);
          }, (err) => {
            tryAlternativeStorageLocations(blob, filename);
          });
        }, (err) => {
          tryAlternativeStorageLocations(blob, filename);
        });
      },
      (err) => {
        tryAlternativeStorageLocations(blob, filename);
      }
    );
  };

  const tryAlternativeStorageLocations = (blob, filename) => {
    const config = getPlatformConfig();
    tryDownloadWithPaths(blob, filename, config.fallbackPaths, 0);
  };

   const tryDownloadWithPaths = (pdfBlob, name, paths, index) => {
    if (index >= paths.length) {
      downloadWithBrowserFallback(pdfBlob, name);
      return;
    }

    const filePath = paths[index];
    const isIOS = window.cordova?.platformId === 'ios';

    window.resolveLocalFileSystemURL(filePath,
      function (directoryEntry) {

        directoryEntry.getFile(name, { create: true, exclusive: false },
          function (fileEntry) {

            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                openPDFFile(fileEntry, isIOS);
              };

              fileWriter.onerror = function (e) {
                tryDownloadWithPaths(pdfBlob, name, paths, index + 1);
              };

              fileWriter.write(new Blob([pdfBlob], { type: "application/pdf" }));
            },
              function (error) {
                tryDownloadWithPaths(pdfBlob, name, paths, index + 1);
              });
          },
          function (error) {
            tryDownloadWithPaths(pdfBlob, name, paths, index + 1);
          });
      },
      function (error) {
        tryDownloadWithPaths(pdfBlob, name, paths, index + 1);
      });
  };

   const downloadWithBrowserFallback = (pdfBlob, name) => {
    try {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      downloadWithShareAPI(pdfBlob, name);
    }
  };

   const downloadWithShareAPI = (pdfBlob, name) => {
    if (navigator.share) {
      const file = new File([pdfBlob], name, { type: 'application/pdf' });

      navigator.share({
        files: [file],
        title: 'PDF Document',
        text: 'Generated PDF document'
      }).then(() => {
        console.log("Share successful");
      }).catch((error) => {
        console.log("All download methods attempted for:", name);
      });
    } else {
      console.log("Web Share API not supported, download attempt completed");
    }
  };


   const openPDFFile = (fileEntry, isIOS) => {
    if (!window.cordova?.plugins?.fileOpener2) {
      showFileLocationToUser(fileEntry.nativeURL, isIOS);
      return;
    }

    let fileUrl = fileEntry.nativeURL;
    if (isIOS) {
      // iOS-specific URL handling
      fileUrl = processIOSFileUrl(fileUrl);
    } else {
      // Android-specific URL handling (if needed)
      fileUrl = processAndroidFileUrl(fileUrl);
    }


    window.cordova.plugins.fileOpener2.open(
      fileUrl,
      "application/pdf",
      {
        error: function (e) {
          console.error(`File opening failed for ${isIOS ? 'iOS' : 'Android'}:`, e);
          if (isIOS) {
            tryAlternativeIOSOpen(fileEntry);
          } else {
            tryAlternativeAndroidOpen(fileEntry);
          }
        },
        success: function () {
          console.log(`File opened successfully on ${isIOS ? 'iOS' : 'Android'}`);
        }
      }
    );
  };

   const showFileLocationToUser = (fileUrl, isIOS) => {
    const platform = isIOS ? 'iOS' : 'Android';
    const location = isIOS ? 'Documents folder' : 'Downloads folder';


    // Show toast notification if available
    if (window.plugins?.toast) {
      window.plugins.toast.show(`PDF saved to ${location}`, "long", "bottom");
    }

    // You can also trigger a custom notification UI here
    // Example: showCustomNotification(`PDF saved to ${location}`);
  };

  // iOS-specific URL processing
  const processIOSFileUrl = (fileUrl) => {
    // Convert http://localhost URL to file:// URL for iOS
    if (fileUrl.includes('http://localhost') || fileUrl.includes('http:/localhost')) {
      // Extract the actual file path
      const pathMatch = fileUrl.match(/\/Users\/.*$/) || fileUrl.match(/\/var\/.*$/);
      if (pathMatch) {
        fileUrl = 'file://' + pathMatch[0];
      }
    }

    // Ensure proper URL encoding for iOS
    try {
      fileUrl = encodeURI(fileUrl);
    } catch (e) {
      console.warn("iOS URL encoding failed:", e);
    }

    return fileUrl;
  };

  // Android-specific URL processing
  const processAndroidFileUrl = (fileUrl) => {
    // Android typically handles file URLs well, but add any specific processing if needed
    if (fileUrl.startsWith('content://')) {
      // Content URLs are fine for Android
      return fileUrl;
    }

    // Ensure file:// protocol for local files
    if (!fileUrl.startsWith('file://') && !fileUrl.startsWith('content://')) {
      fileUrl = 'file://' + fileUrl;
    }

    return fileUrl;
  };

  // iOS-specific alternative opening methods
  const tryAlternativeIOSOpen = (fileEntry) => {

    const alternativeMethods = [
      // Method 1: Use documents directory + filename
      () => window.cordova.file.documentsDirectory + fileEntry.name,
      // Method 2: Use file:// protocol with full path
      () => "file://" + fileEntry.fullPath,
      // Method 3: Use native URL as-is but re-encoded
      () => {
        try {
          return decodeURI(fileEntry.nativeURL);
        } catch (e) {
          return fileEntry.nativeURL;
        }
      }
    ];

    tryOpenWithMethods(alternativeMethods, 0, fileEntry, true);
  };

  // Android-specific alternative opening methods
  const tryAlternativeAndroidOpen = (fileEntry) => {

    const alternativeMethods = [
      // Method 1: Use external data directory + filename
      () => window.cordova.file.externalDataDirectory + fileEntry.name,
      // Method 2: Use file:// protocol with full path
      () => "file://" + fileEntry.fullPath,
      // Method 3: Try content:// if available
      () => fileEntry.nativeURL.replace('file://', 'content://')
    ];

    tryOpenWithMethods(alternativeMethods, 0, fileEntry, false);
  };

   const tryOpenWithMethods = (methods, index, fileEntry, isIOS) => {
    if (index >= methods.length) {
      showFileLocationToUser(fileEntry.nativeURL, isIOS);
      return;
    }

    const method = methods[index];
    const fileUrl = method();


    window.cordova.plugins.fileOpener2.open(
      fileUrl,
      "application/pdf",
      {
        error: function (e) {
          console.log(`${isIOS ? 'iOS' : 'Android'} method ${index + 1} failed:`, e);
          tryOpenWithMethods(methods, index + 1, fileEntry, isIOS);
        },
        success: function () {
          console.log(`File opened successfully with ${isIOS ? 'iOS' : 'Android'} method ${index + 1}`);
        }
      }
    );
  };


    const pdfBlob = await doc.output("blob");

    if (window.cordova) {
      const fileName = id === "prescriptionPdf" ? "patient_prescription.pdf" : "patient_summary.pdf";
      // const url = URL.createObjectURL(pdfBlob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = fileName;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(url);
      savePdfToStorage(pdfBlob, fileName);
    } else {
      doc.save(id === "prescriptionPdf" ? "patient_prescription.pdf" : "patient_summary.pdf");
    }
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
  } finally {
    setGlobalSpinner(false);
    const el = document.getElementById(id);
    if (el) el.style.display = originalDisplay;
  }
};