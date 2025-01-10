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
} from "../controllers/controller.js";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUserProfile);

// Deck routes
router.post("/deck", createDeck);
router.get("/decks", getDecks);

// Badge routes
router.post("/badge", createBadge);

// Learning Path routes
router.post("/learning-path", createLearningPath);

// Leaderboard routes
router.post("/leaderboard", updateLeaderboard);

export default router;
