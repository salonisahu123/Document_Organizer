// import React, { useEffect, useState } from "react";

// import LeftPanel from "../components/LeftPanel";
// import CenterPanel from "../components/CenterPanel";
// import RightPanel from "../components/RightPanel";

// import {
//   getDocuments,
//   classifyDocument,
//   nextDocument,
//   skipDocument,
//   getPdfBase64,
// } from "../api/api.jsx";

// const DocumentOrganizer = ({ remoteConfig }) => {
//   const [inputFolder, setInputFolder] = useState("");
//   const [outputFolder, setOutputFolder] = useState("");

//   const [pdfFiles, setPdfFiles] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [pdfDataUrl, setPdfDataUrl] = useState(null);

//   const [isProcessingStarted, setIsProcessingStarted] = useState(false);

//   const [rotation, setRotation] = useState(0);

//   const [croppedFile, setCroppedFile] = useState(null);

//   const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);

//   // Current PDF update
//   useEffect(() => {
//     if (pdfFiles.length > 0) {
//       setSelectedPdf(pdfFiles[currentIndex]);

//       setRotation(0);
//     } else {
//       setSelectedPdf(null);
//     }
//   }, [pdfFiles, currentIndex]);

//   // PDF Preview
//   useEffect(() => {
//     const loadPdf = async () => {
//       if (!selectedPdf) {
//         setPdfDataUrl(null);
//         return;
//       }

//       try {
//         const filePath =
//           typeof selectedPdf === "string"
//             ? selectedPdf
//             : selectedPdf.path || selectedPdf.filePath || "";

//         if (!filePath) return;

//         const response = await getPdfBase64(filePath);

//         const base64 = response.data.base64;

//         if (base64) {
//           setPdfDataUrl(`data:application/pdf;base64,${base64}`);
//         } else {
//           setPdfDataUrl(null);
//         }
//       } catch (err) {
//         console.error("PDF Load Error:", err);

//         setPdfDataUrl(null);
//       }
//     };

//     loadPdf();
//   }, [selectedPdf]);

//   // Cropped file ka preview load karo (RightPanel mein dikhane ke liye)
//   useEffect(() => {
//     const loadCroppedPreview = async () => {
//       if (!croppedFile) {
//         setCroppedPreviewUrl(null);
//         return;
//       }

//       try {
//         const response = await getPdfBase64(croppedFile);
//         const base64 = response.data.base64;

//         if (base64) {
//           setCroppedPreviewUrl(`data:application/pdf;base64,${base64}`);
//         } else {
//           setCroppedPreviewUrl(null);
//         }
//       } catch (err) {
//         console.error("Cropped Preview Load Error:", err);
//         setCroppedPreviewUrl(null);
//       }
//     };

//     loadCroppedPreview();
//   }, [croppedFile]);

//   // Start Processing
//   const handleStartProcessing = async () => {
//     if (!inputFolder || !outputFolder) {
//       alert("Please select both folders.");
//       return;
//     }

//     try {
//       const response = await getDocuments(inputFolder);

//       const files = response.data.documents;

//       if (!files || files.length === 0) {
//         alert("No PDF files found.");
//         return;
//       }

//       setPdfFiles(files);

//       setCurrentIndex(0);

//       setIsProcessingStarted(true);
//     } catch (err) {
//       console.error("Start Processing Error:", err);

//       alert("Failed to load documents.");
//     }
//   };

//   // Classify
//   const handleClassify = async (category) => {
//     if (!selectedPdf) return;

//     try {
//       const data = {
//         sourceFile: croppedFile || selectedPdf.path,

//         outputFolder,

//         category,

//         rotation,
//       };

//       console.log("Sending classify data:", data);

//       await classifyDocument(data);

//       setCroppedFile(null);
//       setCroppedPreviewUrl(null);
//     } catch (err) {
//       console.log("Classify Error:", err);
//     }
//   };

//   // Next
//   const handleNext = async () => {
//     try {
//       const response = await nextDocument(pdfFiles, currentIndex);

//       if (response.data.document) {
//         setCurrentIndex(response.data.currentIndex);

