# Grand SI ARTP - Demarrage minimal (nouveaux modules P7-P11 + Hub)
# Usage : .\start-mini.ps1
$root = $PSScriptRoot

Write-Host ""
Write-Host "  GRAND SI ARTP - Nouveaux modules (P7, P8, P10, P11 + Hub)" -ForegroundColor Cyan
Write-Host "  -----------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "  [1/5] Hub Central Grand SI  -> http://localhost:5186" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-hub'; npx vite --port 5186" -WindowStyle Normal
Start-Sleep -Seconds 5

Write-Host "  [2/5] P7 Open Data ARTP     -> http://localhost:5187" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-opendata'; npx vite --port 5187" -WindowStyle Normal
Start-Sleep -Seconds 5

Write-Host "  [3/5] P8 Alerte Citoyenne   -> http://localhost:5188" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-alert'; npx vite --port 5188" -WindowStyle Normal
Start-Sleep -Seconds 5

Write-Host "  [4/5] P10 AI Lab ARTP       -> http://localhost:5189" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-ailake'; npx vite --port 5189" -WindowStyle Normal
Start-Sleep -Seconds 5

Write-Host "  [5/5] P11 Open Gateway      -> http://localhost:5190" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-gateway'; npx vite --port 5190" -WindowStyle Normal

Write-Host ""
Write-Host "  Hub Central   http://localhost:5186" -ForegroundColor Cyan
Write-Host "  P7 Open Data  http://localhost:5187" -ForegroundColor Magenta
Write-Host "  P8 Alerte     http://localhost:5188" -ForegroundColor Magenta
Write-Host "  P10 AI Lab    http://localhost:5189" -ForegroundColor Magenta
Write-Host "  P11 Gateway   http://localhost:5190" -ForegroundColor Magenta
Write-Host ""
