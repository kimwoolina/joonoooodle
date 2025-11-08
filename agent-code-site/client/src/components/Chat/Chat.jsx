import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import './Chat.css'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

function Chat({ onFileChange }) {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('')

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL)

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Connected! Ask me to modify the demo website. Try: "Add a dark mode toggle" or "Change the color scheme to blue"'
      }])
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('message:thinking', (data) => {
      setIsThinking(data.thinking)
    })

    newSocket.on('message:stream', (data) => {
      if (data.isComplete) {
        // Streaming complete, finalize the message
        if (currentStreamingMessage) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: currentStreamingMessage
          }])
          setCurrentStreamingMessage('')
        }
      } else {
        // Accumulate streaming text
        setCurrentStreamingMessage(prev => prev + data.text)
      }
    })

    newSocket.on('tool:executed', (data) => {
      const toolMessage = `🔧 Executed: ${data.tool}${
        data.tool === 'Write' ? ` - Created/updated ${data.input.file_path}` :
        data.tool === 'Edit' ? ` - Modified ${data.input.file_path}` :
        data.tool === 'Read' ? ` - Read ${data.input.file_path}` :
        data.tool === 'Bash' ? ` - Ran: ${data.input.command}` :
        ''
      }`

      setMessages(prev => [...prev, {
        role: 'tool',
        content: toolMessage
      }])

      // Refresh preview when files are modified
      if (data.tool === 'Write' || data.tool === 'Edit') {
        setTimeout(() => onFileChange(), 500)
      }
    })

    newSocket.on('file:changed', (data) => {
      console.log('File changed:', data)
      onFileChange()
    })

    newSocket.on('error', (data) => {
      setMessages(prev => [...prev, {
        role: 'error',
        content: `Error: ${data.error}`
      }])
      setIsThinking(false)
    })

    setSocket(newSocket)

    // Start watching files
    newSocket.emit('files:watch')

    return () => {
      newSocket.emit('files:unwatch')
      newSocket.close()
    }
  }, [])

  const sendMessage = (message) => {
    if (!socket || !message.trim()) return

    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: message
    }])

    // Send to server
    socket.emit('message:send', {
      message,
      sessionId: socket.id
    })
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with AI Agent</h2>
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <MessageList
        messages={messages}
        isThinking={isThinking}
        streamingMessage={currentStreamingMessage}
      />
      <MessageInput onSend={sendMessage} disabled={!isConnected || isThinking} />
    </div>
  )
}

export default Chat
