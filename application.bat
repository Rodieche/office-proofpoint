@echo off
:: Check for administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as administrator...
) else (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~dp0%~nx0' -Verb RunAs"
    exit /b
)

:: Run the PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File ".\src\powershell\v2Exchange.ps1"
if %errorLevel% neq 0 (
    echo The PowerShell script failed to run.
    exit /b %errorLevel%
)

:: Run the Node.js application
node .\src\app.js
if %errorLevel% neq 0 (
    echo The Node.js application failed to run.
    exit /b %errorLevel%
)

:: Open the Excel file
start excel .\output\Digest.xlsx
