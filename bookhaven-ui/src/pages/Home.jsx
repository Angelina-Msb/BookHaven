import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books');
                setBooks(res.data);
            } catch (err) {
                setError('Failed to fetch books');
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Filter books dynamically based on search input
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <h3>Loading books...</h3>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <div style={styles.header}>
                <h2>Explore Books 📚</h2>
                <input
                    type="text"
                    placeholder="Search by title, author, or genre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            {filteredBooks.length === 0 ? (
                <p>No books found matching "{searchTerm}".</p>
            ) : (
                <div style={styles.grid}>
                    {filteredBooks.map((book) => (
                        <div key={book._id} style={styles.card}>
                            <img
                                src={book.coverUrl || 'https://via.placeholder.com/150'}
                                alt={book.title}
                                style={styles.image}
                            />
                            <h3>{book.title}</h3>
                            <p><strong>Author:</strong> {book.author}</p>
                            <p><strong>Genre:</strong> {book.genre}</p>
                            <p>⭐ <strong>{book.averageRating || '0'}</strong> / 5 ({book.reviewCount || 0} reviews)</p>
                            <Link to={`/books/${book._id}`} style={styles.link}>
                                View Details & Reviews
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
    searchInput: { padding: '0.6rem 1rem', fontSize: '1rem', width: '300px', borderRadius: '6px', border: '1px solid #ccc' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' },
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    image: { width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px' },
    link: { display: 'inline-block', marginTop: '0.5rem', color: '#3498db', fontWeight: 'bold', textDecoration: 'none' }
};

export default Home;