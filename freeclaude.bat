@echo off
setlocal

echo ===================================
echo Checking OmniRoute...
echo ===================================

REM Проверяем доступен ли already running
curl -s http://localhost:20128/v1 >nul 2>&1

if errorlevel 1 (
    echo Starting OmniRoute...
    start "OmniRoute" cmd /k omniroute

    :wait_loop
    curl -s http://localhost:20128/v1 >nul 2>&1

    if errorlevel 1 (
        echo Waiting for OmniRoute...
        timeout /t 1 >nul
        goto wait_loop
    )
)

echo ===================================
echo OmniRoute ready
echo ===================================

REM API KEY


set "ANTHROPIC_AUTH_TOKEN=sk-5d6ba3fd6a15b9d3-696f58-2fa8c9b7"

set "ANTHROPIC_API_KEY="

REM OmniRoute endpoint
set "ANTHROPIC_BASE_URL=http://localhost:20128/v1"

REM Disable betas
set "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1"

echo ===================================
echo Starting Claude Code...
echo ===================================

claude

endlocal