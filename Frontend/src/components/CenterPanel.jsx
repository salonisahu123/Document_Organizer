

import React from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import CropModal from "./CropModal";

const CenterPanel = ({
  isProcessingStarted,
  selectedPdf,
  pdfUrl,
  rotation,
  setRotation,
  showCrop,
  setShowCrop,
  setCropData,
}) => {
  const [numPages, setNumPages] = React.useState(null);

  const extension = selectedPdf?.extension?.toLowerCase();
const isPdf = extension === ".pdf";
const isImage = [".png", ".jpg", ".jpeg"].includes(extension);

  if (!isProcessingStarted) {
    return (
      <section className="flex-1 bg-[#fdf2f8] rounded-2xl border border-pink-200 shadow-md flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl">📄</div>
          <h2 className="text-2xl font-bold text-[#801446]">
            Document Organizer
          </h2>
        </div>
      </section>
    );
  }

  if (!selectedPdf) {
    return (
      <div className="flex-1 flex items-center justify-center">
        No Document Found
      </div>
    );
  }

  return (
    <section className="flex-1 bg-[#fdf2f8] rounded-2xl border border-pink-200 shadow-md flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#801446]">Document Preview</h2>
            <p>{selectedPdf.name}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="px-4 py-2 bg-[#801446] text-white rounded-lg"
            >
              Rotate PDF ↻
            </button>

            <button
              onClick={() => setShowCrop(true)}
              className="px-4 py-2 bg-[#701235] text-white rounded-lg"
            >
              Crop
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto flex justify-center bg-gray-100 relative">
        {/* {!showCrop && pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={(data) => {
              setNumPages(data.numPages);
            }}
          >
            <Page pageNumber={1} rotate={rotation} width={700} />
          </Document>
        )} */}
{!showCrop && pdfUrl && (
  <>
    {isPdf ? (
      <Document
        file={pdfUrl}
        onLoadSuccess={(data) => {
          setNumPages(data.numPages);
        }}
      >
        <Page
          pageNumber={1}
          rotate={rotation}
          width={700}
        />
      </Document>
    ) : (
      <img
        src={pdfUrl}
        alt={selectedPdf.name}
        className="max-w-full max-h-full object-contain"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      />
    )}
  </>
)}
        {showCrop && (
          <CropModal
            imageUrl={pdfUrl}
            filePath={selectedPdf.path}
            onClose={() => {
              setShowCrop(false);
              setCropData(null);
            }}
            onCropChange={(data) => setCropData(data)}
          />
        )}
      </div>
    </section>
  );
};

export default CenterPanel;
