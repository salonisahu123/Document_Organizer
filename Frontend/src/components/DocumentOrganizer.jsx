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
} from "../api/api.jsx";

const DocumentOrganizer = () => {
  const [inputFolder, setInputFolder] = useState("");
  const [outputFolder, setOutputFolder] = useState("");

  const [pdfFiles, setPdfFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  const [isProcessingStarted, setIsProcessingStarted] = useState(false);
  const [rotation,setRotation] = useState(0);

  // Current PDF update
  useEffect(() => {
    if (pdfFiles.length > 0) {
      setSelectedPdf(pdfFiles[currentIndex]);
    } else {
      setSelectedPdf(null);
    }
  }, [pdfFiles, currentIndex]);

  // PDF Preview
  useEffect(() => {
     console.log("Selected PDF:", selectedPdf);
    const loadPdf = async () => {
      if (!selectedPdf) {
        setPdfDataUrl(null);
        return;
      }

      try {
        const filePath = typeof selectedPdf === "string" ? selectedPdf : (selectedPdf.path || selectedPdf.filePath || "");
        
        if (!filePath) return;

        const response = await getPdfBase64(filePath);

        const base64 = response.data.base64;

        if (base64) {
          setPdfDataUrl(`data:application/pdf;base64,${base64}`);
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
        alert("No PDF files found.");
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


// DocumentOrganizer.jsx
const handleClassify = async (category) => {

  if (!selectedPdf) return;

  try {

    const data = {
      sourceFile: selectedPdf.path,
      outputFolder,
      category,
      rotation,
    };

    console.log("Sending classify data:", data);

    await classifyDocument(data);

    handleNext();

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