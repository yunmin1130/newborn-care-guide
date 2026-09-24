/* 출산 달력 — 사이트 전체의 시점을 한 곳에 모은 데이터 + 달력 렌더링
   d: D-day 기준 오프셋(일). 숫자면 하루짜리, [시작,끝]이면 기간.
   cat: birth(출산 당일) · med(아기 건강·의료) · mom(산모 회복) · rhythm(먹놀잠) · admin(서류·행정·물건)
   본문을 고치면 여기도 같이 고친다. */
(function () {
  'use strict';

  var CATS = {
    birth:  { label: '출산 당일',      color: 'var(--sky)' },
    med:    { label: '아기 건강·의료', color: 'var(--rose)' },
    mom:    { label: '산모 회복',      color: 'var(--lilac)' },
    rhythm: { label: '먹-놀-잠',       color: 'var(--mint)' },
    admin:  { label: '서류·행정·물건', color: 'var(--apricot)' }
  };

  var EVENTS = [
    /* ---- 출산 전후 (birth.html) ---- */
    { d: -7,  cat: 'birth', t: '수술 전 검사 · 카시트 장착 · 조리원 입소일 확정', s: '휴가 신청, 아기 이름 확정, BCG 종류 결정, 양가에 방문 규칙 공지', href: 'birth.html#a' },
    { d: -1,  cat: 'birth', t: '자정부터 금식 · 짐 최종 점검', s: '휴대폰 100% 충전, 저장공간 비우기, 서류 봉투', href: 'birth.html#a' },
    { d: 0,   cat: 'birth', t: '수술 · 아기 첫 대면 촬영 · 회복실에서 말 걸기', s: '동의서 서명 → 수술실 앞 대기 → 첫 대면 촬영 → 아내 쪽 부모님·조리원 연락 → 회복실 앞', href: 'birth.html#b' },
    { d: 1,   cat: 'birth', t: '첫 보행 부축 · 무통주사 버튼 · 방문객 통제', s: '소변줄 제거 후 걷기. 가스 나와야 식사 시작', href: 'birth.html#d' },
    { d: [4, 5], cat: 'birth', t: '퇴원 → 조리원 입소', s: '퇴원 전 확인 5종, 출생사실증명서 넉넉히, 처방약, 카시트 첫 사용', href: 'birth.html#e' },
    { d: [5, 7], cat: 'birth', t: '실밥·스테이플 제거', s: '외래 또는 조리원 방문 진료 — 병원마다 다름', href: 'birth.html#e' },
    { d: 10,  cat: 'birth', t: '조리원에서 목욕·트림·기저귀 직접 배우기', s: '퇴소하면 신생아실이 없습니다. 남편이 배웁니다', href: 'birth.html#f' },
    { d: 18,  cat: 'birth', t: '조리원 퇴소 → 집', s: '퇴소 전 세액공제 영수증. 여기부터 PART 1', href: 'birth.html#f' },

    /* ---- 서류·행정·물건 ---- */
    { d: [4, 5], cat: 'admin', t: '퇴원 서류 3종 — 출생증명서 · 영수증+세부내역서 · 진단서', s: '원무과. 출생증명서 5부, 영수증·세부내역서 원본 2부(세액공제·보건소 지원용), 진단서는 수술명·질병분류코드 확인. 전부 사진으로 클라우드에', href: 'birth.html#e' },
    { d: 7,   cat: 'admin', t: '출생신고 + 행복출산 원스톱 통합신청', s: '출생증명서·가족관계증명서·신분증·통장 사본·아기 이름(한자). 아동수당은 아이 명의 계좌로', href: 'birth.html#g' },
    { d: 12,  cat: 'admin', t: '전기세 감면 · 보험 자녀 등록 · 스튜디오 예약', s: '한전 123 + 관리사무소, 태아보험 전환, 자동차보험 자녀 특약, 회사 지원금', href: 'birth.html#f' },
    { d: 18,  cat: 'admin', t: '조리원 영수증 받기 (퇴소 전)', s: '산후조리원 비용 의료비 세액공제용', href: 'birth.html#g' },
    { d: 30,  cat: 'admin', t: '출생신고 마감 (1개월)', s: '넘기면 과태료', href: 'birth.html#g' },
    { d: 60,  cat: 'admin', t: '지원금 신청 60일 — 출생월 소급 기준', s: '부모급여 등은 60일 내 신청해야 출생월부터 소급', href: 'birth.html#g' },
    { d: 365, cat: 'admin', t: '첫만남이용권 사용 기한 (1년)', s: '', href: 'birth.html#g' },

    /* ---- 아기 건강·의료 (part3, part1) ---- */
    { d: 0,   cat: 'med', t: 'B형간염 1차 (출생 12시간 내, 병원)', s: '', href: 'part3.html#a' },
    { d: [2, 3], cat: 'med', t: '대사이상 선별검사 채혈 · 청각 선별검사', s: '생후 48~72시간. 시행 여부와 결과 통보 방법을 남편이 직접 확인', href: 'part3.html#b' },
    { d: [2, 3], cat: 'med', t: '생리적 황달 시작 (정상)', s: '3~5일 정점, 1~2주 내 소실. 손발바닥까지 내려오거나 24시간 내 발현이면 진료', href: 'part1.html#j' },
    { d: 14,  cat: 'med', t: '황달 2주 기준', s: '2주를 넘겨 지속되거나 다시 짙어지면 진료', href: 'part1.html#j' },
    { d: [14, 35], cat: 'med', t: '영유아 건강검진 1차 — 받을 수 있는 기간 ⚠️', s: '이 3주 안에만 무료. 지나면 해당 회차 무료 혜택 소멸. 소아과 첫 방문 겸', href: 'part3.html#c' },
    { d: 28,  cat: 'med', t: 'BCG 접종 마감 (4주 이내)', s: '피내용은 지정기관 예약 필요', href: 'part3.html#a' },
    { d: 30,  cat: 'med', t: 'B형간염 2차 (1개월)', s: '', href: 'part3.html#a' },
    { d: [42, 105], cat: 'med', t: '로타바이러스 1차 — 이 기간 안에 시작해야 ⚠️', s: '생후 6주~15주 0일. 놓치면 아예 못 맞음', href: 'part3.html#a' },
    { d: 56,  cat: 'med', t: '2개월 접종 세트', s: 'DTaP·IPV·Hib·PCV·로타 1차. 미루지 않기', href: 'part3.html#a' },
    { d: 120, cat: 'med', t: '4개월 접종 (2차)', s: '', href: 'part3.html#a' },
    { d: [120, 180], cat: 'med', t: '영유아 건강검진 2차 (4~6개월)', s: '', href: 'part3.html#c' },
    { d: 180, cat: 'med', t: '6개월 접종 세트 · 인플루엔자 시작 가능', s: 'DTaP·Hib·PCV 3차, B형간염 3차. 독감은 첫 해 4주 간격 2회', href: 'part3.html#a' },
    { d: 240, cat: 'med', t: '로타바이러스 전체 완료 마감 (8개월 0일)', s: '', href: 'part3.html#a' },
    { d: [270, 365], cat: 'med', t: '영유아 건강검진 3차 (9~12개월)', s: '', href: 'part3.html#c' },
    { d: 365, cat: 'med', t: '12개월 접종 (MMR·수두·일본뇌염·A형간염 등)', s: '12~15개월', href: 'part3.html#a' },

    /* ---- 산모 회복 (part4) ---- */
    { d: [0, 3], cat: 'mom', t: '적색오로 · 훗배앓이 · 상처 통증 최고조', s: '조기 산후출혈·혈압 상승 감시 구간', href: 'part4.html#t' },
    { d: [3, 5], cat: 'mom', t: '젖 도는 시기 — 울혈 · 베이비블루스 시작', s: '수유 전 온찜질, 후 냉찜질. 눈물이 잦은 건 정상', href: 'part4.html#b' },
    { d: 10,  cat: 'mom', t: '오로가 갈색→백색으로', s: '방향이 중요. 다시 선홍색으로 늘면 신호', href: 'part4.html#a' },
    { d: 14,  cat: 'mom', t: '베이비블루스 2주 기준 · 산후정신증 위험 구간 종료', s: '2주 넘게 가라앉아 있으면 산후우울증 — 치료 대상', href: 'part4.html#c' },
    { d: [28, 84], cat: 'mom', t: '임신성 당뇨였다면 후속 당부하검사 받는 기간 (4~12주)', s: '가장 많이 누락되는 항목', href: 'part4.html#d' },
    { d: 42,  cat: 'mom', t: '산후 6주 검진 · 혈전·전자간증 위험 구간 종료', s: '오로 종료, 6주 금지사항 해제, 우울 선별, 피임 상담', href: 'part4.html#d' },
    { d: 84,  cat: 'mom', t: '후기 산후출혈 구간 종료 (12주) · 요실금 3개월 기준', s: '요실금이 남아 있으면 골반저 재활 상담', href: 'part4.html#t' },
    { d: 100, cat: 'mom', t: '산후 탈모 시작 (3~4개월)', s: '6~12개월에 회복', href: 'part4.html#t' },
    { d: 365, cat: 'mom', t: '산후우울증 발병 가능 기간 (1년)', s: '몸이 회복된 뒤에 오는 경우가 많음', href: 'part4.html#t' },

    /* ---- 먹-놀-잠 (rhythm, part1, part2) ---- */
    { d: 14,  cat: 'rhythm', t: '출생 체중 회복 목표 (2주)', s: '회복하면 밤에 깨워 먹이지 않아도 됨', href: 'rhythm.html#b' },
    { d: [14, 21], cat: 'rhythm', t: '급성장기 (2~3주)', s: '갑자기 자주 먹으려 듦. 젖 부족 아님', href: 'rhythm.html#b' },
    { d: 21,  cat: 'rhythm', t: '공갈젖꼭지 도입 가능 (모유수유 정착 시)', s: '3~4주 이후', href: 'rhythm.html#c' },
    { d: 30,  cat: 'rhythm', t: '1~2개월 카드로 — 각성 1~1.5시간', s: '밤낮 구분 신호 주기', href: 'rhythm.html#c' },
    { d: 35,  cat: 'rhythm', t: '원더윅스 5주 (근거 제한)', s: '출산 예정일 기준 주차. 달력으로 삼지 말 것', href: 'rhythm.html#k' },
    { d: 42,  cat: 'rhythm', t: '급성장기 6주 · 울음 정점 6~8주 · 수면 의식 시작', s: '달래도 안 그치는 게 정상. 흔들린 아기 증후군 최대 위험 구간', href: 'part2.html#e' },
    { d: 56,  cat: 'rhythm', t: '원더윅스 8주', s: '', href: 'rhythm.html#k' },
    { d: 60,  cat: 'rhythm', t: '2~4개월 카드로 — 각성 1.5~2시간', s: '수면 의식 정착, 속싸개 중단 준비', href: 'rhythm.html#d' },
    { d: 84,  cat: 'rhythm', t: '원더윅스 12주 · 급성장기 3개월', s: '', href: 'rhythm.html#k' },
    { d: [60, 120], cat: 'rhythm', t: '속싸개 중단 시점 — 뒤집기 조짐 관찰', s: '조짐이 보이면 그날로 중단. 한 팔 → 두 팔', href: 'part1.html#h' },
    { d: 120, cat: 'rhythm', t: '4개월 수면 퇴행 시작 · 수면 교육 가능 · 4~6개월 카드', s: '수면 구조가 성인형으로 바뀌는 영구적 변화. 2~6주', href: 'rhythm.html#k' },
    { d: 133, cat: 'rhythm', t: '원더윅스 19주', s: '4개월 퇴행과 겹쳐 특히 힘든 구간', href: 'rhythm.html#k' },
    { d: 180, cat: 'rhythm', t: '이유식 시작 (만 6개월 전후) · 6~9개월 카드', s: '목 가누기·앉기·혀 내밀기 반사 소실·음식에 관심', href: 'rhythm.html#f' },
    { d: 182, cat: 'rhythm', t: '원더윅스 26주 · 분리불안 시작', s: '', href: 'rhythm.html#k' },
    { d: [240, 300], cat: 'rhythm', t: '8~10개월 수면 퇴행', s: '기기·잡고 서기. 2~4주', href: 'rhythm.html#k' },
    { d: 259, cat: 'rhythm', t: '원더윅스 37주 · 낯가림', s: '', href: 'rhythm.html#k' },
    { d: 270, cat: 'rhythm', t: '9~12개월 카드로 — 낮잠 2회', s: '', href: 'rhythm.html#g' },
    { d: 322, cat: 'rhythm', t: '원더윅스 46주', s: '', href: 'rhythm.html#k' },
    { d: 365, cat: 'rhythm', t: '돌 — 12개월 퇴행 · 생우유 가능', s: '', href: 'rhythm.html#g' }
  ];

  /* 먹놀잠 현재 구간 (아무 날이나 눌러도 패널 위에 표시) */
  var PHASES = [
    { from: 0,   to: 30,  t: '0~1개월',  s: '수유 8~12회 · 각성 45~60분 · 낮잠 4~6회 · 체중 회복 전엔 밤에도 깨워서', href: 'rhythm.html#b' },
    { from: 30,  to: 60,  t: '1~2개월',  s: '수유 7~9회 · 각성 1~1.5시간 · 낮잠 4~5회 · 밤낮 구분 신호', href: 'rhythm.html#c' },
    { from: 60,  to: 120, t: '2~4개월',  s: '수유 6~8회 · 각성 1.5~2시간 · 낮잠 3~4회 · 수면 의식 정착', href: 'rhythm.html#d' },
    { from: 120, to: 180, t: '4~6개월',  s: '수유 5~6회 · 각성 2~2.5시간 · 낮잠 3회 · 수면 교육 가능', href: 'rhythm.html#e' },
    { from: 180, to: 270, t: '6~9개월',  s: '수유 4~5회 + 이유식 1~2회 · 각성 2.5~3시간 · 낮잠 2~3회', href: 'rhythm.html#f' },
    { from: 270, to: 366, t: '9~12개월', s: '수유 3~4회 + 이유식 3회 · 각성 3~4시간 · 낮잠 2회', href: 'rhythm.html#g' }
  ];

  /* ---------- 상태 ---------- */
  var DDAY = '2026-10-06';  // 수술 예정일 — 모든 방문자에게 동일하게 고정
  var dday = null;          // Date (로컬 자정)
  var view = new Date();    // 보고 있는 달
  view.setDate(1);
  var selected = null;      // 선택된 날짜 (Date)

  var $ = function (s) { return document.querySelector(s); };
  var el = {
    status: $('#dday-status'),
    title: $('#cal-title'), grid: $('#cal-grid'), panel: $('#day-panel'),
    prev: $('#cal-prev'), next: $('#cal-next'), today: $('#cal-today'), goD: $('#cal-dday'),
    legend: $('#cal-legend')
  };

  function toDate(str) { var p = str.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function toStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function diffDays(a, b) { return Math.round((a - b) / 86400000); }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function dLabel(n) { return n === 0 ? 'D-day' : (n > 0 ? 'D+' + n : 'D' + n); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function isRange(e) { return Array.isArray(e.d) && e.d[1] > e.d[0]; }

  function eventsOn(off) {
    var points = [], ranges = [];
    EVENTS.forEach(function (e) {
      if (isRange(e)) { if (off >= e.d[0] && off <= e.d[1]) ranges.push(e); }
      else if (e.d === off) points.push(e);
    });
    return { points: points, ranges: ranges };
  }
  function phaseOf(off) {
    for (var i = 0; i < PHASES.length; i++) if (off >= PHASES[i].from && off < PHASES[i].to) return PHASES[i];
    return null;
  }

  /* ---------- 렌더 ---------- */
  function renderLegend() {
    el.legend.innerHTML = Object.keys(CATS).map(function (k) {
      return '<span><i style="background:' + CATS[k].color + '"></i>' + CATS[k].label + '</span>';
    }).join('');
  }

  function renderCalendar() {
    var y = view.getFullYear(), m = view.getMonth();
    el.title.textContent = y + '년 ' + (m + 1) + '월';
    var first = new Date(y, m, 1), startDow = first.getDay();
    var days = new Date(y, m + 1, 0).getDate();
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var html = '';
    ['일', '월', '화', '수', '목', '금', '토'].forEach(function (w, i) {
      html += '<div class="dow' + (i === 0 ? ' sun' : i === 6 ? ' sat' : '') + '">' + w + '</div>';
    });
    for (var i = 0; i < startDow; i++) html += '<div class="cell empty"></div>';
    for (var d = 1; d <= days; d++) {
      var date = new Date(y, m, d), off = dday ? diffDays(date, dday) : null;
      var cls = 'cell';
      if (date.getDay() === 0) cls += ' sun'; if (date.getDay() === 6) cls += ' sat';
      if (sameDay(date, today)) cls += ' today';
      if (dday && off === 0) cls += ' dday';
      if (selected && sameDay(date, selected)) cls += ' selected';
      var dots = '', bands = '', badge = '';
      if (dday) {
        var ev = eventsOn(off);
        var seen = {};
        ev.points.forEach(function (e) { if (!seen[e.cat]) { seen[e.cat] = 1; dots += '<i style="background:' + CATS[e.cat].color + '"></i>'; } });
        var seenR = {};
        ev.ranges.forEach(function (e) { if (!seenR[e.cat]) { seenR[e.cat] = 1; bands += '<b style="background:' + CATS[e.cat].color + '"></b>'; } });
        if (off >= -45 && off <= 400) badge = '<span class="dd">' + dLabel(off) + '</span>';
        if (ev.points.length || ev.ranges.length) cls += ' has';
      }
      html += '<div class="' + cls + '" data-date="' + toStr(date) + '"><span class="n">' + d + '</span>' + badge +
              '<span class="dots">' + dots + '</span><span class="bands">' + bands + '</span></div>';
    }
    el.grid.innerHTML = html;
  }

  function renderPanel() {
    if (!dday) {
      el.panel.innerHTML = '<div class="box info"><span class="label">먼저 날짜를 입력하세요</span><p>위에 <strong>수술일 또는 출산 예정일</strong>을 넣고 저장하면 그 날을 D-day로 모든 일정이 달력에 표시됩니다.</p></div>';
      return;
    }
    if (!selected) {
      el.panel.innerHTML = '<div class="box info"><span class="label">날짜를 누르세요</span><p>점이 찍힌 날을 누르면 그날 할 일과 진행 중인 기간, 지금 먹-놀-잠 구간이 여기 나옵니다.</p></div>';
      return;
    }
    var off = diffDays(selected, dday), ev = eventsOn(off), ph = phaseOf(off);
    var h = '<div class="panel-head"><span class="dd-big">' + dLabel(off) + '</span><span class="date">' +
            selected.getFullYear() + '년 ' + (selected.getMonth() + 1) + '월 ' + selected.getDate() + '일</span></div>';
    if (ph) {
      h += '<div class="phase"><span class="k" style="color:' + CATS.rhythm.color + '">지금 구간 · ' + esc(ph.t) + '</span><p>' + esc(ph.s) +
           ' <a href="' + ph.href + '">카드 보기 →</a></p></div>';
    }
    h += '<h3>이 날</h3>';
    h += ev.points.length ? list(ev.points) : '<p class="none">특별한 일정이 없는 날입니다.</p>';
    if (ev.ranges.length) { h += '<h3>진행 중인 기간</h3>' + list(ev.ranges, off); }
    el.panel.innerHTML = h;
  }

  function list(arr, off) {
    return '<ul class="ev">' + arr.map(function (e) {
      var when = isRange(e) ? '<span class="when">' + dLabel(e.d[0]) + ' ~ ' + dLabel(e.d[1]) +
                 (off != null ? ' · ' + (e.d[1] - off) + '일 남음' : '') + '</span>' : '';
      return '<li><i style="background:' + CATS[e.cat].color + '"></i><div><span class="cat">' + CATS[e.cat].label + '</span>' + when +
             '<strong>' + esc(e.t) + '</strong>' + (e.s ? '<p>' + esc(e.s) + '</p>' : '') +
             '<a href="' + e.href + '">자세히 →</a></div></li>';
    }).join('') + '</ul>';
  }

  function renderStatus() {
    if (dday) {
      var off = diffDays(new Date(new Date().setHours(0, 0, 0, 0)), dday);
      el.status.innerHTML = '수술 예정일 <strong>' + (dday.getMonth() + 1) + '월 ' + dday.getDate() + '일</strong> · 오늘은 <strong>' + dLabel(off) + '</strong>';
    }
  }

  function renderAll() { renderStatus(); renderCalendar(); renderPanel(); }

  /* ---------- 이벤트 ---------- */
  el.prev.addEventListener('click', function () { view.setMonth(view.getMonth() - 1); renderCalendar(); });
  el.next.addEventListener('click', function () { view.setMonth(view.getMonth() + 1); renderCalendar(); });
  el.today.addEventListener('click', function () {
    var t = new Date(); t.setHours(0, 0, 0, 0); view = new Date(t); view.setDate(1); selected = t; renderCalendar(); renderPanel();
  });
  el.goD.addEventListener('click', function () {
    if (!dday) return; view = new Date(dday); view.setDate(1); selected = new Date(dday); renderCalendar(); renderPanel();
  });
  el.grid.addEventListener('click', function (e) {
    var c = e.target.closest('.cell'); if (!c || c.classList.contains('empty')) return;
    selected = toDate(c.getAttribute('data-date')); renderCalendar(); renderPanel();
    if (window.innerWidth < 900) el.panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- 시작 ---------- */
  dday = toDate(DDAY);
  if (dday) { var t0 = new Date(); t0.setHours(0, 0, 0, 0); var o = diffDays(t0, dday); selected = t0; view = new Date(o < -45 ? dday : t0); view.setDate(1); }
  renderLegend();
  renderAll();
})();
