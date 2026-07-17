# Windows: set Wi-Fi to Private profile + allow inbound port 3000 for LAN access
# Run in elevated PowerShell: .\scripts\fix-lan.ps1

$ErrorActionPreference = "Stop"

Write-Host "Setting active Wi-Fi profiles to Private..."
Get-NetConnectionProfile | Where-Object { $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*WLAN*" } | ForEach-Object {
  Set-NetConnectionProfile -InterfaceIndex $_.InterfaceIndex -NetworkCategory Private
  Write-Host "  -> $($_.Name) set to Private"
}

Write-Host "Allowing inbound TCP 3000 (HealthDoc frontend)..."
$existing = Get-NetFirewallRule -DisplayName "HealthDoc Frontend 3000" -ErrorAction SilentlyContinue
if (-not $existing) {
  New-NetFirewallRule -DisplayName "HealthDoc Frontend 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow | Out-Null
  Write-Host "  -> Firewall rule created"
} else {
  Write-Host "  -> Firewall rule already exists"
}

Write-Host "Done. Run: npm run dev"
