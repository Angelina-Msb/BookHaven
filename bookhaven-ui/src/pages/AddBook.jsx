import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBook() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        coverUrl: '',
        description: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You must be logged in to add a book');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/books', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add book');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Add a New Book</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input type="text" name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} required style={styles.input} />
                <input type="text" name="author" placeholder="Author Name" value={formData.author} onChange={handleChange} required style={styles.input} />
                <input type="text" name="genre" placeholder="Genre (e.g. Fantasy, Sci-Fi)" value={formData.genre} onChange={handleChange} required style={styles.input} />
                <input type="url" name="coverUrl" placeholder="Image Cover URL" value={formData.coverUrl} onChange={handleChange} style={styles.input} />
                <textarea name="description" placeholder="Short Description" value={formData.description} onChange={handleChange} required style={{ ...styles.input, height: '100px' }} />
                <button type="submit" style={styles.button}>Add Book</button>
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '500px', margin: '2rem auto', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '0.8rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '0.8rem', fontSize: '1rem', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red' }
};

export default AddBook;