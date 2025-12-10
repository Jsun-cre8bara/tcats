import React, { useState } from 'react';

// ============================================
// tcats (티켓츠) QR 발권 시스템
// ============================================

// 샘플 예약 데이터 (백오피스에서 가져올 DB 형태)
const sampleReservations = [
  // 홍길동 - 1회차 3장 (좌석 지정)
  {
    id: "R001",
    reservationNo: "2024112701",
    name: "홍길동",
    phone: "01012345678",
    showId: "S001",
    showName: "햄릿 2024",
    showDate: "2024-12-01",
    showTime: "19:30",
    session: "1회차",
    seats: ["A1"],
    seatAssigned: true,
    ticketIssued: false,
    pricePerTicket: 50000
  },
  {
    id: "R001-2",
    reservationNo: "2024112701",
    name: "홍길동",
    phone: "01012345678",
    showId: "S001",
    showName: "햄릿 2024",
    showDate: "2024-12-01",
    showTime: "19:30",
    session: "1회차",
    seats: ["A2"],
    seatAssigned: true,
    ticketIssued: false,
    pricePerTicket: 50000
  },
  {
    id: "R001-3",
    reservationNo: "2024112701",
    name: "홍길동",
    phone: "01012345678",
    showId: "S001",
    showName: "햄릿 2024",
    showDate: "2024-12-01",
    showTime: "19:30",
    session: "1회차",
    seats: ["A3"],
    seatAssigned: true,
    ticketIssued: false,
    pricePerTicket: 50000
  },
  // 홍길동 - 2회차 2장 (좌석 지정)
  {
    id: "R005",
    reservationNo: "2024112705",
    name: "홍길동",
    phone: "01012345678",
    showId: "S001",
    showName: "햄릿 2024",
    showDate: "2024-12-02",
    showTime: "14:00",
    session: "2회차",
    seats: ["B1"],
    seatAssigned: true,
    ticketIssued: false,
    pricePerTicket: 50000
  },
  {
    id: "R005-2",
    reservationNo: "2024112705",
    name: "홍길동",
    phone: "01012345678",
    showId: "S001",
    showName: "햄릿 2024",
    showDate: "2024-12-02",
    showTime: "14:00",
    session: "2회차",
    seats: ["B2"],
    seatAssigned: true,
    ticketIssued: false,
    pricePerTicket: 50000
  },
  // 김철수 - 좌석 미지정 1장
  {
    id: "R002",
    reservationNo: "2024112702",
    name: "김철수",
    phone: "01098765432",
    showId: "S001",
    showName: "햄릿 2024",
    showDate: "2024-12-01",
    showTime: "19:30",
    session: "1회차",
    seats: [],
    seatAssigned: false,
    ticketIssued: false,
    pricePerTicket: 40000
  },
  // 이영희 - 2회차 2장 (좌석 지정)
  {
    id: "R004",
    reservationNo: "2024112704",
    name: "이영희",
    phone: "01011112222",
    showId: "S001",
    showName: "햄릿 2024",
    showDate: "2024-12-02",
    showTime: "14:00",
    session: "2회차",
    seats: ["C1", "C2"],
    seatAssigned: true,
    ticketIssued: false,
    pricePerTicket: 55000
  }
];

// 공연 정보
const sampleShows = [
  {
    id: "S001",
    name: "햄릿 2024",
    venue: "대학로 예술극장",
    poster: "🎭",
    period: "2024.12.01 ~ 2024.12.31",
    runningTime: "100분",
    rating: "만 15세 이상",
    sessions: [
      { date: "2024-12-01", time: "19:30", session: "1회차" },
      { date: "2024-12-02", time: "14:00", session: "2회차" },
      { date: "2024-12-02", time: "19:30", session: "3회차" }
    ]
  },
  {
    id: "S002",
    name: "오페라의 유령",
    venue: "블루스퀘어 신한카드홀",
    poster: "🎪",
    period: "2024.11.15 ~ 2025.02.28",
    runningTime: "150분 (인터미션 20분)",
    rating: "만 8세 이상",
    sessions: [
      { date: "2024-12-05", time: "14:00", session: "1회차" },
      { date: "2024-12-05", time: "19:30", session: "2회차" }
    ]
  },
  {
    id: "S003",
    name: "시카고",
    venue: "충무아트센터 대극장",
    poster: "💃",
    period: "2024.12.10 ~ 2025.03.10",
    runningTime: "140분 (인터미션 15분)",
    rating: "만 14세 이상",
    sessions: [
      { date: "2024-12-10", time: "19:30", session: "1회차" },
      { date: "2024-12-11", time: "14:00", session: "2회차" }
    ]
  }
];

// 예매처 정보
const ticketAgencies = [
  { id: "A001", name: "인터파크", logo: "🎫" },
  { id: "A002", name: "YES24", logo: "🎟️" },
  { id: "A003", name: "티켓링크", logo: "🎪" },
  { id: "A004", name: "멜론티켓", logo: "🎵" },
  { id: "A005", name: "네이버", logo: "🟢" },
  { id: "A006", name: "현장예매", logo: "🏢" }
];

// ============================================
// 유틸리티 함수들
// ============================================

// 와일드카드(*) 매칭 함수
const wildcardMatch = (input, target) => {
  if (!input || !target) return false;
  
  // 입력값에서 *를 정규식 패턴으로 변환
  const pattern = input
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 특수문자 이스케이프
    .replace(/\\\*/g, '.*'); // *를 .*로 변환
  
  const regex = new RegExp(`^${pattern}$`, 'i');
  return regex.test(target);
};

// 전화번호 매칭 함수 (전체 일치 OR 끝 4자리 일치)
const phoneMatch = (inputPhone, targetPhone) => {
  if (!inputPhone || !targetPhone) return false;
  
  // 숫자만 추출
  const inputNumbers = inputPhone.replace(/[^0-9]/g, '');
  const targetNumbers = targetPhone.replace(/[^0-9]/g, '');
  
  // 전체 일치
  if (inputNumbers === targetNumbers) return true;
  
  // 끝 4자리 일치 (입력이 4자리인 경우)
  if (inputNumbers.length === 4) {
    return targetNumbers.slice(-4) === inputNumbers;
  }
  
  // 끝 4자리 일치 (입력이 11자리인 경우)
  if (inputNumbers.length === 11 && targetNumbers.length === 11) {
    return inputNumbers.slice(-4) === targetNumbers.slice(-4);
  }
  
  return false;
};

