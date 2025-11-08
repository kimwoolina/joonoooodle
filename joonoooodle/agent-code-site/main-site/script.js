// Demo website JavaScript

let clickCount = 0;

function showMessage() {
    clickCount++;
    const messageDiv = document.getElementById('message');

    const messages = [
        '👋 Hello! Thanks for clicking!',
        '✨ You clicked again!',
        '🎉 You\'re on a roll!',
        '🚀 Keep going!',
        '⭐ Amazing! Try asking the AI agent to modify this page!',
    ];

    const index = Math.min(clickCount - 1, messages.length - 1);
    messageDiv.textContent = messages[index];
    messageDiv.style.opacity = '1';

    // Animate the button
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    alert('Thanks for your message! (This is a demo - no actual submission happens)');
    form.reset();
}

function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add a subtle animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

console.log('Demo website loaded! Ask the AI agent to modify me!');

// ============================================
// CHAT WIDGET FUNCTIONALITY
// ============================================

const SOCKET_URL = 'http://localhost:3000';
let socket = null;
let username = null;
let sessionId = null;
let currentBranch = null;
let isThinking = false;
let currentMessage = '';
let isChatOpen = false;

// Initialize chat widget
window.addEventListener('load', () => {
    // Check if username is stored
    username = localStorage.getItem('buildright_username');

    if (!username) {
        // Show username modal on first chat open
        // Don't show it automatically
    } else {
        // Connect to WebSocket
        connectSocket();
    }
});

function setUsername() {
    const input = document.getElementById('usernameInput').value.trim();
    if (!input) {
        alert('Please enter your name');
        return;
    }

    username = input;
    localStorage.setItem('buildright_username', username);
    document.getElementById('usernameModal').classList.add('hidden');

    // Connect to WebSocket
    connectSocket();

    // Show welcome message
    addSystemMessage(`Welcome, ${username}! How can I help you customize this website?`);
}

function connectSocket() {
    if (socket) return; // Already connected

    socket = io(SOCKET_URL);

    socket.on('connect', () => {
        sessionId = socket.id;
        updateConnectionStatus(true);

        // Send username to server
        if (username) {
            socket.emit('user:set-name', { username });
        }
    });

    socket.on('disconnect', () => {
        updateConnectionStatus(false);
        addSystemMessage('Connection lost. Reconnecting...');
    });

    socket.on('user:name-set', (data) => {
        console.log('Username set:', data.username);
    });

    socket.on('message:thinking', (data) => {
        isThinking = data.thinking;
        updateSendButton(data.thinking);

        if (data.thinking) {
            showThinkingIndicator();
        } else {
            hideThinkingIndicator();
        }
    });

    socket.on('message:stream', (data) => {
        if (data.isComplete) {
            // Message complete
            if (currentMessage) {
                finalizeStreamingMessage();
                currentMessage = '';
            }
        } else {
            // Accumulate streaming text
            currentMessage += data.text;
            updateStreamingMessage(currentMessage);
        }
    });

    socket.on('message:cancelled', () => {
        addSystemMessage('Message cancelled');
        currentMessage = '';
        hideThinkingIndicator();
    });

    socket.on('preview:ready', (data) => {
        currentBranch = data.branchName;
        showPreviewNotification(data);
    });

    socket.on('request:submitted', (data) => {
        showSubmittedNotification(data);
    });

    socket.on('error', (data) => {
        addSystemMessage(`Error: ${data.error}`, true);
    });
}

function toggleChat() {
    isChatOpen = !isChatOpen;
    const chatPanel = document.getElementById('chatPanel');

    if (isChatOpen) {
        chatPanel.classList.remove('hidden');
        document.getElementById('chatInput').focus();

        // Check if we need to show username modal
        if (!username) {
            document.getElementById('usernameModal').classList.remove('hidden');
        }
    } else {
        chatPanel.classList.add('hidden');
    }
}

function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('chatStatus');
    const dot = statusElement.querySelector('.status-dot');

    if (connected) {
        dot.classList.add('connected');
        dot.classList.remove('disconnected');
        statusElement.innerHTML = `
            <span class="status-dot connected"></span>
            Connected
        `;
    } else {
        dot.classList.remove('connected');
        dot.classList.add('disconnected');
        statusElement.innerHTML = `
            <span class="status-dot disconnected"></span>
            Disconnected
        `;
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || !socket) return;

    // Check if user has set username
    if (!username) {
        document.getElementById('usernameModal').classList.remove('hidden');
        return;
    }

    addUserMessage(message);
    input.value = '';
    autoResizeTextarea(input);

    // Send to server
    socket.emit('message:send', {
        message,
        isNewFeature: !currentBranch,
        featureDescription: message,
    });
}

