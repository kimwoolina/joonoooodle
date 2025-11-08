// ============================================
// SEOUL TREE SUPPORT REQUEST SYSTEM
// ============================================

// Global variables
let map = null;
let treesData = [];
let requestsData = [];
let selectedTree = null;
let markers = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Load tree data first
    await loadTreeData();

    // Initialize fake request data
    initializeFakeData();

    // Display requests list
    displayRequestsList();
});

// Initialize fake request data
function initializeFakeData() {
    requestsData = [
        {
            id: 1,
            treeId: 'TREE-0042',
            treeInfo: {
                species: 'Ginkgo (은행나무)',
                location: 'Jongno-gu, Gwanghwamun-ro 1',
                health: 8
            },
            type: 'pruning',
            title: 'Branch blocking power lines',
            description: 'The ginkgo tree branches have grown and appear to be touching power lines. Pruning is needed for safety.',
            contact: {
                name: 'Kim Chulsoo',
                phone: '010-1234-5678',
                email: 'kim@email.com'
            },
            status: 'completed',
            timestamp: '2025-10-15T09:30:00Z'
        },
        {
            id: 2,
            treeId: 'TREE-0156',
            treeInfo: {
                species: 'Cherry (벚나무)',
                location: 'Gangnam-gu, Teheran-ro 152',
                health: 5
            },
            type: 'disease',
            title: 'Brown spots on leaves',
            description: 'Recently, many brown spots have appeared on the leaves and some leaves are falling. Pest inspection is needed.',
            contact: {
                name: 'Lee Younghee',
                phone: '010-2345-6789',
                email: 'lee@email.com'
            },
            status: 'processing',
            timestamp: '2025-10-28T14:20:00Z'
        },
        {
            id: 3,
            treeId: 'TREE-0289',
            treeInfo: {
                species: 'Pine (소나무)',
                location: 'Seocho-gu, Seocho-daero 397',
                health: 9
            },
            type: 'maintenance',
            title: 'Area needs cleaning',
            description: 'Fallen leaves and trash have accumulated around the tree. Regular cleaning is needed.',
            contact: {
                name: 'Park Minsu',
                phone: '010-3456-7890',
                email: 'park@email.com'
            },
            status: 'pending',
            timestamp: '2025-11-05T11:00:00Z'
        },
        {
            id: 4,
            treeId: 'TREE-0042',
            treeInfo: {
                species: 'Ginkgo (은행나무)',
                location: 'Jongno-gu, Gwanghwamun-ro 1',
                health: 8
            },
            type: 'other',
            title: 'Request for information sign',
            description: 'This ginkgo tree appears to be old and has historical value. Suggest installing an information sign.',
            contact: {
                name: 'Jung Sujin',
                phone: '010-4567-8901',
                email: 'jung@email.com'
            },
            status: 'processing',
            timestamp: '2025-11-07T16:45:00Z'
        },
        {
            id: 5,
            treeId: 'TREE-0523',
            treeInfo: {
                species: 'Zelkova (느티나무)',
                location: 'Mapo-gu, World Cup-ro 240',
                health: 6
            },
            type: 'hazard',
            title: 'Large branch at risk of breaking',
            description: 'After strong winds, discovered a crack in a large branch. Emergency action needed for pedestrian safety.',
            contact: {
                name: 'Choi Dongwook',
                phone: '010-5678-9012',
                email: 'choi@email.com'
            },
            status: 'pending',
            timestamp: '2025-11-08T08:15:00Z'
        }
    ];
}

// Load tree data from API
async function loadTreeData() {
    try {
        const response = await fetch('/api/trees');
        treesData = await response.json();
        console.log(`Loaded ${treesData.length} trees`);
    } catch (error) {
        console.error('Error loading tree data:', error);
    }
}

