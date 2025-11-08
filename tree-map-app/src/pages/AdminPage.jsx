import { useNavigate } from 'react-router-dom'
import RequestList from '../components/Admin/RequestList'
import '../App.css'

function AdminPage() {
  const navigate = useNavigate()

  return (
    <div className="admin-page">
      <div className="admin-header">
        <button
          onClick={() => navigate('/')}
          className="back-button"
        >
          ← Back to Map
        </button>
        <h1>Admin Dashboard</h1>
      </div>
      <RequestList />
    </div>
  )
}

export default AdminPage
