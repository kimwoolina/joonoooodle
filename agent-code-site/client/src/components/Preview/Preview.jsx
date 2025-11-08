import { useState } from 'react'
import './Preview.css'

const PREVIEW_URL = import.meta.env.VITE_PREVIEW_URL || 'http://localhost:3000/demo'

function Preview({ onRefresh }) {
  const [iframeKey, setIframeKey] = useState(0)

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1)
    if (onRefresh) onRefresh()
  }

  const handleOpenNew = () => {
    window.open(PREVIEW_URL, '_blank')
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Live Preview</h2>
        <div className="preview-controls">
          <button onClick={handleRefresh} className="preview-button" title="Refresh">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
          <button onClick={handleOpenNew} className="preview-button" title="Open in new tab">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>
      <div className="preview-frame-container">
        <iframe
          key={iframeKey}
          src={PREVIEW_URL}
          className="preview-iframe"
          title="Demo Website Preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  )
}

export default Preview
