const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        reviewText: { type: String, required: true },
        storeName: { type: String, default: '' },
        purchaseUrl: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);