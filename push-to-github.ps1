param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl
)

$ErrorActionPreference = "Stop"
Push-Location $PSScriptRoot

try {
  if (-not (Test-Path ".git")) {
    git init
    git branch -M main
  }

  $existing = git remote
  if ($existing -contains "origin") {
    git remote set-url origin $RepoUrl
  } else {
    git remote add origin $RepoUrl
  }

  git add .
  git commit -m "chore: initial Tauri v2 iOS, Android and Desktop builder" --allow-empty
  git push -u origin main --force
  Write-Host "==> isyer-builder başarıyla GitHub'a gönderildi: $RepoUrl" -ForegroundColor Green
} finally {
  Pop-Location
}

