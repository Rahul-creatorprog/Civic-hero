@echo off
title CivicHero - Community Problem Reporting & Authority Tracker
echo ===================================================================
echo     Starting CivicHero: Community Issue Reporting & Action Tracker
echo     Inclusive Design for Elders, Kids, Citizens & Municipal Officers
echo ===================================================================
echo.

echo [1/2] Starting Backend API Server (Port 5000)...
start "CivicHero Backend" cmd /k "cd /d %~dp0backend && node server.js"

echo [2/2] Starting Frontend Vite Development Server (Port 5173)...
start "CivicHero Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================================
echo  Both servers started!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000/api/issues
echo ===================================================================
echo.
pause
