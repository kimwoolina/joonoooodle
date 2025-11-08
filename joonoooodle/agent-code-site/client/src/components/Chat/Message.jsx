import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './Message.css'

function Message({ message, isStreaming = false }) {
  const { role, content } = message

  const getMessageClass = () => {
    switch (role) {
      case 'user':
        return 'message message-user'
      case 'assistant':
        return 'message message-assistant'
      case 'system':
        return 'message message-system'
      case 'tool':
        return 'message message-tool'
      case 'error':
        return 'message message-error'
      default:
        return 'message'
    }
  }

  const getMessageIcon = () => {
    switch (role) {
      case 'user':
        return '👤'
      case 'assistant':
        return '🤖'
      case 'system':
        return 'ℹ️'
      case 'tool':
        return '🔧'
      case 'error':
        return '⚠️'
      default:
        return ''
    }
  }

  return (
    <div className={getMessageClass()}>
      <div className="message-icon">{getMessageIcon()}</div>
      <div className="message-content">
        {role === 'assistant' || role === 'user' ? (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p>{content}</p>
        )}
        {isStreaming && <span className="streaming-cursor">▋</span>}
      </div>
    </div>
  )
}

export default Message
