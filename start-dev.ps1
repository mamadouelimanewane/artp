# Grand SI ARTP - Script de demarrage local (sans Docker)
# Usage : .\start-dev.ps1

$root = $PSScriptRoot

Write-Host ""
Write-Host "  GRAND SI ARTP - Demarrage de tous les services" -ForegroundColor Cyan
Write-Host "  -----------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# 1. Backend API
Write-Host "  [1/14]  API Backend           -> http://localhost:3001" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\api'; npm run dev" -WindowStyle Minimized
Start-Sleep -Seconds 3

# 2. Service IA
Write-Host "  [2/14]  Service IA Chatbot    -> http://localhost:8001" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\services\ai'; python -m uvicorn app.main:app --reload --port 8001" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 3. Portail Admin
Write-Host "  [3/14]  Portail Admin         -> http://localhost:5180" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-admin'; npx vite" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 4. Portail Citoyen
Write-Host "  [4/14]  P2 Mon Reseau SN      -> http://localhost:5174" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-citizen'; npx vite --port 5174" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 5. Portail Operateurs
Write-Host "  [5/14]  Portail Operateurs    -> http://localhost:5176" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-operator'; npx vite --port 5176" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 6. Dashboard BI Analytics
Write-Host "  [6/14]  Dashboard BI          -> http://localhost:5177" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-analytics'; npx vite --port 5177" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 7. App Terrain
Write-Host "  [7/14]  App Terrain Agent     -> http://localhost:5178" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-field'; npx vite --port 5178" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 8. Portail Public
Write-Host "  [8/14]  Portail Public QoS    -> http://localhost:5179" -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-public'; npx vite --port 5179" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 9. P1 PNIR
Write-Host "  [9/14]  P1 PNIR Intelligence  -> http://localhost:5181" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-pnir'; npx vite --port 5181" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 10. P6 SILFT
Write-Host "  [10/14] P6 SILFT Fraude       -> http://localhost:5182" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-fraud'; npx vite --port 5182" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 11. P3 SN-SSR
Write-Host "  [11/14] P3 SN-SSR Spectre     -> http://localhost:5183" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-spectrum'; npx vite --port 5183" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 12. P4 RegTech
Write-Host "  [12/14] P4 RegTech .sn        -> http://localhost:5184" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-domain'; npx vite --port 5184" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 13. P5 Academie
Write-Host "  [13/14] P5 ADR-ARTP Academie  -> http://localhost:5185" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-academy'; npx vite --port 5185" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 14. Hub Central
Write-Host "  [14/18] Hub Central Grand SI  -> http://localhost:5186" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-hub'; npx vite --port 5186" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 15. P7 Open Data
Write-Host "  [15/18] P7 Open Data ARTP     -> http://localhost:5187" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-opendata'; npx vite --port 5187" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 16. P8 Alerte Citoyenne
Write-Host "  [16/18] P8 Alerte Citoyenne   -> http://localhost:5188" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-alert'; npx vite --port 5188" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 17. P10 AI Lab
Write-Host "  [17/18] P10 AI Lab ARTP       -> http://localhost:5189" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-ailake'; npx vite --port 5189" -WindowStyle Minimized
Start-Sleep -Seconds 1

# 18. P11 Open Gateway
Write-Host "  [18/18] P11 Open Gateway      -> http://localhost:5190" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\web-gateway'; npx vite --port 5190" -WindowStyle Minimized

Write-Host ""
Write-Host "  ================================================================" -ForegroundColor Cyan
Write-Host "   GRAND SI ARTP - 11 PROPOSITIONS - 18 SERVICES" -ForegroundColor Cyan
Write-Host "  ================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  INFRASTRUCTURE"
Write-Host "  API Backend                       http://localhost:3001/health"
Write-Host "  Service IA (FastAPI)              http://localhost:8001/docs"
Write-Host ""
Write-Host "  PORTAILS EXISTANTS"
Write-Host "  Admin ARTP                        http://localhost:5180"
Write-Host "  Portail Operateurs                http://localhost:5176"
Write-Host "  Dashboard BI Analytics            http://localhost:5177"
Write-Host "  App Terrain Agent                 http://localhost:5178"
Write-Host "  Portail Public QoS                http://localhost:5179"
Write-Host ""
Write-Host "  GRAND SI - 11 PROPOSITIONS" -ForegroundColor Magenta
Write-Host "  P1  PNIR Intelligence Regulatoire  http://localhost:5181" -ForegroundColor Magenta
Write-Host "  P2  Mon Reseau SN (Citoyen)        http://localhost:5174" -ForegroundColor Magenta
Write-Host "  P3  SN-SSR Spectre Radio           http://localhost:5183" -ForegroundColor Magenta
Write-Host "  P4  RegTech .sn Domaines           http://localhost:5184" -ForegroundColor Magenta
Write-Host "  P5  ADR-ARTP Academie              http://localhost:5185" -ForegroundColor Magenta
Write-Host "  P6  SILFT Fraude Telecom           http://localhost:5182" -ForegroundColor Magenta
Write-Host "  P7  Open Data ARTP                 http://localhost:5187" -ForegroundColor Magenta
Write-Host "  P8  Alerte Citoyenne               http://localhost:5188" -ForegroundColor Magenta
Write-Host "  P9  TTMS (systeme autonome)        --standalone--" -ForegroundColor DarkGray
Write-Host "  P10 AI Lab / Lac de donnees        http://localhost:5189" -ForegroundColor Magenta
Write-Host "  P11 Open Gateway GSMA              http://localhost:5190" -ForegroundColor Magenta
Write-Host ""
Write-Host "  >>> Hub Central (point d'entree)   http://localhost:5186 <<<" -ForegroundColor Cyan
Write-Host ""
Write-Host "  COMPTES DE DEMO" -ForegroundColor Cyan
Write-Host "  Admin ARTP   +221 70 000 0000   OTP: 123456"
Write-Host "  Agent ARTP   +221 70 000 0001   OTP: 123456"
Write-Host "  Citoyen      +221 77 123 4567   OTP: 123456"
Write-Host ""
