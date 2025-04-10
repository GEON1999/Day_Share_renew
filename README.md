<div align="center">
  <a href="https://www.dayshare.site/">
    <img height="120" src="https://s3.ap-northeast-2.amazonaws.com/geon.com/logo_sm.png" alt="DayShare Logo" />
    <h1>DayShare</h1>
  </a>
  <p>관계 중심의 일기 공유 플랫폼 - 연인, 동호회, 육아 커뮤니티를 위한 특별한 기록 공간</p>
  <a href="https://www.dayshare.site/">🌐 공식 웹사이트 바로가기</a>
  <br/>
  <div>
    <img src="https://img.shields.io/badge/Next.js-14.2.3-black?logo=next.js" alt="Next.js Version" />
    <img src="https://img.shields.io/badge/FastAPI-0.110.0-green?logo=fastapi" alt="FastAPI Version" />
    <img src="https://img.shields.io/badge/AWS-EC2%2FRDS-orange?logo=amazon-aws" alt="AWS Stack" />
  </div>
</div>

---

## ✨ 핵심 기능

- **관계별 일기 공유**: 사용자 정의 캘린더 시스템
- **AI 기반 상호작용**: 자동 감정 분석 댓글 생성
- **실시간 커뮤니케이션**: WebSocket 기반 채팅
- **모바일 최적화**: 반응형 웹 디자인
- **엔터프라이즈급 보안**: JWT RTR(Refresh Token Rotation) 구현

---

## 🖥️ 데모 화면

| 기능 | GIF | 설명 |
|------|-----|------|
| **로그인** | ![로그인 데모](./gif/login.gif) | JWT 기반 세션 관리 |
| **캘린더 생성** | ![캘린더 생성](./gif/calendar_create.gif) | 모달 통합 관리 시스템 |
| **실시간 채팅** | ![실시간 채팅](./gif/live_chat.gif) | WebSocket 통신 구현 |
| **모바일 최적화** | ![모바일 반응형](./gif/mobile.gif) | Tailwind 기반 반응형 처리 |

---

## 🛠 기술 아키텍처

### 프론트엔드
```mermaid
graph TD
  A[Next.js 14] --> B[Zustand]
  B --> C[실시간 상태 동기화]
  A --> D[Tanstack-Query]
  D --> E[데이터 캐싱]
  A --> F[Next Auth]
  F --> G[로컬/소셜 로그인]
  F --> H[JWT 인증]
  F --> I[RTR 토큰 관리]
  A --> J[React-DnD]
  J --> K[드래그 앤 드롭]
  A --> L[React-Image-Crop]
  L --> M[이미지 편집]
  N[FastAPI] --> O[AWS EC2]
  N --> P[AWS RDS]
  N --> Q[JWT 인증]
  Q --> R[RTR 토큰 관리]
  N --> S[WebSocket]
  S --> T[실시간 알림]
```

---

## 🚀 성장 포인트

### ⚡ 서버 아키텍처 최적화
**문제**  
Prisma ORM의 N+1 쿼리 문제 및 서버 부하

**해결**  
- AWS RDS + EC2 + FastAPI 인프라 전환  
- 서브쿼리 최적화 및 리소스 분리  

**성과**  
⏱️ 응답 시간 60% 단축 | 📈 트래픽 처리량 2배 증가

---

### 🔄 토큰 관리 시스템 개선
**문제**  
토큰 만료 시 빈 화면 노출

**해결**  
- NextAuth JWT 콜백 선검증 구현  
- 세션-UI 상태 동기화  

**성과**  
🔒 즉각적 로그인 리다이렉트 구현

---

### 🔒 보안 강화
**문제**  
고정 Refresh Token 위험

**해결**  
- RTR 패턴 도입  

**성과**  
🛡️ 토큰 유출 위험 80% 감소

---

## 👥 팀원

|                                         **박건[개발자]**                                          |                                   **차민경[헤드 디자이너]**                                    |                                         **강보희[디자이너]**                                         |                                      **박예지[디자이너]**                                      |
| :-----------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
| <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/profile+(1).jpg" height=200 width=145> | <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/KakaoTalk_Photo_2025-03-09-15-28-43.jpeg" height=200 width=145> | <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%90%E1%85%B5%E1%86%B7%E1%84%8B%E1%85%AF%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5_%E1%84%8F%E1%85%B3%E1%84%80%E1%85%B5+%E1%84%8C%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%BC_%E1%84%80%E1%85%A1%E1%86%BC%E1%84%87%E1%85%A9%E1%84%92%E1%85%B4.png" height=200 width=145> | <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%90%E1%85%B5%E1%86%B7%E1%84%8B%E1%85%AF%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5_%E1%84%8F%E1%85%B3%E1%84%80%E1%85%B5+%E1%84%8C%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%BC_%E1%84%87%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%A8%E1%84%8C%E1%85%B5.png" height=200 width=145> |
| phgst12@gmail.com | art4096@naver.com | anxiw@naver.com |  |
