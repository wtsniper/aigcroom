@echo off
cd /d E:\work\aigcroom
echo Installing dependencies in: %CD%
echo.
C:\nodejs\node-v24.11.0-win-x64\node.exe C:\nodejs\node-v24.11.0-win-x64\node_modules\npm\bin\npm-cli.js install
pause