//         setRotation(0);
//       } else {
//         alert("All PDFs processed.");
//       }
//     } catch (err) {
//       console.error("Next Error:", err);
//     }
//   };

//   // Previous
//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   // Skip
//   const handleSkip = async () => {
//     try {
//       const response = await skipDocument(pdfFiles, currentIndex);

//       if (response.data.document) {
//         setCurrentIndex(response.data.currentIndex);
//       } else {
//         alert("All PDFs processed.");
//       }
//     } catch (err) {
//       console.error("Skip Error:", err);
//     }
//   };

//   // Reset
//   const handleReset = () => {
//     setInputFolder("");

//     setOutputFolder("");

//     setPdfFiles([]);

//     setCurrentIndex(0);

//     setSelectedPdf(null);

//     setPdfDataUrl(null);

//     setCroppedFile(null);
//     setCroppedPreviewUrl(null);

//     setRotation(0);

//     setIsProcessingStarted(false);
//   };

//   return (
//     <div className="flex h-screen gap-3 bg-slate-100 p-3">
//       <LeftPanel
//         inputFolder={inputFolder}
//         outputFolder={outputFolder}
//         setInputFolder={setInputFolder}
//         setOutputFolder={setOutputFolder}
//         onStartProcessing={handleStartProcessing}
//         onResetAll={handleReset}
//       />

//       <CenterPanel
//         isProcessingStarted={isProcessingStarted}
//         selectedPdf={selectedPdf}
//         pdfUrl={pdfDataUrl}
//         rotation={rotation}
//         setRotation={setRotation}
//         outputFolder={outputFolder}
//         setCroppedFile={setCroppedFile}
//       />

//       <RightPanel
//         pageInfo={{
//           current: pdfFiles.length === 0 ? 0 : currentIndex + 1,

//           total: pdfFiles.length,
//         }}
//         folderName={inputFolder}
//         filesProcessed={currentIndex}
//         onClassify={handleClassify}
//         onNext={handleNext}
//         onPrevious={handlePrevious}
//         onSkip={handleSkip}
//         croppedPreviewUrl={croppedPreviewUrl}
//       />
//     </div>
//   );
// };

// export default DocumentOrganizer;


import React, { useEffect, useState } from "react";

import LeftPanel from "../components/LeftPanel";
import CenterPanel from "../components/CenterPanel";
import RightPanel from "../components/RightPanel";

import {
  getDocuments,
  classifyDocument,
  nextDocument,
  skipDocument,
  getPdfBase64,
  cropDocument,
} from "../api/api.jsx";