// 예약 검색 함수 (이름 와일드카드 + 전화번호 매칭)
const searchReservations = (name, phone, reservations) => {
  return reservations.filter(r => {
    const nameMatched = wildcardMatch(name, r.name);
    const phoneMatched = phoneMatch(phone, r.phone);
    return nameMatched && phoneMatched;
  });
};

// 동일인 예약을 회차별로 그룹화
const groupBySession = (reservations) => {
  const grouped = {};
  
  reservations.forEach(r => {
    // 회차 기준 키 생성 (이름 + 공연일시 + 회차)
    const key = `${r.name}-${r.showDate}-${r.showTime}-${r.session}`;
    
    if (!grouped[key]) {
      grouped[key] = {
        ...r,
        seats: [...(r.seats || [])],
        totalTickets: r.seats?.length || 1,
        totalPrice: (r.seats?.length || 1) * (r.pricePerTicket || 0),
        allSeatAssigned: r.seatAssigned
      };
    } else {
      // 같은 회차면 좌석 + 금액 합산
      grouped[key].seats = [...grouped[key].seats, ...(r.seats || [])];
      grouped[key].totalTickets += r.seats?.length || 1;
      grouped[key].totalPrice += (r.seats?.length || 1) * (r.pricePerTicket || 0);
      grouped[key].allSeatAssigned = grouped[key].allSeatAssigned && r.seatAssigned;
    }
  });
  
  return Object.values(grouped);
};

// ============================================
// 메인 앱 컴포넌트
// ============================================

