// Seoul Tree Management System JavaScript

// ============================================
// TREE MAP FUNCTIONALITY
// ============================================

let treeMap = null;
let treeMarkers = [];
let markerClusterGroup = null;

// Mock tree data generator
function generateMockTrees() {
    const species = [
        { common: 'Korean Red Pine', scientific: 'Pinus densiflora' },
        { common: 'Ginkgo', scientific: 'Ginkgo biloba' },
        { common: 'Zelkova', scientific: 'Zelkova serrata' },
        { common: 'Korean Mountain Ash', scientific: 'Sorbus alnifolia' },
        { common: 'Cherry', scientific: 'Prunus serrulata' },
        { common: 'Maple', scientific: 'Acer palmatum' }
    ];

    const districts = [
        { name: 'Gangnam-gu', lat: 37.5172, lng: 127.0473 },
        { name: 'Jongno-gu', lat: 37.5735, lng: 126.9788 },
        { name: 'Jung-gu', lat: 37.5636, lng: 126.9970 },
        { name: 'Mapo-gu', lat: 37.5663, lng: 126.9019 },
        { name: 'Songpa-gu', lat: 37.5145, lng: 127.1059 },
        { name: 'Seocho-gu', lat: 37.4837, lng: 127.0324 }
    ];

    const trees = [];
    for (let i = 0; i < 100; i++) {
        const district = districts[Math.floor(Math.random() * districts.length)];
        const sp = species[Math.floor(Math.random() * species.length)];
        const healthScore = Math.floor(Math.random() * 10) + 1;

        trees.push({
            id: `TREE-${String(i + 1).padStart(3, '0')}`,
            species: sp,
            location: {
                district: district.name,
                coordinates: {
                    lat: district.lat + (Math.random() - 0.5) * 0.05,
                    lng: district.lng + (Math.random() - 0.5) * 0.05
                }
            },
            physical: {
                height: (Math.random() * 20 + 5).toFixed(1),
                dbh: Math.floor(Math.random() * 80 + 20),
                estimatedAge: Math.floor(Math.random() * 50 + 10)
            },
            condition: {
                healthScore: healthScore,
                lastInspection: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        });
    }
    return trees;
}

// Get marker color based on health score
function getMarkerColor(healthScore) {
    if (healthScore >= 9) return '#4caf50'; // Excellent - green
    if (healthScore >= 7) return '#8bc34a'; // Good - light green
    if (healthScore >= 5) return '#ffc107'; // Fair - yellow
    return '#f44336'; // Poor - red
}

// Initialize tree map
function initTreeMap() {
    // Initialize map centered on Seoul
    treeMap = L.map('treeMap').setView([37.5665, 126.9780], 11);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(treeMap);

    // Initialize marker cluster group
    markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false
    });

    // Generate and add tree markers
    const trees = generateMockTrees();
    trees.forEach(tree => {
        const color = getMarkerColor(tree.condition.healthScore);

        const icon = L.divIcon({
            className: 'custom-tree-marker',
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16]
        });

        const marker = L.marker(
            [tree.location.coordinates.lat, tree.location.coordinates.lng],
            { icon: icon }
        );

        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">${tree.species.common}</h3>
                <p style="margin: 4px 0; font-size: 12px; color: #666;"><em>${tree.species.scientific}</em></p>
                <p style="margin: 4px 0;"><strong>ID:</strong> ${tree.id}</p>
                <p style="margin: 4px 0;"><strong>District:</strong> ${tree.location.district}</p>
                <p style="margin: 4px 0;"><strong>Health Score:</strong> ${tree.condition.healthScore}/10</p>
                <p style="margin: 4px 0;"><strong>Height:</strong> ${tree.physical.height}m</p>
                <p style="margin: 4px 0;"><strong>Age:</strong> ~${tree.physical.estimatedAge} years</p>
                <p style="margin: 4px 0; font-size: 11px; color: #888;">Last inspection: ${tree.condition.lastInspection}</p>
            </div>
        `);

        markerClusterGroup.addLayer(marker);
        treeMarkers.push({ marker, tree });
    });

    treeMap.addLayer(markerClusterGroup);
}

// Search and filter functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize map when page loads
    if (document.getElementById('treeMap')) {
        setTimeout(initTreeMap, 100);
    }

    // Search address
    const searchInput = document.getElementById('searchAddress');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) return;

            treeMarkers.forEach(({ marker, tree }) => {
                const matchesSearch =
                    tree.location.district.toLowerCase().includes(query) ||
                    tree.species.common.toLowerCase().includes(query);

                if (matchesSearch) {
                    marker.setOpacity(1);
                } else {
                    marker.setOpacity(0.2);
                }
            });
        });
    }

    // Health filter
    const healthFilter = document.getElementById('healthFilter');
    if (healthFilter) {
        healthFilter.addEventListener('change', (e) => {
            const filter = e.target.value;

            treeMarkers.forEach(({ marker, tree }) => {
                let show = true;

                if (filter === 'excellent') show = tree.condition.healthScore >= 9;
                else if (filter === 'good') show = tree.condition.healthScore >= 7 && tree.condition.healthScore < 9;
                else if (filter === 'fair') show = tree.condition.healthScore >= 5 && tree.condition.healthScore < 7;
                else if (filter === 'poor') show = tree.condition.healthScore < 5;

                marker.setOpacity(show ? 1 : 0.2);
            });
        });
    }

    // Emergency form submission
    const emergencyForm = document.getElementById('emergencyForm');
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Generate request ID
            const requestId = `REQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

            // Show confirmation
            const confirmation = document.getElementById('requestConfirmation');
            const requestIdElement = document.getElementById('requestId');

            requestIdElement.textContent = requestId;
            confirmation.classList.remove('hidden');

            // Scroll to confirmation
            confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Hide form temporarily
            Array.from(emergencyForm.elements).forEach(el => {
                if (el.type !== 'submit') el.disabled = true;
            });

            // Re-enable form after 5 seconds
            setTimeout(() => {
                confirmation.classList.add('hidden');
                emergencyForm.reset();
                Array.from(emergencyForm.elements).forEach(el => {
                    el.disabled = false;
                });
            }, 5000);
        });
    }
});

// Generate fake contact data
function generateFakeData() {
    const firstNames = ['Min-jun', 'Seo-yeon', 'Do-yoon', 'Ji-woo', 'Ye-jun', 'Ha-yoon'];
    const lastNames = ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    document.getElementById('contactName').value = `${lastName} ${firstName} (Demo)`;
    document.getElementById('contactEmail').value = `demo.${firstName.toLowerCase()}@example.com`;
    document.getElementById('contactPhone').value = `010-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
}

// Scroll helper functions
function scrollToMap() {
    document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
}

function scrollToRequest() {
    document.getElementById('request').scrollIntoView({ behavior: 'smooth' });
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
