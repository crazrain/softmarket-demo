# GitHub Pages 배포 Troubleshooting — SoftMarket

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 저장소 | `crazrain/softmarket-demo` (Public) |
| 배포 방식 | `gh-pages` 패키지로 `gh-pages` 브랜치에 `dist/` 업로드 |
| 접근 URL | `https://crazrain.github.io/softmarket-demo/` |
| 기술 스택 | React 19 + TypeScript + Vite 8 + Tailwind CSS 4 |

---

## 문제 1: Save 버튼이 활성화되지 않음

### 증상
GitHub Settings → Pages에서 Source를 `Deploy from a branch`, Branch를 `master`, Folder를 `/ (root)`로 선택해도 Save 버튼이 회색으로 비활성화됨.

### 원인
`.github/workflows/deploy.yml` 파일이 존재하면 GitHub이 Actions 모드로 잠그고, Manual Branch Deploy와 충돌하여 Save 버튼이 활성화되지 않음.

### 해결
```bash
rm .github/workflows/deploy.yml
git add -A
git commit -m "Remove Actions workflow (use manual Pages deploy)"
git push origin master
```
그 후 Pages 설정에서 Save 버튼 활성화됨.

---

## 문제 2: MIME 형식 오류 — "text/html"이 모듈 로드를 차단

### 증상
```
Uncaught TypeError: Cannot use 'import.meta' as a module
```
또는 `Uncaught SyntaxError: Unexpected token 'export'`

### 원인
빌드 결과물(`dist/`)이 루트에 업로드되면 `index.html`에서 `import.meta`나 ES 모듈 구문이 브라우저에서 직접 실행됨. Vite는 빌드 시 번들을 생성하지만, `dist/` 폴더 자체가 업로드되어야 함.

### 해결
1. `.github/workflows/deploy.yml`을 제거하고 Manual Deploy로 변경
2. `gh-pages` 패키지를 사용:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
3. `npx gh-pages -d dist` → `dist/` 폴더가 `gh-pages` 브랜치에 업로드됨
4. GitHub Pages 설정: **Source → `gh-pages` / `/ (root)`**

---

## 문제 3: No routes matched location — 라우팅 깨짐

### 증상
페이지는 뜨지만 URL이 `/softmarket-demo/` 또는 `/browse`, `/product/xxx` 등으로 가도 "No routes matched" 발생.

### 원인 1 — Vite `base` 경로 불일치
`vite.config.ts`에서 `base: '/'` → 빌드 시 JS/CSS 경로가 `/assets/...`로 생성됨. 하지만 GitHub Pages에서는 `/softmarket-demo/assets/...`로 접근해야 함.

**해결 1:**
```ts
// vite.config.ts
export default defineConfig({
  base: '/softmarket-demo/',
  // ...
})
```

### 원인 2 — React Router `basename` 누락
`<BrowserRouter>`에 `basename`을 지정하지 않으면, Vite가 chunk URL을 `/softmarket-demo/assets/...`로 잘 만들더라도, React Router 내부 라우팅은 절대 경로 `/browse`로 해석함.

**해결 2:**
```tsx
// src/App.tsx
<BrowserRouter basename="/softmarket-demo">
  <div className="flex min-h-screen flex-col">
    <AppRoutes />
  </div>
</BrowserRouter>
```

### 원인 3 — SPA 라우팅 시 서버 리다이렉션 없음 (대안)
`gh-pages` 방식은 빌드 결과물을 업로드하므로, 정적 파일만 올라가면 서버 리다이렉션이 필요 없음. 하지만 만약 `dist/` 폴더 자체를 호스팅할 경우 (루트가 아님), HTML에서 `<base>` 태그나 서버 설정이 필요할 수 있음.

---

## 최종 설정 요약

### package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  }
}
```

### vite.config.ts
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/softmarket-demo/',  // 저장소명
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### src/App.tsx
```tsx
<BrowserRouter basename="/softmarket-demo">
  <div className="flex min-h-screen flex-col">
    <AppRoutes />
  </div>
</BrowserRouter>
```

### GitHub Pages 설정
- **Source:** `Deploy from a branch`
- **Branch:** `gh-pages`
- **Folder:** `/ (root)`

### 로컬 배포 실행 순서
```bash
npm run deploy   # predeploy → build → gh-pages -d dist
```

### 수동 배포 방법
```bash
npm run build
npx gh-pages -d dist
```

---

## 참고: GitHub Pages — Private 저장소 유료

| 계정 | Public Pages | Private Pages |
|------|-------------|---------------|
| Free | ✅ | ❌ |
| Pro ($4/월) | ✅ | ✅ |

**결론:** Private 저장소에서 GitHub Pages 쓰려면 **GitHub Pro($4/월)** 필요.
Public 저장소이면 무료.

---

## 배포 검증 체크리스트

| 항목 | 상태 |
|------|------|
| `base: '/softmarket-demo/'` 설정 | ✅ |
| `<BrowserRouter basename="/softmarket-demo">` 설정 | ✅ |
| `npm run build` 정상 | ✅ |
| `npx gh-pages -d dist` 정상 | ✅ |
| GitHub Pages Source → `gh-pages` / `/ (root)` | ✅ |
| 접속 확인 (`https://crazrain.github.io/softmarket-demo/`) | ✅ |
