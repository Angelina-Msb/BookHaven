import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books/my-books', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBooks(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch your books');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchMyBooks();
        } else {
            setError('Please log in to view your books');
            setLoading(false);
        }
    }, [token]);

    if (loading) return <h3>Loading your books...</h3>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>My Books 📚</h2>
            {books.length === 0 ? (
                <p>You haven't added any books yet.</p>
            ) : (
                <div style={styles.grid}>
                    {books.map((book) => (
                        <div key={book._id} style={styles.card}>
                            <img
                                src={book.coverUrl || 'https://via.placeholder.com/150'}
                                alt={book.title}
                                style={styles.cover}
                            />
                            <h3>{book.title}</h3>
                            <p>By {book.author}</p>
                            <p>⭐ {book.averageRating} ({book.reviewCount} reviews)</p>
                            <Link to={`/books/${book._id}`} style={styles.button}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' },
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', textAlign: 'center', backgroundColor: '#fff' },
    cover: { width: '100%', height: '220px', objectFit: 'cover', borderRadius: '4px' },
    button: { display: 'inline-block', marginTop: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#3498db', color: '#fff', textDecoration: 'none', borderRadius: '4px' }
};

export default MyBooks;