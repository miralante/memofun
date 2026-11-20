# One-off: download the official safety-sign vectors from Wikimedia Commons
# into .tmp-cards/signs-svg/.
#
# Sequential on purpose: upload.wikimedia.org answers HTTP 429 to parallel
# bursts from the same IP. Two endpoints work, in this order:
#   1. Special:FilePath/<name>  -> the original SVG (for the ISO 7010 files,
#      whose names are plain ASCII)
#   2. thumb.wikimedia.org/.../1280px-<name>.svg.png -> the rendered PNG
#      (needed for the NTP 399 files: their names carry accents and commas,
#      and FilePath mangles them into a 404)
#
# The PNG thumbnails are the same artwork Commons renders for every visitor,
# so the attribution and the license are the ones of the original file.
#
# Usage: powershell -File scripts/one-off/descargar-vectores.ps1
$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$dest = Join-Path $repo '.tmp-cards\signs-svg'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$ua = 'Mozilla/5.0 (compatible; memofun-deck-tools/1.0; +educational)'

# name -> @{ file = 'Commons file name'; png = $true when only the PNG thumb works }
$files = @{
  'p003-no-fuego'           = @{ file = 'ISO 7010 P003.svg' }
  'p010-no-tocar'           = @{ file = 'ISO 7010 P010.svg' }
  'p002-no-fumar'           = @{ file = 'ISO 7010 P002.svg' }
  'w011-caida-nivel'        = @{ file = 'ISO 7010 W011.svg' }
  'w009-piso-mojado'        = @{ file = 'ISO 7010 W009.svg' }
  'w001-general'            = @{ file = 'ISO 7010 W001.svg' }
  'm003-proteccion-oido'    = @{ file = 'ISO 7010 M003.svg' }
  'm004-oido'               = @{ file = 'ISO 7010 M004.svg' }
  'm017-peatones'           = @{ file = 'ISO 7010 M017.svg' }
  'm022-pasamanos'          = @{ file = 'ISO 7010 M022.svg' }
  'm024-via-peatones'       = @{ file = 'ISO 7010 M024.svg' }
  'f001-extintor'           = @{ file = 'ISO 7010 F001.svg' }
  'f002-manguera'           = @{ file = 'ISO 7010 F002.svg' }
  'f004-manguera-alt'       = @{ file = 'ISO 7010 F004.svg' }
  'e003-primeros-auxilios'  = @{ file = 'ISO 7010 E003 - First aid sign.svg' }
  'e004-telefono'           = @{ file = 'ISO 7010 E004.svg' }
  'e013-camilla'            = @{ file = 'ISO 7010 E013.svg' }
  'ntp-inflamables'         = @{ file = 'NTP 399 NTP 399 PELIGRO, SUSTANCIAS O MATERIAS INFLAMABLES O PELIGRO INFLAMABLE.svg'; png = $true }
  'ntp-caidas'              = @{ file = 'NTP 399 PELIGRO, ATENCIÓN PELIGRO DE CAÍDAS.svg'; png = $true }
  'ntp-proteccion-auditiva' = @{ file = 'NTP 399 USO OBLIGATORIO DE PROTECCIÓN AUDITIVA.svg'; png = $true }
}

function Get-ThumbUrl {
  # thumb.wikimedia.org mirrors the upload path with a fixed render width.
  # The hash is the MD5 of the file name with spaces turned into underscores
  # (Commons' canonical form), and the rendered file keeps the .svg suffix.
  param([string]$Name)
  $canonical = $Name -replace ' ', '_'
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($canonical)
  $md5 = [System.Security.Cryptography.MD5]::Create()
  $hash = ([System.BitConverter]::ToString($md5.ComputeHash($bytes))).Replace('-', '').ToLower()
  $a = $hash.Substring(0, 1)
  $ab = $hash.Substring(0, 2)
  $enc = [uri]::EscapeDataString($canonical)
  return "https://thumb.wikimedia.org/wikipedia/commons/thumb/$a/$ab/$enc/1280px-$enc.png"
}

$failed = @()
foreach ($name in ($files.Keys | Sort-Object)) {
  $spec = $files[$name]
  $ext = if ($spec.png) { 'png' } else { 'svg' }
  $target = Join-Path $dest ($name + '.' + $ext)
  if (Test-Path -LiteralPath $target) {
    Write-Host ("skip  " + $name + " (ya existe)")
    continue
  }
  $url = if ($spec.png) {
    Get-ThumbUrl -Name $spec.file
  } else {
    'https://commons.wikimedia.org/wiki/Special:FilePath/' + [uri]::EscapeDataString($spec.file)
  }
  $ok = $false
  for ($try = 1; $try -le 4 -and -not $ok; $try++) {
    try {
      Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 40 -UserAgent $ua -OutFile $target
      Write-Host ("OK    " + $name + "  " + (Get-Item -LiteralPath $target).Length + " bytes")
      $ok = $true
    } catch {
      Write-Host ("retry " + $name + "  " + $_.Exception.Message)
      Start-Sleep -Seconds (6 * $try)
    }
  }
  if (-not $ok) { $failed += $name }
  Start-Sleep -Seconds 2
}

if ($failed.Count -gt 0) {
  Write-Host ''
  Write-Host ('FALLIDAS (' + $failed.Count + '): ' + ($failed -join ', '))
  exit 1
}
Write-Host ''
Write-Host 'Todos los vectores descargados.'
