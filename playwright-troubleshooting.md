# Playwright 시각 테스트 트러블슈팅 — 프로젝트 재사용 가이드

> 이 문서는 SoftMarket 프로젝트에서 Playwright를 통해 발견한 오류와 해결책을 정리한 것이다.
> **다른 프로젝트에서도 동일한 접근법으로 시각 버그를 조기에 발견할 수 있다.**

---

## 1. Chromium 브라우저가 설치되지 않음

### 증상

```
Error:browserType.launch: Host system is missing dependencies!
  Missing libraries are:
    nvcuda.dll
  ...
```

또는 더 간단하게 — 브라우저가 아예 없어서 `page.screenshot()` 자체가 에러.

### 원인

`npm install playwright`는 **Playwright 테스트 프레임워크만** 설치할 뿐, 실제 브라우저를 다운로드하지 않습니다. 브라우저를 별도로 설치해야 합니다.

```bash
npx playwright install chromium   # Chromium만
npx playwright install            # Chromium + Firefox + WebKit 모두
npx playwright install-deps chromium  # 시스템 의존성도 함께 (Linux)
```

### Windows 특이사항

Windows에서는 `npx playwright install chromium`이 다음에 실패할 수 있습니다:

- **Visual C++ 재배포 가능 패키지가 설치되지 않음** → [Microsoft 사이트](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-visual-get)에서 최신 VC++ 재배포 가능 패키지 설치
- **방화벽/프록시** → 다운로드가 차단될 수 있음
- **할당된 디스크 공간 부족** → Chromium 바이너리는 약 100MB

### 해결 (재현 가능한 스크립트)

```bash
# Windows
npx playwright install chromium
# 또는
npm install -D @playwright/experimental-ct-react
npx playwright install --with-deps chromium
```

```ts
// vitest.config.ts - 브라우저 설정 명시
export default defineConfig({
  test: {
    environment: 'jsdom',
    // 시각 테스트는 별도 파일로 분리
  },
});
```

### 방지: `playwright.config.ts` 생성

```js
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on',
  },
});
```

---

## 2. 로고 텍스트가 화면에서 보이지 않음 (가장 중요한 시각 버그)

### 증상

- VS Code 미리보기에서는 로고가 보임
- 브라우저에서 직접 보면 로고가 **완전히 투명** (화면에 보이지 않음)
- Playwright 스크린샷에서만 `SoftMarket` 텍스트가 보이지 않는 것을 확인할 수 있음

### 원인

`Header.tsx`에서 그라디언트 텍스트 효과를 위해 다음 CSS를 사용했습니다:

```css
/* ❌ 잘못된 방식 — 흰 배경에서 텍스트가 완전히 투명 */
.bg-gradient-to-r.from-primary-600.to-primary-400.bg-clip-text.text-transparent
```

이는 `background-clip: text` + `color: transparent`로, 텍스트 자체를 투명하게 만들고 **그라디언트를 배경으로** 보여줍니다. 하지만 백그라운드 자체가 흰색이므로, "그라디언트 + 투명" = 흰 배경과 섞여서 보이지 않습니다.

### 해결

```css
/* ✅ 올바른 방식 — 그라디언트 없이solid 색상으로 표시 */
.text-primary-600.dark\:text-primary-400
```

또는 그라디언트 효과를 유지하려면:

```css
/* 그라디언트 배경을 가진 컨테이너 위에 transparent 텍스트 (대안) */
.bg-gradient-to-r.from-primary-600.to-primary-400.bg-clip-text.text-transparent
/* → 이 경우 반드시 부모 div에 색상 있는 배경이 있어야 함 */
```

### 코드

```tsx
// Header.tsx - 수정 전 (❌ invisible on white)
<Link to="/" className="flex items-center gap-2">
  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
    SoftMarket
  </span>
</Link>

// Header.tsx - 수정 후 (✅ solid color)
<Link to="/" className="flex items-center gap-2">
  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
    SoftMarket
  </span>
</Link>
```

### 방지: `text-transparent` + 그라디언트 사용 시 체크리스트

| 체크리스트 | 설명 |
|-----------|------|
| 배경 색상 확인 | `text-transparent`는 **배경이 무조건 있음**되어야 보임 |
| `bg-*` 클래스 확인 | 부모 div에 `.bg-white`가 없어야 함 |
| dark mode 확인 | `dark:text-transparent`도 동일하게 주의 |
| **스�크린샷으로 검증** | 실제 브라우저에서 스크린샷 찍어 눈으로 확인 |

---

## 3. 카테고리명이 영문 slug로 노출

### 증상

카테고리 페이지 제목에 `developer-tools`, `productivity` 등의 slug가 그대로 표시됨.

### 원인

URL slug(`/category/developer-tools`)를 그대로 카테고리명으로 표시했음.

```tsx
// ❌ slug 그대로 사용
<h1 className="...">{category}</h1>
```

### 해결

```tsx
// ✅ 카테고리명 매핑 테이블 생성
const CATEGORY_NAMES: Record<string, string> = {
  'all': '모든 소프트웨어',
  'developer-tools': '개발자 도구',
  'productivity': '생산성',
  'design-tools': '디자인 도구',
  'communication': '커뮤니케이션',
  'analytics': '분석',
  'security': '보안',
  'games': '게임',
};

// slug → 한국어 이름으로 매핑
<h1 className="...">{CATEGORY_NAMES[category] || category}</h1>
```

### 방지: `i18n` 또는 매핑 테이블 패턴

