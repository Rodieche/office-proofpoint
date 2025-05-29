# Requiere: ExchangeOnlineManagement y Microsoft.Graph
if (-not (Get-Module -ListAvailable -Name ExchangeOnlineManagement)) {
    Install-Module ExchangeOnlineManagement -Scope CurrentUser -Force
}
if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {
    Install-Module Microsoft.Graph -Scope CurrentUser -Force
}

Import-Module ExchangeOnlineManagement
Import-Module Microsoft.Graph.Users

# ------------------------
# 1. Login interactivo
# ------------------------

# Write-Host "Conectando a Microsoft Graph..." -ForegroundColor Cyan
# Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All"

Write-Host "Conectando a Exchange Online..." -ForegroundColor Cyan
Connect-ExchangeOnline -ShowProgress $true

# ------------------------
# 2. Obtener licencias por usuario
# ------------------------

Write-Host "Obteniendo usuarios con licencias..." -ForegroundColor Yellow

$allUsers = Get-MgUser -All
$licensedUsers = @{}
foreach ($user in $allUsers) {
    $licenseDetails = Get-MgUserLicenseDetail -UserId $user.Id
    $licenseNames = @()

    foreach ($detail in $licenseDetails) {
        foreach ($plan in $detail.ServicePlans) {
            if ($plan.ServicePlanName -like "*EXCHANGE*" -and $plan.ProvisioningStatus -eq "Success") {
                $licenseNames += $detail.SkuPartNumber
                break
            }
        }
    }

    if ($licenseNames.Count -gt 0) {
        $licensedUsers[$user.UserPrincipalName.ToLower()] = $licenseNames -join ", "
    }
}

# ------------------------
# 3. Obtener buzones y combinar información
# ------------------------

Write-Host "Procesando buzones de correo..." -ForegroundColor Yellow

$mailboxes = Get-Mailbox -ResultSize Unlimited | Select-Object DisplayName, UserPrincipalName, PrimarySmtpAddress, EmailAddresses, RecipientTypeDetails

$results = @()
foreach ($mailbox in $mailboxes) {
    $upn = $mailbox.UserPrincipalName.ToLower()
    $primaryEmail = $mailbox.PrimarySmtpAddress.ToString().ToLower()
    $aliases = $mailbox.EmailAddresses | Where-Object {
        $_ -like "smtp:*" -and $_ -ne $primaryEmail
    }

    $hasLicense = $licensedUsers.ContainsKey($upn)
    $licenseName = if ($hasLicense) { $licensedUsers[$upn] } else { "None" }

    $results += [PSCustomObject]@{
        DisplayName        = $mailbox.DisplayName
        PrimaryEmail       = $primaryEmail
        Aliases            = ($aliases -join "; ")
        RecipientType      = $mailbox.RecipientTypeDetails
        HasExchangeLicense = $hasLicense
        LicenseNames       = $licenseName
    }
}

# ------------------------
# 4. Exportar resultados
# ------------------------

$outputDir = ".\output"
$outputFile = "$outputDir\Mailboxes-with-licenses.csv"

if (-not (Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

$results | Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8

Write-Host "Exportación finalizada en: $outputFile" -ForegroundColor Green

# ------------------------
# 5. Desconectar
# ------------------------

Disconnect-ExchangeOnline -Confirm:$false
Disconnect-MgGraph

exit 0
