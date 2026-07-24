const express = require("express");
const cors = require("cors");
require("dotenv").config();

const documentRoutes = require("./src/routes/document.routes");
const errorHandler = require("./src/middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/documents",
  documentRoutes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Document Organizer Backend is running",
  });
});

// Error middleware must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
