import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    createDeck,
    getDecks,
    createBadge,
    createLearningPath,
    updateLeaderboard,
    getLearningPaths,
    getDecksByLearningPathId,
    getLearningPathById,
} from "../controllers/controller.js";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUserProfile);

// Deck routes
router.post("/deck/:userId", createDeck);
router.get("/decks/:userId", getDecks);

// Badge routes
router.post("/badge", createBadge);

// Learning Path routes
router.post("/learning-path", createLearningPath);
router.get("/learning-paths", getLearningPaths);
router.get("/learning-path/:learningPathId/decks", getDecksByLearningPathId);
router.get("/learning-path/:learningPathId", getLearningPathById);

// Leaderboard routes
router.post("/leaderboard", updateLeaderboard);

export default router;
