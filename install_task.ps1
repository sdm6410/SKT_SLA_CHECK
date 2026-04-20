# SK 브로드밴드 SLA 작업 스케줄러 등록 스크립트 (Windows PowerShell용)

$TaskName = "SK_Broadband_SLA_Check"

# Node.js가 설치된 경로 (시스템마다 다를 수 있음)
$ActionPath = $(Get-Command node).Source
if (-not $ActionPath) {
    $ActionPath = "C:\Program Files\nodejs\node.exe"
}

# 실행할 JS 파일 절대 경로 (현재 위치 기준)
$ActionArguments = "$PSScriptRoot\dist\index.js"
$WorkingDirectory = $PSScriptRoot

# 스케줄러 트리거: 매일 오전 2시부터 시작 (일단 예시설정)
$Trigger = New-ScheduledTaskTrigger -Daily -At 10am
$RepetitionDuration = [TimeSpan]::FromHours(24)
$RepetitionInterval = [TimeSpan]::FromHours(4) # 4시간 간격으로 확인

Write-Host "============================="
Write-Host "작업 스케줄러 봇 등록 스크립트"
Write-Host "============================="
Write-Host "실행될 Node.js 경로: $ActionPath"
Write-Host "작업경로: $WorkingDirectory"

$Action = New-ScheduledTaskAction -Execute $ActionPath -Argument $ActionArguments -WorkingDirectory $WorkingDirectory

# 현재 접속한 사용자 권한으로 창 없이 백그라운드 실행 (비밀번호 저장 불필요)
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

# 기존에 봇이 있으면 제거
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

# 신규 작업 등록
Register-ScheduledTask -TaskName $TaskName -Trigger $Trigger -Action $Action -Principal $Principal | Out-Null

Write-Host "==> 작업 스케줄러 '$TaskName' 등록이 완료되었습니다."
Write-Host "Windows 검색 -> '작업 스케줄러(Task Scheduler)' 에서 수정하실 수 있습니다."
