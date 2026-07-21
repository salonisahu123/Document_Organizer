import React, { useEffect, useState } from "react";

import LeftPanel from "../components/LeftPanel";
import CenterPanel from "../components/CenterPanel";
import RightPanel from "../components/RightPanel";

const DocumentOrganizer = () => {
  const [inputFolder, setInputFolder] = useState("");
  const [outputFolder, setOutputFolder] = useState("");

  const [pdfFiles, setPdfFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  const [isProcessingStarted, setIsProcessingStarted] = useState(false);

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
    const loadPdf = async () => {
      if (!selectedPdf) {
        setPdfDataUrl(null);
        return;
      }

      try {
        const base64 = await window.electronAPI.getPdfBase64(
          selectedPdf.path
        );

        if (base64) {
          setPdfDataUrl(
            `data:application/pdf;base64,${base64}`
          );
        } else {
          setPdfDataUrl(null);
        }
      } catch (err) {
        console.log(err);
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

    const files =
      await window.electronAPI.readPdfFiles(
        inputFolder
      );

    if (!files || files.length === 0) {
      alert("No PDF files found.");
      return;
    }

    setPdfFiles(files);
    setCurrentIndex(0);
    setIsProcessingStarted(true);
  };

  // Classification
  const handleClassify = async (category) => {
    if (!selectedPdf) return;

    try {
      await window.electronAPI.classifyPdf({
        sourceFile: selectedPdf.path,
        outputFolder,
        category,
      });

      handleNext();
    } catch (err) {
      console.log(err);
    }
  };

  // Next
  const handleNext = () => {
    if (currentIndex < pdfFiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      alert("All PDFs processed.");
    }
  };

  // Previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Skip
  const handleSkip = () => {
    handleNext();
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
      />

      <RightPanel
        pageInfo={{
          current:
            pdfFiles.length === 0
              ? 0
              : currentIndex + 1,
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