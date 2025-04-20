const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyB0elbGtnjtO_v8IpFRCUkJEyIPVYGdfaU"
);

/**
 * Generate a quiz using the Gemini API
 * @param {string} topic - The topic for the quiz
 * @param {number} questionCount - Number of questions to generate (max 20)
 * @returns {Promise<Array>} An array of questions
 */
async function generateQuiz(topic, questionCount) {
  try {
    // Make sure we don't exceed 20 questions
    const count = Math.min(parseInt(questionCount), 20);

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Create the prompt for quiz generation
    const prompt = `Generate a quiz about ${topic} with exactly ${count} questions.
    Each question should have 4 options, one correct answer, and a brief explanation.
    Format the response in valid JSON like this structure:
    [
      {
        "question": "What is X?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "B",
        "explanation": "Explanation of why B is correct."
      }
    ]
    The output should be ONLY the JSON array, nothing else.`;

    // Generate the content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON from the response
    // Sometimes Gemini adds markdown code blocks, so we need to handle that
    const jsonText = text.replace(/```json\n|\n```|```/g, "").trim();
    const quizData = JSON.parse(jsonText);

    // Validate the structure of the response
    if (!Array.isArray(quizData)) {
      throw new Error("Invalid response format from Gemini API");
    }

    // Return the quiz data
    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}

module.exports = {
  generateQuiz,
};
