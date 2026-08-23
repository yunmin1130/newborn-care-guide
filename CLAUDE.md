# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 응답 규칙

**항상 한국어 반말로 답한다.** "~합니다", "~하세요" 같은 존댓말 대신 "~해", "~야", "~지", "~네"를 쓴다. 코드·명령어·식별자 등 번역하면 안 되는 것만 원문 유지. (사이트 *본문* 은 예외 — 독자 대상 글이라 존댓말 서술체를 유지한다.)

## 프로젝트 성격

**초보 엄마 아빠를 위한 GitHub Pages 사이트.** 개발자가 아닌 사람이 휴대폰으로 급할 때 열어보는 게 주 사용 상황이다. 한국어 신생아 돌봄 가이드.

빌드 도구·패키지 매니저·테스트·의존성이 **전혀 없다**. 순수 HTML + CSS 1개 + JS 1개 — GitHub Pages가 리포 루트를 그대로 서빙하면 끝나는 구조다.

- 미리보기: 파일을 브라우저로 직접 열거나 `python -m http.server 8000` 후 `http://localhost:8000/`
- 빌드/린트/테스트 명령 없음. 새로 도입하지 말 것 — 이 구조가 의도된 것이다.

### GitHub Pages 제약

- 모든 링크는 **상대 경로**를 쓴다(`part1.html`, `style.css`). 루트 절대경로(`/style.css`)는 `user.github.io/repo-name/` 형태로 배포될 때 깨진다.
- 서버 사이드 로직·빌드 스텝을 전제하는 코드를 넣지 않는다. 정적 파일만.
- 외부 CDN 의존을 늘리지 않는다. 폰트도 `--sans` 폴백 스택으로 처리하고 있다.
- 모바일 우선으로 확인한다. `nav.toc`는 1180px 미만에서 가로 목차로 바뀌고, 표는 `.table-scroll`로 가로 스크롤된다.

## 파일 구조와 역할

- `index.html` — 홈. 파트 카드 5장 + "가장 먼저 외울 것" 박스 + D-day 타임라인 표
- `part1.html` ~ `part5.html` — 본문 파트. part1~3은 내용 완료, part4~5는 스텁(뼈대만)
- `style.css` — 전체 스타일 단일 파일. 컴포넌트 클래스 전부 여기 정의
- `nav.js` — 사이드바 목차 스크롤 스파이. `main section[id]`와 `nav.toc a.item[href="#id"]`을 매칭해 `.active` 토글

## 페이지 골격 (파트 페이지 공통)

새 파트를 만들거나 스텁을 채울 때 이 순서와 클래스를 그대로 따른다. `part4.html`이 가장 짧은 참고 템플릿이다.

```
<body class="pN">          ← N=1~5. 테마 색이 여기서 결정됨
  <nav class="toc">        ← 홈 링크 + .toc-title + .item 목록 + .parts(파트 간 이동)
  <header class="page-head">  ← .part-badge / h1 / .subtitle / .lede
  <main class="wrap">
    <section id="a">       ← id는 a,b,c… 순서. nav의 href="#a"와 1:1
      <div class="sec-head"><span class="sec-num">a</span><h2>…</h2></div>
      <p class="sec-sub">…</p>
      … 본문 블록 …
    <div class="pager">    ← 이전/다음 파트
  <footer>
  <script src="nav.js"></script>
```

주의: `nav.toc .parts` 안의 링크는 모든 파트 페이지에 중복 존재한다. 현재 페이지는 `class="here"`, 미완성 파트는 `class="todo"`. 파트를 완성하면 **5개 파일 전부**에서 해당 `todo`를 떼야 한다. 홈 카드의 `.flag`("준비 중" → "완료")와 `.card.ready` 클래스도 같이 갱신한다.

## 콘텐츠 서술 규칙

각 섹션은 **원리 → 실행 → 흔한 실수 → 병원 신호** 흐름으로 쓴다. 이 흐름이 곧 박스 클래스에 대응한다:

| 클래스 | 아이콘 | 용도 |
|---|---|---|
| `.box.why` | 💡 | 원리 — 왜 그렇게 하는지 |
| `.box.do` | ✅ | 실행 — 이렇게 한다 |
| `.box.miss` | ⚠️ | 흔한 실수 |
| `.box.stop` | 🚫 | 하지 말 것 |
| `.box.info` | 📌 | 참고·타 파트 교차 링크 |
| `.box.critical` | ❗ | 생명 관련 경고. 안에 `.big`으로 한 줄 요약 |
| `.hospital` | 🏥 | "이럴 때 병원" 목록 |

각 박스는 `<span class="label">텍스트</span>`로 시작한다(아이콘은 CSS `::before`가 붙임). 그 외 블록: `.plain`(무채색 카드), `ol.steps`(번호 절차), `.flow`(단계 흐름, 마지막 칸은 `span.last`), `.refs`(출처 링크, `.rlabel` 라벨 먼저), `.todo-list`+`.stub-note`(미작성 파트용).

표는 반드시 `<div class="table-scroll">`으로 감싼다. 셀 클래스: `.wrapok`(줄바꿈 허용), `.bad`(위험/기한 강조), `.good`.

## 테마 색

`style.css` `:root`에 sky/mint/rose/lilac/apricot 5색 팔레트가 `--{색}`, `--{색}-bg`, `--{색}-2`, `--{색}-dk` 4단으로 정의돼 있다. `body.p1`~`body.p5`가 그중 하나를 `--theme*`에 매핑한다(1 sky · 2 mint · 3 rose · 4 lilac · 5 apricot). 홈 카드는 예외적으로 인라인 `style="--c:…;--cbg:…;--cdk:…"`로 색을 직접 준다 — 파트 색을 바꾸면 홈 카드 인라인 값도 맞춰야 한다.

색상 값을 하드코딩하지 말고 변수를 쓴다. 다만 `.box.critical` 계열의 `#c33a50` 등 일부 강조색은 의도적으로 리터럴이다.

## 톤

의료 정보를 다루므로 단정적 표현과 수치(예: "38.0℃ 이상", "생후 3개월 미만")는 임의로 바꾸지 않는다. 새 의학 정보를 추가할 때는 `.refs`에 출처를 함께 넣는다. 본문은 존댓말 서술체.
