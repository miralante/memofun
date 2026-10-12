# Resize / re-encode JPGs to come in under the 200 KB hard cap that
# scripts/check.js enforces (technical.md section 3.1). Uses
# System.Drawing only -- no ImageMagick / mozjpeg / sharp, because
# nothing else is installed and the project does not pull a runtime
# image library.
#
# Strategy: load, resize so the long edge <= 1024 px, save as JPEG
# with quality 82. If still > 200 KB, retry with quality 75, then
# 68, until the file fits. Falls back to 800 and 600 px long edges
# for stubborn > 600 KB cases.
#
# ASCII only -- PowerShell 5.1 reads .ps1 without a BOM as cp1252
# and would mangle multibyte UTF-8 bytes during parsing.
#
# Usage: powershell -File scripts/one-off/recodificar-imagenes.ps1
#        <path1> [path2 ...]
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function Get-JpegCodec {
  $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
  foreach ($c in $codecs) { if ($c.MimeType -eq 'image/jpeg') { return $c } }
}

$JPEG_CODEC = Get-JpegCodec
$MAX_KB     = 200

function Resize-Jpg {
  param([Parameter(Mandatory)][string]$Path)
  $full   = (Resolve-Path -LiteralPath $Path).Path
  $before = [int]([System.IO.File]::ReadAllBytes($full).Length / 1024)
  # Load via a MemoryStream with a FileShare.ReadWrite open so that
  # System.Drawing never holds the on-disk file open. Otherwise the
  # subsequent File.WriteAllBytes($full, ...) hits "file in use by
  # another process" because the Image keeps the handle alive.
  $bytesIn = [System.IO.File]::ReadAllBytes($full)
  $ms      = New-Object System.IO.MemoryStream(, $bytesIn)
  $img     = [System.Drawing.Image]::FromStream($ms, $false, $false)
  try {
    $w = $img.Width; $h = $img.Height
    $variants = @(
      @{ Edge = 1024; Quality = 82 },
      @{ Edge = 1024; Quality = 75 },
      @{ Edge = 1024; Quality = 68 },
      @{ Edge = 800;  Quality = 75 },
      @{ Edge = 800;  Quality = 68 },
      @{ Edge = 600;  Quality = 72 }
    )
    $bestSize = $before
    $bestTmp  = $null
    foreach ($v in $variants) {
      $edge = $v.Edge; $q = $v.Quality
      $scale = 1.0
      if ($w -gt $edge -or $h -gt $edge) {
        $scale = [Math]::Min([double]$edge / $w, [double]$edge / $h)
      }
      $nw = [int]([Math]::Round($w * $scale))
      $nh = [int]([Math]::Round($h * $scale))
      $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, 0, 0, $nw, $nh)
      $g.Dispose()
      $tmp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.IO.Path]::GetRandomFileName() + '.jpg')
      $enc = (New-Object System.Drawing.Imaging.EncoderParameters(1))
      $qParam = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [long]$q)
      $enc.Param[0] = $qParam
      $bmp.Save($tmp, $JPEG_CODEC, $enc)
      $bmp.Dispose()
      $sz = [int]([System.IO.File]::ReadAllBytes($tmp).Length / 1024)
      Write-Host ('  edge={0} q={1} -> {2} KB' -f $nw, $q, $sz)
      if ($sz -lt $bestSize) {
        if ($bestTmp) { Remove-Item -LiteralPath $bestTmp -ErrorAction SilentlyContinue }
        $bestTmp = $tmp; $bestSize = $sz
      } else {
        Remove-Item -LiteralPath $tmp -ErrorAction SilentlyContinue
      }
      if ($sz -le $MAX_KB) { break }
    }
    if ($bestTmp -and $bestSize -le $MAX_KB) {
      $bytesOut = [System.IO.File]::ReadAllBytes($bestTmp)
      # WriteAllBytes overwrites the destination; the original file is
      # already on disk and no System.Drawing handle references it.
      [System.IO.File]::WriteAllBytes($full, $bytesOut)
      Remove-Item -LiteralPath $bestTmp -ErrorAction SilentlyContinue
      Write-Host ('  OK {0}: {1} KB -> {2} KB' -f $full, $before, $bestSize)
    } else {
      if ($bestTmp) { Remove-Item -LiteralPath $bestTmp -ErrorAction SilentlyContinue }
      Write-Warning ('  FAIL {0}: still {1} KB after all variants' -f $full, $bestSize)
      $script:Failed += ,@{ Path = $full; Size = $bestSize }
    }
  } finally {
    $img.Dispose()
    $ms.Dispose()
  }
}

$script:Failed = @()
$paths = @($args)
if ($paths.Count -eq 0) {
  Write-Host 'No paths supplied -- pass JPG paths as arguments.'
  exit 2
}
foreach ($p in $paths) {
  if (-not (Test-Path -LiteralPath $p)) { Write-Warning "missing: $p"; continue }
  Write-Host "-> $p"
  try { Resize-Jpg -Path $p } catch { Write-Warning "  err: $_" }
}
if ($script:Failed.Count -gt 0) {
  Write-Host ''
  Write-Host ('{0} file(s) still over 200 KB:' -f $script:Failed.Count)
  $script:Failed | ForEach-Object { Write-Host ('  {0} KB  {1}' -f $_.Size, $_.Path) }
  exit 1
}
Write-Host 'All files under 200 KB.'
