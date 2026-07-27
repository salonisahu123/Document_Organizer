// import React, { useState, useEffect, useRef } from "react";
// import ReactCrop from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;


// const waitForOpenCV = () =>
//   new Promise((resolve, reject) => {
//     let waited = 0;
//     const interval = 100;
//     const maxWait = 15000;

//     const check = () => {
//       if (window.cv && window.cv.Mat) {
//         resolve();
//       } else if (waited >= maxWait) {
//         reject(new Error("OpenCV load timeout"));
//       } else {
//         waited += interval;
//         setTimeout(check, interval);
//       }
//     };
//     check();
//   });

// const CropModal = ({ imageUrl, onApply, onClose }) => {
//   const [crop, setCrop] = useState({
//     unit: "px",
//     width: 300,
//     height: 700,
//     x: 0,
//     y: 0,
//   });

//   const [completedCrop, setCompletedCrop] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [detecting, setDetecting] = useState(false);
//   const [detectError, setDetectError] = useState(false);
//   const [debugImage, setDebugImage] = useState(null);

//   const imgRef = useRef(null);

//   // PDF -> preview image
//   useEffect(() => {
//     if (!imageUrl) return;

//     const loadPreview = async () => {
//       try {
//         console.log("Loading PDF preview...");

//         const pdfData = await fetch(imageUrl).then((res) => res.arrayBuffer());

//         const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

//         console.log("PDF Loaded");

//         const page = await pdf.getPage(1);
//         const viewport = page.getViewport({ scale: 1.5 });

//         const canvas = document.createElement("canvas");
//         const context = canvas.getContext("2d");

//         canvas.width = viewport.width;
//         canvas.height = viewport.height;

//         await page.render({
//           canvasContext: context,
//           viewport,
//         }).promise;

//         const image = canvas.toDataURL("image/png");
//         setPreviewImage(image);
//       } catch (error) {
//         console.error("PDF Preview Error:", error);
//       }
//     };

//     loadPreview();
//   }, [imageUrl]);

//   // Preview aane ke baad auto-detect chalao
//   useEffect(() => {
//     if (!previewImage) return;
//     autoDetectDocument(previewImage);
//   }, [previewImage]);

//   const autoDetectDocument = async (imgSrc) => {
//     setDetecting(true);
//     setDetectError(false);

//     try {
//       await waitForOpenCV();
//       const cv = window.cv;

//       const img = new Image();
//       img.src = imgSrc;
//       await new Promise((resolve, reject) => {
//         img.onload = resolve;
//         img.onerror = reject;
//       });

//       const canvas = document.createElement("canvas");
//       canvas.width = img.naturalWidth;
//       canvas.height = img.naturalHeight;
//       canvas.getContext("2d").drawImage(img, 0, 0);

//       // Image -> grayscale -> blur -> edges
//       const src = cv.imread(canvas);
//       const gray = new cv.Mat();
//       cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

//       const blurred = new cv.Mat();
//       cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

//       const edged = new cv.Mat();
//       cv.Canny(blurred, edged, 30, 100); 
      

//       const dilated = new cv.Mat();
//       const kernel = cv.Mat.ones(5, 5, cv.CV_8U); // bada kernel
//       cv.dilate(edged, dilated, kernel, new cv.Point(-1, -1), 2); 
      
//       // DEBUG: edges ko dikhane ke liye
//       const debugCanvas = document.createElement("canvas");
//       debugCanvas.width = canvas.width;
//       debugCanvas.height = canvas.height;
//       cv.imshow(debugCanvas, dilated);
//       setDebugImage(debugCanvas.toDataURL());

//       // Contours dhoondo
//       const contours = new cv.MatVector();
//       const hierarchy = new cv.Mat();
//       cv.findContours(
//         dilated,
//         contours,
//         hierarchy,
//         cv.RETR_LIST,
//         cv.CHAIN_APPROX_SIMPLE,
//       );

//       let maxArea = 0;
//       let bestRect = null;
//       const imgArea = canvas.width * canvas.height;

