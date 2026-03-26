@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

set "BASE_URL=http://localhost:8080"
set "JSON_FILE=%~dp0test-api.json"

set PASS=0
set FAIL=0
set TOTAL=0

echo ============================================================
echo   Running API Tests
echo ============================================================
echo.

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

for /f %%n in ('jq length "%JSON_FILE%"') do set COUNT=%%n
set /a LAST=%COUNT%-1

for /L %%i in (0,1,%LAST%) do (

    for /f "delims=" %%a in ('jq -r ".[%%i].name" "%JSON_FILE%"') do set NAME=%%a
    for /f "delims=" %%a in ('jq -r ".[%%i].method" "%JSON_FILE%"') do set METHOD=%%a
    for /f "delims=" %%a in ('jq -r ".[%%i].path" "%JSON_FILE%"') do set PATH_URL=%%a
    for /f "delims=" %%a in ('jq -c ".[%%i].body" "%JSON_FILE%"') do set BODY=%%a
    for /f "delims=" %%a in ('jq -r ".[%%i].expect" "%JSON_FILE%"') do set EXPECT=%%a

    set /a TOTAL+=1

    if "!BODY!"=="null" (
        for /f %%s in ('curl -s -o response.json -w "%%{http_code}" -X !METHOD! "!BASE_URL!!PATH_URL!"') do set CODE=%%s
    ) else (
        echo !BODY! > temp.json
        for /f %%s in ('curl -s -o response.json -w "%%{http_code}" -X !METHOD! "!BASE_URL!!PATH_URL!" -H "Content-Type: application/json" -d @temp.json') do set CODE=%%s
    )

    if "!CODE!"=="!EXPECT!" (
        echo [PASS] !METHOD! !PATH_URL! - !NAME!
        set /a PASS+=1
    ) else (
        echo [FAIL] !METHOD! !PATH_URL! - !NAME! (Expected !EXPECT!, got !CODE!)
        type response.json
        set /a FAIL+=1
    )
)

echo.
echo ===============================
echo PASS: %PASS%
echo FAIL: %FAIL%
echo TOTAL: %TOTAL%
echo ===============================

del temp.json >nul 2>&1
pause