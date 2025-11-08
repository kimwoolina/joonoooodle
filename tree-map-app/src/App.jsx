import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/UI/Header'
import MapPage from './pages/MapPage'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import ConfirmationPage from './components/Confirmation/ConfirmationPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/request" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
