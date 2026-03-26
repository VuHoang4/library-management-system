@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

REM ================================
REM CONFIG
REM ================================
set "BASE_URL=http://localhost:8080"

REM --- Nhận file JSON từ tham số ---
if "%~1"=="" (
    set "JSON_FILE=%~dp0test-api.json"
) else (
    set "JSON_FILE=%~dp0%~1"
)

REM --- Check file tồn tại ---
if not exist "%JSON_FILE%" (
    echo [ERROR] File not found: %JSON_FILE%
    pause
    exit /b 1
)

REM ================================
REM INIT
REM ================================
set PASS=0
set FAIL=0
set TOTAL=0

echo ============================================================
echo   Running API Tests from: %JSON_FILE%
echo ============================================================
echo.

REM ================================
REM CHECK DEPENDENCIES
REM ================================
where curl >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] curl not found!
    pause
    exit /b 1
)

where jq >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] jq not found!
    pause
    exit /b 1
)

echo [OK] curl + jq ready
echo.

REM ================================
REM COUNT TEST CASES
REM ================================
for /f %%n in ('jq length "%JSON_FILE%"') do set COUNT=%%n
set /a LAST=!COUNT!-1

REM ================================
REM RUN TEST
REM ================================
for /L %%i in (0,1,!LAST!) do (

    for /f "delims=" %%a in ('jq -r ".[%%i].name" "%JSON_FILE%"') do set NAME=%%a
    for /f "delims=" %%a in ('jq -r ".[%%i].method" "%JSON_FILE%"') do set METHOD=%%a
    for /f "delims=" %%a in ('jq -r ".[%%i].path" "%JSON_FILE%"') do set PATH_URL=%%a
    for /f "delims=" %%a in ('jq -c ".[%%i].body" "%JSON_FILE%"') do set BODY=%%a
    for /f "delims=" %%a in ('jq -r ".[%%i].expect" "%JSON_FILE%"') do set EXPECT=%%a

    set /a TOTAL=!TOTAL!+1

    REM --- Gọi API ---
    if "!BODY!"=="null" (
        for /f %%s in ('curl -s -o response.json -w "%%{http_code}" -X !METHOD! "!BASE_URL!!PATH_URL!"') do set CODE=%%s
    ) else (
        echo !BODY! > temp.json
        for /f %%s in ('curl -s -o response.json -w "%%{http_code}" -X !METHOD! "!BASE_URL!!PATH_URL!" -H "Content-Type: application/json" -d @temp.json') do set CODE=%%s
    )

    REM --- CHECK RESULT ---
    if "!CODE!"=="!EXPECT!" (
        echo [PASS] #!TOTAL! !METHOD! !PATH_URL! - !NAME!
        set /a PASS=!PASS!+1
    ) else (
        echo [FAIL] #!TOTAL! !METHOD! !PATH_URL! - !NAME!
        echo        Expected: !EXPECT! ^| Got: !CODE!
        echo        Response:
        type response.json
        echo.
        set /a FAIL=!FAIL!+1
    )
)

REM ================================
REM SUMMARY
REM ================================
echo.
echo ============================================================
echo   TEST RESULT
echo ============================================================

set /a SUCCESS_RATE=(PASS*100)/TOTAL

echo PASS : !PASS!
echo FAIL : !FAIL!
echo TOTAL: !TOTAL!
echo SUCCESS: !SUCCESS_RATE!%%
echo ============================================================

REM ================================
REM CLEAN UP
REM ================================
del temp.json >nul 2>&1
del response.json >nul 2>&1

pause