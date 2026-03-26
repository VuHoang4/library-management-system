@echo off
chcp 65001 >nul 2>&1
setlocal

echo ============================================================
echo   Setup JAVA_HOME for Spring Boot Project
echo ============================================================
echo.

REM --- Check if JAVA_HOME exists ---
if defined JAVA_HOME (
    if exist "%JAVA_HOME%\bin\java.exe" (
        echo [OK] JAVA_HOME da ton tai: %JAVA_HOME%
        goto :verify
    )
)

echo [INFO] Dang tim Java tren may...

REM --- Check common JDK locations ---
set "CANDIDATES="
set "CANDIDATES=%ProgramFiles%\Java"
set "CANDIDATES=%CANDIDATES%;%ProgramFiles%\Eclipse Adoptium"
set "CANDIDATES=%CANDIDATES%;%ProgramFiles%\Microsoft"
set "CANDIDATES=%CANDIDATES%;%USERPROFILE%\.jdks"

set "FOUND_JAVA="

for %%D in (%CANDIDATES%) do (
    if exist "%%D" (
        for /d %%J in ("%%D\*") do (
            if exist "%%J\bin\java.exe" (
                echo [FOUND] %%J
                set "FOUND_JAVA=%%J"
            )
        )
    )
)

if not defined FOUND_JAVA (
    echo.
    echo [ERROR] Khong tim thay Java!
    echo Hay cai JDK tu: https://adoptium.net/
    pause
    exit /b 1
)

echo.
echo [OK] Su dung Java: %FOUND_JAVA%

REM --- Set JAVA_HOME ---
setx JAVA_HOME "%FOUND_JAVA%" >nul
setx PATH "%FOUND_JAVA%\bin;%PATH%" >nul

echo [OK] Da set JAVA_HOME vinh vien.

:verify
echo.
echo ============================================================
echo   Kiem tra
echo ============================================================
echo.

"%JAVA_HOME%\bin\java.exe" -version

echo.
echo ============================================================
echo   Xong! Chay project bang:
echo     .\mvnw.cmd spring-boot:run
echo ============================================================
echo.

pause