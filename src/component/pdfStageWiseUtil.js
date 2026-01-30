import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

export const downloadStagePDF = async (setGlobalSpinner, id) => {
  setGlobalSpinner(true);
  let originalDisplay = "";

  // Platform-specific configuration
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
          img.onerror = resolve; // even if it fails, we continue
        })
      );
    }
  }

  await Promise.all(loadPromises);
};

const ensureImagePainted = (imgId) =>
  new Promise((resolve) => {
    const img = document.getElementById(imgId);
    if (!img || !img.complete) {
      img.onload = () => {
        requestAnimationFrame(() => {
          resolve();
        });
      };
    } else {
      requestAnimationFrame(() => {
        resolve();
      });
    }
  });


  // Direct file save to storage
  const savePdfToStorage = (blob, filename) => {
    const config = getPlatformConfig();

    window.resolveLocalFileSystemURL(
      config.primaryStoragePath,
      function (dirEntry) {
        dirEntry.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {
          fileEntry.createWriter(function (writer) {
            writer.onwriteend = function () {
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

  // Try multiple storage locations
  const tryAlternativeStorageLocations = (blob, filename) => {
    const config = getPlatformConfig();
    tryDownloadWithPaths(blob, filename, config.fallbackPaths, 0);
  };

  // Alternative download methods for browsers or when file system fails
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
      }).catch((error) => {
      });
    } else {
    }
  };

  const downloadFileToDevice = (pdfBlob, name) => {

    if (window.cordova) {
      savePdfToStorage(pdfBlob, name);
    } else {
      downloadWithBrowserFallback(pdfBlob, name);
    }
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

  // Platform-specific file opening function
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
        }
      }
    );
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

  // Generic method to try multiple opening approaches
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
          tryOpenWithMethods(methods, index + 1, fileEntry, isIOS);
        },
        success: function () {
        }
      }
    );
  };

  // Platform-specific user notification
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

  const downloadForMobile = async (pdfBlob, name) => {
    const platform = window.cordova?.platformId === 'ios' ? 'iOS' : 'Android';
    downloadFileToDevice(pdfBlob, name);
  };

  try {
    
   // await new Promise(resolve => setTimeout(resolve, 25000));
  // await ensureImagePainted("cdicLogoImg");
await new Promise((res) => setTimeout(res, 1000)); // small extra delay
    const element = document.getElementById(id);
    if (!element) {
      console.error("Element not found");
      setGlobalSpinner(false);
      return;
    }

    originalDisplay = element.style.display;
    element.style.display = "block";
    // await waitForImageLoadInsidePDFContainer(id);

    // 🧼 iOS only: force reflow/layout paint
    if (window.cordova?.platformId === 'ios') {
      window.scrollTo(0, 1);
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const elementWidth = element.scrollWidth;
    const elementHeight = element.scrollHeight;

    const pixelRatio = 1;
    // const logoImg = document.querySelector('#' + id + ' img');
    // if (logoImg) {
    //   while (!logoImg.complete) {
        // console.log("Waiting for image to load...");
        // await new Promise(resolve => setTimeout(resolve, 5000));
    //   }
    // }
    
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
        doc.addImage(imgData, "PNG", 0, -currentHeight, imgWidth, imgHeight);
        currentHeight += pdfHeight;
        if (currentHeight < imgHeight) {
          doc.addPage();
        }
      }
    }

    const pdfBlob = await doc.output("blob");

    if (window.cordova) {
      const platform = window.cordova.platformId === 'ios' ? 'iOS' : 'Android';
      downloadForMobile(pdfBlob, id === "prescriptionPdf" ? "patient_prescription.pdf" : "patient_summary.pdf");
    } else {
      doc.save(id === "prescriptionPdf" ? "patient_prescription.pdf" : "patient_summary.pdf");
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    setGlobalSpinner(false);
    if (document.getElementById(id)) {
      document.getElementById(id).style.display = originalDisplay;
    }
  }
};