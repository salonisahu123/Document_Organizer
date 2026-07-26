// import React, { useState, useEffect } from "react";
// import ReactCrop from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";

// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;


// const CropModal = ({ imageUrl, onApply, onClose }) => {

//   const [crop, setCrop] = useState({
//     unit: "px",
//     width:300 ,
//     height:700,
//     x: 0,
//     y: 0,
//   });

//   const [completedCrop, setCompletedCrop] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);


//   useEffect(() => {

//     if (!imageUrl) return;

//     const loadPreview = async () => {

//       try {

//         console.log("Loading PDF preview...");


//         const pdfData = await fetch(imageUrl)
//           .then((res) => res.arrayBuffer());


//         const pdf = await pdfjsLib.getDocument({
//           data: pdfData,
//         }).promise;


//         console.log("PDF Loaded");


//         const page = await pdf.getPage(1);


//         const viewport = page.getViewport({
//           scale: 1.5,
//         });


//         // const canvas = document.createElement("canvas");

//         // const context = canvas.getContext("2d");


//         // canvas.width = viewport.width;
//         // canvas.height = viewport.height;


//         await page.render({
//           // canvasContext: context,
//           viewport,
//         }).promise;



      

//         setPreviewImage(
//           canvas.toDataURL("image/png")
//         );


//       } catch (error) {

//         console.error(
//           "PDF Preview Error:",
//           error
//         );

//       }

//     };


//     loadPreview();


//   }, [imageUrl]);




//   return (

//     <div className="w-full h-full flex flex-col bg-white">


//       {/* Header */}
//       <div className="p-3 border-b">

//         <h2 className="font-bold text-[#701235]">
//           Crop Document
//         </h2>

//       </div>



//       {/* Crop Area */}


// <div className="flex-1 overflow-auto bg-gray-100 p-4">
//         {
//           previewImage ? (

// //  <ReactCrop
// //   crop={crop}
// //   onChange={(c) => setCrop(c)}
// //   onComplete={(c) => setCompletedCrop(c)}
// // >

// //   <img
// //     src={previewImage}
// //     alt="crop"
// //     style={{
// //       display: "block",
// //       maxHeight: "700px",
// //       width: "auto",
// //     }}
// //     onLoad={(e) => {

// //       const img = e.currentTarget;

// //       setCrop({
// //         unit: "px",
// //         x: 0,
// //         y: 0,
// //         width: img.clientWidth,
// //         height: img.clientHeight,
// //       });

// //     }}
// //   />

// // </ReactCrop> 

// <ReactCrop
//   crop={crop}
//   onChange={setCrop}
//   onComplete={setCompletedCrop}
// >

//   <img
//     src={previewImage}
//     alt="crop"
//     style={{
//       display: "block",
//       width: "auto",
//       maxHeight: "700px",
//       margin: "0 auto",
//     }}
//   />

// </ReactCrop>

//           ) : (

//             <p className="text-gray-500">
//               Loading Preview...
//             </p>

//           )

//         }


//       </div>




//       {/* Buttons */}
//       <div className="p-3 flex justify-end gap-3">


//         <button

//           onClick={onClose}

//           className="px-5 py-2 bg-gray-400 text-white rounded"

//         >

//           Cancel

//         </button>




//         <button

//           onClick={()=>{


//             if(!completedCrop){

//               alert("Select crop area");

//               return;

//             }



//             const cropData = {

//               x: completedCrop.x,

//               y: completedCrop.y,

//               width: completedCrop.width,

//               height: completedCrop.height,

//             };



//             console.log(
//               "Sending Crop Data:",
//               cropData
//             );



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



import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;


const CropModal = ({ imageUrl, onApply, onClose }) => {


  const [crop, setCrop] = useState({
    unit: "px",
    width: 300,
    height: 700,
    x: 0,
    y: 0,
  });


  const [completedCrop, setCompletedCrop] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);



  useEffect(() => {


    if (!imageUrl) return;


    const loadPreview = async () => {


      try {


        console.log("Loading PDF preview...");


        const pdfData = await fetch(imageUrl)
          .then((res)=>res.arrayBuffer());



        const pdf = await pdfjsLib
          .getDocument({
            data: pdfData
          })
          .promise;



        console.log("PDF Loaded");



        const page = await pdf.getPage(1);



        const viewport = page.getViewport({
          scale: 1.5,
        });



        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");



        canvas.width = viewport.width;

        canvas.height = viewport.height;



        await page.render({

          canvasContext: context,

          viewport,

        }).promise;



        const image =
          canvas.toDataURL("image/png");



        setPreviewImage(image);



      } catch(error){


        console.error(
          "PDF Preview Error:",
          error
        );


      }


    };



    loadPreview();



  },[imageUrl]);




return (

<div className="w-full h-full flex flex-col bg-white">


<div className="p-3 border-b">

<h2 className="font-bold text-[#701235]">
Crop Document
</h2>

</div>





<div className="flex-1 overflow-auto bg-gray-100 p-4">


{

previewImage ? (


<ReactCrop

crop={crop}

onChange={(c)=>setCrop(c)}

onComplete={(c)=>setCompletedCrop(c)}

>


<img

src={previewImage}

alt="crop"

style={{

display:"block",

width:"auto",

maxHeight:"700px",

margin:"0 auto"

}}

/>


</ReactCrop>



) : (


<p className="text-gray-500">
Loading Preview...
</p>


)


}


</div>







<div className="p-3 flex justify-end gap-3">


<button

onClick={onClose}

className="px-5 py-2 bg-gray-400 text-white rounded"

>

Cancel

</button>




<button

onClick={()=>{


if(!completedCrop){

alert("Select crop area");

return;

}



const cropData = {


x: completedCrop.x,

y: completedCrop.y,

width: completedCrop.width,

height: completedCrop.height,


};



console.log(
"Sending Crop Data:",
cropData
);



onApply(cropData);



}}


className="px-5 py-2 bg-[#701235] text-white rounded"

>

Save Crop

</button>


</div>



</div>

);

};


export default CropModal;