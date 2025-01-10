// User Controller
import {
    User,
    Deck,
    Badge,
    LearningPath,
    Leaderboard,
} from "../model/model.js";

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

        // Create flashcards first and then create the deck
        const createdFlashcards = await Flashcard.insertMany(flashcards);

        const newDeck = new Deck({
            name,
            flashcards: createdFlashcards.map((fc) => fc._id),
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

// Get all decks
export const getDecks = async (req, res) => {
    try {
        const decks = await Deck.find({ creator: req.userId }).populate(
            "flashcards"
        );
        res.status(200).json(decks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching decks" });
    }
};

// Get a specific deck by ID
export const getDeckById = async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id).populate("flashcards");
        if (!deck) return res.status(404).json({ error: "Deck not found" });
        res.status(200).json(deck);
    } catch (error) {
        res.status(500).json({ error: "Error fetching deck" });
    }
};

// Update a deck's details
export const updateDeck = async (req, res) => {
    try {
        const { name, difficulty, flashcards } = req.body;
        const updatedDeck = await Deck.findByIdAndUpdate(
            req.params.id,
            { name, difficulty, flashcards },
            { new: true }
        );

        if (!updatedDeck)
            return res.status(404).json({ error: "Deck not found" });
        res.status(200).json({
            message: "Deck updated successfully",
            deck: updatedDeck,
        });
    } catch (error) {
        res.status(500).json({ error: "Error updating deck" });
    }
};

// Delete a deck
export const deleteDeck = async (req, res) => {
    try {
        const deletedDeck = await Deck.findByIdAndDelete(req.params.id);
        if (!deletedDeck)
            return res.status(404).json({ error: "Deck not found" });

        // Remove deck from user
        const user = await User.findById(req.userId);
        user.customDecks = user.customDecks.filter(
            (deckId) => deckId.toString() !== req.params.id
        );
        await user.save();

        res.status(200).json({
            message: "Deck deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ error: "Error deleting deck" });
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
