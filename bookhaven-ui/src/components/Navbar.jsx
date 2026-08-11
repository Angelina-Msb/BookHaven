import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Logged out successfully!');
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <Link to="/" style={styles.brandLink}>📚 BookHaven</Link>
            </div>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Home</Link>

                {token ? (
                    <>
                        <Link to="/my-books" style={styles.link}>My Books</Link>
                        <Link to="/add-book" style={styles.link}>Add Book</Link>
                        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#2c3e50',
        color: '#fff',
        marginBottom: '2rem'
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    brandLink: {
        color: '#fff',
        textDecoration: 'none'
    },
    links: {
        display: 'flex',
        gap: '1.2rem',
        alignItems: 'center'
    },
    link: {
        color: '#ecf0f1',
        textDecoration: 'none',
        fontWeight: '500'
    },
    logoutBtn: {
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default Navbar;