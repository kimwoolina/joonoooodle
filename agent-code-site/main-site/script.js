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
                    <div class="card-body-content">
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
                    </div>
                    <div class="card-map">
                        <div id="${mapId}" class="card-map-small"></div>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="submit-date">Submitted: ${date}</span>
                </div>
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
    } else if (page === 'admin') {
        document.getElementById('adminPage').classList.add('active');
        // Initialize admin dashboard when showing admin page
        setTimeout(() => {
            initAdminDashboard();
        }, 100);
    } else if (page === 'modDetail') {
        document.getElementById('modDetailPage').classList.add('active');
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

    // Setup tree search functionality
    setupTreeSearch();
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

// Setup tree search functionality
function setupTreeSearch() {
    const searchInput = document.getElementById('treeSearch');
    let searchDropdown = document.getElementById('searchDropdown');

    // Create dropdown if it doesn't exist
    if (!searchDropdown) {
        searchDropdown = document.createElement('div');
        searchDropdown.id = 'searchDropdown';
        searchDropdown.className = 'search-dropdown';
        searchInput.parentNode.appendChild(searchDropdown);
    }

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();

        if (query.length === 0) {
            searchDropdown.classList.remove('active');
            return;
        }

        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query, searchDropdown);
        }, 300);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('active');
        }
    });
}

