# Define the path to the CSV file
$csvPath = ".\Mailboxes.csv"

# Check if the CSV file exists and remove it if it does
if (Test-Path $csvPath) {
    Remove-Item $csvPath
    Write-Output "Existing Mailboxes.csv file removed."
}

# Function to extract aliases
function Get-Aliases($emailAddresses) {
    $aliases = @()
    foreach ($email in $emailAddresses) {
        if ($email.PrefixString -eq "smtp" -and !$email.IsPrimaryAddress) {
            $aliases += $email.AddressString
        }
    }
    return $aliases -join ", "
}

# Attempt to connect to Exchange Online
try {
    Connect-ExchangeOnline
    Write-Output "Successfully connected to Exchange Online."
    $mailboxes | foreach { 
        $mailbox = Get-Mailbox $_.UserPrincipalName
        $type = if ($mailbox.RecipientTypeDetails -eq 'SharedMailbox') { 'SharedMailbox' } else { 'UserMailbox' }
        $user = Get-User $_.UserPrincipalName
        $aliases = Get-Aliases $mailbox.EmailAddresses
        if ($user.WindowsEmailAddress -ne "") {
            $user | Select FirstName, LastName, DisplayName, WindowsEmailAddress, @{Name='Type';Expression={$type}}, @{Name='Aliases';Expression={$aliases}} 
        }
    } | Export-Csv -Path $csvPath -NoTypeInformation -Delimiter ";" -Encoding Unicode
    
    # Disconnect from Exchange Online after export
    Disconnect-ExchangeOnline -Confirm:$false
    Write-Output "Disconnected from Exchange Online."
}
catch {
    Write-Output "Failed to connect to Exchange Online. Installing module and setting execution policy..."
    # Install ExchangeOnlineManagement module and set execution policy
    Install-Module -Name ExchangeOnlineManagement -Force
    Set-ExecutionPolicy RemoteSigned -Force
    
    # Try connecting again
    Connect-ExchangeOnline
    $mailboxes | foreach { 
        $mailbox = Get-Mailbox $_.UserPrincipalName
        $type = if ($mailbox.RecipientTypeDetails -eq 'SharedMailbox') { 'SharedMailbox' } else { 'UserMailbox' }
        $user = Get-User $_.UserPrincipalName
        $aliases = Get-Aliases $mailbox.EmailAddresses
        if ($user.WindowsEmailAddress -ne "") {
            $user | Select FirstName, LastName, DisplayName, WindowsEmailAddress, @{Name='Type';Expression={$type}}, @{Name='Aliases';Expression={$aliases}} 
        }
    } | Export-Csv -Path $csvPath -NoTypeInformation -Delimiter ";" -Encoding Unicode
    
    # Disconnect from Exchange Online after export
    Disconnect-ExchangeOnline -Confirm:$false
    Write-Output "Disconnected from Exchange Online."
}
