const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    price: { type: Number },
    inStock: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // linked to creator
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