const DocumentOrganizer = ({ remoteConfig }) => {
  const [inputFolder, setInputFolder] = useState("");
  const [outputFolder, setOutputFolder] = useState("");

  const [pdfFiles, setPdfFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  const [isProcessingStarted, setIsProcessingStarted] = useState(false);

  const [rotation, setRotation] = useState(0);

  const [croppedFile, setCroppedFile] = useState(null);

  // Crop mode ke liye
  const [showCrop, setShowCrop] = useState(false);
  const [cropData, setCropData] = useState(null);

  // Current PDF update
  useEffect(() => {
    if (pdfFiles.length > 0) {
      setSelectedPdf(pdfFiles[currentIndex]);
      setRotation(0);
      setShowCrop(false);
      setCropData(null);
    } else {
      setSelectedPdf(null);
    }
  }, [pdfFiles, currentIndex]);

  // PDF Preview
  useEffect(() => {
    const loadPdf = async () => {
      if (!selectedPdf) {
        setPdfDataUrl(null);
        return;
      }

      try {
        const filePath =
          typeof selectedPdf === "string"
            ? selectedPdf
            : selectedPdf.path || selectedPdf.filePath || "";

        if (!filePath) return;

        // const response = await getPdfBase64(filePath);
        // const base64 = response.data.base64;

        // if (base64) {
        //   setPdfDataUrl(`data:application/pdf;base64,${base64}`);
        // } else {
        //   setPdfDataUrl(null);
        // }
        const response = await getPdfBase64(filePath);

const base64 = response.data.base64;

if (base64) {
  const extension =
    (
      selectedPdf.extension ||
      filePath.substring(filePath.lastIndexOf("."))
    ).toLowerCase();

  let mimeType = "application/pdf";

  if (extension === ".png") {
    mimeType = "image/png";
  } else if (
    extension === ".jpg" ||
    extension === ".jpeg"
  ) {
    mimeType = "image/jpeg";
  }

  setPdfDataUrl(`data:${mimeType};base64,${base64}`);
} else {
  setPdfDataUrl(null);
}
      } catch (err) {
        console.error("PDF Load Error:", err);
        setPdfDataUrl(null);
      }
    };

    loadPdf();
  }, [selectedPdf]);

  // Start Processing
  const handleStartProcessing = async () => {
    if (!inputFolder || !outputFolder) {
      alert("Please select both folders.");
      return;
    }

    try {
      const response = await getDocuments(inputFolder);
      const files = response.data.documents;

      if (!files || files.length === 0) {
        alert("No supported documents found.");
        return;
      }

      setPdfFiles(files);
      setCurrentIndex(0);
      setIsProcessingStarted(true);
    } catch (err) {
      console.error("Start Processing Error:", err);
      alert("Failed to load documents.");
    }
  };

  // Classify (ab crop-save bhi isi ke andar hoga agar crop mode active hai)
  const handleClassify = async (category) => {
    if (!selectedPdf) return;

    try {
      let fileToClassify = croppedFile || selectedPdf.path;

      // Agar crop mode active hai aur user ne crop area select ki hai,
      // pehle crop ko backend mein save karo
      if (showCrop && cropData) {
        const cropResponse = await cropDocument({
          filePath: selectedPdf.path,
          cropData,
          outputFolder,
        });

        fileToClassify = cropResponse.data.file;
        console.log("Cropped File:", fileToClassify);
      }

      const data = {
        sourceFile: fileToClassify,
        outputFolder,
        category,
        rotation,
      };

      console.log("Sending classify data:", data);

      await classifyDocument(data);

      // Reset crop-related state
      setCroppedFile(null);
      setCropData(null);
      setShowCrop(false);
    } catch (err) {
      console.log("Classify Error:", err);
    }
  };

  // Next
  const handleNext = async () => {
    try {
      const response = await nextDocument(pdfFiles, currentIndex);

      if (response.data.document) {
        setCurrentIndex(response.data.currentIndex);
        setRotation(0);
      } else {
        alert("All PDFs processed.");
      }
    } catch (err) {
      console.error("Next Error:", err);
    }
  };

  // Previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Skip
  const handleSkip = async () => {
    try {
      const response = await skipDocument(pdfFiles, currentIndex);

      if (response.data.document) {
        setCurrentIndex(response.data.currentIndex);
      } else {
        alert("All PDFs processed.");
      }
    } catch (err) {
      console.error("Skip Error:", err);
    }
  };

  // Reset
  const handleReset = () => {
    setInputFolder("");
    setOutputFolder("");
    setPdfFiles([]);
    setCurrentIndex(0);
    setSelectedPdf(null);
    setPdfDataUrl(null);
    setCroppedFile(null);
    setCropData(null);
    setShowCrop(false);
    setRotation(0);
    setIsProcessingStarted(false);
  };

  return (
    <div className="flex h-screen gap-3 bg-slate-100 p-3">
      <LeftPanel
        inputFolder={inputFolder}
        outputFolder={outputFolder}
        setInputFolder={setInputFolder}
        setOutputFolder={setOutputFolder}
        onStartProcessing={handleStartProcessing}
        onResetAll={handleReset}
      />

      <CenterPanel
        isProcessingStarted={isProcessingStarted}
        selectedPdf={selectedPdf}
        pdfUrl={pdfDataUrl}
        rotation={rotation}
        setRotation={setRotation}
        showCrop={showCrop}
        setShowCrop={setShowCrop}
        setCropData={setCropData}
      />

      <RightPanel
        pageInfo={{
          current: pdfFiles.length === 0 ? 0 : currentIndex + 1,
          total: pdfFiles.length,
        }}
        folderName={inputFolder}
        filesProcessed={currentIndex}
        onClassify={handleClassify}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default DocumentOrganizer;