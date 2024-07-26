# Check if the ImportExcel module is installed and install if not
if (-not (Get-Module -ListAvailable -Name ImportExcel)) {
    Install-Module -Name ImportExcel -Scope CurrentUser -Force
}

# Check if the ExchangeOnlineManagement module is installed and install if not
if (-not (Get-Module -ListAvailable -Name ExchangeOnlineManagement)) {
    Install-Module -Name ExchangeOnlineManagement -Scope CurrentUser -Force
}

# Import the necessary modules
Import-Module -Name ImportExcel
Import-Module -Name ExchangeOnlineManagement

# Connect to Exchange Online
Connect-ExchangeOnline -ShowProgress $true

# Get the mailboxes and their email addresses
$mailboxes = Get-Mailbox | Select-Object DisplayName, PrimarySmtpAddress, EmailAddresses, RecipientTypeDetails, RecipientType

# Create a list to store the processed information
$results = @()

# Process each mailbox to separate primary email and aliases and get recipient type
foreach ($mailbox in $mailboxes) {
    $primaryEmail = $mailbox.PrimarySmtpAddress
    $aliases = $mailbox.EmailAddresses | Where-Object { $_ -like "smtp:*" -and $_ -ne $primaryEmail }

    $results += [PSCustomObject]@{
        DisplayName = $mailbox.DisplayName
        PrimaryEmail = $primaryEmail
        Aliases = ($aliases -join "; ")
        RecipientType = $mailbox.RecipientTypeDetails
    }
}

# Define the output directory and file path
$outputDir = ".\output"
$outputFile = "$outputDir\Mailboxes-office.csv"

# Check if the output directory exists and create it if it does not
if (-not (Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Export the results to a CSV file
$results | Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8

# Disconnect from Exchange Online
Disconnect-ExchangeOnline -Confirm:$false

exit 0