// Display requests list
function displayRequestsList() {
    const container = document.getElementById('requestList');
    const countElement = document.getElementById('requestCount');

    container.innerHTML = '';
    countElement.textContent = requestsData.length;

    if (requestsData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📋</span>
                <h2>No Requests Yet</h2>
                <p>Be the first to submit a tree support request</p>
            </div>
        `;
        return;
    }

    requestsData.forEach(request => {
        const card = document.createElement('div');
        card.className = 'request-card';
        card.onclick = () => showRequestDetail(request.id);

        const typeLabel = getRequestTypeLabel(request.type);
        const statusLabel = getStatusLabel(request.status);
        const date = formatDate(request.timestamp);
        const mapId = `card-map-${request.id}`;

        card.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    <div class="card-title">
                        <span class="request-id">#${String(request.id).padStart(4, '0')}</span>
                        <span class="status-badge status-${request.status}">${statusLabel}</span>
                    </div>
                    <div class="emergency-type">${typeLabel}</div>
                </div>
                <div class="card-body">
                    <div class="info-section">
                        <h4>Request</h4>
                        <p><strong>Title:</strong> ${request.title}</p>
                        <p><strong>Description:</strong> ${request.description}</p>
                    </div>
                    <div class="info-section">
                        <h4>Tree Information</h4>
                        <p><strong>ID:</strong> ${request.treeId}</p>
                        <p><strong>Species:</strong> ${request.treeInfo.species}</p>
                        <p><strong>Location:</strong> ${request.treeInfo.location}</p>
                    </div>
                    <div class="card-footer">
                        <span class="submit-date">Submitted: ${date}</span>
                    </div>
                </div>
            </div>
            <div class="card-map">
                <div id="${mapId}" class="card-map-small"></div>
            </div>
        `;

        container.appendChild(card);

        // Initialize small map for this card
        setTimeout(() => {
            initCardMap(mapId, request);
        }, 100);
    });
}

