import { useState, useEffect } from 'react'
import Chat from './components/Chat/Chat'
import Preview from './components/Preview/Preview'
import Header from './components/UI/Header'
import './App.css'

function App() {
  const [previewKey, setPreviewKey] = useState(0);

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="chat-panel">
          <Chat onFileChange={refreshPreview} />
        </div>
        <div className="preview-panel">
          <Preview key={previewKey} onRefresh={refreshPreview} />
        </div>
      </div>
    </div>
  )
}

export default App
