export async function sendDiscordNotification(webhookUrl: string, message: string) {
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });
    console.log(`[알림] Discord 전송 완료: ${message}`);
  } catch (error) {
    console.error(`[알림 실패] Discord 알림 전송 중 에러 발생:`, error);
  }
}
