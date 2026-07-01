# HTML 기본 구조

> 오늘 학습한 **HTML(HyperText Markup Language)** 의 정의부터 문서의 기본 골격(`<!DOCTYPE html>`·`<html>`·`<head>`·`<body>`), 브라우저가 화면을 그리는 과정, 그리고 **DOM** 개념까지 "기본 구조"를 정리했다. (개별 태그 문법은 다음 학습으로 이어진다.)

---

## 1. HTML이란?

**HTML(HyperText Markup Language)** 은 **웹 페이지의 구조를 정의하는 언어**다.

- 글의 제목, 문단, 이미지, 링크 같은 웹 페이지의 **뼈대**를 만드는 역할을 한다.
- 즉, "무엇을 어떤 의미로 배치할지"를 태그로 표현한다. (보이는 스타일은 CSS, 동작은 JavaScript가 담당)

### 웹과 HTML
- 서버가 HTML 문서를 만들어 브라우저에 전달한다.
- 브라우저는 HTML을 읽고 화면의 기본 구조를 그린다.
- 흐름: **서버 → HTML 전달 → 브라우저 → 화면 구조 생성**

---

## 2. 태그(tag)와 중첩 구조

HTML 문서는 항상 일정한 기본 틀을 가지며, **태그(tag)들의 조합**으로 구성된다.

- 태그는 `<태그이름>` 형태로 작성한다.
- 각 태그는 저마다 요소의 **의미와 역할**을 가진다.
- 대부분의 태그는 **여는 태그**와 **닫는 태그**가 짝을 이룬다.

```html
<h1>제목</h1>
<p>문단 내용</p>
```

태그 안에 다른 태그가 들어갈 수 있고(**중첩, nesting**), 이 중첩으로 문서의 **계층 구조**가 만들어진다.

```html
<body>
  <h1>제목</h1>
  <p>내용</p>
</body>
```

---

## 3. HTML 기본 골격

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    Hello, HTML
  </body>
</html>
```

각 요소의 의미는 다음과 같다.

| 요소 | 역할 |
|---|---|
| `<!DOCTYPE html>` | 이 문서가 **HTML5 문서**임을 브라우저에 알리는 선언 |
| `<html>` | HTML 문서의 **최상위 태그**. 모든 HTML 요소는 이 안에 포함됨 |
| `<head>` | 화면에 **직접 보이지 않는** 설정 영역 (제목, 문자 인코딩, CSS, 메타 정보 등) |
| `<title>` | 브라우저 **탭에 표시되는 제목**. 검색 결과 제목으로도 사용됨 |
| `</head>` | head 영역의 끝 |
| `<body>` | 브라우저 화면에 **실제로 보이는** 내용 영역 (텍스트·이미지·버튼 등) |
| `Hello, HTML` | body 안의 텍스트. 브라우저에 그대로 표시됨 |
| `</body>` · `</html>` | 각각 body, html 영역의 끝 |

---

## 4. 실습 환경

### HTML 파일 만들고 서버 실행
```bash
mkdir html                    # html 디렉토리 생성
cd html
python3.13 -m http.server     # 간단한 로컬 서버 실행
code hello.html               # VS Code로 HTML 파일 열기
```

### Live Preview (VS Code 확장)
- 확장 검색에서 **Live Preview** 설치
- HTML 파일을 연 뒤 `Ctrl + Shift + P` → **Live Preview: Show Preview (Internal)** 선택
- 코드를 수정하면 결과를 실시간으로 미리 볼 수 있다.

---

## 5. HTML 문서가 브라우저에 표시되는 과정

1. 브라우저가 서버에 HTML을 **요청(request)**
2. 서버가 HTML 문서로 **응답(response)**
3. 브라우저가 HTML을 **해석(parsing)**
4. 화면 구조인 **DOM 생성**
5. **CSS 적용** → 화면 표시

---

## 6. DOM(Document Object Model)

**DOM**은 브라우저가 HTML 문서를 해석해 만든 **객체 기반 구조**다.

- HTML을 **트리(tree) 구조**로 표현한 것
- 각 태그와 텍스트가 **노드(node)** 가 된다
- **JavaScript가 화면을 조작할 때 사용하는 대상**이 바로 이 DOM이다

> - DOM은 브라우저 안에 만들어진 HTML의 **구조화된 표현**이다.
> - 비유하면 **HTML = 설계도**, **DOM = 브라우저 안의 실제 구조**.

### DOM 트리 예시

아래 HTML은 오른쪽과 같은 트리로 표현된다.

```text
<!DOCTYPE html>          document
<html>                   └─ html
  <head>                    ├─ head
    <title>My Page</title>  │   └─ title
  </head>                   │        └─ "My Page"
  <body>                    └─ body
    Hello, HTML                  └─ "Hello, HTML"
  </body>
</html>
```

---

참고: 이 문서는 제공된 학습 자료(HTML/CSS 학습 콘텐츠의 'HTML 기본 구조' 파트)를 중심으로 정리했으며, 개념 이해를 위해 일부 표준적인 외부 지식이 함께 포함되었다.
