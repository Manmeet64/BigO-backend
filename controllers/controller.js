// User Controller
import {
    User,
    Deck,
    Badge,
    LearningPath,
    Leaderboard,
} from "../models/model.js";

// Register a user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: "Error logging in user" });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "badges learningPaths customDecks friends"
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user profile" });
    }
};

// Deck Controller
// Create a deck
export const createDeck = async (req, res) => {
    try {
        const { name, difficulty, flashcards } = req.body;
        const newDeck = new Deck({
            name,
            difficulty,
            flashcards,
            creator: req.userId,
        });
        await newDeck.save();

        // Add deck to user
        const user = await User.findById(req.userId);
        user.customDecks.push(newDeck._id);
        await user.save();

        res.status(201).json({
            message: "Deck created successfully",
            deck: newDeck,
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating deck" });
    }
};

// Get decks
export const getDecks = async (req, res) => {
    try {
        const decks = await Deck.find({ creator: null }); // Prebuilt decks
        res.status(200).json(decks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching decks" });
    }
};

// Badge Controller
// Create a badge
export const createBadge = async (req, res) => {
    try {
        const { name, tag } = req.body;
        const newBadge = new Badge({ name, tag });
        await newBadge.save();
        res.status(201).json({
            message: "Badge created successfully",
            badge: newBadge,
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating badge" });
    }
};

// Learning Path Controller
// Create a learning path
export const createLearningPath = async (req, res) => {
    try {
        const { name, decks } = req.body;
        const newPath = new LearningPath({ name, decks });
        await newPath.save();
        res.status(201).json({
            message: "Learning path created successfully",
            path: newPath,
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating learning path" });
    }
};

// Leaderboard Controller
// Update leaderboard
export const updateLeaderboard = async (req, res) => {
    try {
        const { userId, score } = req.body;
        const leaderboard = await Leaderboard.findOneAndUpdate(
            { user: userId },
            { score },
            { upsert: true, new: true }
        );
        res.status(200).json({
            message: "Leaderboard updated successfully",
            leaderboard,
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating leaderboard" });
    }
};
