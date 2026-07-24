const fs = require("fs");
const { PDFDocument, degrees } = require("pdf-lib");


const rotatePdf = async (inputPath, outputPath, angle) => {

    const pdfBytes = fs.readFileSync(inputPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();


    pages.forEach((page) => {
        page.setRotation(degrees(angle));
    });


    const rotatedPdf = await pdfDoc.save();


    fs.writeFileSync(outputPath, rotatedPdf);

};


module.exports = rotatePdf;