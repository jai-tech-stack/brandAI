# Force clean and rebuild script for Windows PowerShell
Write-Host "🛑 Stopping all Node.js processes..." -ForegroundColor Yellow

# Kill all node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "🧹 Cleaning .next directory..." -ForegroundColor Yellow

# Force remove .next directory
if (Test-Path ".next") {
    try {
        Remove-Item -Recurse -Force .next -ErrorAction Stop
        Write-Host "✅ .next directory removed" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not remove .next: $_" -ForegroundColor Red
        Write-Host "💡 Please close File Explorer windows showing this folder and try again" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "ℹ️  .next directory doesn't exist (already clean)" -ForegroundColor Cyan
}

Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "🚀 You can now run: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}

