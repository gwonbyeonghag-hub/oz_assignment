/* =========================================================
   app.js — OZ 코딩스쿨 JavaScript 3일차 과제
   Binance 24hr 티커로 만드는 실시간 암호화폐(USDT 페어) 추적기

   기능
     1) 매초 폴링(재귀 setTimeout) → USDT 페어만 필터
     2) 검색 (전체 USDT 대상)
     3) 즐겨찾기 (localStorage 영속)
     4) 전체보기 / 관심항목 탭
     5) 행 캐싱(Map) + in-place 갱신으로 깜빡임 없는 렌더링
   ========================================================= */

const PRIMARY_URL = 'https://api4.binance.com/api/v3/ticker/24hr';
const FALLBACK_URL = 'https://data-api.binance.vision/api/v3/ticker/24hr';
const RENDER_LIMIT = 150; // 검색어 없는 '전체보기' 탭에서만 적용 (성능)
const EMPTY_KEY = '__empty__';

/* ---------------------------------------------------------
   상태값
   --------------------------------------------------------- */
let tickers = []; // 최근 응답(USDT만)
let favorites = new Set(JSON.parse(localStorage.getItem('favorites') || '[]'));
let currentTab = 'all'; // 'all' | 'favorites'
let keyword = ''; // 검색어(소문자)
let useFallback = false; // primary 실패 시 폴백 엔드포인트로 전환

const rowMap = new Map(); // symbol -> <tr> (행 재생성 방지, in-place 갱신용)

/* ---------------------------------------------------------
   DOM 참조
   --------------------------------------------------------- */
const coinList = document.querySelector('#coin-list');
const searchInput = document.querySelector('#search');
const tabButtons = document.querySelectorAll('.tab');

/* ---------------------------------------------------------
   데이터 폴링 (매초, 재귀 setTimeout으로 요청 겹침 방지)
   --------------------------------------------------------- */
async function fetchTickers() {
  const url = useFallback ? FALLBACK_URL : PRIMARY_URL;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    tickers = data.filter((item) => item.symbol.endsWith('USDT'));
    render();
  } catch (error) {
    // 네트워크 오류는 무시하고 폴링을 계속한다. primary 실패 시 폴백으로 전환.
    console.error('가격 조회 실패:', error);
    if (!useFallback) useFallback = true;
  }
}

async function loop() {
  try {
    await fetchTickers();
  } finally {
    setTimeout(loop, 1000);
  }
}

/* ---------------------------------------------------------
   가격 / 변동률 포맷팅
   --------------------------------------------------------- */
function formatPrice(priceStr) {
  const n = parseFloat(priceStr);
  if (!Number.isFinite(n)) return priceStr;

  if (n >= 1) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  // 1 미만 (예 0.00001234 같은 SHIB류)은 유효자리가 드러나도록 소수 8자리까지 표시 후 끝자리 0 정리
  let s = n.toFixed(8).replace(/0+$/, '');
  if (s.endsWith('.')) s += '0';
  return s;
}

function formatChangePercent(pctStr) {
  const n = parseFloat(pctStr);
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

/* ---------------------------------------------------------
   즐겨찾기
   --------------------------------------------------------- */
function toggleFavorite(symbol) {
  if (favorites.has(symbol)) {
    favorites.delete(symbol);
  } else {
    favorites.add(symbol);
  }
  localStorage.setItem('favorites', JSON.stringify([...favorites]));
  render();
}

/* ---------------------------------------------------------
   화면에 보일 목록 계산
   (탭 필터: all=전체 / favorites=즐겨찾기만) AND (검색: keyword 포함)
   --------------------------------------------------------- */
function getVisibleList() {
  let list = tickers;

  if (currentTab === 'favorites') {
    list = list.filter((item) => favorites.has(item.symbol));
  }
  if (keyword) {
    list = list.filter((item) => item.symbol.toLowerCase().includes(keyword));
  }

  list = [...list].sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));

  // 검색어가 없는 '전체보기'일 때만 상위 N개로 제한 (검색은 항상 USDT 전체 대상)
  if (currentTab === 'all' && !keyword) {
    list = list.slice(0, RENDER_LIMIT);
  }
  return list;
}

