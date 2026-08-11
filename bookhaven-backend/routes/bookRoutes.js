const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/authMiddleware');

// 1. GET /api/books - Fetch all books with average ratings
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().populate('addedBy', 'name email');

        // Calculate average rating for each book
        const booksWithRatings = await Promise.all(
            books.map(async (book) => {
                const reviews = await Review.find({ bookId: book._id });
                const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
                const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

                return {
                    ...book._doc,
                    averageRating: Number(avgRating),
                    reviewCount: reviews.length,
                };
            })
        );

        res.json(booksWithRatings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching books', error: err.message });
    }
});

// 2. POST /api/books - Add a new book (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, author, genre, coverUrl, description } = req.body;

        const book = new Book({
            title,
            author,
            genre,
            coverUrl,
            description,
            addedBy: req.user.userId, // Extracted from verified JWT
        });

        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: 'Error creating book', error: err.message });
    }
});

// 3. GET /api/books/:id - Fetch single book with populated reviews
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('addedBy', 'name');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const reviews = await Review.find({ bookId: req.params.id }).populate('userId', 'name');

        res.json({ book, reviews });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching book details', error: err.message });
    }
});

// 4. POST /api/books/:id/reviews - Add review & store purchase info (Protected)
router.post('/:id/reviews', authMiddleware, async (req, res) => {
    try {
        const { rating, reviewText, storeName, purchaseUrl } = req.body;

        const review = new Review({
            bookId: req.params.id,
            userId: req.user.userId,
            rating,
            reviewText,
            storeName,
            purchaseUrl,
        });

        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: 'Error adding review', error: err.message });
    }
});
// DELETE /api/books/:id - Protected route to delete a book
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Optional: Check if the logged-in user is the one who added the book
        if (book.addedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this book' });
        }

        await Book.findByIdAndDelete(req.params.id);

        // Also remove associated reviews for cleanup
        await Review.deleteMany({ bookId: req.params.id });

        res.json({ message: 'Book and associated reviews deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error while deleting book' });
    }
});
// GET /api/books/my-books - Fetch books added by the logged-in user
router.get('/my-books', authMiddleware, async (req, res) => {
    try {
        const books = await Book.find({ addedBy: req.user.userId }).populate('addedBy', 'name email');

        const booksWithRatings = await Promise.all(
            books.map(async (book) => {
                const reviews = await Review.find({ bookId: book._id });
                const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
                const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

                return {
                    ...book._doc,
                    averageRating: Number(avgRating),
                    reviewCount: reviews.length,
                };
            })
        );

        res.json(booksWithRatings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user books', error: err.message });
    }
});

// DELETE /api/books/:id - Delete book ONLY if created by logged-in user
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Authorization check: Verify if req.user.userId matches book.addedBy
        if (book.addedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete books you created.' });
        }

        await Book.findByIdAndDelete(req.params.id);
        await Review.deleteMany({ bookId: req.params.id }); // Clean up reviews for this book

        res.json({ message: 'Book and associated reviews deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting book', error: err.message });
    }
});

// DELETE /api/books/reviews/:reviewId - Delete review ONLY if created by logged-in user
router.delete('/reviews/:reviewId', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Authorization check: Verify if req.user.userId matches review.userId
        if (review.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own reviews.' });
        }

        await Review.findByIdAndDelete(req.params.reviewId);
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting review', error: err.message });
    }
});
module.exports = router;