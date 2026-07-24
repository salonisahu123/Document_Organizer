import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/documents",
});

export const getDocuments = (inputFolder) => {
  return API.post("/list", {
    inputFolder,
  });
};

export const classifyDocument = (
  sourceFile,
  outputFolder,
  category
) => {
  return API.post("/classify", {
    sourceFile,
    outputFolder,
    category,
  });
};

export const nextDocument = (
  documents,
  currentIndex
) => {
  return API.post("/next", {
    documents,
    currentIndex,
  });
};

export const skipDocument = (
  documents,
  currentIndex
) => {
  return API.post("/skip", {
    documents,
    currentIndex,
  });
};

export const undoDocument = (
  originalPath,
  classifiedPath
) => {
  return API.post("/undo", {
    originalPath,
    classifiedPath,
  });
};