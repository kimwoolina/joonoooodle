# Joonoooodle 🌳🤖

> **AI-Powered Website Management Agent for Non-Technical Users**
> **비개발자도 자연어로 웹사이트를 수정·관리할 수 있는 AI 에이전트**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [한국어](#korean)

---

<a name="english"></a>

## 🎯 Overview

Joonoooodle is an AI-powered website management system that enables non-technical users to modify and manage websites using natural language commands. Built with Claude AI, it transforms the way people interact with web content—no coding required.

### The Problem We're Solving

> **"Change the banner text to '2025 New Policy Guide'"**

This simple request typically requires:
- Finding a developer or outsourcing company
- Waiting days or weeks for implementation
- Paying hundreds to thousands of dollars
- Dealing with communication overhead

With Joonoooodle, the same change happens **instantly** through natural language.

### 💡 The Inspiration

Our first customer was a mother-in-law who works as a public official for the City of Los Angeles, managing all trees throughout LA. Her department uses two separate systems:

1. **Tree Map Website** - Displays tree information on a map with detailed views
2. **Support Ticket System** - Handles citizen complaints about trees (similar to Jira)

**The Problem**: These two critical systems were completely disconnected, causing significant inefficiency.

**Our Solution**: We integrated both systems and added an AI agent layer that allows non-technical staff to modify and customize the website using plain English commands.

---

## 🚀 Key Features

### 1. **Natural Language Website Editing**
- Type commands like "Change the header color to blue"
- AI analyzes code structure, generates changes, and applies them
- Real-time preview before deployment

### 2. **Integrated Tree Management System**
- **Interactive Map View**: Displays 700+ trees across Seoul with health status
- **Support Request System**: Submit and track tree maintenance requests
- **Unified Interface**: Previously separate systems now work together seamlessly
- **Location Integration**: Support requests show tree locations on the map

### 3. **Admin Dashboard**
- Review all AI-generated change requests
- Approve or reject modifications
- Track change history
- User-friendly interface for administrators

### 4. **Real-Time Collaboration**
- Live preview of changes before deployment
- WebSocket-based instant updates
- Multi-user support with session management

---

## 🏗️ Architecture

### System Components

```
joonoooodle/
├── agent-code-site/          # AI Agent & Integrated Main Site
│   ├── client/               # React UI for AI chat interface
│   ├── server/               # Node.js backend with Claude AI integration
│   └── main-site/            # Integrated Seoul Tree Support System
│
├── tree-map-app/             # Interactive Tree Map (React + Leaflet)
│   └── 700+ trees with health metrics, photos, and details
│
└── tree-support-site/        # Tree Support Request System
    ├── client/               # React frontend for support tickets
    └── server/               # Node.js API for request management
```

### Technology Stack

#### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation
- **React Hook Form** - Form management

#### Backend
- **Node.js** - Runtime environment
- **Express** - HTTP server
- **Socket.io** - WebSocket server
- **Anthropic Claude AI SDK** - AI agent integration
- **Chokidar** - File system watching

#### AI & Tools
- **Claude Sonnet 4.5** - Natural language understanding and code generation
- **Custom Tool System** - Read, Write, Edit, Bash, Glob, Grep tools
- **Real-time Streaming** - Instant AI response delivery

---

## 📊 Market Opportunity

### The Website Maintenance Gap

- **10 billion+ websites worldwide**
- **50%+ require developers for basic changes**
- **$50-500+ per small change** through outsourcing
- **Days to weeks** for simple modifications

### Our Competitive Advantage

| Traditional Solutions | Joonoooodle |
|----------------------|-------------|
| **Wix/Webflow**: Manual editing required | Natural language commands |
| **ChatGPT + Replit**: Code generation without integration | Embedded agent with real-time preview |
| **Outsourcing**: Slow, expensive, communication overhead | Instant changes, rollback support |

### Revenue Model

1. **SaaS Subscription** - Monthly per-site licensing
2. **Enterprise Tier** - Multi-site management for organizations
3. **API Access** - Integration for agencies and platforms
4. **White Label** - Customizable solutions for clients

**Target Market:**
- Government agencies and municipalities (like our LA case study)
- Small-to-medium businesses
- Marketing agencies
- Educational institutions
- Non-profits

---

## 🎬 Demo Scenario

### Before Joonoooodle
**Citizen**: "There's a fallen tree blocking the sidewalk on Main Street!"
**Staff**: *Logs into System A to create ticket*
**Staff**: *Opens System B to find tree location*
**Staff**: *Manually cross-references data*
**Staff**: *Cannot modify website layout without developer*

### With Joonoooodle
**Citizen**: "There's a fallen tree blocking the sidewalk on Main Street!"
**Staff**: *Creates ticket - map location automatically displayed*
**Staff**: "Show the tree's maintenance history on the ticket page"
**AI Agent**: *Analyzes request, generates code, shows preview*
**Staff**: *Approves change - deployed instantly*

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (for Claude AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kimwoolina/joonoooodle.git
   cd joonoooodle
   ```

2. **Setup Agent Code Site (Main Application)**
   ```bash
   cd agent-code-site/server
   npm install

   # Create .env file with your Anthropic API key
   echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
   echo "CLIENT_URL=http://localhost:5173" >> .env

   # Start server
   npm run dev
   ```

3. **Start AI Agent Client**
   ```bash
   cd agent-code-site/client
   npm install
   npm run dev
   ```

4. **Optional: Run Standalone Apps**

   **Tree Map App:**
   ```bash
   cd tree-map-app
   npm install
   npm run dev
   ```

   **Tree Support Site:**
   ```bash
   # Server
   cd tree-support-site/server
   npm install
   npm start

   # Client (new terminal)
   cd tree-support-site/client
   npm install
   npm run dev
   ```

### Usage

1. **Open the application**: Navigate to `http://localhost:3000`
2. **View the integrated map**: See trees and support requests together
3. **Open AI Agent Chat**: Click the chat icon to interact with the AI
4. **Make changes**: Type natural language commands like:
   - "Change the header text to 'Seoul Urban Forest Management'"
   - "Add a button to export requests as CSV"
   - "Change the map marker color for high-priority requests to red"
5. **Review preview**: See changes in real-time
6. **Deploy**: Approve changes through admin dashboard

---

## 🎓 Use Cases

### Government & Municipalities
- **Parks & Recreation**: Manage facilities, equipment, and maintenance
- **Public Works**: Track infrastructure issues and repairs
- **Citizen Services**: Update service hours, policies, and announcements

### Small-to-Medium Businesses
- **Retail**: Update product descriptions, pricing, promotions
- **Restaurants**: Modify menus, hours, special events
- **Services**: Change service offerings, staff information

### Non-Profits
- **Event Management**: Update event calendars and registration
- **Donation Drives**: Modify campaign messaging and progress
- **Volunteer Coordination**: Update schedules and opportunities

---

## 🔒 Security Considerations

- **File System Isolation**: AI operations restricted to designated directories
- **Command Sandboxing**: Bash commands execute with timeout and path restrictions
- **Admin Approval Flow**: All changes require admin review before deployment
- **Session Management**: User identification and activity tracking
- **API Key Protection**: Environment variables, never committed to repository
- **CORS Configuration**: Restricted to specified client URLs

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Natural language command processing
- [x] Real-time code modification
- [x] Integration of tree map and support systems
- [x] Admin dashboard for approvals

### Phase 2: Enhanced Features (In Progress)
- [ ] Git branch isolation per user session
- [ ] Rollback and version history
- [ ] Multi-language support (Korean, Spanish, etc.)
- [ ] Voice command integration
- [ ] Mobile app version

### Phase 3: Enterprise Features
- [ ] Multi-site management
- [ ] Team collaboration tools
- [ ] Advanced permission system
- [ ] Analytics and usage tracking
- [ ] White-label customization

### Phase 4: AI Enhancements
- [ ] Predictive suggestions
- [ ] Automated accessibility improvements
- [ ] SEO optimization recommendations
- [ ] Performance optimization
- [ ] Security vulnerability detection

---

## 📈 Success Metrics

### Technical
- AI command accuracy: >95%
- Average response time: <2 seconds
- Zero security incidents
- 99.9% uptime

### Business
- Reduce website modification costs by 80%
- Decrease time-to-deployment by 95%
- Increase non-technical user satisfaction
- Enable 10x more frequent website updates

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for non-technical users everywhere.

---

## 📞 Contact

- **Project Link**: [https://github.com/kimwoolina/joonoooodle](https://github.com/kimwoolina/joonoooodle)
- **Issues**: [https://github.com/kimwoolina/joonoooodle/issues](https://github.com/kimwoolina/joonoooodle/issues)

---

<a name="korean"></a>

# 한국어 문서

## 🎯 개요

Joonoooodle은 비개발자도 자연어 명령으로 웹사이트를 수정하고 관리할 수 있게 해주는 AI 기반 웹사이트 관리 시스템입니다. Claude AI를 활용하여 코딩 지식 없이도 웹 콘텐츠를 수정할 수 있는 혁신적인 방법을 제공합니다.

### 우리가 해결하는 문제

> **"상단 배너를 '2025년 신규 정책 안내'로 바꿔줘"**

이 간단한 요청을 처리하려면 일반적으로:
- 개발자나 외주업체를 찾아야 하고
- 며칠에서 몇 주를 기다려야 하며
- 수십만 원에서 수백만 원을 지불해야 하고
- 커뮤니케이션 오버헤드가 발생합니다

Joonoooodle을 사용하면 같은 변경사항이 자연어 명령으로 **즉시** 처리됩니다.

### 💡 프로젝트 배경

우리의 첫 번째 고객은 LA시에서 모든 나무를 관리하는 공무원인 시어머니였습니다. 그녀의 부서는 두 개의 분리된 시스템을 사용하고 있었습니다:

1. **나무 지도 웹사이트** - 지도에서 나무 정보를 상세히 표시
2. **민원 처리 시스템** - 나무 관련 시민 민원 처리 (Jira와 유사)

**문제점**: 이 두 중요한 시스템이 완전히 분리되어 있어 업무 효율성이 크게 떨어졌습니다.

**우리의 솔루션**: 두 시스템을 통합하고 AI 에이전트 레이어를 추가하여 비기술 직원도 평문 영어 명령으로 웹사이트를 수정하고 커스터마이징할 수 있도록 했습니다.

---

## 🚀 주요 기능

### 1. **자연어 웹사이트 편집**
- "헤더 색상을 파란색으로 변경해줘"와 같은 명령어 입력
- AI가 코드 구조를 분석하고, 변경사항을 생성하고, 적용
- 배포 전 실시간 미리보기 제공

### 2. **통합 나무 관리 시스템**
- **대화형 지도 뷰**: 서울의 700개 이상 나무를 건강 상태와 함께 표시
- **지원 요청 시스템**: 나무 유지보수 요청 제출 및 추적
- **통합 인터페이스**: 이전에 분리되었던 시스템들이 원활하게 함께 작동
- **위치 통합**: 지원 요청에 지도상 나무 위치 표시

### 3. **관리자 대시보드**
- AI가 생성한 모든 변경 요청 검토
- 수정사항 승인 또는 거부
- 변경 이력 추적
- 관리자를 위한 사용자 친화적 인터페이스

### 4. **실시간 협업**
- 배포 전 변경사항 실시간 미리보기
- WebSocket 기반 즉시 업데이트
- 세션 관리를 통한 다중 사용자 지원

---

## 🏗️ 아키텍처

### 시스템 구성요소

```
joonoooodle/
├── agent-code-site/          # AI 에이전트 & 통합 메인 사이트
│   ├── client/               # AI 채팅 인터페이스용 React UI
│   ├── server/               # Claude AI 통합 Node.js 백엔드
│   └── main-site/            # 통합 서울 나무 지원 시스템
│
├── tree-map-app/             # 대화형 나무 지도 (React + Leaflet)
│   └── 건강 지표, 사진, 상세 정보가 있는 700개 이상의 나무
│
└── tree-support-site/        # 나무 지원 요청 시스템
    ├── client/               # 지원 티켓용 React 프론트엔드
    └── server/               # 요청 관리용 Node.js API
```

### 기술 스택

#### 프론트엔드
- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구 및 개발 서버
- **Leaflet** - 대화형 지도
- **Socket.io Client** - 실시간 통신
- **React Router** - 네비게이션
- **React Hook Form** - 폼 관리

#### 백엔드
- **Node.js** - 런타임 환경
- **Express** - HTTP 서버
- **Socket.io** - WebSocket 서버
- **Anthropic Claude AI SDK** - AI 에이전트 통합
- **Chokidar** - 파일 시스템 감시

#### AI 및 도구
- **Claude Sonnet 4.5** - 자연어 이해 및 코드 생성
- **커스텀 도구 시스템** - Read, Write, Edit, Bash, Glob, Grep 도구
- **실시간 스트리밍** - 즉각적인 AI 응답 전달

---

## 📊 시장 기회

### 웹사이트 유지보수 격차

- **전 세계 100억 개 이상의 웹사이트**
- **50% 이상이 기본 변경에도 개발자 필요**
- **작은 변경 하나에 5만원~50만원+** (외주 비용)
- **간단한 수정에도 며칠에서 몇 주 소요**

### 우리의 경쟁 우위

| 기존 솔루션 | Joonoooodle |
|-----------|-------------|
| **Wix/Webflow**: 수동 편집 필요 | 자연어 명령 |
| **ChatGPT + Replit**: 통합 없는 코드 생성 | 실시간 미리보기가 있는 임베디드 에이전트 |
| **외주**: 느림, 비쌈, 커뮤니케이션 오버헤드 | 즉각 변경, 롤백 지원 |

### 수익 모델

1. **SaaS 구독** - 사이트당 월 라이선스
2. **엔터프라이즈 티어** - 조직을 위한 다중 사이트 관리
3. **API 접근** - 에이전시 및 플랫폼을 위한 통합
4. **화이트 레이블** - 고객을 위한 커스터마이징 가능한 솔루션

**타겟 시장:**
- 정부 기관 및 지자체 (LA 사례처럼)
- 중소기업
- 마케팅 에이전시
- 교육 기관
- 비영리 단체

---

## 🎬 데모 시나리오

### Joonoooodle 이전
**시민**: "메인 스트리트에 쓰러진 나무가 인도를 막고 있어요!"
**직원**: *시스템 A에 로그인하여 티켓 생성*
**직원**: *시스템 B를 열어 나무 위치 찾기*
**직원**: *데이터를 수동으로 교차 참조*
**직원**: *개발자 없이는 웹사이트 레이아웃 수정 불가*

### Joonoooodle 사용
**시민**: "메인 스트리트에 쓰러진 나무가 인도를 막고 있어요!"
**직원**: *티켓 생성 - 지도 위치 자동 표시*
**직원**: "티켓 페이지에 나무의 유지보수 이력을 표시해줘"
**AI 에이전트**: *요청 분석, 코드 생성, 미리보기 표시*
**직원**: *변경 승인 - 즉시 배포*

---

## 🛠️ 시작하기

### 필수 조건

- Node.js 18+
- npm 또는 yarn
- Anthropic API 키 (Claude AI용)

### 설치

1. **저장소 복제**
   ```bash
   git clone https://github.com/kimwoolina/joonoooodle.git
   cd joonoooodle
   ```

2. **Agent Code Site 설정 (메인 애플리케이션)**
   ```bash
   cd agent-code-site/server
   npm install

   # Anthropic API 키로 .env 파일 생성
   echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
   echo "CLIENT_URL=http://localhost:5173" >> .env

   # 서버 시작
   npm run dev
   ```

3. **AI 에이전트 클라이언트 시작**
   ```bash
   cd agent-code-site/client
   npm install
   npm run dev
   ```

4. **선택사항: 독립 앱 실행**

   **나무 지도 앱:**
   ```bash
   cd tree-map-app
   npm install
   npm run dev
   ```

   **나무 지원 사이트:**
   ```bash
   # 서버
   cd tree-support-site/server
   npm install
   npm start

   # 클라이언트 (새 터미널)
   cd tree-support-site/client
   npm install
   npm run dev
   ```

### 사용법

1. **애플리케이션 열기**: `http://localhost:3000`으로 이동
2. **통합 지도 보기**: 나무와 지원 요청을 함께 확인
3. **AI 에이전트 채팅 열기**: 채팅 아이콘 클릭하여 AI와 상호작용
4. **변경하기**: 다음과 같은 자연어 명령 입력:
   - "헤더 텍스트를 '서울 도시 숲 관리'로 변경해줘"
   - "요청을 CSV로 내보내는 버튼 추가해줘"
   - "높은 우선순위 요청의 지도 마커 색상을 빨간색으로 변경해줘"
5. **미리보기 검토**: 실시간으로 변경사항 확인
6. **배포**: 관리자 대시보드를 통해 변경사항 승인

---

## 🎓 사용 사례

### 정부 및 지자체
- **공원 및 레크리에이션**: 시설, 장비, 유지보수 관리
- **공공사업**: 인프라 문제 및 수리 추적
- **시민 서비스**: 서비스 시간, 정책, 공지사항 업데이트

### 중소기업
- **소매**: 제품 설명, 가격, 프로모션 업데이트
- **레스토랑**: 메뉴, 영업 시간, 특별 이벤트 수정
- **서비스**: 서비스 제공 사항, 직원 정보 변경

### 비영리 단체
- **이벤트 관리**: 이벤트 캘린더 및 등록 업데이트
- **기부 캠페인**: 캠페인 메시지 및 진행 상황 수정
- **자원봉사 조정**: 일정 및 기회 업데이트

---

## 🔒 보안 고려사항

- **파일 시스템 격리**: AI 작업이 지정된 디렉토리로 제한
- **명령 샌드박싱**: Bash 명령이 타임아웃 및 경로 제한으로 실행
- **관리자 승인 플로우**: 모든 변경사항은 배포 전 관리자 검토 필요
- **세션 관리**: 사용자 식별 및 활동 추적
- **API 키 보호**: 환경 변수 사용, 저장소에 커밋 금지
- **CORS 구성**: 지정된 클라이언트 URL로 제한

---

## 🗺️ 로드맵

### 1단계: 핵심 기능 ✅
- [x] 자연어 명령 처리
- [x] 실시간 코드 수정
- [x] 나무 지도 및 지원 시스템 통합
- [x] 승인을 위한 관리자 대시보드

### 2단계: 향상된 기능 (진행 중)
- [ ] 사용자 세션별 Git 브랜치 격리
- [ ] 롤백 및 버전 히스토리
- [ ] 다국어 지원 (한국어, 스페인어 등)
- [ ] 음성 명령 통합
- [ ] 모바일 앱 버전

### 3단계: 엔터프라이즈 기능
- [ ] 다중 사이트 관리
- [ ] 팀 협업 도구
- [ ] 고급 권한 시스템
- [ ] 분석 및 사용 추적
- [ ] 화이트 레이블 커스터마이징

### 4단계: AI 개선
- [ ] 예측 제안
- [ ] 자동 접근성 개선
- [ ] SEO 최적화 권장사항
- [ ] 성능 최적화
- [ ] 보안 취약점 탐지

---

## 📈 성공 지표

### 기술
- AI 명령 정확도: >95%
- 평균 응답 시간: <2초
- 보안 사고 제로
- 99.9% 가동 시간

### 비즈니스
- 웹사이트 수정 비용 80% 절감
- 배포 시간 95% 단축
- 비기술 사용자 만족도 향상
- 웹사이트 업데이트 빈도 10배 증가

---

## 🤝 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](CONTRIBUTING.md)을 참조하세요.

### 개발 설정

1. 저장소 포크
2. 기능 브랜치 생성: `git checkout -b feature/amazing-feature`
3. 변경사항 커밋: `git commit -m 'Add amazing feature'`
4. 브랜치에 푸시: `git push origin feature/amazing-feature`
5. Pull Request 열기

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 👥 팀

전 세계 비기술 사용자를 위해 ❤️로 제작했습니다.

---

## 📞 연락처

- **프로젝트 링크**: [https://github.com/kimwoolina/joonoooodle](https://github.com/kimwoolina/joonoooodle)
- **이슈**: [https://github.com/kimwoolina/joonoooodle/issues](https://github.com/kimwoolina/joonoooodle/issues)

---

## 🎤 Pitch Tips

> **"전 세계에는 100억 개 이상의 웹사이트가 있습니다. 그중 절반 이상은 수정하려면 개발자나 외주업체를 거쳐야 하죠. 우리는 단 한 문장으로, 웹사이트를 수정·관리할 수 있는 AI 에이전트를 만들었습니다."**

### 데모 전략
- HTML 샘플 + Claude가 코드 diff 생성 → 프리뷰로 보여주기
- "시어머니 사례"를 스토리텔링으로 활용하여 공감대 형성
- 실시간 변경을 보여주는 라이브 데모

### 시장 포지셔닝
- **빠른 반영**: 며칠 → 몇 초
- **비용 절감**: $100-500 → $10-20/월
- **접근성**: 개발자 필요 → 누구나 가능

---

**Built with Claude AI 🤖 | Made for Everyone 🌍**
