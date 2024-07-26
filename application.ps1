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
        # Start-Process excel .\\output\\Digest.xlsx
    } else {
        Write-Error "The Node.js application failed to run."
    }
} else {
    Write-Error "The PowerShell script failed to run."
}
