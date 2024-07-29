# Check if Node.js is installed
if (-Not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install Node.js and try again."
    exit 1
}

if (-Not (Test-Path -Path .\node_modules)) {
    npm install
}

# Run the PowerShell script
.\\src\\powershell\\v2Exchange.ps1

# Check the exit status of the previous command
if ($LASTEXITCODE -eq 0) {
    # Run the Node.js application
    node .\\src\\app.js

    # Check the exit status of the previous command
    if ($LASTEXITCODE -eq 0) {
        # Open the Excel file
        Invoke-Item .\\output\\Digest.xlsx
    } else {
        Write-Error "The Node.js application failed to run."
    }
} else {
    Write-Error "The PowerShell script failed to run."
}