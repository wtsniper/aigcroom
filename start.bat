@echo off
cd /d E:\work\aigcroom

echo Installing dependencies...
C:\nodejs\node-v24.11.0-win-x64\node.exe C:\nodejs\node-v24.11.0-win-x64\node_modules\npm\bin\npm-cli.js install --legacy-peer-deps

echo Starting Next.js server...
C:\nodejs\node-v24.11.0-win-x64\node.exe node_modules\next\dist\bin\next dev
