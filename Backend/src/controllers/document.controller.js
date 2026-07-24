const fs = require("fs").promises;
const path = require("path");
const { PDFDocument, degrees } = require("pdf-lib");

const {
  getDocumentsFromFolder,
  undoDocument,
} = require("../services/document.service");

const AppError = require("../utils/AppError");

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



module.exports = {
  getDocuments,
  classify,
  nextDocument,
  skipDocument,
  undo,
  getPdfBase64,
};