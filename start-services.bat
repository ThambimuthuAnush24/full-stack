@echo off
echo Starting backend and frontend services...
echo.

echo ===========================================
echo Money Manager Application Startup
echo ===========================================
echo.

:: Start backend
echo [1/3] Starting Spring Boot backend...
start cmd /k "cd /d D:\full-stack\backend\moneymanager && mvnw.cmd spring-boot:run"

:: Wait for backend to start
echo [2/3] Waiting for backend to initialize...
timeout /t 15

:: Start frontend
echo [3/3] Starting React frontend...
start cmd /k "cd /d D:\full-stack\frontend\money && npm run dev"

echo.
echo ===========================================
echo All services started!
echo.
echo * Backend: http://localhost:8080
echo * Frontend: http://localhost:5173
echo ===========================================
echo.
echo Check the terminal windows for detailed output.
echo.