//       for (let i = 0; i < contours.size(); i++) {
//         const cnt = contours.get(i);
//         const area = cv.contourArea(cnt);

//         // Bahut chhota (noise) ya poori image jaisa bada contour turant skip karo
//         if (area < imgArea * 0.05 || area > imgArea * 0.95) {
//           cnt.delete();
//           continue;
//         }

//         // Shape ko simplify karke check karo — kya ye ~4-corner (document-like) hai?
//         const peri = cv.arcLength(cnt, true);
//         const approx = new cv.Mat();
//         cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

//         const numPoints = approx.rows;

//         if (numPoints >= 4 && numPoints <= 6 && area > maxArea) {
//           maxArea = area;
//           bestRect = cv.boundingRect(cnt);
//         }

//         approx.delete();
//         cnt.delete();
//       }

//       // Cleanup — memory leak se bachne ke liye zaroori
//       src.delete();
//       gray.delete();
//       blurred.delete();
//       edged.delete();
//       dilated.delete();
//       kernel.delete();
//       contours.delete();
//       hierarchy.delete();

//       if (!bestRect) {
//         console.warn("Document boundary not found — defaulting to full image.");
//         setDetectError(true);
//         setDetecting(false);

//         // Poori image ko hi default crop bana do (chhota default box nahi)
//         const displayedHeight = imgRef.current?.clientHeight || img.height;
//         const displayedWidth = imgRef.current?.clientWidth || img.width;

//         const fullCrop = {
//           unit: "px",
//           x: 0,
//           y: 0,
//           width: displayedWidth,
//           height: displayedHeight,
//         };

//         setCrop(fullCrop);
//         setCompletedCrop(fullCrop);
//         return;
//       }
//       const displayedHeight = imgRef.current?.clientHeight || img.height;
//       const scale = displayedHeight / img.height;

//       const newCrop = {
//         unit: "px",
//         x: bestRect.x * scale,
//         y: bestRect.y * scale,
//         width: bestRect.width * scale,
//         height: bestRect.height * scale,
//       };

//       setCrop(newCrop);
//       setCompletedCrop(newCrop);
//     } catch (error) {
//       console.error("Auto-detect failed:", error);
//       setDetectError(true);
//     } finally {
//       setDetecting(false);
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col bg-white">
//       <div className="p-3 border-b flex items-center justify-between">
//         <h2 className="font-bold text-[#701235]">Crop Document</h2>
//       </div>

//       <div className="flex-1 overflow-auto bg-gray-100 p-4">
//         {previewImage ? (
//           <ReactCrop
//             crop={crop}
//             onChange={(c) => setCrop(c)}
//             onComplete={(c) => setCompletedCrop(c)}
//           >
//             <img
//               ref={imgRef}
//               src={previewImage}
//               alt="crop"
//               style={{
//                 display: "block",
//                 width: "auto",
//                 maxHeight: "700px",
//                 margin: "0 auto",
//               }}
//             />
//           </ReactCrop>
//         ) : (
//           <p className="text-gray-500">Loading Preview...</p>
//         )}
//       </div>

//       <div className="p-3 flex justify-end gap-3">
//         {/* <button
//           onClick={onClose}
//           className="px-5 py-2 bg-gray-400 text-white rounded"
//         >
//           Cancel
//         </button> */}

//         <button
//           onClick={() => {
//             if (!completedCrop) {
//               alert("Select crop area");
//               return;
//             }

//             const cropData = {
//               x: completedCrop.x,
//               y: completedCrop.y,
//               width: completedCrop.width,
//               height: completedCrop.height,
//             };

//             console.log("Sending Crop Data:", cropData);
//             onApply(cropData);
//           }}
//           className="px-5 py-2 bg-[#701235] text-white rounded"
//         >
//           Save Crop
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CropModal;