```tsx
// utils/categoryNames.ts
export const CATEGORY_NAMES: Record<string, string> = {
  /* slug → 현지화된 이름 매핑 */
};

// 사용
import { CATEGORY_NAMES } from '@/utils/categoryNames';
const displayName = CATEGORY_NAMES[slug] ?? slug;
```

---

## 4. 스크린샷 테스트 구현 패턴

### playwright 스크린샷 찍는 명령어

```bash
# Playwright가 설치되어 있다는 가정
npx playwright install chromium  # 첫 설치 시 필요

# 프로젝트의 주요 페이지 전체 스크린샷
npx playwright test --config=playwright.config.ts

# 스크린샷만 찍는 간단한 스크립트
node -e "
  const { chromium } = require('playwright');
  (async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5173');
    await page.screenshot({ path: 'screenshot-home.png', fullPage: false });
    await browser.close();
  })();
"
```

### 테스트용 스크립트 (src/scripts/screenshot-all.ts)

```ts
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { join } from 'path';

const PAGES = [
  { name: 'home', url: 'http://localhost:5173' },
  { name: 'browse', url: 'http://localhost:5173/browse' },
  { name: 'category', url: 'http://localhost:5173/category/developer-tools' },
  { name: 'product', url: 'http://localhost:5173/product/filescope' },
  { name: 'seller', url: 'http://localhost:5173/seller' },
];

async function captureScreenshots() {
  // 1. Vite dev server 백그라운드에서 시작
  const vite = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    detached: true,
  });

  // 서버가 빌드될 때까지 대기
  await new Promise<void>((resolve) => {
    vite.stdout?.on('data', (data) => {
      if (data.toString().includes('ready in')) resolve();
    });
  });

  const browser = await chromium.launch({ headless: true });

  for (const page of PAGES) {
    const browserPage = await browser.newPage();
    try {
      await browserPage.goto(page.url, { waitUntil: 'networkidle' });
      await browserPage.waitForTimeout(2000);
      await browserPage.screenshot({
        path: `screenshot-${page.name}.png`,
        fullPage: false,
      });
      console.log(`✅ ${page.name}`);
    } catch (err) {
      console.error(`❌ ${page.name}: ${err.message}`);
    }
    await browserPage.close();
  }

  await browser.close();
  vite.kill(); // dev server 종료
  console.log('Done!');
}

captureScreenshots();
```

### 주요 페이지 목록 (스크린샷 대상)

| 페이지 | URL | 확인 항목 |
|--------|-----|-----------|
| 홈 | `/` | 로고, 네비게이션, 히어로, 피처 카드 |
| 탐색 | `/browse` | 필터, 상품 목록, 페이지네이션 |
| 카테고리 | `/category/developer-tools` | 카테고리명, 상품 목록 |
| 상품 상세 | `/product/filescope` | 상품 정보, 가격, 장바구니 버튼 |
| 장바구니 | `/cart` | 장바구니 목록, 총 금액 |
| 로그인 | `/login` | 폼, 입력 필드 |
| 판매자 대시보드 | `/seller` | 판매자 전용 컴포넌트 |

---

## 5. 시각 테스트로 발견해야 할 것들

| 체크리스트 항목 | 왜 중요한지 |
|----------------|-------------|
| **로고 / 텍스트 색상** | 흰 배경 + `text-transparent` = invisible |
| **카테고리명 / 라벨** | slug 직접 노출 → i18n 누락 |
| **버튼 상태** | 비활성화 상태의 버튼이 활성화처럼 보이는지 |
| **다크모드 전환** | `dark:` 토큰이 제대로 적용되는지 |
| **이미지 로딩** | placeholder 없이 이미지만 렌더링되는지 |
| **반응형 레이아웃** | 모바일/태블릿/데스크톱에서 잘리는 요소 |
| **로딩 상태** | `LoadingSpinner`가 전체 화면을 덮는지 |
| **에러 메시지** | 색상이 구분되게 표시되는지 |
| **스크롤** | 긴 페이지에서 레이아웃이 깨지지 않는지 |
| **접근성** | aria-label이 화면에 보이는지 (접근성 테스트) |

---

## 6. 프로젝트 초기 스텝에서 Playwright 설정하는 체크리스트

```bash
# 1. Playwright 설치 (프로젝트 생성 직후)
npm install -D playwright @playwright/test
npx playwright install chromium

# 2. playwright.config.ts 생성
npx playwright init

# 3. 주요 페이지 목록 정의 (스크린샷 대상)
# 4. CI에 playwright 스크린샷 스텝 추가
# 5. 첫 빌드 후 스크린샷 찍어서 시각 검증
npm run build
npx vite preview
# → 브라우저로 접속 후 스크린샷
```

---

## 빠른 복구 (Quick Reference)

### "chromium not found" 에러
```bash
npx playwright install chromium
```

### "chromium dependencies missing" 에러
```bash
# Linux (Ubuntu)
npx playwright install-deps chromium

# Windows — Visual C++ 재배포 가능 패키지 설치
# https://learn.microsoft.com/en-us/cpp/windows/latest-supported-visual-get
```

### "browser crashed" 에러
```bash
npx playwright install --force
```

### 스크린샷으로 디버깅
```bash
# 페이지가 뜨지만 어떤 문제가 있는지 확인하고 싶을 때
npx playwright test --headed   # 브라우저 창을 띄우고
# 또는
node -e "require('playwright').chromium.launch().then(b => b.newPage().then(p => p.goto('http://localhost:5173')))"
```
