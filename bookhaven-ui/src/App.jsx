import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import MyBooks from './pages/MyBooks';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/my-books" element={<MyBooks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;