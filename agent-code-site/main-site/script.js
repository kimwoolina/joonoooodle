// ============================================
// SEOUL TREE SUPPORT REQUEST SYSTEM
// ============================================

// Global variables
let map = null;
let treesData = [];
let requestsData = [];
let selectedTree = null;
let markers = [];
let currentLang = 'ko';
let currentFilter = 'all';

// Translation object
const translations = {
    ko: {
        'header-title': '🌳 서울 나무 민원 시스템',
        'header-subtitle': 'Tree Support Request System',
        'text-new-request': '민원 작성',
        'list-title': '민원 목록',
        'filter-all': '전체',
        'filter-pending': '접수',
        'filter-processing': '처리중',
        'filter-completed': '완료',
        'text-th-title': '제목',
        'text-th-type': '유형',
        'text-th-status': '상태',
        'text-th-date': '작성일',
        'text-th-author': '작성자',
        'detail-title': '민원 상세',
        'text-back': '← 목록으로',
        'text-tree-info': '나무 정보',
        'text-tree-id': '나무 ID',
        'text-species': '수종',
        'text-location': '위치',
        'text-health': '건강도',
        'text-request-info': '민원 정보',
        'text-type': '유형',
        'text-status': '상태',
        'text-date': '작성일',
        'text-description': '상세 내용',
        'text-contact': '연락처 정보',
        'text-name': '이름',
        'text-phone': '전화번호',
        'text-email': '이메일',
        'create-title': '민원 작성',
        'text-select-tree': '지도에서 나무를 선택하세요',
        'text-selected-tree': '선택된 나무',
        'text-change-selection': '다른 나무 선택',
        'text-request-type': '민원 유형',
        'select-type': '선택하세요',
        'type-pruning': '가지치기',
        'type-disease': '병해충',
        'type-hazard': '위험',
        'type-maintenance': '일반 관리',
        'type-other': '기타',
        'text-title': '제목',
        'placeholder-title': '민원 제목을 입력하세요',
        'placeholder-description': '나무의 상태나 문제를 자세히 설명해주세요',
        'placeholder-name': '이름',
        'placeholder-phone': '010-1234-5678',
        'placeholder-email': 'email@example.com',
        'text-submit': '민원 제출',
        'text-history': '이 나무의 민원 내역',
        'text-no-history': '이 나무에 대한 민원 내역이 없습니다.',
        'status-pending': '접수',
        'status-processing': '처리중',
        'status-completed': '완료',
        'status-rejected': '반려',
        'health-excellent': '매우 좋음',
        'health-good': '좋음',
        'health-fair': '보통',
        'health-poor': '나쁨'
    },
    en: {
        'header-title': '🌳 Seoul Tree Support System',
        'header-subtitle': '서울 나무 민원 시스템',
        'text-new-request': 'New Request',
        'list-title': 'Support Requests',
        'filter-all': 'All',
        'filter-pending': 'Pending',
        'filter-processing': 'Processing',
        'filter-completed': 'Completed',
        'text-th-title': 'Title',
        'text-th-type': 'Type',
        'text-th-status': 'Status',
        'text-th-date': 'Date',
        'text-th-author': 'Author',
        'detail-title': 'Request Detail',
        'text-back': '← Back to List',
        'text-tree-info': 'Tree Information',
        'text-tree-id': 'Tree ID',
        'text-species': 'Species',
        'text-location': 'Location',
        'text-health': 'Health',
        'text-request-info': 'Request Information',
        'text-type': 'Type',
        'text-status': 'Status',
        'text-date': 'Date',
        'text-description': 'Description',
        'text-contact': 'Contact Information',
        'text-name': 'Name',
        'text-phone': 'Phone',
        'text-email': 'Email',
        'create-title': 'New Support Request',
        'text-select-tree': 'Please select a tree on the map',
        'text-selected-tree': 'Selected Tree',
        'text-change-selection': 'Change Selection',
        'text-request-type': 'Request Type',
        'select-type': 'Select...',
        'type-pruning': 'Pruning',
        'type-disease': 'Disease/Pest',
        'type-hazard': 'Hazard',
        'type-maintenance': 'Maintenance',
        'type-other': 'Other',
        'text-title': 'Title',
        'placeholder-title': 'Enter request title',
        'placeholder-description': 'Please describe the tree condition or issue in detail',
        'placeholder-name': 'Name',
        'placeholder-phone': '010-1234-5678',
        'placeholder-email': 'email@example.com',
        'text-submit': 'Submit Request',
        'text-history': 'Request History for This Tree',
        'text-no-history': 'No request history for this tree.',
        'status-pending': 'Pending',
        'status-processing': 'Processing',
        'status-completed': 'Completed',
        'status-rejected': 'Rejected',
        'health-excellent': 'Excellent',
        'health-good': 'Good',
        'health-fair': 'Fair',
        'health-poor': 'Poor'
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFakeData();
    displayRequestsList();

    // Set default page to list
    showPage('list');
});

