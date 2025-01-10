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
const deckSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },
        flashcards: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
            },
        ],
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

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

// Export all models
export { User, Deck, Badge, LearningPath, Leaderboard };
