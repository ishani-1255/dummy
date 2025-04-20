const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  extractTextFromPDF,
  analyzeResume,
} = require("../services/resumeService");

// Set up multer for file storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept PDF and DOCX files
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF and DOCX files are allowed."),
        false
      );
    }
  },
});

// Extract text from resume (PDF/DOCX)
router.post("/extract", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Only process PDF files for now (since we're using vision model)
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message:
          "Only PDF files can be processed with the current OCR implementation",
      });
    }

    try {
      // Extract text using Gemini AI
      const extractedText = await extractTextFromPDF(req.file.buffer);

      // If extraction returns empty text
      if (!extractedText || extractedText.trim() === "") {
        return res.status(422).json({
          success: false,
          message:
            "Could not extract text from the uploaded PDF. The file may be scanned or contain only images.",
        });
      }

      res.status(200).json({
        success: true,
        fileName: req.file.originalname,
        text: extractedText,
      });
    } catch (extractError) {
      console.error("Error extracting text from resume:", extractError);

      // Provide a user-friendly message
      res.status(500).json({
        success: false,
        message:
          "There was an error processing your PDF file. Please try a different file or format.",
        error: extractError.message,
      });
    }
  } catch (error) {
    console.error("Unexpected error in extract route:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing your file",
      error: error.message,
    });
  }
});

// Analyze resume against job description
router.post("/analyze", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume text and job description are required",
      });
    }

    // Analyze resume using Gemini AI
    const analysis = await analyzeResume(resumeText, jobDescription);

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({
      success: false,
      message:
        "Failed to analyze resume. The AI service may be temporarily unavailable.",
      error: error.message,
    });
  }
});

module.exports = router;
