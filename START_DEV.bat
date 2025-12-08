@echo off
echo Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Cleaning .next folder...
rmdir /s /q .next 2>nul

echo Starting dev server (it will rebuild automatically)...
call npm run dev

