const express = require("express");
const router = express.Router();
const Quiz = require("../model/quizSchema");
const { generateQuiz } = require("../services/geminiService");

// Generate a new quiz
router.post("/generate", async (req, res) => {
  try {
    const { topic, questionCount } = req.body;

    // Validate input
    if (!topic || !questionCount) {
      return res.status(400).json({
        success: false,
        message: "Topic and question count are required",
      });
    }

    // Generate questions using Gemini API
    const questions = await generateQuiz(topic, questionCount);

    // Create a new quiz in the database
    const newQuiz = new Quiz({
      topic,
      questionCount: Math.min(parseInt(questionCount), 20),
      questions,
      userId: req.user ? req.user._id : null,
    });

    await newQuiz.save();

    res.status(201).json({
      success: true,
      quiz: newQuiz,
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz",
      error: error.message,
    });
  }
});

// Get a quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
      error: error.message,
    });
  }
});

// Submit answers for a quiz
router.post("/:id/submit", async (req, res) => {
  try {
    const { userAnswers } = req.body;
    const quizId = req.params.id;

    if (!userAnswers) {
      return res.status(400).json({
        success: false,
        message: "User answers are required",
      });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Calculate score
    let score = 0;
    for (const questionId in userAnswers) {
      const question = quiz.questions.find(
        (q) => q._id.toString() === questionId
      );
      if (question && question.correctAnswer === userAnswers[questionId]) {
        score++;
      }
    }

    // Update quiz with user answers and score
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completed = true;

    await quiz.save();

    res.status(200).json({
      success: true,
      quiz,
      score,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
});

// Get user's quiz history
router.get("/user/history", async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const quizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .select("-questions.correctAnswer -questions.explanation");

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz history",
      error: error.message,
    });
  }
});

module.exports = router;