function cancelChatMessage() {
    if (socket) {
        socket.emit('message:cancel');
    }
}

function handleChatKeydown(event) {
    const input = event.target;

    // Send on Enter (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }

    // Auto-resize textarea
    autoResizeTextarea(input);
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function addUserMessage(text) {
    const messagesDiv = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = 'message user';
    msg.textContent = text;
    messagesDiv.appendChild(msg);
    scrollToBottom();
}

function addAssistantMessage(text) {
    const messagesDiv = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = 'message assistant';
    msg.innerHTML = text.replace(/\n/g, '<br>');
    messagesDiv.appendChild(msg);
    scrollToBottom();
}

function addSystemMessage(text, isError = false) {
    const messagesDiv = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = 'message system';
    msg.textContent = text;
    if (isError) msg.style.background = '#ffebee';
    messagesDiv.appendChild(msg);
    scrollToBottom();
}

function showThinkingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    const thinking = document.createElement('div');
    thinking.id = 'thinkingIndicator';
    thinking.className = 'message thinking';
    thinking.innerHTML = `
        <span>AI is thinking</span>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    messagesDiv.appendChild(thinking);
    scrollToBottom();
}

function hideThinkingIndicator() {
    const thinking = document.getElementById('thinkingIndicator');
    if (thinking) thinking.remove();

    const streaming = document.getElementById('streamingMessage');
    if (streaming && !currentMessage) {
        streaming.remove();
    }
}

function updateStreamingMessage(text) {
    const messagesDiv = document.getElementById('chatMessages');
    let streamMsg = document.getElementById('streamingMessage');

    if (!streamMsg) {
        // Remove thinking indicator
        const thinking = document.getElementById('thinkingIndicator');
        if (thinking) thinking.remove();

        streamMsg = document.createElement('div');
        streamMsg.id = 'streamingMessage';
        streamMsg.className = 'message assistant';
        messagesDiv.appendChild(streamMsg);
    }

    streamMsg.innerHTML = text.replace(/\n/g, '<br>');
    scrollToBottom();
}

function finalizeStreamingMessage() {
    const streamMsg = document.getElementById('streamingMessage');
    if (streamMsg) {
        streamMsg.removeAttribute('id');
    }
}

function updateSendButton(thinking) {
    const sendBtn = document.getElementById('sendButton');
    const cancelBtn = document.getElementById('cancelButton');

    if (thinking) {
        sendBtn.disabled = true;
        cancelBtn.classList.remove('hidden');
    } else {
        sendBtn.disabled = false;
        cancelBtn.classList.add('hidden');
    }
}

function scrollToBottom() {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showPreviewNotification(data) {
    const notification = document.getElementById('previewNotification');
    notification.classList.remove('hidden');

    // Store branch info for submit
    currentBranch = data.branchName;
}

function showSubmittedNotification(data) {
    const notification = document.getElementById('previewNotification');
    notification.innerHTML = `
        <div class="preview-content">
            <p><strong>✅ Submitted!</strong></p>
            <p>Your request is now pending admin approval.</p>
        </div>
    `;

    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
        currentBranch = null;
    }, 5000);

    addSystemMessage('Your changes have been submitted for approval!');
}

function submitForApproval() {
    if (!socket || !currentBranch) return;

    const description = prompt('Add a description for this change request (optional):');

    socket.emit('request:submit', {
        description: description || 'Website modification request'
    });
}

function viewPreview() {
    if (!currentBranch) {
        alert('No preview available');
        return;
    }

    // Set the branch name in the modal
    document.getElementById('previewBranchName').textContent = currentBranch;

    // Load the preview in the iframe
    const previewUrl = `http://localhost:3000/preview/${currentBranch}/index.html`;
    document.getElementById('previewFrame').src = previewUrl;

    // Show the modal
    document.getElementById('previewModal').classList.remove('hidden');
}

function closePreview() {
    document.getElementById('previewModal').classList.add('hidden');
    document.getElementById('previewFrame').src = '';
}
