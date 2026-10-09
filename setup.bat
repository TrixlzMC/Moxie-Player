@echo off
echo Setting up MelodyPlayer Electron Project...
echo.
echo If you see a PowerShell execution policy error, run this command first:
echo Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
echo.
cd /d "%~dp0"
npm install
echo.
echo Installation complete!
echo.
echo To run in development mode: npm start
echo To build executable: npm run build
echo.
pause
