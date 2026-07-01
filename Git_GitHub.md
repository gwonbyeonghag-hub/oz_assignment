# Git & GitHub 정리

> 오늘 학습한 **Git**(버전 관리 시스템)과 **GitHub**(원격 저장소 플랫폼)의 개념, 설치·설정, 기본 작업 흐름, 그리고 실무에서 쓰는 명령어 레퍼런스를 정리했다.

---

## 1. 왜 Git과 GitHub를 사용하는가

### 1) 버전 관리 (Version Control)
- **변경 이력 추적**: 코드의 변경 이력을 `커밋(commit)` 단위로 기록·추적한다. 과거 코드를 되돌아보거나 특정 버그가 언제 생겼는지 파악할 수 있다.
- **안전한 복구**: 실수로 코드를 잘못 고쳐도 이전 버전으로 쉽게 되돌릴 수 있다.

### 2) 협업 (Collaboration)
- **동시 작업**: 여러 개발자가 각자의 `브랜치(branch)`에서 작업한 뒤 `병합(merge)`해 하나의 결과물을 만든다.
- **코드 리뷰**: 팀원끼리 서로의 코드를 확인하고 피드백을 주고받는다.

### 3) 백업 및 중앙 집중화 (GitHub의 기능)
- **중앙 저장소**: GitHub는 클라우드 기반 중앙 저장소 역할을 한다. 언제 어디서든 접근할 수 있다.
- **데이터 손실 방지**: 로컬 컴퓨터가 고장 나도 GitHub에 저장된 코드로 복구할 수 있다.

### 4) 오픈 소스 및 공개 협업
- 누구나 오픈 소스 프로젝트에 기여할 수 있고, 자신의 프로젝트를 공개해 피드백을 받을 수 있다.

### 5) CI/CD 및 자동화 지원
- 코드를 `push`하면 자동으로 테스트·배포하는 등 다양한 자동화 도구와 연동된다.

### 6) 문서화 및 프로젝트 관리
- **README** 파일로 프로젝트 개요·사용법을 문서화한다.
- **이슈(issue) 추적**으로 작업 항목을 체계적으로 관리한다.

> 정리하면 Git·GitHub는 개발의 효율성을 높이고 협업을 원활하게 하며, 안전하고 체계적으로 프로젝트를 관리하게 해 주는 도구다. 특히 팀 개발과 오픈 소스에서 사실상 필수 도구로 자리 잡았다.

---

## 2. Git과 GitHub의 차이

| 구분 | Git | GitHub |
|---|---|---|
| 정체 | **분산 버전 관리 시스템(DVCS)** | Git 저장소를 호스팅하는 **웹 기반 플랫폼** |
| 위치 | 내 컴퓨터(로컬)에서 동작 | 인터넷(원격, 클라우드) |
| 역할 | 변경 이력 기록·관리 | 원격 저장·공유·협업 |

- **Git**: 프로젝트의 모든 파일·폴더를 추적하고 변경 사항을 커밋으로 기록한다. 중앙 서버 없이도 각자 컴퓨터에 **전체 프로젝트 복사본**을 두고 작업하는 **분산형** 구조라, 서버와 연결이 끊겨도 작업을 이어갈 수 있다. `브랜치`로 독립적인 작업을 만들고 다시 병합할 수 있다.
- **GitHub**: Git으로 관리되는 프로젝트를 인터넷에 **호스팅**하는 서비스. 코드를 온라인에 올려 공유·협업하고, 전 세계 개발자들이 오픈소스에 기여하는 커뮤니티의 중심이 된다.

---

## 3. 터미널과 CLI

**터미널(Terminal)** 은 사용자와 컴퓨터가 소통하는 인터페이스다. 명령어를 입력하면 컴퓨터가 그에 맞는 동작을 실행한다. 이렇게 명령어로 조작하는 방식을 **CLI(Command Line Interface)** 라고 한다. (macOS는 "터미널", Windows는 "명령 프롬프트"지만 편의상 통칭 터미널이라 부른다.)

- **macOS**: `Command(⌘) + Space` → Spotlight에서 `Terminal`(또는 `터미널`) 검색 → Enter
- **Windows**: 검색창에 `cmd` 입력, 또는 `Windows 키 + R` → `cmd` 입력 → 확인

---

## 4. 설치와 초기 설정

