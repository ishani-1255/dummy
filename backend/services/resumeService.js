const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyC5oc2G9TsyNNSx09CInqpWmHgqGiLxC0U"
);

/**
 * Extract text from a PDF file using pdf-parse library
 * @param {Buffer} pdfBuffer - PDF file as buffer
 * @returns {Promise<string>} - Extracted text from PDF
 */
async function extractTextWithPdfParse(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text with pdf-parse:", error);
    throw new Error("Failed to extract text with pdf-parse: " + error.message);
  }
}

/**
 * Extract text from a PDF using Gemini (simulated OCR capability)
 * @param {Buffer} fileBuffer - The PDF file buffer
 * @returns {Promise<string>} Extracted text from the PDF
 */
async function extractTextFromPDF(fileBuffer) {
  try {
    // First try with pdf-parse (faster and more reliable for text-based PDFs)
    try {
      const extractedText = await extractTextWithPdfParse(fileBuffer);
      if (extractedText && extractedText.trim().length > 50) {
        return extractedText;
      }
      console.log(
        "PDF-parse extraction yielded insufficient text, trying Gemini API..."
      );
    } catch (pdfParseError) {
      console.log(
        "PDF-parse extraction failed, trying Gemini API...",
        pdfParseError.message
      );
    }

    // If pdf-parse fails or returns minimal text, try with Gemini Vision API
    // Convert buffer to base64
    const base64PDF = fileBuffer.toString("base64");

    // Get the Gemini model - Using gemini-pro-vision which is available in the API
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Create the prompt for text extraction
    const prompt =
      "Extract all the text from this PDF resume file. Return only the extracted text content.";

    // Generate content with the file
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64PDF,
          mimeType: "application/pdf",
        },
      },
    ]);

    const response = await result.response;
    const extractedText = response.text();

    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}

/**
 * Analyze a resume against a job description using Gemini
 * @param {string} resumeText - The text content of the resume
 * @param {string} jobDescription - The job description text
 * @returns {Promise<Object>} Analysis results including score and feedback
 */
async function analyzeResume(resumeText, jobDescription) {
  try {
    // Get the Gemini model - Using gemini-1.5-pro instead of gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create the prompt for resume analysis
    const prompt = `Analyze this resume against the job description and provide an ATS (Applicant Tracking System) score and detailed feedback.

Resume:
${resumeText}

Job Description:
${jobDescription}

Format your response as a valid JSON object with the following structure:
{
  "score": 85, // A score between 0-100 representing the ATS match
  "feedback": [
    {
      "type": "positive", // One of: "positive", "improvement", "critical"
      "text": "The specific feedback point"
    }
  ],
  "keywordMatches": [
    {
      "keyword": "JavaScript", // Important keyword from the job description
      "found": true // Whether the keyword was found in the resume
    }
  ]
}

Base the score on how well the resume matches the job description, considering:
1. Presence of key skills and technologies
2. Relevant experience
3. Matching qualifications
4. Appropriate use of industry terminology
5. ATS-friendly formatting (if detectable)

The response should be ONLY the JSON object, nothing else.`;

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON from the response
    // Sometimes Gemini adds markdown code blocks, so we need to handle that
    const jsonText = text.replace(/```json\n|\n```|```/g, "").trim();
    const analysisData = JSON.parse(jsonText);

    return analysisData;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
}

module.exports = {
  extractTextFromPDF,
  analyzeResume,
};
