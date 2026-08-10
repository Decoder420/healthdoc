#requires -RunAsAdministrator
<#
  Fix LAN access for healthdoc (Next.js on port 3000).
  Right-click PowerShell -> Run as administrator, then:
    cd D:\hmsfrontend
    powershell -ExecutionPolicy Bypass -File .\scripts\fix-lan.ps1
#>

$ErrorActionPreference = "Stop"
$port = 3000

Write-Host ""
Write-Host "=== healthdoc LAN fix ===" -ForegroundColor Cyan

# 1) Mark Wi-Fi as Private (Home/Work) so inbound LAN is permitted
$wifi = Get-NetConnectionProfile -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue
if ($wifi) {
  Write-Host "Current Wi-Fi profile: $($wifi.Name) / $($wifi.NetworkCategory)"
  if ($wifi.NetworkCategory -ne "Private") {
    Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
    Write-Host "Wi-Fi network category set to Private." -ForegroundColor Green
  } else {
    Write-Host "Wi-Fi is already Private." -ForegroundColor Green
  }
} else {
  Write-Host "Wi-Fi interface not found." -ForegroundColor Yellow
}

# 2) Allow inbound TCP 3000 for all profiles
$ruleName = "healthdoc-next-port-$port"
Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue | Remove-NetFirewallRule -ErrorAction SilentlyContinue
New-NetFirewallRule `
  -DisplayName $ruleName `
  -Direction Inbound `
  -Action Allow `
  -Protocol TCP `
  -LocalPort $port `
  -Profile Any `
  -Description "Allow healthdoc Next.js LAN access on port $port" | Out-Null
Write-Host "Firewall rule added: allow TCP $port (Any profile)." -ForegroundColor Green

# 3) Also allow node.exe explicitly on Public+Private
$node = "C:\Program Files\nodejs\node.exe"
if (Test-Path $node) {
  $nodeRule = "healthdoc-node-exe"
  Get-NetFirewallRule -DisplayName $nodeRule -ErrorAction SilentlyContinue | Remove-NetFirewallRule -ErrorAction SilentlyContinue
  New-NetFirewallRule `
    -DisplayName $nodeRule `
    -Direction Inbound `
    -Action Allow `
    -Program $node `
    -Profile Any `
    -Description "Allow Node.js for healthdoc LAN access" | Out-Null
  Write-Host "Firewall rule added: allow $node" -ForegroundColor Green
}

# 4) Print URL
$ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notlike "169.*" } |
  Select-Object -First 1 -ExpandProperty IPAddress)

Write-Host ""
Write-Host "Use this URL on the other phone/laptop (same Wi-Fi):" -ForegroundColor Cyan
if ($ip) {
  Write-Host "  http://${ip}:${port}" -ForegroundColor Green
} else {
  Write-Host "  (Could not detect Wi-Fi IP — run ipconfig)" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "If it STILL fails after this script:" -ForegroundColor Yellow
Write-Host "  Your router likely has AP/Client Isolation enabled."
Write-Host "  Check Airtel router Wi-Fi settings and disable:"
Write-Host "  - AP Isolation / Client Isolation / Guest Network isolation"
Write-Host ""