import React, { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const waitForOpenCV = () =>
  new Promise((resolve, reject) => {
    let waited = 0;
    const interval = 100;
    const maxWait = 15000;

    const check = () => {
      if (window.cv && window.cv.Mat) {
        resolve();
      } else if (waited >= maxWait) {
        reject(new Error("OpenCV load timeout"));
      } else {
        waited += interval;
        setTimeout(check, interval);
      }
    };
    check();
  });

const CropModal = ({ imageUrl, onClose, onCropChange }) => {
  const [crop, setCrop] = useState({
    unit: "px",
    width: 300,
    height: 700,
    x: 0,
    y: 0,
  });

  const [completedCrop, setCompletedCrop] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const imgRef = useRef(null);

  // PDF -> preview image
  useEffect(() => {
    if (!imageUrl) return;

    const loadPreview = async () => {
      try {
        const pdfData = await fetch(imageUrl).then((res) => res.arrayBuffer());
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        setPreviewImage(canvas.toDataURL("image/png"));
      } catch (error) {
        console.error("PDF Preview Error:", error);
      }
    };

    loadPreview();
  }, [imageUrl]);

  // Preview aane ke baad auto-detect chalao
  useEffect(() => {
    if (!previewImage) return;
    autoDetectDocument(previewImage);
  }, [previewImage]);

  // Jab bhi completedCrop change ho, parent ko batao (live update)
  useEffect(() => {
    if (completedCrop) {
      onCropChange?.({
        x: completedCrop.x,
        y: completedCrop.y,
        width: completedCrop.width,
        height: completedCrop.height,
      });
    }
  }, [completedCrop]);

  const autoDetectDocument = async (imgSrc) => {
    try {
      await waitForOpenCV();
      const cv = window.cv;

      const img = new Image();
      img.src = imgSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);

      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const blurred = new cv.Mat();
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

      const edged = new cv.Mat();
      cv.Canny(blurred, edged, 30, 100);

      const dilated = new cv.Mat();
      const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
      cv.dilate(edged, dilated, kernel, new cv.Point(-1, -1), 2);

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(
        dilated,
        contours,
        hierarchy,
        cv.RETR_LIST,
        cv.CHAIN_APPROX_SIMPLE
      );

      let maxArea = 0;
      let bestRect = null;
      const imgArea = canvas.width * canvas.height;

      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt);

        if (area < imgArea * 0.05 || area > imgArea * 0.95) {
          cnt.delete();
          continue;
        }

        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

        const numPoints = approx.rows;

        if (numPoints >= 4 && numPoints <= 6 && area > maxArea) {
          maxArea = area;
          bestRect = cv.boundingRect(cnt);
        }

        approx.delete();
        cnt.delete();
      }

      src.delete();
      gray.delete();
      blurred.delete();
      edged.delete();
      dilated.delete();
      kernel.delete();
      contours.delete();
      hierarchy.delete();

      const displayedHeight = imgRef.current?.clientHeight || img.height;
      const displayedWidth = imgRef.current?.clientWidth || img.width;
      const scale = displayedHeight / img.height;

      let finalCrop;

      if (!bestRect) {
        finalCrop = {
          unit: "px",
          x: 0,
          y: 0,
          width: displayedWidth,
          height: displayedHeight,
        };
      } else {
        finalCrop = {
          unit: "px",
          x: bestRect.x * scale,
          y: bestRect.y * scale,
          width: bestRect.width * scale,
          height: bestRect.height * scale,
        };
      }

      setCrop(finalCrop);
      setCompletedCrop(finalCrop);
    } catch (error) {
      console.error("Auto-detect failed:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-3 border-b flex items-center justify-between">
        <h2 className="font-bold text-[#701235]">Crop Document</h2>
      </div>

      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        {previewImage ? (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img
              ref={imgRef}
              src={previewImage}
              alt="crop"
              style={{
                display: "block",
                width: "auto",
                maxHeight: "700px",
                margin: "0 auto",
              }}
            />
          </ReactCrop>
        ) : (
          <p className="text-gray-500">Loading Preview...</p>
        )}
      </div>

      <div className="p-3 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Select a category on the right to save this crop
        </p>

        <button
          onClick={onClose}
          className="px-5 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CropModal;