import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const CenterPanel = ({
   isProcessingStarted,
  selectedPdf,
  pdfUrl,
  rotation,
  setRotation
}) => {


  const [numPages, setNumPages] = useState(null);
 


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
        No PDF Found
      </div>
    );
  }


  return (
    <section className="flex-1 bg-[#fdf2f8] rounded-2xl border border-pink-200 shadow-md flex flex-col overflow-hidden">

      <div className="p-4 bg-white border-b">

        <h2 className="font-bold text-[#801446]">
          PDF Preview
        </h2>

        <p>
          {selectedPdf.name}
        </p>


        <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)  }
          className="mt-2 px-4 py-2 bg-[#801446] text-white rounded-lg"
        >
          Rotate PDF ↻
        </button>

      </div>


      <div className="flex-1 overflow-auto flex justify-center bg-gray-100">


        {
          pdfUrl &&

          <Document
            file={pdfUrl}
            onLoadSuccess={(data)=>{
              setNumPages(data.numPages);
            }}
          >

            {
              Array.from(
                new Array(numPages),
                (el,index)=>(
                  
                  <Page
                    key={index}
                    pageNumber={1}
                    rotate={rotation}
                    width={700}
                  />

                )
              )
            }


          </Document>

        }


      </div>


    </section>
  );
};


export default CenterPanel;