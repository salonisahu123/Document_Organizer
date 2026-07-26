import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/documents",
});

// 1. Get Documents list from folder
export const getDocuments = (inputFolder) => {
  return api.post("/list", { inputFolder });
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
export const classifyDocument = (data) => {
  return api.post("/classify", data);
};
// 6. Undo
export const undo = (originalPath, classifiedPath) => {
  return api.post("/undo", { originalPath, classifiedPath });
};
export const fetchRemoteConfig = () => {
  return api.post("/remote-config");
};



export const cropDocument = (data)=>{

return api.post("/crop",data);

};

export default api;
