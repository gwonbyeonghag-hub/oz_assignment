/* =========================================================
   calculator.js — OZ 코딩스쿨 JavaScript 2일차 과제
   querySelector + addEventListener 로 배선하는 사칙연산 계산기

   학습 목표
     1) 인라인 onclick 대신 addEventListener 로 이벤트 연결
     2) querySelector / querySelectorAll 로 DOM 요소 선택
     3) 우선순위(* , / 먼저) 계산은 day1의 calculate() 재사용 (eval 미사용)
   ========================================================= */

/* ---------------------------------------------------------
   [계산 엔진] day1 calculator.js 의 tokenize / validate / calculate 복사
   문자열 수식을 직접 파싱해 우선순위(* , /)를 먼저 계산한다. (eval 회피)
   --------------------------------------------------------- */

/* 1) 문자열 수식을 토큰(숫자 / 연산자)으로 분리한다 */
function tokenize(expression) {
  const tokens = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i];

    // 공백은 건너뜀 → "3+4" 와 "3 + 4" 를 모두 처리
    if (ch === ' ') {
      i++;
      continue;
    }

    // 연산자 자리
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      const prev = tokens[tokens.length - 1];

      // 맨 앞이거나 직전이 연산자이면 → 음수/양수 '부호'로 해석 (예: -5, 3 * -2)
      const isSign =
        (ch === '+' || ch === '-') &&
        (tokens.length === 0 || typeof prev === 'string');

      if (isSign) {
        let num = ch;
        i++;
        while (i < expression.length && /[0-9.]/.test(expression[i])) {
          num += expression[i];
          i++;
        }
        tokens.push(parseFloat(num));
      } else {
        tokens.push(ch);
        i++;
      }
      continue;
    }

    // 숫자 자리 (소수점 포함)
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < expression.length && /[0-9.]/.test(expression[i])) {
        num += expression[i];
        i++;
      }
      tokens.push(parseFloat(num));
      continue;
    }

    throw new Error(`계산할 수 없는 문자가 있습니다: "${ch}"`);
  }

  return tokens;
}

/* 2) 토큰이 [숫자, 연산자, 숫자, 연산자, ...] 형태인지 검증한다 */
function validate(tokens) {
  if (tokens.length === 0) {
    throw new Error('빈 수식입니다.');
  }
  if (tokens.length % 2 === 0) {
    throw new Error('수식 형식이 올바르지 않습니다.');
  }
  for (let i = 0; i < tokens.length; i++) {
    const isNumberSpot = i % 2 === 0; // 짝수 자리=숫자, 홀수 자리=연산자
    const isNumber = typeof tokens[i] === 'number';
    if (isNumberSpot !== isNumber || (isNumber && Number.isNaN(tokens[i]))) {
      throw new Error('수식 형식이 올바르지 않습니다.');
    }
  }
}

/* 3) 실제 계산: 우선순위(* , /)를 먼저 처리한 뒤 (+ , -)를 처리한다 */
function calculate(expression) {
  const tokens = tokenize(String(expression));
  validate(tokens);

  // (1단계) * 와 / 를 먼저 계산해서 하나의 숫자로 접는다
  const reduced = [tokens[0]];
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const number = tokens[i + 1];

    if (operator === '*') {
      reduced.push(reduced.pop() * number);
    } else if (operator === '/') {
      if (number === 0) {
        throw new Error('0으로 나눌 수 없습니다.');
      }
      reduced.push(reduced.pop() / number);
    } else {
      // + 또는 - 는 2단계에서 처리하도록 그대로 남긴다
      reduced.push(operator, number);
    }
  }

  // (2단계) 남은 + 와 - 를 왼쪽부터 순서대로 계산한다
  let result = reduced[0];
  for (let i = 1; i < reduced.length; i += 2) {
    const operator = reduced[i];
    const number = reduced[i + 1];
    if (operator === '+') result += number;
    else if (operator === '-') result -= number;
  }

  return result;
}

/* ---------------------------------------------------------
   [DOM 배선] querySelector + addEventListener
   --------------------------------------------------------- */

const display = document.querySelector('#display');
const onOffButton = document.querySelector('.on-off');

// 전원 상태 (초기값 OFF). 꺼져 있으면 모든 조작이 무시된다.
let power = false;

/* 디스플레이에 숫자/소수점을 이어붙인다 */
function appendNumber(ch) {
  if (!power) return; // 전원 OFF 가드

  if (ch === '.') {
    // 현재 입력 중인 숫자에 소수점이 이미 있으면 무시 (중복 방지)
    const lastNumber = display.value.split(/[+\-*/]/).pop();
    if (lastNumber.includes('.')) return;
    if (display.value === '0') {
      display.value = '0.'; // "0" 상태에서 "." → "0."
      return;
    }
  }

  // 디스플레이가 "0"이면 새 숫자로 교체, 아니면 이어붙임
  if (display.value === '0') {
    display.value = ch;
  } else {
    display.value += ch;
  }
}

/* 디스플레이 끝에 연산자를 이어붙인다 (예: "3+4*2" 식 구성) */
function appendOperator(op) {
  if (!power) return; // 전원 OFF 가드

  const last = display.value.slice(-1);
  // 끝이 이미 연산자면 새 연산자로 교체 (예: "3+" 뒤 "*" → "3*")
  if (['+', '-', '*', '/'].includes(last)) {
    display.value = display.value.slice(0, -1) + op;
  } else {
    display.value += op;
  }
}

/* 디스플레이를 "0"으로 초기화한다 */
function clearDisplay() {
  if (!power) return; // 전원 OFF 가드
  display.value = '0';
}

/* 디스플레이의 식을 계산해서 결과를 표시한다 */
function performCalculate() {
  if (!power) return; // 전원 OFF 가드
  try {
    const result = calculate(display.value);
    display.value = String(result);
  } catch (error) {
    // 계산 실패 → "오류" 표시 후 잠시 뒤 "0"으로 리셋
    display.value = '오류';
    setTimeout(() => {
      if (power) display.value = '0';
    }, 1000);
  }
}

/* 전원 상태를 토글한다 */
function togglePower() {
  power = !power;
  if (power) {
    display.value = '0';
    onOffButton.classList.add('on'); // 켜짐: 초록색 표시
  } else {
    display.value = '0';
    onOffButton.classList.remove('on');
  }
}

/* ---- 버튼 배선: querySelectorAll + addEventListener ---- */

// 숫자 버튼: 텍스트(0~9, .)를 그대로 appendNumber 로 전달
document.querySelectorAll('.number').forEach((btn) => {
  btn.addEventListener('click', () => appendNumber(btn.textContent));
});

// 연산자 버튼: 텍스트(+ - * /)를 appendOperator 로 전달
document.querySelectorAll('.operator').forEach((btn) => {
  btn.addEventListener('click', () => appendOperator(btn.textContent));
});

// 지우기 / 계산 / 전원
document.querySelector('.clear').addEventListener('click', clearDisplay);
document.querySelector('.enter').addEventListener('click', performCalculate);
onOffButton.addEventListener('click', togglePower);

/* ---- (보너스) 키보드 입력 지원: 또 다른 addEventListener 활용 예시 ---- */
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/[0-9.]/.test(key)) {
    appendNumber(key);
  } else if (['+', '-', '*', '/'].includes(key)) {
    appendOperator(key);
  } else if (key === 'Enter' || key === '=') {
    performCalculate();
  } else if (key === 'Escape' || key === 'c' || key === 'C') {
    clearDisplay();
  }
});
