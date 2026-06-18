# Grand SI ARTP - Demarrage minimal (Hub + P7, P8, P10, P11)
# Usage : .\start-mini.ps1
$root = $PSScriptRoot

Write-Host ""
Write-Host "  GRAND SI ARTP - Demarrage" -ForegroundColor Cyan
Write-Host "  -------------------------" -ForegroundColor DarkGray
Write-Host ""

# --- Nettoyage : tuer tous les processus Node existants ---
$nodeProcs = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcs) {
    Write-Host "  Arret des processus Node existants ($($nodeProcs.Count) trouves)..." -ForegroundColor Yellow
    $nodeProcs | Stop-Process -Force
    Start-Sleep -Seconds 3
    Write-Host "  Processus arretes." -ForegroundColor Green
} else {
    Write-Host "  Aucun processus Node actif." -ForegroundColor DarkGray
}

# --- Verifier que les ports sont libres avant de lancer ---
$ports = @(5186, 5187, 5188, 5189, 5190)
foreach ($p in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "  ATTENTION : port $p encore occupe, attente..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

Write-Host ""

# --- Lancement sequentiel avec verification ---
$services = @(
    @{ label="[1/5] Hub Central Grand SI "; dir="web-hub";      port=5186; color="Cyan"    },
    @{ label="[2/5] P7 Open Data ARTP    "; dir="web-opendata"; port=5187; color="Magenta" },
    @{ label="[3/5] P8 Alerte Citoyenne  "; dir="web-alert";    port=5188; color="Magenta" },
    @{ label="[4/5] P10 AI Lab ARTP      "; dir="web-ailake";   port=5189; color="Magenta" },
    @{ label="[5/5] P11 Open Gateway     "; dir="web-gateway";  port=5190; color="Magenta" }
)

foreach ($s in $services) {
    Write-Host "  $($s.label) -> http://localhost:$($s.port)" -ForegroundColor $s.color
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\packages\$($s.dir)'; npx vite --port $($s.port)" -WindowStyle Minimized
    Start-Sleep -Seconds 12

    # Verifier que le service repond
    $ok = $false
    for ($i = 1; $i -le 3; $i++) {
        try {
            Invoke-WebRequest "http://localhost:$($s.port)" -UseBasicParsing -TimeoutSec 4 -EA Stop | Out-Null
            Write-Host "    OK http://localhost:$($s.port)" -ForegroundColor Green
            $ok = $true
            break
        } catch {
            if ($i -lt 3) { Start-Sleep -Seconds 4 }
        }
    }
    if (-not $ok) {
        Write-Host "    ATTENTION : http://localhost:$($s.port) ne repond pas encore (verifier la fenetre PowerShell)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host "   GRAND SI ARTP - Services disponibles" -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Hub Central   http://localhost:5186" -ForegroundColor Cyan
Write-Host "  P7 Open Data  http://localhost:5187" -ForegroundColor Magenta
Write-Host "  P8 Alerte     http://localhost:5188" -ForegroundColor Magenta
Write-Host "  P10 AI Lab    http://localhost:5189" -ForegroundColor Magenta
Write-Host "  P11 Gateway   http://localhost:5190" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Ouvrir le Hub : Start-Process 'http://localhost:5186'" -ForegroundColor DarkGray
Write-Host ""