// Perform tree search
function performSearch(query, dropdown) {
    const results = treesData.filter(tree => {
        const treeId = tree.id.toLowerCase();
        const species = (tree.species.common_ko + ' ' + tree.species.common).toLowerCase();
        const location = (tree.location.district_ko + ' ' + tree.location.neighborhood_ko).toLowerCase();

        return treeId.includes(query) ||
               species.includes(query) ||
               location.includes(query);
    });

    if (results.length === 0) {
        dropdown.innerHTML = '<div class="search-item no-results">No trees found</div>';
        dropdown.classList.add('active');

        // Hide "no results" after 2 seconds
        setTimeout(() => {
            dropdown.classList.remove('active');
        }, 2000);
        return;
    }

    // Limit to 10 results
    const limitedResults = results.slice(0, 10);

    dropdown.innerHTML = limitedResults.map(tree => {
        const healthScore = tree.condition.healthScore;
        const healthClass = getHealthClass(healthScore);
        const healthLabel = getHealthLabel(healthScore);

        return `
            <div class="search-item" data-tree-id="${tree.id}">
                <div class="search-item-main">
                    <strong>${tree.id}</strong>
                    <span class="health-badge ${healthClass}">${healthLabel}</span>
                </div>
                <div class="search-item-details">
                    ${tree.species.common_ko} (${tree.species.common})
                </div>
                <div class="search-item-location">
                    📍 ${tree.location.district_ko} ${tree.location.neighborhood_ko}
                </div>
            </div>
        `;
    }).join('');

    dropdown.classList.add('active');

    // Add click handlers to search results
    dropdown.querySelectorAll('.search-item:not(.no-results)').forEach(item => {
        item.addEventListener('click', () => {
            const treeId = item.getAttribute('data-tree-id');
            const tree = treesData.find(t => t.id === treeId);
            if (tree) {
                selectTree(tree);
                map.setView([tree.location.coordinates.lat, tree.location.coordinates.lng], 16);
                dropdown.classList.remove('active');
                document.getElementById('treeSearch').value = '';
            }
        });
    });
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

    // Set cookie for server-side routing
    document.cookie = `buildright_username=${username}; path=/; max-age=31536000`; // 1 year

    // Redirect to /site/ to load user's worktree
    window.location.href = '/site/';
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

// ============================================
// ADMIN DASHBOARD
// ============================================

// Mock data for modifications
let modificationsData = [];
let timelineChart = null;
let donutChart = null;

// Initialize admin dashboard when the page is shown
function initAdminDashboard() {
    // Generate mock data if not already generated
    if (modificationsData.length === 0) {
        generateMockModifications();
    }

    // Render the dashboard
    renderModificationsTable();
    initializeCharts();
    setupFilterButtons();
}

// Generate mock modification data
function generateMockModifications() {
    const requesters = ['공공포털팀', '시청 관리자', '김영희', '이철수', '박민수', 'AI Bot'];
    const statuses = ['approved', 'pending', 'rejected', 'rollback'];
    const requests = [
        '상단 배너를 "2025년 신규 정책 안내"로 바꿔줘',
        '메인 페이지 색상을 좀 더 밝게 해줘',
        '푸터에 연락처 정보 추가해줘',
        '로그인 버튼 크기를 키워줘',
        '모바일에서 메뉴가 잘 보이게 해줘',
        '검색창을 상단에 추가해줘',
        '공지사항 섹션을 더 눈에 띄게 해줘',
        '폰트 크기를 좀 더 크게 해줘',
        '이미지 슬라이더 추가해줘',
        '404 페이지 디자인 개선해줘'
    ];

    const summaries = [
        'header.html → banner-text 변경',
        'styles.css → color scheme 업데이트',
        'footer.html → contact-info 추가',
        'index.html → button size 조정',
        'mobile.css → responsive menu 수정',
        'header.html → search-bar 추가',
        'index.html → notice-section 스타일 변경',
        'styles.css → font-size 증가',
        'index.html → image-carousel 컴포넌트 추가',
        '404.html → 페이지 디자인 리뉴얼'
    ];

    // Generate data for the last 30 days
    const now = new Date();
    for (let i = 0; i < 127; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        const statusWeights = { approved: 0.7, pending: 0.1, rejected: 0.15, rollback: 0.05 };
        let rand = Math.random();
        let status = 'approved';
        if (rand < statusWeights.rollback) status = 'rollback';
        else if (rand < statusWeights.rollback + statusWeights.rejected) status = 'rejected';
        else if (rand < statusWeights.rollback + statusWeights.rejected + statusWeights.pending) status = 'pending';

        modificationsData.push({
            id: i + 1,
            date: date.toISOString(),
            requester: requesters[Math.floor(Math.random() * requesters.length)],
            request: requests[Math.floor(Math.random() * requests.length)],
            summary: summaries[Math.floor(Math.random() * summaries.length)],
            status: status,
            rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
            comments: '수정 내용이 정확하고 빠르게 적용되었습니다.',
            codeDiff: `- <h1>기존 타이틀</h1>\n+ <h1>2025년 신규 정책 안내</h1>\n\n- background: #ffffff;\n+ background: #f5f5f5;`
        });
    }

    // Sort by date (newest first)
    modificationsData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Render modifications table
function renderModificationsTable(filter = 'all') {
    const tbody = document.getElementById('modificationsTableBody');
    if (!tbody) return;

    // Filter data
    let filteredData = modificationsData;
    if (filter !== 'all') {
        filteredData = modificationsData.filter(mod => mod.status === filter);
    }

    // Clear table
    tbody.innerHTML = '';

    // Render rows (show first 20)
    filteredData.slice(0, 20).forEach(mod => {
        const row = document.createElement('tr');

        // Format date and time in clean format
        const date = new Date(mod.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}.${month}.${day} ${hours}:${minutes}`;

        const rowCell = document.createElement('td');
        rowCell.className = 'mod-date';
        rowCell.textContent = formattedDate;
        row.appendChild(rowCell);

        const requesterCell = document.createElement('td');
        requesterCell.className = 'mod-requester';
        requesterCell.textContent = mod.requester;
        row.appendChild(requesterCell);

        const requestCell = document.createElement('td');
        requestCell.className = 'mod-request';
        requestCell.textContent = mod.request;
        requestCell.style.cursor = 'pointer';
        requestCell.onclick = () => showModificationDetail(mod.id);
        row.appendChild(requestCell);

        const summaryCell = document.createElement('td');
        summaryCell.className = 'mod-summary';
        summaryCell.textContent = mod.summary;
        row.appendChild(summaryCell);

        const actionsCell = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'table-action-buttons';

        const approveBtn = document.createElement('button');
        approveBtn.className = 'table-action-btn approve';
        approveBtn.textContent = 'Approve';
        approveBtn.onclick = (e) => {
            e.stopPropagation();
            quickApprove(mod.id);
        };

        const rejectBtn = document.createElement('button');
        rejectBtn.className = 'table-action-btn reject';
        rejectBtn.textContent = 'Reject';
        rejectBtn.onclick = (e) => {
            e.stopPropagation();
            quickReject(mod.id);
        };

        actionsDiv.appendChild(approveBtn);
        actionsDiv.appendChild(rejectBtn);
        actionsCell.appendChild(actionsDiv);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

// Quick approve from table
function quickApprove(modId) {
    const mod = modificationsData.find(m => m.id === modId);
    if (mod) {
        mod.status = 'approved';
        alert('✅ 승인되었습니다!');
        renderModificationsTable();
        if (timelineChart) initializeCharts();
    }
}

// Quick reject from table
function quickReject(modId) {
    const mod = modificationsData.find(m => m.id === modId);
    if (mod) {
        mod.status = 'rejected';
        alert('❌ 거절되었습니다.');
        renderModificationsTable();
        if (timelineChart) initializeCharts();
    }
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Get filter status
            const status = btn.getAttribute('data-status');

            // Render table with filter
            renderModificationsTable(status);
        });
    });
}

// Initialize charts
function initializeCharts() {
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Timeline Chart
    const timelineCtx = document.getElementById('timelineChart');
    if (timelineCtx) {
        // Prepare data for the last 14 days
        const days = 14;
        const labels = [];
        const proposedData = [];
        const approvedData = [];
        const rollbackData = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }));

            // Count modifications for this day
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            const dayMods = modificationsData.filter(mod => {
                const modDate = new Date(mod.date);
                return modDate >= dayStart && modDate <= dayEnd;
            });

            proposedData.push(dayMods.length);
            approvedData.push(dayMods.filter(m => m.status === 'approved').length);
            rollbackData.push(dayMods.filter(m => m.status === 'rollback').length);
        }

        if (timelineChart) {
            timelineChart.destroy();
        }

        timelineChart = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '제안 건수',
                        data: proposedData,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '승인 건수',
                        data: approvedData,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '롤백 건수',
                        data: rollbackData,
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Donut Chart
    const donutCtx = document.getElementById('donutChart');
    if (donutCtx) {
        // Count status for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentMods = modificationsData.filter(mod => new Date(mod.date) >= sevenDaysAgo);

        const statusCounts = {
            approved: recentMods.filter(m => m.status === 'approved').length,
            pending: recentMods.filter(m => m.status === 'pending').length,
            rejected: recentMods.filter(m => m.status === 'rejected').length,
            rollback: recentMods.filter(m => m.status === 'rollback').length
        };

        if (donutChart) {
            donutChart.destroy();
        }

        donutChart = new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: ['승인됨', '대기중', '거절됨', '롤백됨'],
                datasets: [{
                    data: [statusCounts.approved, statusCounts.pending, statusCounts.rejected, statusCounts.rollback],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545',
                        '#fd7e14'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Show modification detail
function showModificationDetail(modId) {
    const mod = modificationsData.find(m => m.id === modId);
    if (!mod) return;

    // Update detail page content
    document.getElementById('modDetailTitle').textContent = mod.request;
    document.getElementById('modDetailRequester').innerHTML = `<strong>요청자:</strong> ${mod.requester}`;
    document.getElementById('modDetailDate').innerHTML = `<strong>날짜:</strong> ${new Date(mod.date).toLocaleString('ko-KR')}`;

    const statusEmoji = {
        approved: '✅',
        pending: '⏳',
        rejected: '❌',
        rollback: '🔁'
    };

    const statusText = {
        approved: 'Approved',
        pending: 'Pending',
        rejected: 'Rejected',
        rollback: 'Rollback'
    };

    const statusClass = `status-${mod.status}`;
    document.getElementById('modDetailStatus').innerHTML = `<span class="status-badge ${statusClass}">${statusEmoji[mod.status]} ${statusText[mod.status]}</span>`;

    document.getElementById('modDetailRequest').textContent = mod.request;
    document.getElementById('modDetailSummary').textContent = mod.summary;
    document.getElementById('modDetailCodeDiff').textContent = mod.codeDiff;

    // Render stars
    const ratingContainer = document.getElementById('modDetailRating');
    ratingContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = i <= mod.rating ? 'star' : 'star empty';
        star.textContent = '★';
        ratingContainer.appendChild(star);
    }

    document.getElementById('modDetailComments').textContent = mod.comments;

    // Store current mod ID for actions
    window.currentModId = modId;

    // Show detail page
    showPage('modDetail');
}

// Admin actions
function approveModification() {
    if (!window.currentModId) return;

    const mod = modificationsData.find(m => m.id === window.currentModId);
    if (mod) {
        mod.status = 'approved';
        alert('✅ 수정 사항이 승인되었습니다!');
        showPage('admin');
        renderModificationsTable();
        if (timelineChart) initializeCharts();
    }
}

function rejectModification() {
    if (!window.currentModId) return;

    const mod = modificationsData.find(m => m.id === window.currentModId);
    if (mod) {
        mod.status = 'rejected';
        alert('❌ 수정 사항이 거절되었습니다.');
        showPage('admin');
        renderModificationsTable();
        if (timelineChart) initializeCharts();
    }
}

function rollbackModification() {
    if (!window.currentModId) return;

    const mod = modificationsData.find(m => m.id === window.currentModId);
    if (mod) {
        mod.status = 'rollback';
        alert('🔁 수정 사항이 롤백되었습니다.');
        showPage('admin');
        renderModificationsTable();
        if (timelineChart) initializeCharts();
    }
}