export default function App() {
  // 현재 화면 상태
  const [currentPage, setCurrentPage] = useState('landing');
  
  // 선택된 데이터들
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState(null);
  
  // 입력 데이터
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  
  // CRM 데이터 저장소 (실제로는 서버 DB에 저장)
  const [crmDatabase, setCrmDatabase] = useState([]);

  // CRM DB에 개인정보 + 관람기록 저장
  const saveToDatabase = (marketingAgreedValue) => {
    const reservation = selectedReservation;
    if (!reservation) return;

    // 저장할 CRM 데이터
    const crmRecord = {
      id: `CRM-${Date.now()}`,
      // 개인정보
      name: inputName,
      phone: inputPhone,
      // 관람기록
      showName: reservation.showName,
      showDate: reservation.showDate,
      showTime: reservation.showTime,
      session: reservation.session,
      ticketCount: reservation.totalTickets || reservation.seats?.length || 1,
      seats: reservation.seats || [],
      // 금액
      price: reservation.totalPrice || ((reservation.totalTickets || reservation.seats?.length || 1) * 50000),
      // 마케팅 동의
      marketingAgreed: marketingAgreedValue,
      agreedAt: new Date().toISOString(),
      // 발권 정보
      issuedAt: new Date().toISOString()
    };

    // DB에 저장 (실제로는 API 호출)
    setCrmDatabase(prev => [...prev, crmRecord]);
    
    // 콘솔에 저장된 데이터 출력 (개발용)
    console.log('=== CRM 데이터 저장 ===');
    console.log('이름:', crmRecord.name);
    console.log('전화번호:', crmRecord.phone);
    console.log('공연명:', crmRecord.showName);
    console.log('관람일시:', `${crmRecord.showDate} ${crmRecord.showTime} (${crmRecord.session})`);
    console.log('매수:', crmRecord.ticketCount);
    console.log('금액:', crmRecord.price.toLocaleString() + '원');
    console.log('마케팅동의:', crmRecord.marketingAgreed ? 'Y' : 'N');
    console.log('동의일시:', crmRecord.agreedAt);
    console.log('========================');
    
    return crmRecord;
  };

  // 페이지 이동 함수
  const goToPage = (page) => setCurrentPage(page);

  // 검색 실행
  const handleSearch = () => {
    const results = searchReservations(inputName, inputPhone, sampleReservations);
    
    if (results.length > 0) {
      // 회차별로 그룹화
      const grouped = groupBySession(results);
      setSearchResult(grouped);
      goToPage('confirmInfo');
    } else {
      alert('일치하는 예약 정보가 없습니다.');
    }
  };

  // 리셋 함수
  const resetAll = () => {
    setCurrentPage('landing');
    setSelectedShow(null);
    setSelectedAgency(null);
    setSearchResult([]);
    setSelectedReservation(null);
    setMarketingAgreed(false);
    setIssuedTicket(null);
    setInputName('');
    setInputPhone('');
  };

  // ============================================
  // 페이지 렌더링
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 모바일 컨테이너 */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden">
        
        {/* 헤더 */}
        <header className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
          <button 
            onClick={() => currentPage !== 'landing' ? goToPage('landing') : null}
            className="text-white/80 hover:text-white transition-colors"
          >
            {currentPage !== 'landing' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
          <h1 className="text-lg font-bold tracking-wide">
            <span className="text-yellow-300">T</span>CATS
          </h1>
          <button onClick={resetAll} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="pb-20 overflow-hidden">
          <div className="transition-all duration-300 ease-out">
            {currentPage === 'landing' && (
              <LandingPage 
                shows={sampleShows}
                agencies={ticketAgencies}
                onSelectShow={setSelectedShow}
                onSelectAgency={setSelectedAgency}
                onNext={() => goToPage('inputInfo')}
                selectedShow={selectedShow}
                selectedAgency={selectedAgency}
              />
            )}

            {currentPage === 'inputInfo' && (
              <InputInfoPage
                inputName={inputName}
                inputPhone={inputPhone}
                onNameChange={setInputName}
                onPhoneChange={setInputPhone}
                onSearch={handleSearch}
                selectedShow={selectedShow}
              />
            )}

            {currentPage === 'confirmInfo' && (
              <ConfirmInfoPage
                reservations={searchResult}
                onSelect={(r) => {
                  setSelectedReservation(r);
                  goToPage('marketing');
                }}
                selectedShow={selectedShow}
              />
            )}

            {currentPage === 'marketing' && (
              <MarketingPage
                agreed={marketingAgreed}
                onAgreeChange={setMarketingAgreed}
                onConfirm={() => {
                  if (selectedReservation?.allSeatAssigned === false) {
                    goToPage('seatSelect');
                  } else {
                    goToPage('qrTicket');
                  }
                }}
                selectedReservation={selectedReservation}
                onSaveToDb={saveToDatabase}
              />
            )}

            {currentPage === 'seatSelect' && (
              <SeatSelectPage
                reservation={selectedReservation}
                onComplete={(seats) => {
                  setSelectedReservation({...selectedReservation, seats, allSeatAssigned: true});
                  goToPage('qrTicket');
                }}
              />
            )}

            {currentPage === 'qrTicket' && (
              <QRTicketPage
                reservation={selectedReservation}
                selectedShow={selectedShow}
                onClose={resetAll}
              />
            )}
          </div>
        </main>

        {/* 하단 네비게이션 */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center text-gray-400 hover:text-rose-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-xs mt-1">카테고리</span>
            </button>
            <button className="flex flex-col items-center text-gray-400 hover:text-rose-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs mt-1">검색</span>
            </button>
            <button className="flex flex-col items-center text-rose-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1 font-medium">홈</span>
            </button>
            <button className="flex flex-col items-center text-gray-400 hover:text-rose-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-xs mt-1">티켓</span>
            </button>
            <button className="flex flex-col items-center text-gray-400 hover:text-rose-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">마이</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

// ============================================
// 페이지 컴포넌트들
// ============================================

// 1. 랜딩 페이지 (공연/예매처 선택)
function LandingPage({ shows, agencies, onSelectShow, onSelectAgency, onNext, selectedShow, selectedAgency }) {
  const showPickerRef = React.useRef(null);
  const agencyPickerRef = React.useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 휠 스크롤 시 선택 항목 변경
  const handleShowScroll = () => {
    if (!showPickerRef.current) return;
    const container = showPickerRef.current;
    const itemHeight = 56;
    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (shows[index] && (!selectedShow || selectedShow.id !== shows[index].id)) {
      onSelectShow(shows[index]);
    }
  };

  const handleAgencyScroll = () => {
    if (!agencyPickerRef.current) return;
    const container = agencyPickerRef.current;
    const itemHeight = 56;
    const scrollTop = container.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (agencies[index] && (!selectedAgency || selectedAgency.id !== agencies[index].id)) {
      onSelectAgency(agencies[index]);
    }
  };

  // 초기 선택
  React.useEffect(() => {
    if (shows.length > 0 && !selectedShow) {
      onSelectShow(shows[0]);
    }
    if (agencies.length > 0 && !selectedAgency) {
      onSelectAgency(agencies[0]);
    }
    // 입장 애니메이션
    setIsAnimating(true);
  }, []);

  return (
    <div className={`p-4 space-y-5 transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* 로고 영역 */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full shadow-lg mb-3 animate-pulse">
          <span className="text-2xl">🎭</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">공연관람 DATA 서비스</h2>
        <p className="text-rose-500 mt-1 font-medium text-sm">Joyful Time, Right for You.</p>
      </div>

      {/* 공연 선택 휠박스 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
          공연 선택
        </h3>
        <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
          {/* 선택 하이라이트 */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-rose-100 border-y-2 border-rose-300 pointer-events-none z-0"></div>
          
          {/* 스크롤 컨테이너 */}
          <div 
            ref={showPickerRef}
            onScroll={handleShowScroll}
            className="relative z-10 h-[168px] overflow-y-auto snap-y snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            {/* 상단 패딩 */}
            <div className="h-14"></div>
            
            {shows.map((show, index) => (
              <div
                key={show.id}
                className={`h-14 flex items-center justify-center gap-3 snap-center transition-all duration-200
                  ${selectedShow?.id === show.id ? 'text-rose-600 font-bold scale-105' : 'text-gray-400 scale-95'}`}
              >
                <span className="text-2xl">{show.poster}</span>
                <div className="text-center">
                  <p className="text-sm">{show.name}</p>
                  <p className="text-xs opacity-70">{show.venue}</p>
                </div>
              </div>
            ))}
            
            {/* 하단 패딩 */}
            <div className="h-14"></div>
          </div>
          
          {/* 페이드 효과 */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none z-20"></div>
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-20"></div>
        </div>
      </div>

      {/* 선택된 공연 상세정보 */}
      {selectedShow && (
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-100 transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
              {selectedShow.poster}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 truncate">{selectedShow.name}</h4>
              <p className="text-xs text-gray-500 mt-1">📍 {selectedShow.venue}</p>
              <p className="text-xs text-gray-500">📅 {selectedShow.period}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                  ⏱ {selectedShow.runningTime}
                </span>
                <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600">
                  🎫 {selectedShow.rating}
                </span>
              </div>
            </div>
          </div>
          
          {/* 회차 미리보기 */}
          <div className="mt-3 pt-3 border-t border-rose-200">
            <p className="text-xs text-gray-500 mb-2">예정된 회차</p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {selectedShow.sessions.slice(0, 3).map((session, idx) => (
                <div key={idx} className="flex-shrink-0 bg-white px-3 py-1.5 rounded-lg text-xs text-center shadow-sm">
                  <p className="font-medium text-gray-800">{session.date.slice(5)}</p>
                  <p className="text-gray-500">{session.time}</p>
                </div>
              ))}
              {selectedShow.sessions.length > 3 && (
                <div className="flex-shrink-0 bg-gray-100 px-3 py-1.5 rounded-lg text-xs flex items-center text-gray-400">
                  +{selectedShow.sessions.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 예매처 선택 휠박스 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
          예매처 선택
        </h3>
        <div className="relative bg-gray-50 rounded-2xl overflow-hidden">
          {/* 선택 하이라이트 */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-rose-100 border-y-2 border-rose-300 pointer-events-none z-0"></div>
          
          {/* 스크롤 컨테이너 */}
          <div 
            ref={agencyPickerRef}
            onScroll={handleAgencyScroll}
            className="relative z-10 h-[168px] overflow-y-auto snap-y snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {/* 상단 패딩 */}
            <div className="h-14"></div>
            
            {agencies.map((agency, index) => (
              <div
                key={agency.id}
                className={`h-14 flex items-center justify-center gap-3 snap-center transition-all duration-200
                  ${selectedAgency?.id === agency.id ? 'text-rose-600 font-bold scale-105' : 'text-gray-400 scale-95'}`}
              >
                <span className="text-2xl">{agency.logo}</span>
                <span className="text-sm">{agency.name}</span>
              </div>
            ))}
            
            {/* 하단 패딩 */}
            <div className="h-14"></div>
          </div>
          
          {/* 페이드 효과 */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none z-20"></div>
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none z-20"></div>
        </div>
      </div>

      {/* 선택 확인 카드 */}
      <div className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedShow?.poster || '🎭'}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{selectedShow?.name || '공연을 선택하세요'}</p>
              <p className="text-xs text-gray-500">{selectedAgency?.name || '예매처를 선택하세요'}</p>
            </div>
          </div>
          {selectedShow && selectedAgency && (
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={onNext}
        disabled={!selectedShow || !selectedAgency}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform
          ${selectedShow && selectedAgency 
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' 
            : 'bg-gray-300 cursor-not-allowed'}`}
      >
        다음단계
      </button>
    </div>
  );
}

// 2. 본인 예매 정보 입력 페이지
function InputInfoPage({ inputName, inputPhone, onNameChange, onPhoneChange, onSearch, selectedShow }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [birthYear, setBirthYear] = useState('1996');
  const [birthMonth, setBirthMonth] = useState('2');
  const [birthDay, setBirthDay] = useState('27');
  const [gender, setGender] = useState('');
  
  const yearPickerRef = React.useRef(null);
  const monthPickerRef = React.useRef(null);
  const dayPickerRef = React.useRef(null);

  // 년도 배열 (1950 ~ 2010)
  const years = Array.from({ length: 61 }, (_, i) => (1950 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  // 전화번호 포맷팅 (010-1234-5678)
  const formatPhone = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
    onPhoneChange(numbersOnly);
  };

  // 휠 스크롤 핸들러
  const handleYearScroll = () => {
    if (!yearPickerRef.current) return;
    const index = Math.round(yearPickerRef.current.scrollTop / 40);
    if (years[index]) setBirthYear(years[index]);
  };

  const handleMonthScroll = () => {
    if (!monthPickerRef.current) return;
    const index = Math.round(monthPickerRef.current.scrollTop / 40);
    if (months[index]) setBirthMonth(months[index]);
  };

  const handleDayScroll = () => {
    if (!dayPickerRef.current) return;
    const index = Math.round(dayPickerRef.current.scrollTop / 40);
    if (days[index]) setBirthDay(days[index]);
  };

  // 유효성 체크
  const isNameValid = inputName.length >= 2;
  const isPhoneValid = inputPhone.length === 11;
  const isFormValid = isNameValid && isPhoneValid;

  React.useEffect(() => {
    setIsAnimating(true);
    
    // 초기 스크롤 위치 설정
    setTimeout(() => {
      if (yearPickerRef.current) {
        const yearIndex = years.indexOf(birthYear);
        yearPickerRef.current.scrollTop = yearIndex * 40;
      }
      if (monthPickerRef.current) {
        const monthIndex = months.indexOf(birthMonth);
        monthPickerRef.current.scrollTop = monthIndex * 40;
      }
      if (dayPickerRef.current) {
        const dayIndex = days.indexOf(birthDay);
        dayPickerRef.current.scrollTop = dayIndex * 40;
      }
    }, 100);
  }, []);

  return (
    <div className={`transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* 로고 영역 */}
      <div className="text-center py-6 bg-gradient-to-b from-white to-gray-50">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-lg mb-3 relative">
          <span className="text-3xl">🐱</span>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-xs">🎫</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-rose-500">티켓츠 QR 발권 서비스</h2>
        <p className="text-gray-400 text-xs mt-1">Joyful Time, Right for You.</p>
      </div>

      {/* 입력 폼 영역 */}
      <div className="px-4 py-4 space-y-4">
        {/* 이름 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">이름</label>
          <div className="relative">
            <input
              type="text"
              value={inputName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="홍길동"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors bg-white
                ${isNameValid ? 'border-green-400 focus:border-green-500' : 'border-gray-200 focus:border-rose-400'}`}
            />
            {isNameValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 휴대폰 번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">휴대폰 번호</label>
          <div className="relative">
            <input
              type="tel"
              value={formatPhone(inputPhone)}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              maxLength={13}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors bg-white
                ${isPhoneValid ? 'border-green-400 focus:border-green-500' : 'border-gray-200 focus:border-rose-400'}`}
            />
            {isPhoneValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">생년월일</label>
          <div className="relative bg-gray-100 rounded-xl overflow-hidden">
            {/* 선택 하이라이트 */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-white border-y border-gray-200 pointer-events-none z-0"></div>
            
            <div className="flex relative z-10">
              {/* 년도 */}
              <div className="flex-1 relative">
                <div 
                  ref={yearPickerRef}
                  onScroll={handleYearScroll}
                  className="h-[120px] overflow-y-auto snap-y snap-mandatory"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <div className="h-10"></div>
                  {years.map((year) => (
                    <div
                      key={year}
                      className={`h-10 flex items-center justify-center snap-center transition-all text-sm
                        ${birthYear === year ? 'text-gray-800 font-bold' : 'text-gray-400'}`}
                    >
                      {year}년
                    </div>
                  ))}
                  <div className="h-10"></div>
                </div>
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
              </div>

              {/* 월 */}
              <div className="flex-1 relative border-l border-gray-200">
                <div 
                  ref={monthPickerRef}
                  onScroll={handleMonthScroll}
                  className="h-[120px] overflow-y-auto snap-y snap-mandatory"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <div className="h-10"></div>
                  {months.map((month) => (
                    <div
                      key={month}
                      className={`h-10 flex items-center justify-center snap-center transition-all text-sm
                        ${birthMonth === month ? 'text-gray-800 font-bold' : 'text-gray-400'}`}
                    >
                      {month}월
                    </div>
                  ))}
                  <div className="h-10"></div>
                </div>
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
              </div>

              {/* 일 */}
              <div className="flex-1 relative border-l border-gray-200">
                <div 
                  ref={dayPickerRef}
                  onScroll={handleDayScroll}
                  className="h-[120px] overflow-y-auto snap-y snap-mandatory"
                  style={{ scrollbarWidth: 'none' }}
                >
                  <div className="h-10"></div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className={`h-10 flex items-center justify-center snap-center transition-all text-sm
                        ${birthDay === day ? 'text-gray-800 font-bold' : 'text-gray-400'}`}
                    >
                      {day}일
                    </div>
                  ))}
                  <div className="h-10"></div>
                </div>
                <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none"></div>
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">성별</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all
                ${gender === 'male' 
                  ? 'border-rose-400 bg-rose-50 text-rose-500' 
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
            >
              남성
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all
                ${gender === 'female' 
                  ? 'border-rose-400 bg-rose-50 text-rose-500' 
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
            >
              여성
            </button>
          </div>
        </div>
      </div>

      {/* 다음단계 버튼 */}
      <div className="px-4 pb-4">
        <button
          onClick={onSearch}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform
            ${isFormValid
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg active:scale-[0.98]' 
              : 'bg-gray-300 cursor-not-allowed'}`}
        >
          다음단계
        </button>
      </div>
    </div>
  );
}

// 4. 예약 정보 확인 페이지
function ConfirmInfoPage({ reservations, onSelect, selectedShow }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  React.useEffect(() => {
    setIsAnimating(true);
    // 기본으로 모든 예약 선택
    setSelectedItems(reservations.map((_, idx) => idx));
  }, [reservations]);

  // 예약 선택/해제 토글
  const toggleSelect = (idx) => {
    if (selectedItems.includes(idx)) {
      setSelectedItems(selectedItems.filter(i => i !== idx));
    } else {
      setSelectedItems([...selectedItems, idx]);
    }
  };

  // 선택된 예약 확인
  const handleConfirm = () => {
    const selected = selectedItems.map(idx => reservations[idx]);
    if (selected.length > 0) {
      onSelect(selected.length === 1 ? selected[0] : { 
        ...selected[0], 
        seats: selected.flatMap(r => r.seats),
        totalTickets: selected.reduce((sum, r) => sum + r.totalTickets, 0),
        multiSession: selected.length > 1,
        sessions: selected
      });
    }
  };

  // 총 매수 및 금액 계산
  const totalTickets = selectedItems.reduce((sum, idx) => sum + (reservations[idx]?.totalTickets || 0), 0);
  const totalPrice = selectedItems.reduce((sum, idx) => sum + (reservations[idx]?.totalPrice || 0), 0);

  // 날짜 포맷팅
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}.${date.getDate()}(${days[date.getDay()]})`;
  };

  return (
    <div className={`transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-5">
        <h2 className="text-lg font-bold">예약 정보 확인</h2>
        <p className="text-rose-100 text-sm mt-1">예매 내역을 확인해주세요</p>
      </div>

      {/* 예약자 정보 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 예약자 이름 */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-500 font-bold">{reservations[0]?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">{reservations[0]?.name}</p>
                <p className="text-xs text-gray-500">예매자</p>
              </div>
            </div>
          </div>

          {/* 회차별 예약 목록 */}
          <div className="divide-y divide-gray-100">
            {reservations.map((r, idx) => (
              <div 
                key={idx}
                onClick={() => toggleSelect(idx)}
                className={`px-4 py-4 cursor-pointer transition-all
                  ${selectedItems.includes(idx) ? 'bg-rose-50' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-start gap-3">
                  {/* 체크박스 */}
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
                    ${selectedItems.includes(idx) ? 'bg-rose-500 border-rose-500' : 'border-gray-300'}`}>
                    {selectedItems.includes(idx) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* 예약 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {formatDate(r.showDate)} {r.showTime}
                      </span>
                      <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                        {r.session}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">{r.showName}</p>
                    
                    {/* 좌석 정보 */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${r.allSeatAssigned ? 'text-blue-600' : 'text-amber-600'}`}>
                        {r.totalTickets}매
                      </span>
                      {r.totalPrice > 0 && (
                        <span className="text-xs text-gray-500">
                          ({r.totalPrice.toLocaleString()}원)
                        </span>
                      )}
                      {r.allSeatAssigned && r.seats.length > 0 ? (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {r.seats.join(', ')}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded">
                          좌석 미지정
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 선택 요약 */}
      <div className="px-4 pb-4">
        <div className="bg-gray-800 text-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-gray-400 text-xs">선택한 티켓</p>
              <p className="text-xl font-bold">{totalTickets}매</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">선택 회차</p>
              <p className="font-semibold">{selectedItems.length}건</p>
            </div>
          </div>
          {totalPrice > 0 && (
            <div className="pt-2 border-t border-gray-700 flex justify-between items-center">
              <span className="text-gray-400 text-sm">총 결제금액</span>
              <span className="text-lg font-bold text-rose-400">{totalPrice.toLocaleString()}원</span>
            </div>
          )}
        </div>
      </div>

      {/* 확인 버튼 */}
      <div className="px-4 pb-4">
        <button
          onClick={handleConfirm}
          disabled={selectedItems.length === 0}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300
            ${selectedItems.length > 0
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg active:scale-[0.98]' 
              : 'bg-gray-300 cursor-not-allowed'}`}
        >
          선택한 티켓 발권하기
        </button>
      </div>
    </div>
  );
}

// 5. 마케팅 동의 페이지
function MarketingPage({ agreed, onAgreeChange, onConfirm, selectedReservation, onSaveToDb }) {
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    setIsAnimating(true);
  }, []);

  // 발권 진행 (DB 저장 후)
  const handleConfirm = () => {
    if (!agreed) {
      alert('마케팅 정보 수신에 동의해주세요.');
      return;
    }
    // DB에 개인정보 + 관람기록 저장
    if (onSaveToDb) {
      onSaveToDb(agreed);
    }
    onConfirm();
  };

  return (
    <div className={`transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-5">
        <h2 className="text-lg font-bold">마케팅 정보 수신 동의</h2>
        <p className="text-rose-100 text-sm mt-1">발권을 위해 동의가 필요합니다</p>
      </div>

      <div className="p-4 space-y-4">
        {/* 예약 정보 요약 */}
        {selectedReservation && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-500 font-bold">{selectedReservation.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">{selectedReservation.name}</p>
                <p className="text-xs text-gray-500">{selectedReservation.showName}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 text-sm">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>관람일시</span>
                <span className="font-medium">{selectedReservation.showDate} {selectedReservation.showTime}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>회차</span>
                <span className="font-medium">{selectedReservation.session}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>예매 매수</span>
                <span className="font-bold text-rose-500">{selectedReservation.totalTickets || selectedReservation.seats?.length || 1}매</span>
              </div>
              {selectedReservation.totalPrice > 0 && (
                <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-100 mt-1">
                  <span>결제금액</span>
                  <span className="font-bold text-gray-800">{selectedReservation.totalPrice.toLocaleString()}원</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 동의 안내 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded font-medium">필수</span>
              <h3 className="font-semibold text-gray-800">개인정보 수집 및 이용 동의</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              티켓츠는 고객님께 더 나은 공연 정보와 혜택을 제공하기 위해 
              아래와 같이 개인정보를 수집·이용합니다.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 text-xs text-gray-600 space-y-2">
            <div className="flex gap-2">
              <span className="text-gray-400">•</span>
              <span><strong>수집항목:</strong> 이름, 연락처, 관람기록</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">•</span>
              <span><strong>이용목적:</strong> 공연정보 안내, 맞춤 혜택 제공</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400">•</span>
              <span><strong>보유기간:</strong> 동의 철회 시까지</span>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between border-t border-gray-100">
            <button
              onClick={() => setShowPrivacyPopup(true)}
              className="text-sm text-rose-500 hover:text-rose-600 underline underline-offset-2"
            >
              전문 보기 →
            </button>
          </div>
        </div>

        {/* 동의 체크박스 - 필수 */}
        <div 
          onClick={() => onAgreeChange(!agreed)}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all
            ${agreed ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-white hover:border-rose-300'}`}
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
              ${agreed ? 'bg-rose-500 border-rose-500' : 'border-gray-300 bg-white'}`}>
              {agreed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                <span className="text-rose-500">[필수]</span> 마케팅 정보 수신에 동의합니다
              </p>
            </div>
          </label>
        </div>

        {/* 안내 문구 */}
        <p className="text-xs text-gray-400 text-center">
          거래정보와 관련된 내용은 수신동의 여부와 관계없이 발송됩니다.
        </p>
      </div>

      {/* 발권하기 버튼 */}
      <div className="px-4 pb-4">
        <button
          onClick={handleConfirm}
          disabled={!agreed}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all
            ${agreed 
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg active:scale-[0.98]' 
              : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {agreed ? '발권하기' : '동의 후 발권 가능'}
        </button>
      </div>

      {/* 개인정보 처리방침 팝업 */}
      {showPrivacyPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl max-h-[80vh] flex flex-col animate-slide-up">
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">개인정보 수집·이용 동의서</h3>
              <button 
                onClick={() => setShowPrivacyPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 팝업 내용 */}
            <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-600 space-y-4">
              <section>
                <h4 className="font-semibold text-gray-800 mb-2">제 1조 (목적)</h4>
                <p className="leading-relaxed">
                  티켓츠(이하 "회사")는 고객님들에게 보다 다양한 정보를 제공하고, 서비스의 질을 
                  향상시키기 위하여 「개인정보보호법」, 「정보통신망 이용촉진 및 정보보호 등에 
                  관한 법률」의 규정을 준수하여 회원님의 개인정보를 수집·이용합니다.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">제 2조 (수집 및 활용 정보)</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p><strong>수집항목:</strong> 성명, 휴대폰번호, 생년월일, 성별, 관람기록(공연명, 일시, 좌석, 결제금액)</p>
                  <p><strong>수집목적:</strong> 공연정보 안내, 맞춤형 혜택 제공, 고객 분석 및 서비스 개선</p>
                  <p><strong>보유기간:</strong> 동의 철회 시까지 (최대 3년)</p>
                  <p><strong>제공받는 자:</strong> 티켓츠 협력 극단사</p>
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">제 3조 (동의 철회)</h4>
                <p className="leading-relaxed">
                  동의를 철회하고 싶은 회원은 언제든지 전화와 이메일 등을 통하여 본인 확인 후 
                  요청할 수 있습니다. 이미 제공된 회원정보를 철회하는 데는 일정 시간이 소요됩니다.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">제 4조 (동의 거부권)</h4>
                <p className="leading-relaxed">
                  고객님은 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 
                  다만, 동의를 거부하시는 경우 QR 티켓 발권이 제한됩니다.
                </p>
              </section>
            </div>

            {/* 팝업 하단 */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowPrivacyPopup(false)}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// 6. 좌석 선택 페이지
function SeatSelectPage({ reservation, onComplete }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const requiredSeats = 1; // 미지정석은 1매씩
  
  // 샘플 좌석 배열 (실제로는 서버에서 가져옴)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  const unavailable = ['A1', 'A2', 'A3', 'B5', 'C1', 'C2', 'D3', 'D4']; // 이미 선점된 좌석

  const toggleSeat = (seat) => {
    if (unavailable.includes(seat)) return;
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      if (selectedSeats.length < requiredSeats) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold text-gray-800">좌석 선택</h3>
      <p className="text-sm text-gray-500">원하시는 좌석을 선택해주세요.</p>

      {/* 무대 */}
      <div className="bg-gray-800 text-white text-center py-2 rounded-lg text-sm font-semibold">
        STAGE
      </div>

      {/* 좌석 배열 */}
      <div className="flex flex-col items-center gap-1 py-4">
        {rows.map(row => (
          <div key={row} className="flex items-center gap-1">
            <span className="w-6 text-xs text-gray-400 text-center">{row}</span>
            {cols.map(col => {
              const seat = `${row}${col}`;
              const isUnavailable = unavailable.includes(seat);
              const isSelected = selectedSeats.includes(seat);
              
              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  disabled={isUnavailable}
                  className={`w-8 h-8 rounded text-xs font-medium transition-all
                    ${isUnavailable 
                      ? 'bg-gray-300 text-gray-400 cursor-not-allowed' 
                      : isSelected 
                        ? 'bg-rose-500 text-white shadow-md scale-110' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                >
                  {col}
                </button>
              );
            })}
            <span className="w-6 text-xs text-gray-400 text-center">{row}</span>
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>선택가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-rose-500 rounded"></div>
          <span>선택됨</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>선택불가</span>
        </div>
      </div>

      {/* 선택 정보 */}
      <div className="bg-gray-50 rounded-xl p-3 text-center">
        <span className="text-sm text-gray-600">선택된 좌석: </span>
        <span className="font-bold text-rose-600">
          {selectedSeats.length > 0 ? selectedSeats.join(', ') : '없음'}
        </span>
      </div>

      {/* 확인 버튼 */}
      <button
        onClick={() => onComplete(selectedSeats)}
        disabled={selectedSeats.length < requiredSeats}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all
          ${selectedSeats.length >= requiredSeats
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg' 
            : 'bg-gray-300 cursor-not-allowed'}`}
      >
        좌석 확정 및 QR 발권
      </button>
    </div>
  );
}

// 7. QR 발권 페이지 - 개별 QR 발급 + 전달 기능
function QRTicketPage({ reservation, selectedShow, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTicketForShare, setSelectedTicketForShare] = useState(null);
  const [showReceiverForm, setShowReceiverForm] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // 티켓 초기화 - 좌석별로 개별 QR 생성
  React.useEffect(() => {
    setIsAnimating(true);
    
    if (reservation?.seats && reservation.seats.length > 0) {
      const generatedTickets = reservation.seats.map((seat, idx) => ({
        id: `TKT-${Date.now()}-${idx}`,
        seat: seat,
        ownerName: idx === 0 ? reservation.name : null, // 첫 번째 티켓만 예매자 본인
        ownerPhone: idx === 0 ? reservation.phone : null,
        isOwner: idx === 0,
        isTransferred: false,
        transferredTo: null,
        qrData: JSON.stringify({
          ticketId: `TKT-${Date.now()}-${idx}`,
          showName: selectedShow?.name,
          showDate: reservation?.showDate,
          showTime: reservation?.showTime,
          session: reservation?.session,
          seat: seat,
          issuedAt: new Date().toISOString()
        })
      }));
      setTickets(generatedTickets);
    }
  }, [reservation, selectedShow]);

  // 공유 링크 생성
  const generateShareLink = (ticket) => {
    const baseUrl = 'https://m.tcats.com/receive';
    const params = new URLSearchParams({
      ticketId: ticket.id,
      showName: selectedShow?.name || '',
      showDate: reservation?.showDate || '',
      seat: ticket.seat
    });
    return `${baseUrl}?${params.toString()}`;
  };

  // 티켓 전달하기 클릭
  const handleShareClick = (ticket) => {
    setSelectedTicketForShare(ticket);
    setShareLink(generateShareLink(ticket));
    setShowShareModal(true);
  };

  // 카카오톡 공유
  const shareKakao = () => {
    const message = `🎭 티켓츠 QR 티켓이 도착했습니다!\n\n` +
      `공연: ${selectedShow?.name}\n` +
      `일시: ${reservation?.showDate} ${reservation?.showTime}\n` +
      `좌석: ${selectedTicketForShare?.seat}\n\n` +
      `아래 링크에서 본인인증 후 티켓을 받으세요:\n${shareLink}`;
    
    // 실제로는 카카오 SDK 사용
    alert(`카카오톡 공유 (시뮬레이션)\n\n${message}`);
    
    // 티켓 상태 업데이트
    setTickets(prev => prev.map(t => 
      t.id === selectedTicketForShare.id 
        ? { ...t, isTransferred: true, transferredTo: '카카오톡 전달됨' }
        : t
    ));
    setShowShareModal(false);
  };

  // 문자 공유
  const shareSMS = () => {
    const message = `[티켓츠] QR 티켓이 도착했습니다!\n` +
      `공연: ${selectedShow?.name}\n` +
      `좌석: ${selectedTicketForShare?.seat}\n` +
      `티켓 받기: ${shareLink}`;
    
    // 실제로는 SMS 링크 사용
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    
    setTickets(prev => prev.map(t => 
      t.id === selectedTicketForShare.id 
        ? { ...t, isTransferred: true, transferredTo: '문자 전달됨' }
        : t
    ));
    setShowShareModal(false);
  };

  // 링크 복사
  const copyLink = () => {
    navigator.clipboard?.writeText(shareLink);
    alert('링크가 복사되었습니다!');
  };

  return (
    <div className={`transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-5">
        <h2 className="text-lg font-bold">🎉 발권 완료!</h2>
        <p className="text-rose-100 text-sm mt-1">총 {tickets.length}매의 티켓이 발권되었습니다</p>
      </div>

      {/* 공연 정보 */}
      <div className="px-4 py-3 bg-gray-50 border-b">
        <p className="font-bold text-gray-800">{selectedShow?.name}</p>
        <p className="text-sm text-gray-500">{reservation?.showDate} {reservation?.showTime} ({reservation?.session})</p>
      </div>

      {/* 티켓 목록 */}
      <div className="p-4 space-y-3">
        <p className="text-sm font-medium text-gray-600 mb-2">발권된 티켓</p>
        
        {tickets.map((ticket, idx) => (
          <div 
            key={ticket.id}
            className={`bg-white rounded-xl border-2 overflow-hidden transition-all
              ${ticket.isOwner ? 'border-rose-300' : ticket.isTransferred ? 'border-green-300' : 'border-gray-200'}`}
          >
            {/* 티켓 헤더 */}
            <div className={`px-4 py-2 flex items-center justify-between
              ${ticket.isOwner ? 'bg-rose-50' : ticket.isTransferred ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">좌석 {ticket.seat}</span>
                {ticket.isOwner && (
                  <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full">내 티켓</span>
                )}
                {ticket.isTransferred && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">전달됨</span>
                )}
              </div>
              <span className="text-xs text-gray-400">#{idx + 1}</span>
            </div>

            {/* QR 코드 */}
            <div className="p-4 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                {/* 시뮬레이션 QR 코드 */}
                <div className="grid grid-cols-5 gap-0.5 p-2">
                  {Array(25).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 ${Math.random() > 0.4 ? 'bg-gray-800' : 'bg-white'}`}
                    ></div>
                  ))}
                </div>
              </div>
              
              {ticket.isOwner ? (
                <p className="text-sm text-gray-600">{reservation?.name}님의 티켓</p>
              ) : ticket.transferredTo ? (
                <p className="text-sm text-green-600">{ticket.transferredTo}</p>
              ) : (
                <p className="text-sm text-amber-600">동행자에게 전달해주세요</p>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="px-4 pb-4 flex gap-2">
              {ticket.isOwner ? (
                <button className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium">
                  다운로드
                </button>
              ) : !ticket.isTransferred ? (
                <>
                  <button 
                    onClick={() => handleShareClick(ticket)}
                    className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium"
                  >
                    전달하기
                  </button>
                  <button className="py-2 px-4 bg-gray-200 text-gray-600 rounded-lg text-sm">
                    다운로드
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleShareClick(ticket)}
                  className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium"
                >
                  다시 전달하기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 안내사항 */}
      <div className="px-4 pb-4">
        <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold mb-2">💡 안내사항</p>
          <ul className="space-y-1 text-xs">
            <li>• 각 티켓의 QR코드는 1회만 입장 가능합니다.</li>
            <li>• 동행자에게 전달 시, 상대방도 본인인증이 필요합니다.</li>
            <li>• 스크린샷으로 저장해두시면 편리합니다.</li>
          </ul>
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className="px-4 pb-4">
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600"
        >
          완료
        </button>
      </div>

      {/* 공유 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl animate-slide-up">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-800">티켓 전달하기</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 티켓 정보 */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                  <span className="text-rose-500 font-bold">{selectedTicketForShare?.seat}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{selectedShow?.name}</p>
                  <p className="text-sm text-gray-500">{reservation?.showDate} {reservation?.showTime}</p>
                </div>
              </div>
            </div>

            {/* 공유 방법 */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                받는 분은 본인인증 후 티켓을 받을 수 있습니다.
              </p>

              <button
                onClick={shareKakao}
                className="w-full py-3 bg-yellow-400 text-yellow-900 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <span>💬</span> 카카오톡으로 보내기
              </button>

              <button
                onClick={shareSMS}
                className="w-full py-3 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <span>📱</span> 문자로 보내기
              </button>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={shareLink} 
                  readOnly 
                  className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium"
                >
                  복사
                </button>
              </div>
            </div>

            {/* 닫기 */}
            <div className="p-4 border-t">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// 8. 티켓 수신자 본인인증 페이지 (별도 URL로 접근)
function TicketReceivePage({ ticketId, showName, showDate, seat }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const formatPhone = (value) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const isFormValid = name.length >= 2 && phone.length === 11 && gender && marketingAgreed;

  const handleVerify = () => {
    if (!isFormValid) {
      alert('모든 항목을 입력하고 마케팅 동의를 해주세요.');
      return;
    }
    
    // CRM 데이터 저장 (수신자 정보)
    console.log('=== 티켓 수신자 CRM 저장 ===');
    console.log('이름:', name);
    console.log('전화번호:', phone);
    console.log('성별:', gender);
    console.log('공연:', showName);
    console.log('좌석:', seat);
    console.log('마케팅동의:', 'Y');
    console.log('============================');
    
    setIsVerified(true);
    setShowQR(true);
  };

  if (showQR) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 text-center">
            <h2 className="text-xl font-bold">🎉 티켓 수령 완료!</h2>
            <p className="text-rose-100 mt-1">{name}님, 환영합니다</p>
          </div>

          <div className="p-6">
            <div className="text-center mb-4">
              <p className="font-bold text-gray-800">{showName}</p>
              <p className="text-sm text-gray-500">{showDate}</p>
              <p className="text-lg font-bold text-rose-500 mt-2">좌석: {seat}</p>
            </div>

            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="grid grid-cols-5 gap-0.5 p-2">
                {Array(25).fill(0).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 ${Math.random() > 0.4 ? 'bg-gray-800' : 'bg-white'}`}
                  ></div>
                ))}
              </div>
            </div>

            <button className="w-full py-3 bg-rose-500 text-white rounded-xl font-medium">
              티켓 다운로드
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 text-center">
          <h2 className="text-xl font-bold">🎫 티켓이 도착했습니다!</h2>
          <p className="text-rose-100 mt-1">본인확인 후 티켓을 받으세요</p>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <p className="font-bold text-gray-800">{showName}</p>
          <p className="text-sm text-gray-500">{showDate} | 좌석: {seat}</p>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-4 py-3 border rounded-xl focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">휴대폰 번호</label>
            <input
              type="tel"
              value={formatPhone(phone)}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="010-1234-5678"
              maxLength={13}
              className="w-full px-4 py-3 border rounded-xl focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">성별</label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all
                  ${gender === 'male' ? 'border-rose-400 bg-rose-50 text-rose-500' : 'border-gray-200'}`}
              >
                남성
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all
                  ${gender === 'female' ? 'border-rose-400 bg-rose-50 text-rose-500' : 'border-gray-200'}`}
              >
                여성
              </button>
            </div>
          </div>

          <div 
            onClick={() => setMarketingAgreed(!marketingAgreed)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all
              ${marketingAgreed ? 'border-rose-400 bg-rose-50' : 'border-gray-200'}`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${marketingAgreed ? 'bg-rose-500 border-rose-500' : 'border-gray-300'}`}>
                {marketingAgreed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-800">
                <span className="text-rose-500">[필수]</span> 마케팅 정보 수신 동의
              </span>
            </label>
          </div>

          <button
            onClick={handleVerify}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all
              ${isFormValid 
                ? 'bg-gradient-to-r from-rose-500 to-pink-600' 
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {isFormValid ? '티켓 받기' : '모든 항목을 입력해주세요'}
          </button>
        </div>
      </div>
    </div>
  );
}