// Initialize fake data
function initializeFakeData() {
    requestsData = [
        {
            id: 1,
            treeId: 'TREE-0042',
            treeInfo: {
                species: '은행나무 (Ginkgo)',
                location: '종로구 광화문로 1',
                health: 8
            },
            type: 'pruning',
            title: '가지가 전선을 가리고 있습니다',
            description: '은행나무 가지가 자라서 전선에 닿을 것 같습니다. 안전을 위해 가지치기가 필요합니다.',
            contact: {
                name: '김철수',
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
                species: '벚나무 (Cherry)',
                location: '강남구 테헤란로 152',
                health: 5
            },
            type: 'disease',
            title: '잎에 갈색 반점이 보입니다',
            description: '최근 들어 잎에 갈색 반점이 많이 생겼고, 일부 잎이 떨어지고 있습니다. 병해충 점검이 필요해 보입니다.',
            contact: {
                name: '이영희',
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
                species: '소나무 (Pine)',
                location: '서초구 서초대로 397',
                health: 9
            },
            type: 'maintenance',
            title: '주변 청소가 필요합니다',
            description: '나무 주변에 낙엽과 쓰레기가 많이 쌓여 있습니다. 정기적인 청소가 필요합니다.',
            contact: {
                name: '박민수',
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
                species: '은행나무 (Ginkgo)',
                location: '종로구 광화문로 1',
                health: 8
            },
            type: 'other',
            title: '나무 안내판 설치 요청',
            description: '이 은행나무는 수령이 오래되고 역사적 가치가 있어 보입니다. 안내판 설치를 제안합니다.',
            contact: {
                name: '정수진',
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
                species: '느티나무 (Zelkova)',
                location: '마포구 월드컵로 240',
                health: 6
            },
            type: 'hazard',
            title: '큰 가지가 부러질 위험이 있습니다',
            description: '강풍 후 큰 가지에 금이 간 것을 발견했습니다. 보행자 안전을 위해 긴급 조치가 필요합니다.',
            contact: {
                name: '최동욱',
                phone: '010-5678-9012',
                email: 'choi@email.com'
            },
            status: 'pending',
            timestamp: '2025-11-08T08:15:00Z'
        }
    ];
}

