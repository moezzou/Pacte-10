import mongoose from "mongoose";

// Define the schema for complaints
const ComplaintSchema = new mongoose.Schema(
  {
    complaint: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "complaints", // Optionally specify the collection name
  }
);

// Create a model for complaints using the schema
const ComplaintModel = mongoose.model("Complaint", ComplaintSchema);

export default ComplaintModel;
