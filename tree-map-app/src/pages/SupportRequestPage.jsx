import { useLocation, useNavigate } from 'react-router-dom'
import RequestForm from '../components/RequestForm/RequestForm'
import '../App.css'

function SupportRequestPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const treeData = location.state?.treeData

  return (
    <div className="support-page">
      <div className="support-header">
        <button
          onClick={() => navigate('/')}
          className="back-button"
        >
          ← Back to Map
        </button>
        <h1>Tree Support Request</h1>
      </div>
      <RequestForm initialTreeData={treeData} />
    </div>
  )
}

export default SupportRequestPage
