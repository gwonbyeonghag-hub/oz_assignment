/* =========================================================
   calculator.js — OZ 코딩스쿨 JavaScript 1일차 과제
   웹 브라우저 콘솔에서 실행하는 사칙연산 계산기

   사용법 (브라우저 콘솔에서):
     calculate("3 + 4 * 2")       // 11
     calculate("1 + 2 * 3 - 4")   // 3

   요구사항
     1) 사칙연산(+, -, *, /) 지원
     2) 길이가 긴 수식도 계산
     3) 우선순위 적용: * , / 를 먼저 → 그다음 + , -
   ※ eval 을 쓰지 않고 문자열을 직접 파싱/계산합니다.
   ========================================================= */

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

/* ---- 데모 & 간단한 테스트: 파일이 로드되면 콘솔에 자동 출력 ---- */
(function demo() {
  console.log('사칙연산 계산기 준비 완료!  예) calculate("3 + 4 * 2")');

  const cases = [
    ['3 + 4', 7],
    ['3 + 4 * 2', 11],                              // 곱셈 먼저
    ['10 - 2 * 3', 4],
    ['8 / 2 / 2', 2],
    ['2 + 3 * 4 - 6 / 2', 11],                      // 우선순위 섞임
    ['1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10', 55], // 긴 수식
    ['2 * 3 * 4 + 100 / 25 - 8', 20],
    ['-5 + 3', -2],                                 // 음수
    ['3.5 * 2', 7],                                 // 소수
  ];

  let pass = 0;
  for (const [expr, expected] of cases) {
    const got = calculate(expr);
    const ok = got === expected;
    if (ok) pass++;
    console.log(`${ok ? '✅' : '❌'}  ${expr} = ${got}${ok ? '' : `  (기대값 ${expected})`}`);
  }
  console.log(`테스트 ${pass}/${cases.length} 통과`);
})();

/* Node.js 등에서 재사용할 수 있도록 export (브라우저에선 무시됨) */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculate, tokenize };
}
