
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Form from './Pages/Form';
import Admin from './Pages/Admin';
import About from './Pages/About';
function App() {
  return (
    <BrowserRouter>
      <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999, fontSize: 12, color: '#000', background: '#fff', padding: '4px 6px', borderRadius: 4 }}>
        App Loaded
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
