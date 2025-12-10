# 🎭 TCATS - 티켓츠 QR 발권 시스템

**Joyful Time, Right for You.**

공연장 현장 QR 발권 서비스입니다.

---

## 📋 주요 기능

- ✅ 공연/예매처 선택 (휠 피커)
- ✅ 본인 정보 입력 (이름, 전화번호, 생년월일, 성별)
- ✅ 예약 정보 매칭 (와일드카드, 끝4자리 지원)
- ✅ 회차별 티켓 그룹화
- ✅ 마케팅 동의 (필수)
- ✅ 좌석별 개별 QR 발급
- ✅ 동행자 티켓 전달 (카카오톡/문자)
- ✅ 수신자 본인인증 후 티켓 수령
- ✅ CRM 데이터 저장

---

## 🚀 로컬에서 실행하기

### 1. 필수 프로그램 설치

**Node.js** (v18 이상 권장)
- 다운로드: https://nodejs.org/
- "LTS" 버전 다운로드 후 설치

### 2. 프로젝트 실행

```bash
# 1) 터미널(명령 프롬프트) 열기

# 2) 프로젝트 폴더로 이동
cd tcats-complete

# 3) 필요한 패키지 설치 (최초 1회)
npm install

# 4) 개발 서버 실행
npm run dev
```

### 3. 브라우저에서 확인

- 주소창에 입력: `http://localhost:3000`
- 모바일 미리보기: 브라우저 개발자도구(F12) → 모바일 모드

---

## 🌐 인터넷에 배포하기 (무료)

### 방법 1: Vercel (추천 ⭐)

가장 쉽고 빠른 방법입니다.

#### 단계별 가이드

**1) GitHub 계정 만들기**
- https://github.com 접속
- "Sign up" 클릭하여 가입

**2) GitHub에 코드 올리기**
- GitHub 로그인 후 "New repository" 클릭
- Repository name: `tcats-ticketing`
- "Create repository" 클릭
- 아래 명령어 실행:

```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "첫 번째 배포"

# GitHub 연결 (YOUR_USERNAME을 본인 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/tcats-ticketing.git

# 업로드
git push -u origin main
```

**3) Vercel 연결**
- https://vercel.com 접속
- "Start Deploying" 클릭
- "Continue with GitHub" 선택
- `tcats-ticketing` 저장소 선택
- "Deploy" 클릭
- 약 1-2분 후 배포 완료!

**4) 배포 URL 확인**
- 예: `https://tcats-ticketing.vercel.app`
- 이 주소로 누구나 접속 가능!

---

### 방법 2: Netlify

**1) https://netlify.com 접속**

**2) GitHub 연결 후 저장소 선택**

**3) Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

**4) "Deploy site" 클릭**

---

## 📱 모바일 앱처럼 사용하기 (PWA)

### iPhone (Safari)
1. tcats 사이트 접속
2. 하단 공유 버튼 클릭
3. "홈 화면에 추가" 선택

### Android (Chrome)
1. tcats 사이트 접속
2. 우측 상단 메뉴(⋮) 클릭
3. "홈 화면에 추가" 선택

---

## 🔧 커스터마이징

### 공연 데이터 변경
`src/App.jsx` 파일에서 `sampleShows` 배열 수정

### 예매처 변경
`src/App.jsx` 파일에서 `ticketAgencies` 배열 수정

### 예약 데이터 연동
`sampleReservations`를 실제 API 호출로 교체

---

## 📁 프로젝트 구조

```
tcats-complete/
├── index.html          # 메인 HTML
├── package.json        # 프로젝트 설정
├── vite.config.js      # 빌드 도구 설정
├── tailwind.config.js  # Tailwind CSS 설정
├── postcss.config.js   # PostCSS 설정
├── public/
│   └── favicon.svg     # 파비콘
└── src/
    ├── main.jsx        # 앱 진입점
    ├── index.css       # 스타일
    └── App.jsx         # 메인 앱 컴포넌트
```

---

## ❓ 문제 해결

### "npm not found" 오류
→ Node.js 설치 필요 (https://nodejs.org)

### "port 3000 already in use" 오류
→ 다른 프로그램이 3000 포트 사용 중. 터미널에서:
```bash
npm run dev -- --port 3001
```

### 화면이 깨져 보임
→ 브라우저 캐시 삭제 (Ctrl+Shift+R)

---

## 📞 기술 지원

- 개발: CMSoft
- 문의: support@tcats.com

---

© 2024 TCATS. All rights reserved.
