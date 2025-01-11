// User Controller
import {
    User,
    Deck,
    Badge,
    LearningPath,
    Flashcard,
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
            "badges learningPaths friends"
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
        const { name, flashcards } = req.body;
        const userId = req.params.userId; // Get the userId from params

        // Validate input
        if (!name || !Array.isArray(flashcards) || flashcards.length === 0) {
            return res
                .status(400)
                .json({ error: "Deck name and flashcards are required" });
        }

        // Validate the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create flashcards
        const createdFlashcards = await Flashcard.create(
            flashcards.map((flashcard) => ({
                ...flashcard,
                deck: null, // Initially set the `deck` field to null
            }))
        );

        // Debug: Log the created flashcards
        console.log("Created Flashcards:", createdFlashcards);

        // Create the deck
        const newDeck = new Deck({
            name,
            flashcards: createdFlashcards.map((fc) => fc._id),
            creator: userId,
        });
        await newDeck.save();

        // Update the deck field in flashcards
        await Promise.all(
            createdFlashcards.map((fc) =>
                Flashcard.findByIdAndUpdate(fc._id, { deck: newDeck._id })
            )
        );

        // Debug: Log the updated flashcards
        const updatedFlashcards = await Flashcard.find({
            _id: { $in: createdFlashcards.map((fc) => fc._id) },
        });
        console.log("Updated Flashcards with Deck:", updatedFlashcards);

        // Add the new deck to the user's customDecks
        user.customDecks.push(newDeck._id);
        await user.save();

        res.status(201).json({
            message: "Deck created successfully",
            deck: newDeck,
            flashcards: updatedFlashcards,
        });
    } catch (error) {
        console.error("Error creating deck:", error); // Log the error
        res.status(500).json({
            error: "Error creating deck",
            details: error.message,
        });
    }
};

// Get all decks
export const getDecks = async (req, res) => {
    try {
        // Get all decks for the given user
        const decks = await Deck.find({ creator: req.params.userId });

        // Fetch flashcards for each deck manually
        const decksWithFlashcards = await Promise.all(
            decks.map(async (deck) => {
                // Fetch flashcards for the current deck using the deck's flashcard references
                const flashcards = await Flashcard.find({
                    _id: { $in: deck.flashcards }, // Find flashcards with ids in the deck's flashcards array
                });

                // Return deck with the flashcards populated
                return {
                    ...deck.toObject(),
                    flashcards,
                };
            })
        );

        res.status(200).json(decksWithFlashcards);
    } catch (error) {
        res.status(500).json({
            error: "Error fetching decks",
            details: error.message,
        });
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

// Get all learning paths
export const getLearningPaths = async (req, res) => {
    try {
        const learningPaths = await LearningPath.find();
        res.status(200).json(learningPaths);
    } catch (error) {
        res.status(500).json({
            error: "Error fetching learning paths",
            details: error.message,
        });
    }
};

// Get decks by learning path ID
export const getDecksByLearningPathId = async (req, res) => {
    try {
        const learningPathId = req.params.learningPathId;

        // Find the learning path and populate its decks
        const learningPath = await LearningPath.findById(
            learningPathId
        ).populate({
            path: "decks",
            select: "name flashcards creator", // Select the deck fields you want
        });

        if (!learningPath) {
            return res.status(404).json({ error: "Learning path not found" });
        }

        res.status(200).json(learningPath.decks);
    } catch (error) {
        console.error("Error fetching decks:", error);
        res.status(500).json({
            error: "Error fetching decks for learning path",
            details: error.message,
        });
    }
};

// Get learning path by ID
export const getLearningPathById = async (req, res) => {
    try {
        const learningPathId = req.params.learningPathId;

        const learningPath = await LearningPath.findById(
            learningPathId
        ).populate({
            path: "decks",
            select: "name flashcards creator",
        });

        if (!learningPath) {
            return res.status(404).json({ error: "Learning path not found" });
        }

        res.status(200).json(learningPath);
    } catch (error) {
        console.error("Error fetching learning path:", error);
        res.status(500).json({
            error: "Error fetching learning path",
            details: error.message,
        });
    }
};