// Initialize small map for card
function initCardMap(mapId, request) {
    try {
        const tree = treesData.find(t => t.id === request.treeId);
        if (!tree) {
            console.warn(`Tree not found: ${request.treeId}`);
            return;
        }

        const cardMap = L.map(mapId, {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false
        }).setView([tree.location.coordinates.lat, tree.location.coordinates.lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(cardMap);

        const healthScore = tree.condition.healthScore;
        const color = healthScore >= 8 ? '#10b981' :
                     healthScore >= 6 ? '#06b6d4' :
                     healthScore >= 4 ? '#f59e0b' : '#ef4444';

        L.circleMarker([tree.location.coordinates.lat, tree.location.coordinates.lng], {
            radius: 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(cardMap);
    } catch (error) {
        console.error('Error initializing card map:', error);
    }
}

// Show request detail
function showRequestDetail(requestId) {
    const request = requestsData.find(r => r.id === requestId);
    if (!request) return;

    document.getElementById('detailTitle').textContent = request.title;
    document.getElementById('detailDate').textContent = `Date: ${formatDate(request.timestamp)}`;
    document.getElementById('detailAuthor').textContent = `Submitted by: ${request.contact.name}`;
    document.getElementById('detailStatus').innerHTML = `<span class="status-badge status-${request.status}">${getStatusLabel(request.status)}</span>`;

    const healthClass = getHealthClass(request.treeInfo.health);
    const healthLabel = getHealthLabel(request.treeInfo.health);

    document.getElementById('detailTreeInfo').innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Tree ID</span>
            <span class="detail-value">${request.treeId}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Species</span>
            <span class="detail-value">${request.treeInfo.species}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Location</span>
            <span class="detail-value">${request.treeInfo.location}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Health</span>
            <span class="detail-value">
                <span class="health-badge ${healthClass}">${healthLabel} (${request.treeInfo.health}/10)</span>
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Request Type</span>
            <span class="detail-value">${getRequestTypeLabel(request.type)}</span>
        </div>
    `;

    document.getElementById('detailDescription').textContent = request.description;

    document.getElementById('detailContact').innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Name</span>
            <span class="detail-value">${request.contact.name}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Phone</span>
            <span class="detail-value">${request.contact.phone}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Email</span>
            <span class="detail-value">${request.contact.email || '-'}</span>
        </div>
    `;

    initDetailMap(request);
    showPage('detail');
}

// Initialize detail page map
function initDetailMap(request) {
    const detailMapDiv = document.getElementById('detailMap');
    detailMapDiv.innerHTML = '';

    try {
        const tree = treesData.find(t => t.id === request.treeId);
        if (!tree) return;

        const detailMap = L.map('detailMap', {
            zoomControl: true,
            attributionControl: false,
        }).setView([tree.location.coordinates.lat, tree.location.coordinates.lng], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(detailMap);

        const healthScore = tree.condition.healthScore;
        const color = healthScore >= 8 ? '#10b981' :
                     healthScore >= 6 ? '#06b6d4' :
                     healthScore >= 4 ? '#f59e0b' : '#ef4444';

        L.circleMarker([tree.location.coordinates.lat, tree.location.coordinates.lng], {
            radius: 10,
            fillColor: color,
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
        }).bindPopup(`
            <strong>${tree.species.common_ko}</strong><br>
            ${tree.location.district_ko} ${tree.location.neighborhood_ko}
        `).addTo(detailMap);

        setTimeout(() => {
            detailMap.invalidateSize();
        }, 100);
    } catch (error) {
        console.error('Error initializing detail map:', error);
    }
}

// Show page
function showPage(page) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    if (page === 'list') {
        document.getElementById('listPage').classList.add('active');
        displayRequestsList();
    } else if (page === 'detail') {
        document.getElementById('detailPage').classList.add('active');
    } else if (page === 'create') {
        document.getElementById('createPage').classList.add('active');
        if (!map) {
            initMap();
        }
        displaySelectedTree();
    }
}

// Initialize Leaflet map
function initMap() {
    map = L.map('map').setView([37.5665, 126.9780], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for all trees
    treesData.forEach(tree => {
        const healthScore = tree.condition.healthScore;
        const color = healthScore >= 8 ? '#10b981' :
                     healthScore >= 6 ? '#06b6d4' :
                     healthScore >= 4 ? '#f59e0b' : '#ef4444';

        const marker = L.circleMarker([tree.location.coordinates.lat, tree.location.coordinates.lng], {
            radius: 6,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        marker.bindPopup(`
            <strong>${tree.species.common_ko}</strong><br>
            ${tree.species.common}<br>
            ${tree.location.district_ko} ${tree.location.neighborhood_ko}<br>
            Health: ${healthScore}/10
        `);

        marker.on('click', () => {
            selectTree(tree);
        });

        marker.addTo(map);
        markers.push(marker);
    });
}

// Select tree from map
function selectTree(tree) {
    selectedTree = tree;
    displaySelectedTree();
}

// Display selected tree info
function displaySelectedTree() {
    const treeSelection = document.getElementById('treeSelection');
    const submitBtn = document.getElementById('submitBtn');

    if (!selectedTree) {
        treeSelection.innerHTML = `
            <div class="no-tree-notice">
                <div class="icon">🗺️</div>
                <h4>Select a Tree</h4>
                <p>Click on a tree marker on the map to select it for your support request</p>
            </div>
        `;
        submitBtn.disabled = true;
        return;
    }

    submitBtn.disabled = false;

    const healthClass = getHealthClass(selectedTree.condition.healthScore);
    const healthLabel = getHealthLabel(selectedTree.condition.healthScore);

    treeSelection.innerHTML = `
        <div class="selected-tree-banner">
            <div class="selected-tree-header">
                <h4>✓ Selected Tree</h4>
                <button type="button" class="clear-btn" onclick="clearSelectedTree()">
                    Change Selection
                </button>
            </div>
            <div class="tree-info-grid">
                <div>
                    <span class="tree-info-label">Tree ID: </span>
                    <span class="tree-info-value">${selectedTree.id}</span>
                </div>
                <div>
                    <span class="tree-info-label">Species: </span>
                    <span class="tree-info-value">${selectedTree.species.common_ko}</span>
                </div>
                <div>
                    <span class="tree-info-label">Health: </span>
                    <span class="health-badge ${healthClass}">${healthLabel}</span>
                </div>
                <div style="grid-column: 1 / -1;">
                    <span class="tree-info-label">Location: </span>
                    <span class="tree-info-value">${selectedTree.location.district_ko} ${selectedTree.location.neighborhood_ko}</span>
                </div>
            </div>
        </div>
    `;
}

// Clear selected tree
function clearSelectedTree() {
    selectedTree = null;
    displaySelectedTree();
}

// Submit request
function submitRequest(event) {
    event.preventDefault();

    if (!selectedTree) {
        alert('Please select a tree on the map first.');
        return;
    }

    const type = document.getElementById('requestType').value;
    const description = document.getElementById('description').value;
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;

    if (!type || !description || !name || !phone) {
        alert('Please fill in all required fields.');
        return;
    }

    const typeLabel = getRequestTypeLabel(type);
    const title = `${typeLabel} - ${selectedTree.species.common} (${selectedTree.id})`;

    const newRequest = {
        id: requestsData.length + 1,
        treeId: selectedTree.id,
        treeInfo: {
            species: `${selectedTree.species.common} (${selectedTree.species.common_ko})`,
            location: `${selectedTree.location.district_ko} ${selectedTree.location.neighborhood_ko}`,
            health: selectedTree.condition.healthScore
        },
        type: type,
        title: title,
        description: description,
        contact: {
            name: name,
            phone: phone,
            email: email
        },
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    requestsData.push(newRequest);

    document.getElementById('requestForm').reset();
    selectedTree = null;
    displaySelectedTree();

    alert('Request submitted successfully!');
    showPage('list');
}

// Utility: Get request type label
function getRequestTypeLabel(type) {
    const labels = {
        pruning: 'Pruning',
        disease: 'Disease/Pest',
        hazard: 'Hazard',
        maintenance: 'Maintenance',
        other: 'Other'
    };
    return labels[type] || type;
}

// Utility: Get status label
function getStatusLabel(status) {
    const labels = {
        pending: 'Pending',
        processing: 'Processing',
        completed: 'Completed',
        rejected: 'Rejected'
    };
    return labels[status] || status;
}

// Utility: Get health label
function getHealthLabel(healthScore) {
    if (healthScore >= 8) return 'Excellent';
    if (healthScore >= 6) return 'Good';
    if (healthScore >= 4) return 'Fair';
    return 'Poor';
}

// Utility: Get health class
function getHealthClass(healthScore) {
    if (healthScore >= 8) return 'health-excellent';
    if (healthScore >= 6) return 'health-good';
    if (healthScore >= 4) return 'health-fair';
    return 'health-poor';
}

// Utility: Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
// CHAT WIDGET FUNCTIONALITY
// ============================================

// Use window.location.origin to support both direct access and iframes
const SOCKET_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
let socket = null;
let sessionId = null;
let currentBranch = null;
let isThinking = false;
let currentMessage = '';
let isChatOpen = false;

// Helper function to get username from cookie
function getUsername() {
    console.log('getUsername called, all cookies:', document.cookie);
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('agent_code_username='));
    const username = cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    console.log('getUsername returning:', username);
    return username;
}

// Initialize chat widget
window.addEventListener('load', () => {
    // Check if user is logged in via cookie
    const username = getUsername();
    if (username) {
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

    // Set cookie for server-side routing
    document.cookie = `buildright_username=${username}; path=/; max-age=31536000`; // 1 year

    // Redirect to /site/ to load user's worktree
    window.location.href = '/site/';
}

function connectSocket() {
    if (socket) {
        console.log('Socket already exists, connected:', socket.connected);
        return; // Already connected
    }

    console.log('Creating new socket connection to', SOCKET_URL);
    socket = io(SOCKET_URL);

    socket.on('connect', () => {
        console.log('Socket connected!', socket.id);
        sessionId = socket.id;
        updateConnectionStatus(true);

        // Send username to server
        const username = getUsername();
        console.log('Sending username to server:', username);
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
        console.log('Preview ready event received:', data);
        currentBranch = data.branchName;
        showPreviewNotification(data);
    });

    socket.on('request:submitted', (data) => {
        showSubmittedNotification(data);
    });

    socket.on('error', (data) => {
        addSystemMessage(`Error: ${data.error}`, true);
    });

    socket.on('changes:applied', (data) => {
        addSystemMessage(data.message || 'Changes applied successfully! Reloading page...');

        // Reload immediately now that backend has confirmed changes are applied
        setTimeout(() => {
            window.location.reload();
        }, 500);
    });

    socket.on('request:submitted', (data) => {
        addSystemMessage(data.message || 'Request submitted for admin approval!');
    });
}

function toggleChat() {
    isChatOpen = !isChatOpen;
    const chatPanel = document.getElementById('chatPanel');

    if (isChatOpen) {
        chatPanel.classList.remove('hidden');
        document.getElementById('chatInput').focus();

        // Connect socket if not already connected and user is logged in
        const username = getUsername();
        if (username && !socket) {
            console.log('Connecting socket from toggleChat');
            connectSocket();
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

    console.log('sendChatMessage called', { message, socket, socketConnected: socket?.connected });

    if (!message) return;

    // Check if socket exists and is connected
    if (!socket || !socket.connected) {
        console.log('Socket not connected, attempting to connect...');
        if (!socket) {
            connectSocket();
        }
        addSystemMessage('Connecting to server...');
        return;
    }

    // Check if user is logged in
    const username = getUsername();
    if (!username) {
        addSystemMessage('Please log in to send messages');
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
        <span>Agent is thinking...</span>
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
    // Use requestAnimationFrame to ensure DOM has updated before scrolling
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });
    });
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

function viewPreview() {
    console.log('viewPreview called, currentBranch:', currentBranch);
    if (!currentBranch) {
        alert('No preview available');
        return;
    }

    // Set the branch name in the modal
    document.getElementById('previewBranchName').textContent = currentBranch;

    // Load the preview in the iframe from the worktree
    const previewUrl = `/w/${currentBranch}/`;
    console.log('Loading preview from URL:', previewUrl);
    document.getElementById('previewFrame').src = previewUrl;

    // Show the modal
    document.getElementById('previewModal').classList.remove('hidden');
}

function closePreview() {
    document.getElementById('previewModal').classList.add('hidden');
    document.getElementById('previewFrame').src = '';
}

function applyChanges() {
    // Show custom confirmation modal
    document.getElementById('confirmModal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.add('hidden');
}

function confirmApplyChanges() {
    // Close confirmation modal
    closeConfirmModal();

    // Close preview modal
    closePreview();

    // Emit event to apply changes and submit for approval
    socket.emit('request:apply-and-submit');

    // Show loading state
    addSystemMessage('Applying changes to your site and submitting for admin approval...');
}