// Display requests list
function displayRequestsList() {
    const container = document.getElementById('requestCardsContainer');
    container.innerHTML = '';

    const filteredRequests = requestsData.filter(req => {
        if (currentFilter === 'all') return true;
        return req.status === currentFilter;
    });

    if (filteredRequests.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
                <div style="font-size: 48px; margin-bottom: 15px;">📋</div>
                <h3>민원이 없습니다</h3>
                <p>해당 상태의 민원이 없습니다.</p>
            </div>
        `;
        return;
    }

    filteredRequests.forEach(request => {
        const card = document.createElement('div');
        card.className = 'request-card';
        card.onclick = () => showRequestDetail(request.id);

        const typeLabel = getRequestTypeLabel(request.type);
        const statusLabel = getStatusLabel(request.status);
        const statusClass = request.status;
        const date = formatDate(request.timestamp);

        // Create unique map ID for this card
        const mapId = `card-map-${request.id}`;

        card.innerHTML = `
            <div class="card-content">
                <div class="card-title-row">
                    <h3 class="request-title">${request.title}</h3>
                    <span class="request-tree-id">${request.treeId}</span>
                </div>
                <div class="card-meta">
                    <span class="meta-item">
                        <span style="font-weight: 600;">유형:</span>
                        <span class="type-badge">${typeLabel}</span>
                    </span>
                    <span class="meta-item">
                        <span style="font-weight: 600;">상태:</span>
                        <span class="status-badge status-${statusClass}">${statusLabel}</span>
                    </span>
                    <span class="meta-item">
                        <span>📅</span>
                        <span>${date}</span>
                    </span>
                    <span class="meta-item">
                        <span>👤</span>
                        <span>${request.contact.name}</span>
                    </span>
                </div>
                <div class="card-description">
                    ${request.description}
                </div>
                <div class="card-footer">
                    <span class="card-location">
                        📍 ${request.treeInfo.location}
                    </span>
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
        // Find tree data for this request
        const tree = treesData.find(t => t.id === request.treeId);
        if (!tree) return;

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

// Filter requests by status
function filterRequests(status) {
    currentFilter = status;

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    displayRequestsList();
}

// Show request detail
function showRequestDetail(requestId) {
    const request = requestsData.find(r => r.id === requestId);
    if (!request) return;

    // Update detail info
    document.getElementById('detailTitle').textContent = request.title;
    document.getElementById('detailDate').textContent = formatDate(request.timestamp);
    document.getElementById('detailAuthor').textContent = request.contact.name;
    document.getElementById('detailStatus').innerHTML = `<span class="status-badge status-${request.status}">${getStatusLabel(request.status)}</span>`;

    // Update tree info
    const healthClass = getHealthClass(request.treeInfo.health);
    const healthLabel = currentLang === 'ko'
        ? (request.treeInfo.health >= 8 ? '매우 좋음' : request.treeInfo.health >= 6 ? '좋음' : request.treeInfo.health >= 4 ? '보통' : '나쁨')
        : (request.treeInfo.health >= 8 ? 'Excellent' : request.treeInfo.health >= 6 ? 'Good' : request.treeInfo.health >= 4 ? 'Fair' : 'Poor');

    document.getElementById('detailTreeInfo').innerHTML = `
        <div class="detail-item">
            <span class="detail-label">나무 ID</span>
            <span class="detail-value">${request.treeId}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">수종</span>
            <span class="detail-value">${request.treeInfo.species}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">위치</span>
            <span class="detail-value">${request.treeInfo.location}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">건강도</span>
            <span class="detail-value">
                <span class="health-badge ${healthClass}">${healthLabel} (${request.treeInfo.health}/10)</span>
            </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">민원 유형</span>
            <span class="detail-value">
                <span class="type-badge">${getRequestTypeLabel(request.type)}</span>
            </span>
        </div>
    `;

    document.getElementById('detailDescription').textContent = request.description;

    document.getElementById('detailContact').innerHTML = `
        <div class="detail-item">
            <span class="detail-label">이름</span>
            <span class="detail-value">${request.contact.name}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">전화번호</span>
            <span class="detail-value">${request.contact.phone}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">이메일</span>
            <span class="detail-value">${request.contact.email || '-'}</span>
        </div>
    `;

    // Initialize detail map
    initDetailMap(request);

    showPage('detail');
}

// Initialize detail page map
function initDetailMap(request) {
    // Remove existing map if any
    const detailMapDiv = document.getElementById('detailMap');
    detailMapDiv.innerHTML = '';

    try {
        // Find tree data for this request
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

        // Fix map rendering
        setTimeout(() => {
            detailMap.invalidateSize();
        }, 100);
    } catch (error) {
        console.error('Error initializing detail map:', error);
    }
}

// Show page
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected page
    if (page === 'list') {
        document.getElementById('listPage').classList.add('active');
        displayRequestsList();
    } else if (page === 'detail') {
        document.getElementById('detailPage').classList.add('active');
    } else if (page === 'create') {
        document.getElementById('createPage').classList.add('active');

        // Initialize map if not already initialized
        if (!map) {
            initMap();
            loadTreeData();
        }

        // Initialize tree selection display
        displaySelectedTree();
    }
}

// Initialize Leaflet map
function initMap() {
    map = L.map('map').setView([37.5665, 126.9780], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Load tree data from API
async function loadTreeData() {
    try {
        const response = await fetch('/api/trees');
        treesData = await response.json();

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
                ${tree.location.district_ko} ${tree.location.neighborhood_ko}<br>
                ${currentLang === 'ko' ? '건강도' : 'Health'}: ${healthScore}/10
            `);

            marker.on('click', () => {
                selectTree(tree);
            });

            marker.addTo(map);
            markers.push(marker);
        });
    } catch (error) {
        console.error('Error loading tree data:', error);
    }
}

// Select tree from map
function selectTree(tree) {
    selectedTree = tree;
    displaySelectedTree();
}

// Display selected tree info
function displaySelectedTree() {
    const treeSelectionArea = document.getElementById('tree-selection-area');
    const submitBtn = document.getElementById('submitBtn');

    if (!selectedTree) {
        treeSelectionArea.innerHTML = `
            <div class="no-tree-notice">
                <div class="icon">🗺️</div>
                <h4 class="text-no-tree-title">나무를 선택해주세요</h4>
                <p class="text-no-tree-subtitle">위 지도에서 나무를 클릭하면 해당 나무 정보가 자동으로 입력됩니다</p>
            </div>
        `;
        submitBtn.disabled = true;
        return;
    }

    submitBtn.disabled = false;

    const healthClass = getHealthClass(selectedTree.condition.healthScore);
    const healthLabel = currentLang === 'ko'
        ? (selectedTree.condition.healthScore >= 8 ? '매우 좋음' : selectedTree.condition.healthScore >= 6 ? '좋음' : selectedTree.condition.healthScore >= 4 ? '보통' : '나쁨')
        : (selectedTree.condition.healthScore >= 8 ? 'Excellent' : selectedTree.condition.healthScore >= 6 ? 'Good' : selectedTree.condition.healthScore >= 4 ? 'Fair' : 'Poor');

    treeSelectionArea.innerHTML = `
        <div class="selected-tree-banner">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0;">✓ 선택된 나무</h4>
                <button type="button" onclick="clearSelectedTree()" style="background: white; border: 1px solid #3b82f6; color: #3b82f6; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">
                    다른 나무 선택
                </button>
            </div>
            <div class="tree-info-grid">
                <div class="tree-info-item">
                    <span class="tree-info-label">나무 ID: </span>
                    <span class="tree-info-value">${selectedTree.id}</span>
                </div>
                <div class="tree-info-item">
                    <span class="tree-info-label">수종: </span>
                    <span class="tree-info-value">${selectedTree.species.common_ko}</span>
                </div>
                <div class="tree-info-item">
                    <span class="tree-info-label">건강도: </span>
                    <span class="health-badge ${healthClass}">${healthLabel}</span>
                </div>
            </div>
            <div style="margin-top: 10px;">
                <span class="tree-info-label">위치: </span>
                <span class="tree-info-value">${selectedTree.location.district_ko} ${selectedTree.location.neighborhood_ko}</span>
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
        alert(currentLang === 'ko' ? '먼저 지도에서 나무를 선택해주세요.' : 'Please select a tree on the map first.');
        return;
    }

    const type = document.getElementById('requestType').value;
    const description = document.getElementById('description').value;
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;

    if (!type || !description || !name || !phone) {
        alert(currentLang === 'ko' ? '모든 필수 항목을 입력해주세요.' : 'Please fill in all required fields.');
        return;
    }

    // Generate a simple title from type
    const typeLabel = getRequestTypeLabel(type);
    const title = `${typeLabel} - ${selectedTree.species.common_ko} (${selectedTree.id})`;

    // Create new request
    const newRequest = {
        id: requestsData.length + 1,
        treeId: selectedTree.id,
        treeInfo: {
            species: `${selectedTree.species.common_ko} (${selectedTree.species.common})`,
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

    // Reset form
    document.getElementById('requestForm').reset();
    selectedTree = null;
    displaySelectedTree();

    // Show success message
    alert(currentLang === 'ko' ? '민원이 성공적으로 접수되었습니다!' : 'Request submitted successfully!');

    // Go back to list
    showPage('list');
}

// Change language
function changeLanguage(lang) {
    currentLang = lang;

    const trans = translations[lang];

    // Update all text elements
    Object.keys(trans).forEach(key => {
        const elements = document.querySelectorAll(`.${key}, #${key}`);
        elements.forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = trans[key];
            } else if (el.tagName === 'OPTION') {
                el.textContent = trans[key];
            } else {
                el.textContent = trans[key];
            }
        });
    });

    // Refresh displays
    displayRequestsList();
    if (selectedTree) {
        displaySelectedTree();
    }

    // Update map popup language
    if (map && markers.length > 0) {
        markers.forEach((marker, index) => {
            if (treesData[index]) {
                const tree = treesData[index];
                const healthScore = tree.condition.healthScore;
                marker.setPopupContent(`
                    <strong>${tree.species.common_ko}</strong><br>
                    ${tree.location.district_ko} ${tree.location.neighborhood_ko}<br>
                    ${currentLang === 'ko' ? '건강도' : 'Health'}: ${healthScore}/10
                `);
            }
        });
    }
}

// Utility: Get request type label
function getRequestTypeLabel(type) {
    const labels = {
        pruning: currentLang === 'ko' ? '가지치기' : 'Pruning',
        disease: currentLang === 'ko' ? '병해충' : 'Disease/Pest',
        hazard: currentLang === 'ko' ? '위험' : 'Hazard',
        maintenance: currentLang === 'ko' ? '일반 관리' : 'Maintenance',
        other: currentLang === 'ko' ? '기타' : 'Other'
    };
    return labels[type] || type;
}

// Utility: Get status label
function getStatusLabel(status) {
    const labels = {
        pending: currentLang === 'ko' ? '접수' : 'Pending',
        processing: currentLang === 'ko' ? '처리중' : 'Processing',
        completed: currentLang === 'ko' ? '완료' : 'Completed',
        rejected: currentLang === 'ko' ? '반려' : 'Rejected'
    };
    return labels[status] || status;
}

// Utility: Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Utility: Get health class
function getHealthClass(healthScore) {
    if (healthScore >= 8) return 'health-excellent';
    if (healthScore >= 6) return 'health-good';
    if (healthScore >= 4) return 'health-fair';
    return 'health-poor';
}
