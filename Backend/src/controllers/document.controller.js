const fs = require("fs").promises;
const path = require("path");
const { PDFDocument, degrees } = require("pdf-lib");
const { fromPath } = require("pdf2pic");
const sharp = require("sharp");
const axios = require("axios");
const {
  getDocumentsFromFolder,
  undoDocument,
} = require("../services/document.service");

const AppError = require("../utils/AppError");
// const {
//   cropDocument
// } = require("../controllers/document.controller");
// 1. Get Documents
const getDocuments = async (req, res, next) => {
  try {
    const { inputFolder } = req.body;

    if (!inputFolder) {
      throw new AppError("Input folder is required", 400);
    }

    const documents = await getDocumentsFromFolder(inputFolder);

    res.status(200).json({
      success: true,
      totalFiles: documents.length,
      currentIndex: 0,
      currentDocument: documents[0] || null,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Classify Document (Handles Rotation too)
const classify = async (req, res, next) => {
  try {
    const {
      sourceFile,
      outputFolder,
      category,
      rotation
    } = req.body;

    if (!sourceFile || !outputFolder || !category) {
      throw new AppError(
        "sourceFile, outputFolder and category are required",
        400
      );
    }

    // Target folder path
    const targetDir = path.join(outputFolder, category);

    // Native Node.js method to ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    const fileName = path.basename(sourceFile);
    const destinationPath = path.join(targetDir, fileName);

    // Read original PDF
    const pdfBytes = await fs.readFile(sourceFile);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Apply rotation if set (90, 180, 270)
    const angleNum = Number(rotation || 0);
    if (angleNum !== 0) {
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + angleNum) % 360));
      });
    }

    // Save modified PDF to output directory
    const modifiedPdfBytes = await pdfDoc.save();
    await fs.writeFile(destinationPath, modifiedPdfBytes);

    res.status(200).json({
      success: true,
      message: "Document classified and rotated successfully",
      destination: destinationPath,
    });
  } catch (error) {
  console.log("CLASSIFY ERROR:", error);
  next(error);
}
};

// 3. Next Document
const nextDocument = (req, res, next) => {
  try {
    const { documents, currentIndex } = req.body;

    if (!Array.isArray(documents) || typeof currentIndex !== "number") {
      throw new AppError(
        "Valid documents array and currentIndex are required",
        400
      );
    }

    const nextIndex = currentIndex + 1;

    res.status(200).json({
      success: true,
      currentIndex: nextIndex,
      totalFiles: documents.length,
      document: documents[nextIndex] || null,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Skip Document
const skipDocument = (req, res, next) => {
  try {
    const { documents, currentIndex } = req.body;

    if (!Array.isArray(documents) || typeof currentIndex !== "number") {
      throw new AppError(
        "Valid documents array and currentIndex are required",
        400
      );
    }

    const nextIndex = currentIndex + 1;

    res.status(200).json({
      success: true,
      message: "Document skipped",
      currentIndex: nextIndex,
      totalFiles: documents.length,
      document: documents[nextIndex] || null,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Undo Document
const undo = async (req, res, next) => {
  try {
    const { originalPath, classifiedPath } = req.body;

    if (!originalPath || !classifiedPath) {
      throw new AppError(
        "originalPath and classifiedPath are required",
        400
      );
    }

    const restoredPath = await undoDocument(originalPath, classifiedPath);

    res.status(200).json({
      success: true,
      message: "Document restored successfully",
      restoredPath,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get PDF Base64
const getPdfBase64 = async (req, res, next) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      throw new AppError("filePath is required", 400);
    }

    const file = await fs.readFile(filePath);

    res.status(200).json({
      success: true,
      base64: file.toString("base64"),
    });
  } catch (error) {
    next(error);
  }
};

const getRemoteConfig = async (req, res, next) => {
  try {

    const response = await axios.post(
      "https://nextinlabs.com/AppRemoteConfiguration/remote-configure.php",
      {
        app_id: "DRISTISIGNALS_C_1",
        app_package_name: "com.nxtinlbs.drishtisignals",
      }
    );

    res.status(200).json(response.data);

  } catch (error) {

    console.error(error.message);

    next(error);

  }
};

const cropDocument = async (req,res,next)=>{

try{

const {
filePath,
cropData,
outputFolder
}=req.body;


if(!filePath || !cropData || !outputFolder){

throw new AppError(
"filePath, cropData and outputFolder are required",
400
);

}


// output folder
await fs.mkdir(outputFolder,{
recursive:true
});


// temporary image folder
const tempFolder = path.join(
outputFolder,
"temp_crop"
);


await fs.mkdir(tempFolder,{
recursive:true
});



// PDF first page image
const convert = fromPath(filePath, {
  density: 150,
  saveFilename: "page_preview",
  savePath: tempFolder,
  format: "png"
});


const result = await convert(1);


const imagePath = result.path;



// image metadata
const image = sharp(imagePath);

const metadata = await image.metadata();



// ReactCrop percentage ko pixel me convert karna

// ReactCrop already gives pixel values

let left = Math.round(cropData.x);
let top = Math.round(cropData.y);
let width = Math.round(cropData.width);
let height = Math.round(cropData.height);


// Safety check
if(left < 0) left = 0;
if(top < 0) top = 0;


if(left + width > metadata.width){
  width = metadata.width - left;
}


if(top + height > metadata.height){
  height = metadata.height - top;
}


console.log("Image Size:", metadata.width, metadata.height);

console.log("Final Crop:", {
 left,
 top,
 width,
 height
});

// crop image

const croppedImagePath = path.join(
tempFolder,
"cropped.png"
);



await sharp(imagePath)
.extract({
left,
top,
width,
height
})
.png()
.toFile(croppedImagePath);





// Image ko PDF me convert

const newPdf = await PDFDocument.create();


const pngBytes = await fs.readFile(
croppedImagePath
);


const pngImage = await newPdf.embedPng(
pngBytes
);


const page = newPdf.addPage([
pngImage.width,
pngImage.height
]);


page.drawImage(
pngImage,
{
x:0,
y:0,
width:pngImage.width,
height:pngImage.height
}
);



const pdfBytes = await newPdf.save();




// final pdf save

const fileName =
"cropped_"+path.basename(filePath);


const outputPath =
path.join(outputFolder,fileName);



await fs.writeFile(
outputPath,
pdfBytes
);



res.json({

success:true,

message:"PDF cropped successfully",

file:outputPath

});



}
catch(error){

console.log("CROP ERROR:",error);

next(error);

}

};

module.exports = {
  getDocuments,
  classify,
  nextDocument,
  skipDocument,
  undo,
  getPdfBase64,
  getRemoteConfig,
  cropDocument
};