### 1) Homebrew 설치 (Mac만)
**Homebrew**는 macOS·Linux에서 소프트웨어 설치·관리·업그레이드·제거를 쉽게 해 주는 패키지 관리자다.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- 설치 중 맥북 비밀번호를 입력한다. (보안상 화면에 입력 내용이 보이지 않는 것이 정상)
- `==> Installation successful!` 이 뜨면 완료. `Next steps:` 안내가 나오면 `PATH:` 부분의 안내 명령을 복사해 터미널에 붙여넣어 실행한다.

```bash
brew --version   # Homebrew 버전 확인
brew list        # 설치된 패키지 목록 확인
```

> Windows는 Homebrew가 필요 없고, Git 공식 설치 파일로 설치한다.

### 2) Git 설치 (Mac)

```bash
brew install git   # brew로 git 설치
git --version      # Git 버전 확인
```

### 3) Git 전역 설정 (config)
저장소를 몇 개 만들든 **최초 한 번만** 하면 되는 설정이다. 사용자 이름·이메일은 커밋 작성자 정보로 기록된다.

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main   # 기본 브랜치 이름을 main으로
```

```bash
git config --list   # 설정 확인
```

> **트러블슈팅 — `dquote>` 가 계속 뜰 때**
> 따옴표(`"`)를 한쪽만 닫아서 생기는 현상이다.
> 1. `Ctrl + C`(또는 `Ctrl + G`)로 빠져나온다.
> 2. 잘못 들어간 설정을 지운다: `git config --global --unset user.name`
> 3. 양쪽 따옴표를 모두 닫아 다시 입력한다.

---

## 5. 저장소 생성과 원격 연결

**저장소(repository)** 는 GitHub에서 코드와 관련 파일을 저장·관리하는 공간이다. 로컬에서 시작하는 방법과, 원격을 복제해 오는 방법 두 가지가 있다.

### 방법 1 — `git init` 시퀀스 (로컬에서 시작 → 원격 연결)
GitHub에서 `Public`으로 새 저장소를 만든 뒤, 로컬 프로젝트를 초기화하고 처음으로 push한다.

```bash
# 1) 작업 디렉토리 생성 후 이동 (예: 바탕화면의 oz_assignment)
cd Desktop
mkdir oz_assignment
cd oz_assignment

# 2) 원격 저장소 연결 및 첫 push
echo "# oz_assignment" >> README.md   # README 생성
git init                              # 현재 폴더에 Git 저장소 초기화
git add README.md                     # 스테이징
git commit -m "first commit"          # 커밋
git branch -M main                    # 현재 브랜치 이름을 main으로
git remote add origin <URL>           # 원격 저장소 URL을 origin으로 추가
git push -u origin main               # main 브랜치를 원격으로 push
```

### 방법 2 — `git clone` (원격 저장소 복제)
이미 존재하는 원격 저장소를 로컬로 복제해 작업을 이어간다.

```bash
cd Desktop
git clone <본인 레포지토리 URL>
```

- `git clone`은 지정한 URL의 원격 저장소 전체(모든 히스토리·파일)를 현재 디렉토리로 복사해 새 로컬 저장소를 만든다.
- 완료되면 저장소 이름과 같은 폴더가 생성된다.

### `.git` 폴더의 중요성
원격이 연결되면 `Command + Shift + .` 로 숨겨진 `.git` 폴더를 볼 수 있다.

- **Git의 핵심**: 모든 커밋·브랜치·태그·메타데이터가 저장된 데이터베이스다. 손상·삭제되면 버전 관리 정보가 사라진다.
- **독립적**: `.git` 폴더만 있으면 다른 파일이 없어도 전체 히스토리를 복구할 수 있다.
- ⚠️ **주의**: 함부로 지우지 말 것. 또한 `.git`은 **최상위 폴더에 딱 하나**만 존재해야 하며, 하위 폴더에 중복되면 충돌의 원인이 된다.

> `git init`은 한 프로젝트에서 **최초 한 번만** 실행한다.

---

## 6. 기본 작업 흐름: add → commit → push

VS Code에서 프로젝트를 열고 작업·저장(`Command + S`)한 뒤, 통합 터미널(`Command + J`)에서 아래 3종 세트를 실행한다.

```bash
git status                 # 파일 상태 확인 (빨강=미스테이징, 초록=스테이징됨)
git add day_1              # 특정 파일/폴더 스테이징 (git add . 는 전체)
git commit -m "작업 내용"   # 스테이징된 변경을 커밋(이력 저장)
git push origin main       # 로컬 커밋을 원격(origin)의 main으로 업로드
```

커밋 후 터미널에는 아래처럼 표시된다.

