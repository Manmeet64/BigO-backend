import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(
            "mongodb+srv://manmeet:manu2341@cluster0.bb58d.mongodb.net/?"
        );
        console.log("Connected to database");
    } catch (err) {
        console.log("Some error occurred");
    }
}
