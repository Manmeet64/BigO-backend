import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        xp: { type: Number, default: 0 },
        badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        learningPaths: [
            { type: mongoose.Schema.Types.ObjectId, ref: "LearningPath" },
        ],
        customDecks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }],
    },
    { timestamps: true }
);

// Deck Schema
const deckSchema = new mongoose.Schema({
    name: { type: String, required: true },
    flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flashcard" }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
//Flashcard schema
// Flashcard schema with Enum for 'difficulty'
const flashcardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"], // Enum values for the difficulty level
        required: true,
    },
    deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck" },
});

// Badge Schema
const badgeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        tag: { type: String, required: true },
    },
    { timestamps: true }
);

// Learning Path Schema
const learningPathSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        decks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }],
    },
    { timestamps: true }
);

// Leaderboard Schema
const leaderboardSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        score: { type: Number, required: true },
    },
    { timestamps: true }
);

// Create models
const User = mongoose.model("User", userSchema);
const Deck = mongoose.model("Deck", deckSchema);
const Badge = mongoose.model("Badge", badgeSchema);
const LearningPath = mongoose.model("LearningPath", learningPathSchema);
const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
const Flashcard = mongoose.model("flashcard", flashcardSchema);

// Export all models
export { User, Deck, Badge, LearningPath, Leaderboard, Flashcard };