```bash
[main (최상위-커밋) 719bd42] first commit
# main 브랜치의 최신 커밋. 719bd42는 커밋 고유 해시. 'first commit'은 커밋 메시지.
 1 file changed, 11 insertions(+)
# 파일 1개 변경, 11줄 추가
 create mode 100644 day_1/sample.html
# day_1/sample.html 새로 생성 (100644 = 일반 읽기-쓰기 파일 권한)
```

이후 GitHub에서 반영된 결과를 확인할 수 있다.

---

## 7. 과제 폴더 구조 추천

과목별로 나누고 그 안에서 다시 일차(day)로 구분하는 것을 권장한다. 폴더·파일명은 **띄어쓰기 대신 언더바(`_`)** 를 쓴다.

```text
oz_assignment/
├── PYTHON/
│   ├── day_1/
│   ├── day_2/
│   └── day_3/
├── HTML/
│   ├── day_1/
│   └── day_2/
├── JS/
│   ├── day_1/
│   └── day_2/
└── FLASK/
    ├── day_1/
    └── day_2/
```

---

## 8. Git 기본 명령어 레퍼런스

### 8-1. 설정 (Setup)

| 명령어 | 하는 일 |
|---|---|
| `git init` | 현재 디렉토리에 저장소 생성(`.git` 폴더 초기화) |
| `git clone [URL]` | 원격 저장소를 복제해 로컬 저장소 생성(기본 원격 이름 `origin`) |
| `git config user.name "이름"` | 커밋 작성자 이름 설정 |
| `git config user.email "이메일"` | 커밋 작성자 이메일 설정 |
| `git config --list` | 설정 전체 출력 |
| `git config --get [항목]` | 특정 설정 값만 출력 (예: `git config --get user.name`) |
| `git help [명령]` | 해당 명령의 도움말 |

### 8-2. Stage와 Commit

| 명령어 | 하는 일 |
|---|---|
| `git add [파일]` | 수정된 파일을 스테이징 영역(staging area)에 올림 |
| `git add [디렉토리]` | 해당 디렉토리 내 수정된 모든 파일 스테이징 |
| `git add .` | 작업 디렉토리의 수정된 모든 파일 스테이징 |
| `git commit` | 스테이징된 변경을 커밋(에디터로 메시지 입력) |
| `git commit -m "메시지"` | 메시지를 바로 입력하며 커밋 |
| `git commit -am "메시지"` | 추적 중인 파일의 add와 commit을 한 번에 (untracked 파일 제외) |

> **staging area**: 커밋에 포함할 파일을 임시로 모아 두는 영역. `add`로 올리고 `commit`으로 확정한다.

### 8-3. 상태 관리 (Inspect)

**status / log**

| 명령어 | 하는 일 |
|---|---|
| `git status` | 저장소의 현재 상태 출력 |
| `git status -s` | 상태를 간략히 표시 (`??` untracked, `M` 수정됨) |
| `git log` | 커밋 이력 출력(해시·작성자·날짜·메시지) |
| `git log --oneline` | 커밋을 한 줄로 간결히 출력 |
| `git log --graph --oneline` | 브랜치·병합 흐름을 그래프로 시각화 |
| `git log --decorate=full` | 브랜치·태그 참조 정보를 상세히 표시 |

**show / diff**

| 명령어 | 하는 일 |
|---|---|
| `git show` | 가장 최근 커밋의 상세 정보 출력 |
| `git show [커밋 해시]` | 지정한 커밋의 정보 출력 |
| `git show HEAD` | 현재 브랜치 최신 커밋(HEAD) 정보 출력 |
| `git show HEAD~[n]` | HEAD 기준 n단계 이전 커밋 정보 (`HEAD^^^` = 3단계 전) |
| `git diff` | 최근 커밋과 **unstaged** 변경 내용 비교 |
| `git diff --staged` | 최근 커밋과 **스테이징된** 변경 비교 |
| `git diff [해시1] [해시2]` | 두 커밋 간 변경 사항 비교 |

> **HEAD**: 현재 브랜치가 가리키는 최신 커밋. `~n`은 n단계 이전, `^`는 한 단계 이전을 뜻한다.

### 8-4. 커밋 조작 (Commit 되돌리기)

**checkout** — HEAD의 참조(작업 디렉토리 상태)를 옮긴다.