/* ---------------------------------------------------------
   행 생성 / 갱신 (Map 캐싱으로 첫 렌더에만 DOM 생성)
   --------------------------------------------------------- */
function buildRow(symbol) {
  const tr = document.createElement('tr');

  const starTd = document.createElement('td');
  starTd.className = 'col-star';
  const starBtn = document.createElement('button');
  starBtn.className = 'star-btn';
  starBtn.type = 'button';
  starBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleFavorite(symbol);
  });
  starTd.appendChild(starBtn);

  const symbolTd = document.createElement('td');
  symbolTd.className = 'symbol-cell';
  symbolTd.textContent = symbol;

  const priceTd = document.createElement('td');
  priceTd.className = 'price-cell';

  const changeTd = document.createElement('td');
  changeTd.className = 'change-cell';

  tr.appendChild(starTd);
  tr.appendChild(symbolTd);
  tr.appendChild(priceTd);
  tr.appendChild(changeTd);

  tr._starBtn = starBtn;
  tr._priceTd = priceTd;
  tr._changeTd = changeTd;
  return tr;
}

function updateRow(tr, item) {
  tr._starBtn.textContent = favorites.has(item.symbol) ? '★' : '☆';
  tr._starBtn.classList.toggle('on', favorites.has(item.symbol));

  tr._priceTd.textContent = formatPrice(item.lastPrice);

  const pct = parseFloat(item.priceChangePercent);
  tr._changeTd.textContent = formatChangePercent(item.priceChangePercent);
  tr._changeTd.classList.toggle('positive', pct >= 0);
  tr._changeTd.classList.toggle('negative', pct < 0);
}

function showEmptyMessage() {
  let tr = rowMap.get(EMPTY_KEY);
  if (!tr) {
    tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.className = 'empty-message';
    td.textContent = '관심 코인이 없습니다';
    tr.appendChild(td);
    rowMap.set(EMPTY_KEY, tr);
  }
  coinList.appendChild(tr);
}

/* ---------------------------------------------------------
   렌더링 (전체 innerHTML 교체 없이 in-place 갱신)
   --------------------------------------------------------- */
function render() {
  const list = getVisibleList();
  const seen = new Set();

  // 이번 렌더에 보이지 않는 기존 행은 DOM에서 떼어낸다 (empty 행 포함, 아래서 필요시 재부착)
  rowMap.forEach((tr, key) => {
    if (!seen.has(key) && tr.parentNode === coinList && !list.some((item) => item.symbol === key)) {
      coinList.removeChild(tr);
    }
  });

  list.forEach((item) => {
    let tr = rowMap.get(item.symbol);
    if (!tr) {
      tr = buildRow(item.symbol);
      rowMap.set(item.symbol, tr);
    }
    updateRow(tr, item);
    seen.add(item.symbol);
    coinList.appendChild(tr); // 이미 붙어있어도 appendChild는 끝으로 재배치 -> 정렬 순서 반영
  });

  if (currentTab === 'favorites' && list.length === 0) {
    showEmptyMessage();
  } else {
    const emptyTr = rowMap.get(EMPTY_KEY);
    if (emptyTr && emptyTr.parentNode === coinList) coinList.removeChild(emptyTr);
  }
}

/* ---------------------------------------------------------
   이벤트 배선
   --------------------------------------------------------- */
searchInput.addEventListener('input', () => {
  keyword = searchInput.value.trim().toLowerCase();
  render();
});

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentTab = btn.dataset.tab;
    tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

/* ---------------------------------------------------------
   시작: 즉시 1회 호출 후 매초 재귀 폴링
   --------------------------------------------------------- */
loop();
