@echo off
echo Starting backend and frontend services...

:: Start backend
start cmd /k "cd /d D:\full-stack\backend\moneymanager && mvnw.cmd spring-boot:run"

:: Wait for backend to start
timeout /t 15

:: Start frontend
start cmd /k "cd /d D:\full-stack\frontend\money && npm run dev"

echo Services started. Check the terminal windows for output.