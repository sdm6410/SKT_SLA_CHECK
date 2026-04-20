import { config } from 'dotenv';
import { runSktSlaTest } from './skt_speed_test';
import { sendDiscordNotification } from './notifier';

// 환경변수 로딩 (.env 파일 파싱)
config();

async function main() {
  console.log('=== SK Broadband SLA 속도 측정 자동화 앱 ===\n');
  try {
    const result = await runSktSlaTest();
    console.log('\n🌟 결과 완료:', result);

    if (process.env.DISCORD_WEBHOOK_URL) {
      await sendDiscordNotification(
        process.env.DISCORD_WEBHOOK_URL,
        `✅ SK 브로드밴드 속도 측정 진행 완료: ${result.message}`
      );
    }
  } catch (error: any) {
    console.error('\n🚨 런타임 오류 발생:\n', error.message);

    if (process.env.DISCORD_WEBHOOK_URL) {
      await sendDiscordNotification(
        process.env.DISCORD_WEBHOOK_URL,
        `🚨 SK 브로드밴드 자동화 앱에서 오류 발생: ${error.message}`
      );
    }
  }
}

main();