| 명령어 | 하는 일 |
|---|---|
| `git checkout [커밋 해시]` | 해당 커밋으로 이동(새 커밋 시 "분리된 HEAD" 상태) |
| `git checkout -` | 직전에 있던 참조로 되돌아가기 |
| `git checkout main` | HEAD가 main을 참조(브랜치 전환) |
| `git checkout HEAD~n` | HEAD 기준 n단계 이전 커밋으로 이동 |

**reset / amend** — 스테이징·커밋을 되돌린다.

| 명령어 | 하는 일 |
|---|---|
| `git reset` | 스테이징 영역 전체를 unstaged로 되돌림 |
| `git reset [파일]` | 해당 파일만 unstaged로 되돌림 |
| `git reset [커밋 해시]` | 브랜치 참조를 해당 커밋으로 이동 |
| `git reset --soft [해시]` | 커밋만 취소, 작업 디렉토리·스테이징은 **유지** |
| `git reset --hard [해시]` | 작업 디렉토리·스테이징·커밋 **모두** 되돌림 ⚠️ 변경 삭제됨, 주의 |
| `git reset HEAD^` | 직전 커밋으로 브랜치 참조 이동 |
| `git commit --amend` | 최근 커밋 수정 |
| `git commit --amend -m "메시지"` | 최근 커밋 메시지를 바꿔서 수정 |

> ⚠️ `git reset --hard`는 변경 사항이 완전히 삭제되므로 신중하게 사용한다.

---

## 9. 브랜치 (Branch)

`브랜치`는 독립적인 작업 흐름이다. 주 프로젝트와 분리해 새 기능을 개발한 뒤, 완성되면 다시 병합한다.

### 9-1. 브랜치 기본

| 명령어 | 하는 일 |
|---|---|
| `git branch` | 브랜치 목록 표시(현재 브랜치 포함) |
| `git branch [이름]` | 새 브랜치 생성(현재 브랜치는 그대로) |
| `git checkout [이름]` | 해당 브랜치로 전환 |
| `git checkout -b [이름]` | 브랜치 생성과 동시에 전환 |
| `git branch -m [기존] [새이름]` | 브랜치 이름 변경 |
| `git branch -d [이름]` | 브랜치 삭제(병합된 브랜치만 삭제 가능) |

### 9-2. 병합 (Merge)
현재 브랜치에 다른 브랜치의 내용을 통합한다.

| 명령어 | 하는 일 |
|---|---|
| `git merge [브랜치]` | 해당 브랜치를 현재 브랜치에 병합 |
| `git merge --ff [브랜치]` | fast-forward 가능하면 커밋 없이 참조만 이동(기본값) |
| `git merge --no-ff [브랜치]` | fast-forward여도 항상 병합 커밋 생성(기록 남김) |
| `git merge --squash [브랜치]` | 여러 커밋을 하나로 합쳐 병합 |

> **fast-forward**: 대상 브랜치의 커밋이 현재 브랜치의 부모로 바로 이어질 때, 별도 병합 커밋 없이 포인터만 앞으로 옮기는 것.

### 9-3. 리베이스 (Rebase)
변경 사항을 다른 브랜치 위로 재배치해 커밋 이력을 깔끔하게 유지한다.

| 명령어 | 하는 일 |
|---|---|
| `git rebase [브랜치]` | 현재 브랜치를 해당 브랜치에서 분기하도록 재배치 |
| `git rebase --continue` | 충돌 해결 후 재배치 계속 |
| `git rebase --abort` | 리베이스 취소, 원래 상태로 복귀 |

### 9-4. 체리픽 (Cherry-pick)
특정 커밋의 변경만 골라 현재 브랜치에 반영한다.

| 명령어 | 하는 일 |
|---|---|
| `git cherry-pick [해시]` | 해당 커밋을 현재 브랜치에 추가(여러 해시 연속 지정 가능) |
| `git cherry-pick [해시1]..[해시2]` | 구간 커밋을 한 번에 추가 |
| `git cherry-pick --continue` | 충돌 해결 후 계속 |
| `git cherry-pick --abort` | 충돌 시 체리픽 취소 |

---

## 10. 한눈에 보는 기본 흐름

```text
(설정 1회)  git config --global user.name / user.email
   │
   ▼
git init  ─►  파일 작업  ─►  git add  ─►  git commit  ─►  git push origin main
(최초 1회)     (수정/저장)     (스테이징)     (이력 저장)        (원격 업로드)
```

---

참고: 이 문서는 제공된 학습 자료(Git/GitHub 학습 콘텐츠·명령어 모음)를 중심으로 정리했으며, 개념 이해를 위해 일부 표준적인 외부 지식이 함께 포함되었다.
