/* 현재 읽고 있는 섹션을 사이드바 목차에서 하이라이트 */
(function () {
  var links = {};
  document.querySelectorAll('nav.toc a.item').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });

  var sections = document.querySelectorAll('main section[id]');
  if (!sections.length) return;

  var current = null;

  function setActive(id) {
    if (id === current) return;
    current = id;
    for (var k in links) links[k].classList.toggle('active', k === id);

    // 좁은 화면(가로 목차)에서는 활성 항목이 보이도록 스크롤
    if (window.innerWidth < 1180 && links[id]) {
      links[id].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }

  function update() {
    var best = null, bestTop = -Infinity;
    var line = window.innerHeight * 0.3; // 화면 상단 30% 지점 기준

    sections.forEach(function (sec) {
      var top = sec.getBoundingClientRect().top;
      if (top <= line && top > bestTop) { bestTop = top; best = sec.id; }
    });

    setActive(best || sections[0].id);
  }

  update();
  window.addEventListener('scroll', function () {
    window.requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
})();
