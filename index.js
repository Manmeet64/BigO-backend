import express from "express";
import cors from "cors";
import connectDB from "./dbConnection.js";
import router from "./routers/router.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/bigo", router);

// Test route
app.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
