import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/documents",
});

// 1. Get Documents list from folder
export const getDocuments = (inputFolder) => {
  return api.post("/list", { inputFolder });
};

// 2. Classify Document
// src/api/api.jsx
export const classifyDocument = (sourceFile, outputFolder, category, rotationAngle = 0) => {
  const src = typeof sourceFile === "object" ? sourceFile.path : String(sourceFile);
  const out = typeof outputFolder === "object" ? outputFolder.path : String(outputFolder);

  return api.post("/classify", {
    sourceFile: src,
    outputFolder: out,
    category: String(category),
    rotationAngle: Number(rotationAngle) // Pass rotation angle (0, 90, 180, 270)
  });
};



// 3. Next Document
export const nextDocument = (documents, currentIndex) => {
  return api.post("/next", { documents, currentIndex });
};

// 4. Skip Document
export const skipDocument = (documents, currentIndex) => {
  return api.post("/skip", { documents, currentIndex });
};

// 5. Get PDF Base64
export const getPdfBase64 = (filePath) => {
  return api.post("/pdf", { filePath });
};

// 6. Undo
export const undo = (originalPath, classifiedPath) => {
  return api.post("/undo", { originalPath, classifiedPath });
};



export default api;
