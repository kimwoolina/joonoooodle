import { useEffect, useRef } from 'react'
import Message from './Message'
import './MessageList.css'

function MessageList({ messages, isThinking, streamingMessage }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}

      {streamingMessage && (
        <Message
          message={{ role: 'assistant', content: streamingMessage }}
          isStreaming={true}
        />
      )}

      {isThinking && !streamingMessage && (
        <div className="thinking-indicator">
          <div className="thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="thinking-text">Agent is thinking...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
