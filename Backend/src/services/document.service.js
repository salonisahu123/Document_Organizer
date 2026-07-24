

const fs = require("fs").promises;
const path = require("path");

const rotatePdf = require("./pdfRotate.service");

const AppError = require("../utils/AppError");

const ALLOWED_EXTENSIONS = [
  ".pdf",
];

const getDocumentsFromFolder = async (folderPath) => {
  try {
    const files = await fs.readdir(folderPath);

    return files
      .filter((file) =>
        ALLOWED_EXTENSIONS.includes(
          path.extname(file).toLowerCase()
        )
      )
      .map((file) => ({
        name: file,
        path: path.join(folderPath, file),
        extension: path.extname(file).toLowerCase(),
      }));
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new AppError(
        "Input folder does not exist",
        404
      );
    }

    if (error.code === "EACCES") {
      throw new AppError(
        "Permission denied for input folder",
        403
      );
    }

    throw error;
  }
};

const classifyDocument = async (
  sourceFile,
  outputFolder,
  category,
  rotation = 0
) => {
  try {
    await fs.access(sourceFile);
  } catch {
    throw new AppError(
      "Source document does not exist",
      404
    );
  }

  const categoryFolder = path.join(
    outputFolder,
    category
  );

  await fs.mkdir(categoryFolder, {
    recursive: true,
  });

  const fileName = path.basename(sourceFile);

  let destination = path.join(
    categoryFolder,
    fileName
  );

  // Duplicate file handling
  let counter = 1;

  while (true) {
    try {
      await fs.access(destination);

      const extension = path.extname(fileName);
      const name = path.basename(
        fileName,
        extension
      );

      destination = path.join(
        categoryFolder,
        `${name} (${counter})${extension}`
      );

      counter++;
    } catch {
      break;
    }
  }

 if (
  rotation &&
  rotation !== 0 &&
  path.extname(sourceFile).toLowerCase() === ".pdf"
) {

  await rotatePdf(
    sourceFile,
    destination,
    rotation
  );

} else {

  await fs.copyFile(
    sourceFile,
    destination
  );

}

  return destination;
};

const undoDocument = async (
  originalPath,
  classifiedPath
) => {
  try {
    await fs.access(classifiedPath);
  } catch {
    throw new AppError(
      "Classified document does not exist",
      404
    );
  }

  try {
    await fs.copyFile(
      classifiedPath,
      originalPath
    );

    await fs.unlink(classifiedPath);

    return originalPath;
  } catch (error) {
    throw new AppError(
      "Failed to restore document",
      500
    );
  }
};


const getNextDocument = (
  documents,
  currentIndex
) => {
  const nextIndex = currentIndex + 1;

  if (nextIndex >= documents.length) {
    return {
      index: nextIndex,
      document: null,
    };
  }

  return {
    index: nextIndex,
    document: documents[nextIndex],
  };
};





module.exports = {
  getDocumentsFromFolder,
  classifyDocument,
  undoDocument,
  getNextDocument,

};