import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Welcome Back</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={styles.input} />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '400px', margin: '2rem auto', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '0.8rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '0.8rem', fontSize: '1rem', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red' }
};

export default Login;