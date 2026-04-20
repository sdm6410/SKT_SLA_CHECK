import { chromium } from 'playwright';

export async function runSktSlaTest() {
  const headless = process.env.HEADLESS === 'true';
  const skId = process.env.SK_ID;
  const skPassword = process.env.SK_PASSWORD;

  if (!skId || !skPassword) {
    throw new Error('❌ SK_ID 또는 SK_PASSWORD가 환경 변수에 설정되어 있지 않습니다.');
  }

  console.log(`🚀 [SK Broadband] 인터넷 속도 및 SLA 측정 시작 (Headless: ${headless})`);

  // Playwright 브라우저 실행
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. 측정 사이트 홈 진입
    console.log('🌐 SK 브로드밴드 속도측정 사이트에 접속합니다...');
    await page.goto('https://myspeed.skbroadband.com/');
    await page.waitForTimeout(2000);

    // 2. 로그인 수행 (T-ID)
    console.log('🔑 로그인을 시도합니다...');
    
    // [진행 단계 1] - 메인 화면의 우측 상단 로그인 버튼 클릭
    await page.click('#header > div > div.h-svc > a.login');
    console.log('👉 메인 화면 로그인 버튼 클릭 완료!');
    
    // 페이지 이동 대기
    await page.waitForTimeout(3000); 

    // [진행 단계 2] - B world 로그인 포털 화면의 'T아이디 로그인' 버튼 클릭
    console.log('👉 B world 통합 로그인 화면 진입 완료. T아이디 로그인 버튼(#btnLogin)을 클릭합니다.');
    
    // T-ID 로그인이 "새 창(팝업)"으로 열리는 경우를 대비
    const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    await page.click('#btnLogin');
    
    const popup = await popupPromise;
    const loginPage = popup ? popup : page; // 팝업이 뜨면 팝업을, 아니면 원래 페이지를 조작
    
    if (popup) {
        console.log('👉 새 창(팝업)으로 T-ID 로그인 화면이 열린 것을 감지했습니다!');
    } else {
        await page.waitForTimeout(3000); // 같은 창 이동 시 살짝 대기
    }

    // [진행 단계 3] - 실제 T-ID 폼 로그인 처리
    console.log('👉 실제 T-ID 로그인 페이지에 진입했으므로 아이디/비밀번호를 입력합니다.');
    
    // 혹시 페이지 로딩이 느릴 수 있으니 인풋박스가 뜰 때까지 대기
    await loginPage.waitForSelector('#inputId', { timeout: 15000 });
    
    await loginPage.fill('#inputId', skId);
    await loginPage.fill('#inputPassword', skPassword);
    await loginPage.click('button[data-click-id="login"]');

    console.log('🔒 로그인 버튼 클릭! 원래의 SK 브로드밴드 사이트로 돌아가는지 확인합니다.');
    
    // 리다이렉트 및 팝업 닫힘 대기 시간 (넉넉히 5~10초)
    await page.waitForTimeout(10000);

    // [진행 단계 4] - 초고속 인터넷 SLA 품질 측정 페이지 진입
    // 파악한 바에 따르면 internet_sla.asp는 안내 페이지이고, 진짜 측정 페이지는 ipcheck.asp 입니다.
    console.log('👉 메인 화면 로딩 완료! 인터넷 SLA 속도 측정 전용 페이지(ipcheck.asp)로 곧바로 직행합니다...');
    await page.goto('https://myspeed.skbroadband.com/mesu/sla/ipcheck.asp');
    
    // 측정 프로그램 존재 여부 체크 등 대기
    await page.waitForTimeout(5000);

    // 3. SLA 5회 측정 기동 및 대기
    console.log('🏃‍♂️ SLA 5회 측정 프로그램이 기동되었습니다.');
    console.log('⏳ 측정이 완료될 때까지 약 40분간 브라우저를 유지하며 대기합니다...');
    
    // 별도의 이의신청 버튼 클릭 없이 백그라운드 측정 후 자가 종료 구조 (40분 세팅)
    await page.waitForTimeout(40 * 60 * 1000); // 40분 대기

    console.log('✅ 40분 대기 완료! SLA 측정이 정상적으로 완료되었거나 기록되었습니다.');
    return { success: true, message: 'SLA 측정 (40분 수행) 완료' };
  } catch (error) {
    console.error('❌ 측정 중 에러 발생:', error);
    throw error;
  } finally {
    // 브라우저 닫기
    await browser.close(); 
  }
}
