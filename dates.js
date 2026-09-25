/* 본문의 "생후 N주 / N개월 / D+N / N일차"를 실제 달력 주차로 바꿔 옆에 붙인다.
   기준일(D-day)은 여기 한 곳. calendar.js도 이 값을 읽는다.
   표기: "26년 10월 3주차" — 그 달 달력에서 몇 번째 줄(일요일 시작)인지. */
(function () {
  'use strict';
  var DDAY = window.NCG_DDAY = '2026-10-06';

  var p = DDAY.split('-'), base = new Date(+p[0], +p[1] - 1, +p[2]);

  function addDays(n) { var d = new Date(base); d.setDate(d.getDate() + n); return d; }
  function addMonths(n) { var d = new Date(base); d.setMonth(d.getMonth() + n); return d; }
  function weekOf(d) {
    var firstDow = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return { y: d.getFullYear() % 100, m: d.getMonth() + 1, w: Math.ceil((d.getDate() + firstDow) / 7) };
  }
  function fmt(a) { return a.y + '년 ' + a.m + '월 ' + a.w + '주차'; }
  function label(d1, d2) {
    var a = weekOf(d1);
    if (!d2) return fmt(a);
    var b = weekOf(d2);
    if (a.y === b.y && a.m === b.m && a.w === b.w) return fmt(a);
    if (a.y === b.y && a.m === b.m) return fmt(a) + '~' + b.w + '주차';
    if (a.y === b.y) return fmt(a) + '~' + b.m + '월 ' + b.w + '주차';
    return fmt(a) + '~' + fmt(b);
  }

  /* 순서대로: D+N(~D+M) | 생후 N(~M)일 | N(~M)일차 | N(~M)주 | N(~M)개월
     제외: 임신 주수, "주 2회"(숫자가 뒤), 기간 표현(간격·마다·동안·씩·간·뿐·넘게·갑니다·걸리·지속), 1주일 */
  var re;
  try {
    re = new RegExp(
      '(D([+\\-])(\\d+)(?:\\s*~\\s*D?[+\\-]?(\\d+))?)' +
      '|((?:생후|출생 후|출생일로부터|출산 후|산후)\\s*(\\d+)(?:\\s*~\\s*(\\d+))?\\s*일(?!차|\\s*(?:간격|마다|동안|씩)))' +
      '|((\\d+)(?:\\s*~\\s*(\\d+))?일차)' +
      '|((\\d+)(?:\\s*~\\s*(\\d+))?\\s*주(?!일|간|째|차|기|\\s*(?:간격|마다|씩|동안|뿐|밖에|넘게|갑니다|걸리|지속|이상\\s*(?:우|지속|아프))))' +
      '|((\\d+)(?:\\s*~\\s*(\\d+))?\\s*개월(?!\\s*(?:간격|마다|씩|동안|간(?!격)|뿐|넘게|갑니다|걸리|지속)))',
      'g');
  } catch (e) { return; }

  var PREV_BLOCK = /(임신|재태|주수|예정일|매|하루|1일|주\s*$)/;

  function convert(text) {
    var out = [], last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(text))) {
      var before = text.slice(Math.max(0, m.index - 6), m.index);
      var d1 = null, d2 = null;
      if (m[1]) {                                   // D+N
        var s = m[2] === '-' ? -1 : 1; d1 = addDays(s * +m[3]); if (m[4]) d2 = addDays(+m[4]);
      } else if (m[5]) {                            // 생후 N일
        d1 = addDays(+m[6]); if (m[7]) d2 = addDays(+m[7]);
      } else if (m[8]) {                            // N일차
        d1 = addDays(+m[9]); if (m[10]) d2 = addDays(+m[10]);
      } else if (m[11]) {                           // N주
        if (PREV_BLOCK.test(before)) continue;
        d1 = addDays(7 * +m[12]); if (m[13]) d2 = addDays(7 * +m[13]);
      } else if (m[14]) {                           // N개월
        if (PREV_BLOCK.test(before)) continue;
        d1 = addMonths(+m[15]); if (m[16]) d2 = addMonths(+m[16]);
      }
      if (!d1) continue;
      out.push(text.slice(last, m.index + m[0].length));
      out.push({ dt: label(d1, d2) });
      last = m.index + m[0].length;
    }
    if (!out.length) return null;
    out.push(text.slice(last));
    return out;
  }

  function skip(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentNode) {
      var t = n.tagName;
      if (t === 'SCRIPT' || t === 'STYLE' || t === 'NAV' || t === 'TITLE') return true;
      if (n.classList && (n.classList.contains('dt') || n.classList.contains('jump') || n.classList.contains('cal-grid') || n.classList.contains('day-panel') || n.classList.contains('cal-setup'))) return true;
    }
    return false;
  }

  function run() {
    var root = document.querySelector('main') || document.body;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [], n;
    while ((n = walker.nextNode())) if (/\d/.test(n.nodeValue) && !skip(n.parentNode)) nodes.push(n);
    nodes.forEach(function (node) {
      var parts = convert(node.nodeValue);
      if (!parts) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (x) {
        if (typeof x === 'string') { if (x) frag.appendChild(document.createTextNode(x)); }
        else { var s = document.createElement('span'); s.className = 'dt'; s.textContent = x.dt; frag.appendChild(s); }
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  if (typeof document !== 'undefined' && document.querySelector) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  }
  window.NCG_convertDates = convert; // 테스트용
})();
