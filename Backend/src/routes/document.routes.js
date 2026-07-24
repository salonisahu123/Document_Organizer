const express = require("express");


const {
    getDocuments,
    classify,
    nextDocument,
    skipDocument,
   undo,
    getPdfBase64,
} = require("../controllers/document.controller");

const router = express.Router();

router.post("/list", getDocuments);
router.post("/classify", classify);

router.post("/next", nextDocument);

router.post("/skip", skipDocument);

router.post("/undo", undo);
router.post("/pdf", getPdfBase64);

module.exports = router;