import React from "react";

const CenterPanel = ({
  isProcessingStarted,
  selectedPdf,
  pdfUrl,
}) => {
  // Initial Screen
  if (!isProcessingStarted) {
    return (
      <section className="flex-1 bg-[#fdf2f8] rounded-2xl border border-pink-200/80 shadow-md flex items-center justify-center p-6">
        <div className="text-center">

          <div className="text-7xl mb-4">📄</div>

          <h2 className="text-2xl font-bold text-[#801446]">
            Document Organizer
          </h2>

          <p className="text-slate-600 mt-2 font-medium">
            Select Input and Output folders
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Then click
            <span className="font-semibold text-[#801446]">
              {" "}
              Start Processing
            </span>
          </p>

        </div>
      </section>
    );
  }

  // No PDF Found
  if (!selectedPdf) {
    return (
      <section className="flex-1 bg-[#fdf2f8] rounded-2xl border border-pink-200/80 shadow-md flex items-center justify-center p-6">
        <div className="text-center">

          <div className="text-6xl mb-4">📂</div>

          <h2 className="text-xl font-bold text-[#801446]">
            No PDF Found
          </h2>

          <p className="text-slate-500 mt-2">
            Selected folder does not contain PDF files.
          </p>

        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 bg-[#fdf2f8] rounded-2xl border border-pink-200/80 shadow-md flex flex-col overflow-hidden">

      {/* Header */}
      <div className="border-b border-pink-200/80 p-4 bg-white/80 backdrop-blur-sm">

        <h2 className="font-bold text-[#801446]">
          PDF Preview
        </h2>

        <p className="text-sm font-medium text-slate-700 truncate mt-1">
          {selectedPdf.name}
        </p>

        <p className="text-xs text-slate-400 truncate">
          {selectedPdf.path}
        </p>

      </div>

      {/* Preview Container */}
      <div className="flex-1 bg-pink-50/50 relative">

        {pdfUrl ? (
          <iframe
            title="PDF Preview"
            src={pdfUrl}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="h-full flex items-center justify-center">

            <div className="text-center">

              <div className="text-5xl mb-4 animate-pulse">
                ⏳
              </div>

              <h2 className="text-lg font-semibold text-[#801446]">
                Loading PDF...
              </h2>

            </div>

          </div>
        )}

      </div>

    </section>
  );
};

export default CenterPanel;