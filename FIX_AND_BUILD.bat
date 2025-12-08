@echo off
echo Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Cleaning .next folder...
rmdir /s /q .next 2>nul

echo Building project...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo You can now run: npm run dev
    pause
) else (
    echo.
    echo ❌ BUILD FAILED - Check errors above
    pause
)

