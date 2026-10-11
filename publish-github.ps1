param([string]$Repository = 'JassDigital/JASS-Privacy-Compass')
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
foreach ($cmd in @('git','gh','node','npm')) { if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "Required command not found: $cmd" } }
if (-not (gh auth status 2>$null)) { throw 'GitHub CLI is not authenticated. Run: gh auth login' }
npm run check
if ($LASTEXITCODE -ne 0) { throw 'Tests failed; refusing to publish.' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Production build failed; refusing to publish.' }
if (-not (Test-Path '.git')) { git init }
if (-not (git remote get-url origin 2>$null)) {
  $exists = gh repo view $Repository --json nameWithOwner -q .nameWithOwner 2>$null
  if ($LASTEXITCODE -eq 0 -and $exists) { git remote add origin "https://github.com/$Repository.git" }
}
git add .
Write-Host "`nReview staged changes before proceeding:" -ForegroundColor Cyan
git diff --cached --stat
git status --short
$answer = Read-Host 'Commit these files and create/push the GitHub repository if needed? Type YES to continue'
if ($answer -cne 'YES') { Write-Host 'Cancelled. Files remain local and staged.'; exit 0 }
if (-not (git diff --cached --quiet)) {
  git commit -m 'Initial release: JASS Privacy Compass v1.0.0'
  if ($LASTEXITCODE -ne 0) { throw 'Commit failed.' }
}
git branch -M main
$repoExists = $false
gh repo view $Repository --json nameWithOwner -q .nameWithOwner *> $null
if ($LASTEXITCODE -eq 0) { $repoExists = $true }
if (-not $repoExists) {
  gh repo create $Repository --public --source=. --remote=origin --push
} else {
  if (-not (git remote get-url origin 2>$null)) { git remote add origin "https://github.com/$Repository.git" }
  git push -u origin main
}
if ($LASTEXITCODE -ne 0) { throw 'GitHub publish failed. Review the Git/GitHub CLI output.' }
Write-Host "Published: https://github.com/$Repository" -ForegroundColor Green
