import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [storeName, setStoreName] = useState('');
    const [purchaseUrl, setPurchaseUrl] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    const token = localStorage.getItem('token');

    // Safe retrieval of user object to prevent JSON.parse crash
    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error('Failed to parse stored user:', e);
    }

    const fetchBookDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/books/${id}`);
            setBook(res.data.book);
            setReviews(res.data.reviews || []);
        } catch (err) {
            setError('Failed to fetch book details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Book deleted successfully!');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete book');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/books/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Review deleted successfully!');
            fetchBookDetails();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete review');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');

        if (!token) {
            setSubmitError('You must be logged in to leave a review.');
            return;
        }

        try {
            await axios.post(
                `http://localhost:5000/api/books/${id}/reviews`,
                { rating, reviewText, storeName, purchaseUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSubmitSuccess('Review added successfully!');
            setReviewText('');
            setStoreName('');
            setPurchaseUrl('');

            fetchBookDetails();
        } catch (err) {
            setSubmitError(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <h3>Loading book details...</h3>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!book) return <h3>Book not found.</h3>;

    // Safely resolve creator ID
    const bookCreatorId = typeof book.addedBy === 'object' ? book.addedBy?._id : book.addedBy;
    const currentUserId = user ? (user.id || user._id) : null;
    const isBookOwner = Boolean(currentUserId && bookCreatorId && String(bookCreatorId) === String(currentUserId));

    return (
        <div style={styles.container}>
            {/* Book Summary Card */}
            <div style={styles.bookHeader}>
                <img src={book.coverUrl || 'https://via.placeholder.com/200'} alt={book.title} style={styles.cover} />
                <div>
                    <h2>{book.title}</h2>
                    <h4>By {book.author}</h4>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p>{book.description}</p>

                    {/* Show Delete Button ONLY if logged-in user created this book */}
                    {isBookOwner && (
                        <button onClick={handleDelete} style={styles.deleteButton}>
                            🗑️ Delete Book
                        </button>
                    )}
                </div>
            </div>

            <hr style={{ margin: '2rem 0' }} />

            {/* Submit Review Section */}
            <div style={styles.section}>
                <h3>Leave a Review</h3>
                {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
                {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}

                {token ? (
                    <form onSubmit={handleReviewSubmit} style={styles.form}>
                        <label>
                            <strong>Rating: </strong>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={styles.input}>
                                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                                <option value={3}>3 Stars ⭐⭐⭐</option>
                                <option value={2}>2 Stars ⭐⭐</option>
                                <option value={1}>1 Star ⭐</option>
                            </select>
                        </label>

                        <textarea
                            placeholder="Write your review here..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                            style={{ ...styles.input, height: '80px' }}
                        />

                        <input
                            type="text"
                            placeholder="Where did you buy it? (e.g., Local Bookstore, Amazon)"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            type="url"
                            placeholder="Purchase Link URL (optional)"
                            value={purchaseUrl}
                            onChange={(e) => setPurchaseUrl(e.target.value)}
                            style={styles.input}
                        />

                        <button type="submit" style={styles.button}>Submit Review</button>
                    </form>
                ) : (
                    <p><em>Please log in to submit a review.</em></p>
                )}
            </div>

            <hr style={{ margin: '2rem 0' }} />

            {/* Reviews List */}
            <div style={styles.section}>
                <h3>User Reviews ({reviews.length})</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to leave one!</p>
                ) : (
                    reviews.map((rev) => {
                        const reviewUserId = typeof rev.userId === 'object' ? rev.userId?._id : rev.userId;
                        const isReviewOwner = Boolean(currentUserId && reviewUserId && String(reviewUserId) === String(currentUserId));

                        return (
                            <div key={rev._id} style={styles.reviewCard}>
                                <div style={styles.reviewHeader}>
                                    <p style={{ margin: 0 }}>
                                        <strong>{rev.userId?.name || 'Anonymous User'}</strong> rated it {'⭐'.repeat(rev.rating)}
                                    </p>

                                    {isReviewOwner && (
                                        <button
                                            onClick={() => handleDeleteReview(rev._id)}
                                            style={styles.deleteReviewBtn}
                                        >
                                            🗑️ Delete Review
                                        </button>
                                    )}
                                </div>

                                <p>{rev.reviewText}</p>

                                {rev.storeName && (
                                    <p style={{ fontSize: '0.9rem', color: '#555' }}>
                                        🛍️ <strong>Bought from:</strong> {rev.storeName}{' '}
                                        {rev.purchaseUrl && (
                                            <a href={rev.purchaseUrl} target="_blank" rel="noreferrer" style={{ color: '#3498db' }}>
                                                [Buy Link]
                                            </a>
                                        )}
                                    </p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto' },
    bookHeader: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
    cover: { width: '200px', borderRadius: '8px' },
    section: { margin: '1rem 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' },
    input: { padding: '0.8rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '0.8rem', fontSize: '1rem', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    reviewCard: { border: '1px solid #eee', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', background: '#f9f9f9' },
    reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
    deleteButton: {
        marginTop: '1rem',
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    deleteReviewBtn: {
        backgroundColor: 'transparent',
        color: '#e74c3c',
        border: '1px solid #e74c3c',
        padding: '0.2rem 0.6rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.85rem'
    }
};

export default BookDetail;