import { useMemo, useState } from 'react'

const sampleShows = [
  {
    id: 's1',
    title: 'Midnight Jazz Night',
    venue: '서울 블루홀',
    date: '2024-07-12',
    times: ['17:00', '20:00'],
  },
  {
    id: 's2',
    title: '뮤지컬 캣츠',
    venue: '부산 드림씨어터',
    date: '2024-07-20',
    times: ['13:30', '18:30'],
  },
]

const ticketAgencies = ['예스24', '인터파크', '티켓링크']

const sampleReservations = [
  {
    id: 'r1',
    showId: 's1',
    agency: '예스24',
    name: '김민수',
    phone: '01012345678',
    time: '17:00',
    seats: [
      { seat: 'A12', holder: '김민수' },
      { seat: 'A13', holder: '김민수' },
    ],
  },
  {
    id: 'r2',
    showId: 's2',
    agency: '티켓링크',
    name: '이서연',
    phone: '01087654321',
    time: '18:30',
    seats: [
      { seat: 'B01', holder: '이서연' },
      { seat: 'B02', holder: '이서연' },
      { seat: 'B03', holder: '박도윤' },
    ],
  },
]

const formatDate = (value) =>
  new Intl.DateTimeFormat('ko', { dateStyle: 'medium' }).format(new Date(value))

function ReservationCard({ reservation, onIssue }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 shadow-md shadow-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">예매자</p>
          <p className="text-lg font-semibold text-white">{reservation.name}</p>
          <p className="text-sm text-slate-400">{reservation.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}</p>
        </div>
        <div className="rounded-lg bg-slate-800/80 px-3 py-2 text-sm text-pink-300">
          {reservation.agency}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-400">회차</p>
          <p className="text-base font-semibold text-white">{reservation.time}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">총 좌석</p>
          <p className="text-base font-semibold text-white">{reservation.seats.length}석</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-slate-800/70 p-3 text-sm text-slate-200">
        <p className="font-semibold text-white">좌석별 QR</p>
        <ul className="mt-2 space-y-1">
          {reservation.seats.map((seat) => (
            <li key={seat.seat} className="flex items-center justify-between rounded-md bg-slate-900/60 px-2 py-1">
              <span className="font-mono text-slate-100">{seat.seat}</span>
              <span className="text-slate-300">{seat.holder}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <button
          className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white transition hover:bg-pink-400"
          onClick={() => onIssue(reservation)}
        >
          QR 발급하기
        </button>
        <span className="rounded-lg bg-slate-800/70 px-3 py-2">카카오톡 전달</span>
        <span className="rounded-lg bg-slate-800/70 px-3 py-2">문자 발송</span>
      </div>
    </div>
  )
}

function App() {
  const [selectedShow, setSelectedShow] = useState(sampleShows[0].id)
  const [selectedAgency, setSelectedAgency] = useState(ticketAgencies[0])
  const [keyword, setKeyword] = useState('')
  const [consent, setConsent] = useState(false)
  const [toast, setToast] = useState('')

  const matches = useMemo(() => {
    const normalized = keyword.replace(/\D/g, '')
    return sampleReservations.filter((reservation) => {
      const showMatches = reservation.showId === selectedShow
      const agencyMatches = reservation.agency === selectedAgency
      if (!normalized) return showMatches && agencyMatches

      const phoneTail = reservation.phone.slice(-4)
      const nameMatches = reservation.name.includes(keyword)
      const phoneMatches = phoneTail.includes(normalized) || reservation.phone.includes(normalized)
      return showMatches && agencyMatches && (nameMatches || phoneMatches)
    })
  }, [keyword, selectedAgency, selectedShow])

  const handleIssue = (reservation) => {
    if (!consent) {
      setToast('마케팅 동의 후 발급 가능합니다.')
      return
    }
    setToast(`${reservation.name}님의 QR을 발급했습니다.`)
    setTimeout(() => setToast(''), 2400)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/50 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-300">TCATS</p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">티켓츠 QR 발권 대시보드</h1>
          <p className="text-sm text-slate-400">공연장 현장 발권, 동행자 전달, 회차별 티켓을 한 번에 처리하세요.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          실시간 매표 모드 활성화
        </div>
      </header>

      <section className="grid gap-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/50 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">공연/예매처 선택</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-white"
                value={selectedShow}
                onChange={(e) => setSelectedShow(e.target.value)}
              >
                {sampleShows.map((show) => (
                  <option key={show.id} value={show.id}>
                    {show.title} · {formatDate(show.date)}
                  </option>
                ))}
              </select>
              <select
                className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-white"
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
              >
                {ticketAgencies.map((agency) => (
                  <option key={agency}>{agency}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300">본인 확인</label>
            <div className="mt-2 space-y-2">
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-3 text-white placeholder:text-slate-500"
                placeholder="이름 또는 전화번호 끝 4자리"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <p className="text-xs text-slate-500">와일드카드 검색 지원 · 전화번호는 숫자만 입력해 주세요.</p>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-500 text-pink-500 focus:ring-pink-500"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            마케팅 정보 수신 동의 (필수)
          </label>
        </div>

        <div className="flex flex-col justify-between space-y-4 rounded-xl bg-gradient-to-br from-pink-500/80 via-fuchsia-500/70 to-indigo-500/60 p-6 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Today&apos;s Show</p>
            <h2 className="mt-2 text-2xl font-bold">{sampleShows.find((s) => s.id === selectedShow)?.title}</h2>
            <p className="text-sm text-white/80">{sampleShows.find((s) => s.id === selectedShow)?.venue}</p>
            <p className="text-sm text-white/80">{formatDate(sampleShows.find((s) => s.id === selectedShow)?.date)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {sampleShows
              .find((s) => s.id === selectedShow)
              ?.times.map((time) => (
                <div key={time} className="rounded-xl bg-white/15 px-3 py-2 text-center font-semibold">
                  {time} 회차
                </div>
              ))}
          </div>
          <p className="text-xs text-white/80">좌석별 QR 발급과 동행자 전달을 위해 예매 정보를 확인하세요.</p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">예약 정보 매칭</h2>
          <div className="text-sm text-slate-400">총 {matches.length}건</div>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-center text-slate-400">
            조건에 맞는 예약이 없습니다. 이름 또는 전화번호를 다시 확인해 주세요.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} onIssue={handleIssue} />
            ))}
          </div>
        )}
      </section>

      {toast && (
        <div className="fixed inset-x-0 bottom-6 flex justify-center px-4">
          <div className="rounded-full bg-slate-900/95 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/40">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
