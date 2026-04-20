# SKT SLA Checker

Playwright와 Node.js를 이용한 SK 브로드밴드 인터넷 품질측정(SLA) 자동화 봇입니다. 
주기적으로 T-ID 로그인 후 품질측정을 진행하고, 최저보장속도(SLA) 미달 시 장애 접수 및 요금 감면을 위해 활용할 수 있습니다.

## 기능

- T-ID를 통한 자동 로그인
- SK 브로드밴드 품질측정 페이지 자동 이동 및 측정 실행
- 측정 결과 확인

## 요구사항

- [Node.js](https://nodejs.org/) (버전 18 이상 권장)
- [Playwright](https://playwright.dev/)

## 설치 및 실행

1. 의존성 설치
   ```bash
   npm install
   ```

2. 환경변수 설정
   프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력합니다:
   ```env
   # .env
   SKT_ID=본인아이디
   SKT_PASSWORD=본인비밀번호
   ```

3. 브라우저 바이너리 설치 (Playwright)
   ```bash
   npx playwright install
   ```

4. 봇 실행 (개발 모드)
   ```bash
   npm run dev
   ```

5. 빌드 후 실행
   ```bash
   npm run build
   npm start
   ```

## 기술 스택

- TypeScript 
- Node.js
- Playwright

## 참고 사항

* 이 도구는 백그라운드 자동화를 위해 개발되었습니다.
* 측정 시 네트워크 대역폭을 모두 사용하므로, 측정 중에는 다른 인터넷 작업이 느려질 수 있습니다.
* 개인정보 보호를 위해 `.env` 파일은 절대 Git(공개 저장소)에 업로드하지 마세요. (이미 `.gitignore`에 등록되어 있습니다.)
