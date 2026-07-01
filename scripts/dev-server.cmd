@echo off
setlocal
cd /d "%~dp0.."
if not exist logs mkdir logs
"C:\Program Files\nodejs\node.exe" node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173 >> logs\vite-dev.out.log 2>> logs\vite-dev.err.log
