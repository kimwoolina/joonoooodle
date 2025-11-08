import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/UI/Header'
import TreeMapPage from './pages/TreeMapPage'
import SupportRequestPage from './pages/SupportRequestPage'
import AdminPage from './pages/AdminPage'
import ConfirmationPage from './components/Confirmation/ConfirmationPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<TreeMapPage />} />
          <Route path="/support" element={<SupportRequestPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
