# 📂 Document Organizer

A desktop-based PDF document management application built with **Electron, React.js, Node.js, Express.js** that helps users organize PDF files automatically by classifying documents into category-wise folders.

The application provides PDF preview, PDF rotation support, and automated document sorting into selected output folders.

---

# 🚀 Features

* 📁 Select Input Folder
* 📂 Select Output Folder
* 📄 Automatically detect PDF documents
* 👀 Preview PDF files inside the application
* 🔄 Rotate PDF documents before saving
* 🗂️ Classify PDF documents using categories
* 📌 Automatically create category folders
* 📤 Save organized PDFs into selected output folder
* ⏭️ Next / Previous / Skip PDF navigation
* 🖥️ Desktop application built with Electron

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React-PDF
* Axios

## Backend

* Node.js
* Express.js
* PDF-LIB
* File System API

## Desktop

* Electron

---

# 📁 Project Structure

```text
DocumentOrganizer
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   │   ├── LeftPanel.jsx
│   │   │   ├── CenterPanel.jsx
│   │   │   └── RightPanel.jsx
│   │   │
│   │   ├── pages
│   │   │   └── DocumentOrganizer.jsx
│   │   │
│   │   └── api
│   │       └── api.jsx
│
├── Backend
│   ├── src
│   │   ├── controllers
│   │   │   └── document.controller.js
│   │   │
│   │   ├── services
│   │   │   ├── document.service.js
│   │   │   └── pdfRotate.service.js
│   │   │
│   │   ├── routes
│   │   │   └── document.routes.js
│   │   │
│   │   └── server.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/salonisahu123/Document_Organizer.git
```

---

# Frontend Setup

Navigate to frontend folder:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Backend Setup

Navigate to backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# 📌 How To Use

1. Open the Document Organizer application.
2. Select the folder containing PDF documents.
3. Select the destination output folder.
4. Click on **Start Processing**.
5. View PDF preview in the center panel.
6. Rotate the PDF if required.
7. Select a category from the Right Panel.
8. The PDF will automatically be saved inside the selected category folder.

---

# 📂 Output Example

```text
Output Folder

│
├── Resume
│     └── resume.pdf
│
├── Agreement
│     └── agreement.pdf
│
├── Tender Application
│     └── tender.pdf
│
└── Other Documents
      └── document.pdf
```

---

# 🔄 PDF Rotation

The application supports rotating PDF documents before saving.

Supported rotation angles:

* 90°
* 180°
* 270°

The rotated PDF is saved directly into the selected category folder.

---

# 🔌 API Endpoints

Base URL:

```text
http://localhost:5000/api/documents
```

---

## Get PDF Documents

### POST

```text
/list
```

Fetches PDF files from the selected input folder.

---

## Classify PDF Document

### POST

```text
/classify
```

Organizes PDF documents into selected category folders.

Request:

```json
{
  "sourceFile": "pdf-file-path",
  "outputFolder": "output-folder-path",
  "category": "Resume",
  "rotation": 90
}
```

---

## Get PDF Preview

### POST

```text
/pdf
```

Converts PDF file into Base64 format for displaying preview in React.

---

# 🎯 Future Improvements

* Automatic PDF classification using AI
* OCR-based document text extraction
* Drag and drop PDF upload
* Search and filter documents
* PDF thumbnail preview
* Windows installer (.exe) build
* Cloud storage integration

---

# 👩‍💻 Author

**Saloni Sahu**

BCA Student | Full Stack Web Developer

### Skills

* React.js
* Node.js
* Express.js
* MongoDB
* Electron
* REST APIs

---

⭐ If you like this project, consider giving it a star on GitHub.
